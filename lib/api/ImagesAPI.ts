import { supabaseBrowser } from '../supabase/browser';


export class ImagesAPI {
    static async getProductsImages() {
        const supabase = supabaseBrowser();
        
        // Fetch the list of files in the `product-images` bucket
        const { data: files, error } = await supabase.storage
            .from('product-images') // Replace with your bucket name
            .list();
        
        if (error) {
            console.error('Error fetching product images:', error.message);
            return [];
        }
        
        // Generate public URLs for the images
        const images = files.map((file) => {
            const { data } = supabase.storage
            .from('product-images') // Replace with your bucket name
            .getPublicUrl(file.name);
        
            return {
            name: file.name,
            url: data.publicUrl,
            };
        });
        
        return images;
    }

    static async getServicesImages() {
      const supabase = await supabaseBrowser();
    
      // Fetch the list of files in the `services-images` bucket
      const { data: files, error } = await supabase.storage
        .from('services-images') // Replace with your bucket name
        .list();
    
      if (error) {
        console.error('Error fetching services images:', error.message);
        return [];
      }
    
      // Generate public URLs for the images
      const images = files.map((file) => {
        const { data } = supabase.storage
          .from('services-images') // Replace with your bucket name
          .getPublicUrl(file.name);
    
        return {
          name: file.name,
          url: data.publicUrl,
        };
      });
    
      return images;
    }
}