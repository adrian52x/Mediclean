import { supabaseBrowser } from '../supabase/browser';
import { InsertProduct } from '@/types';

export class ProductsAPI {
    static async fetchProducts() {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        return data ?? [];
    }

    static async addProduct(product: InsertProduct) {
        const supabase = await supabaseBrowser();

        const { data, error } = await supabase.from('products').insert([product]);
        if (error) throw error;

        return data ?? [];
    }
}


