// Middleware to check if the user is an admin
import { supabaseServer } from '@/lib/supabase/server';

export async function isAdminServerSide(): Promise<boolean> {

  const supabase = await supabaseServer();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    //console.error('Error fetching authenticated user:', authError);
    return false; // User is not authenticated
  }

  const userId = authData.user.id;

  console.log(userId);
  

  // Query the users table to check the role
  const { data: userData, error: userError } = await supabase
    .from('users')
    //.select('*');
    .select('id, role')
    .eq('id', userId)
    .single();

    console.log(userData);
    
  if (userError || !userData) {
    console.error('Error fetching user role:', userError);
    return false; // User not found or error occurred
  }

  // Check if the role is "admin"
  return userData.role === 'admin';
}