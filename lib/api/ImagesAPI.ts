import { UploadFileResult } from '@/types';
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

    static async uploadMultipleImages(files: File[], title: string, price: number): Promise<{ urls: string[]; paths: string[]; errors: any[] }> {
        const results = await Promise.all(
            files.map(async (file, idx) => {
              
                const fileExt = file.name.split('.').pop();
                const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

                const fileName = `${safeTitle}_${price}_${idx+1}.${fileExt}`;

                const { data, error } = await supabaseBrowser()
                    .storage
                    .from('product-images')
                    .upload(fileName, file);

                if (error || !data) {
                    return { url: undefined, path: undefined, error };
                }

                const { data: urlData } = supabaseBrowser()
                    .storage
                    .from('product-images')
                    .getPublicUrl(data.path);

                return { url: urlData?.publicUrl, path: data.path, error: null };
            })
        );

        return {
            urls: results.map(r => r.url).filter(Boolean) as string[],
            paths: results.map(r => r.path).filter(Boolean) as string[],
            errors: results.map(r => r.error).filter(Boolean),
        };
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