// Middleware to check if the user is an admin
import { supabaseServer } from '@/lib/supabase/server';

export async function isAdmin() {

  const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.getUser();
    console.log(data);
    
    if (!data || !data.user) return false;
 
    // Check if the user's email matches the admin email
    return data.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}