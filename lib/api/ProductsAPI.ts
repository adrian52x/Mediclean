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

    static async uploadPdf(file: File): Promise<{ url: string | undefined, error: any }> {
        const supabase = supabaseBrowser();
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // Upload the file
        const { data, error } = await supabase.storage
            .from('product-pdfs')
            .upload(fileName, file);

        if (error || !data) {
            // Return error if upload failed
            return { url: undefined, error };
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from('product-pdfs')
            .getPublicUrl(data.path);

        // Success: return the URL
        return { url: urlData.publicUrl, error: null };
    }
}


