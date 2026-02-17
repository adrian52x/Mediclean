import { supabaseBrowser } from '../supabase/browser';
import { InsertProduct, InsertProductImage, InsertProductVolumePrice, ProductDetails } from '@/types';
import { ImagesAPI } from './ImagesAPI';

export class ProductsAPI {
    static async fetchProducts(): Promise<ProductDetails[]> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase
        .from('products')
        .select(`*,
            product_type(type_name),
            product_images(url),
            product_volumes_price(volume, price)
        `)
        .order('updated_at', { ascending: false }); 
        
        if (error) throw error;

        return data ?? [];
    }

        // Fetch last 8 newest products by created_at for homepage
    static async fetchNewProducts(): Promise<ProductDetails[]> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase
            .from('products')
            .select(`*,
                product_type(type_name),
                product_images(url),
                product_volumes_price(volume, price)
            `)
            .order('created_at', { ascending: false })
            .limit(8);
        
        if (error) throw error;
        return data ?? [];
    }

    static async fetchProductById(id: string): Promise<ProductDetails> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products')
            .select(`*,
                product_type(type_name),
                product_images(url),
                product_volumes_price(volume, price)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        return data ?? null;
    }

    static async addProduct(product: InsertProduct) {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products').insert([product]).select('id').single();
        if (error) throw error;

        return data ?? [];
    }

    static async deleteProduct(id: string): Promise<void> {
        const supabase = supabaseBrowser();

        // 1. Fetch product data including doc_url and image URLs
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('doc_url')
            .eq('id', id)
            .single();

        if (productError) throw productError;

        // 2. Fetch image URLs for the product
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('url')
            .eq('product_id', id);

        if (imagesError) throw imagesError;

        // 3. Extract storage paths from image URLs
        const imagePaths = (images ?? [])
            .map(img => {
                // Extract just the filename from the URL
                // Example: https://xyz.supabase.co/storage/v1/object/public/product-images/aaaa_500_1.png
                // Extract just 'aaaa_500_1.png'
                const match = img.url.match(/\/product-images\/(.+)$/);
                const filename = match ? match[1] : null;
                //console.log("Image URL:", img.url, "Extracted filename:", filename);
                return filename;
            })
            .filter(Boolean);

        // 4. Extract PDF path from doc_url if it exists
        let pdfPath = null;
        if (product?.doc_url) {
            // Extract just the filename from the URL
            // Example: https://xyz.supabase.co/storage/v1/object/public/product-pdfs/aaaaa_11111_.pdf
            // Extract just 'aaaaa_11111_.pdf'
            const match = product.doc_url.match(/\/product-pdfs\/(.+)$/);
            pdfPath = match ? match[1] : null;
        }

        // 5. Delete files from storage
        if (imagePaths.length > 0) {
            await ImagesAPI.deleteFiles('product-images', imagePaths);

        }

        if (pdfPath) {
            await ImagesAPI.deleteFiles('product-pdfs', pdfPath);
        }

        // 6. Delete the product 
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
    }

    static async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<ProductDetails> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select(`*,
                product_type(type_name),
                product_images(url),
                product_volumes_price(volume, price)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    static async addProductImage(productImage: InsertProductImage | InsertProductImage[]) {
        const supabase = supabaseBrowser();

        // Ensure it's always an array for the insert operation
        const images = Array.isArray(productImage) ? productImage : [productImage];
        
        const { data, error } = await supabase.from('product_images').insert(images);
        if (error) throw error;

        return data ?? [];
    }

    static async addProductVolumePrice(productVolumePrice: InsertProductVolumePrice | InsertProductVolumePrice[]) {
        const supabase = supabaseBrowser();

        // Ensure it's always an array for the insert operation
        const volumePrices = Array.isArray(productVolumePrice) ? productVolumePrice : [productVolumePrice];
        
        const { data, error } = await supabase.from('product_volumes_price').insert(volumePrices);
        if (error) throw error;

        return data ?? [];
    }

    // Delete all volume prices for a product
    static async deleteProductVolumePrices(productId: string): Promise<void> {
        const supabase = supabaseBrowser();

        const { error } = await supabase
            .from('product_volumes_price')
            .delete()
            .eq('product_id', productId);

        if (error) throw error;
    }

    // Delete all images for a product
    static async deleteProductImages(productId: string): Promise<void> {
        const supabase = supabaseBrowser();

        const { error } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId);

        if (error) throw error;
    }

    // Update product PDF (remove old one)
    // static async updateProductPdf(id: string, docUrl: string | null): Promise<void> {
    //     const supabase = supabaseBrowser();

    //     const { error } = await supabase
    //         .from('products')
    //         .update({ doc_url: docUrl })
    //         .eq('id', id);

    //     if (error) throw error;
    // }
}


