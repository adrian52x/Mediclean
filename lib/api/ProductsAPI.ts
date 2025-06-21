import { supabaseBrowser } from '../supabase/browser';
import { InsertProduct } from '@/types';

export class ProductsAPI {
    static async fetchProducts() {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        return data ?? [];
    }

    static async fetchProductById(id: string) {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;

        return data ?? null;
    }

    static async addProduct(product: InsertProduct) {
        const supabase = await supabaseBrowser();

        const { data, error } = await supabase.from('products').insert([product]);
        if (error) throw error;

        return data ?? [];
    }

    static async uploadPdf(file: File, title: string, price: number): Promise<{ url: string | undefined, path: string | undefined, error: any }> {
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

    static async uploadImage(file: File, title: string, price: number): Promise<{ url: string | undefined, path: string | undefined, error: any }> {
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


