import { supabaseBrowser } from '../supabase/browser';
import { InsertProduct, InsertProductImage, InsertProductVolumePrice, ProductDetails, UploadFileResult } from '@/types';

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

        // Fetch only highlighted products for homepage (limit 6)
    static async fetchFeaturedProducts(): Promise<ProductDetails[]> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase
            .from('products')
            .select(`*,
                product_type(type_name),
                product_images(url),
                product_volumes_price(volume, price)
            `)
            .eq('featured', true)
            .order('updated_at', { ascending: false })
            .limit(8);
        
        if (error) throw error;
        return data ?? [];
    }

    static async fetchProductById(id: string): Promise<ProductDetails> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;

        return data ?? null;
    }

    static async addProduct(product: InsertProduct) {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products').insert([product]).select('id').single();
        if (error) throw error;

        return data ?? [];
    }

    static async deleteProduct(id: string) {
        const supabase = supabaseBrowser();

        // 1. Fetch image URLs for the product
        const { data: images, error: imagesError } = await supabase
            .from('product_images')
            .select('url')
            .eq('product_id', id);

        if (imagesError) throw imagesError;

        // 2. Extract storage paths from URLs
        const paths = (images ?? [])
            .map(img => {
                // Example: https://xyz.supabase.co/storage/v1/object/public/product-images/filename.png
                // Extract 'product-images/filename.png'
                const match = img.url.match(/\/storage\/v1\/object\/public\/(.+)$/);
                return match ? match[1] : null;
            })
            .filter(Boolean);

        // 3. Delete files from storage
        if (paths.length > 0) {
            await supabase.storage.from('product-images').remove(paths);
        }

        // 4. Delete the product 
        const { data, error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;

        return data ?? [];
    }

    static async addProductImage(productImage: InsertProductImage) {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('product_images').insert([productImage]);
        if (error) throw error;

        return data ?? [];
    }

    static async addProductVolumePrice(productVolumePrice: InsertProductVolumePrice) {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('product_volumes_price').insert([productVolumePrice]);
        if (error) throw error;

        return data ?? [];
    }

    static async uploadPdf(file: File, title: string, price: number): Promise<UploadFileResult> {
        const supabase = supabaseBrowser();
        const fileExt = file.name.split('.').pop();
        // Sanitize title for filename
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${safeTitle}_${price}_.${fileExt}`;

        // Upload the file
        const { data, error } = await supabase.storage
            .from('product-pdfs')
            .upload(fileName, file);

        if (error || !data) {
            // Return error if upload failed
            return { url: undefined, path: undefined, error };
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from('product-pdfs')
            .getPublicUrl(data.path);

        // Success: return the URL
        return { url: urlData.publicUrl, path: data.path, error: null };
    }

    static async uploadImage(file: File, title: string, price: number): Promise<UploadFileResult> {
        const supabase = supabaseBrowser();
        const fileExt = file.name.split('.').pop();
        // Sanitize title for filename
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${safeTitle}_${price}_.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

        if (error || !data) {
            return { url: undefined, path: undefined, error };
        }

        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

        return { url: urlData.publicUrl, path: data.path, error: null };
    }

    // Delete a file from a bucket
    static async deleteFile(bucket: string, path: string) {
        const supabase = supabaseBrowser();
        await supabase.storage.from(bucket).remove([path]);
    }
}


