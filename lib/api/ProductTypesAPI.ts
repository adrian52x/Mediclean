import { supabaseBrowser } from '../supabase/browser';
import { ProductType } from "@/types";

export class ProductTypesAPI {
    static async fetchProductTypes(): Promise<ProductType[]> {
        const supabase = supabaseBrowser();

        const { data, error } = await supabase
        .from('product_types')
        .select('*');

        if (error) throw error;

        return data ?? [];
    }
}