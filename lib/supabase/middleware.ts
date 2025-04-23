import { supabaseServer } from '@/lib/supabase/server';

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/auth', '/about', '/contact'];

    // Check if the current route is public
    const isPublicRoute = publicRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    );

    if (!isPublicRoute) {
      // Redirect to login if the user is not authenticated and the route is protected
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Check for admin role if accessing `/admin` routes
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   const { data: userData, error } = await supabase
  //     .from('users')
  //     .select('role')
  //     .eq('id', user?.id)
  //     .single();

  //   if (error || userData?.role !== 'admin') {
  //     // Show a 404 Not Found page for non-admin users
  //     return NextResponse.rewrite(new URL('/404', request.url));
  //   }
  // }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = await isUserAdmin();

    if (!isAdmin) {
      // Show a 404 Not Found page for non-admin users
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return supabaseResponse;
}

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

export async function isUserAdmin() {
  const supabase = await supabaseServer();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return false; // User is not authenticated
  }

  const userEmail = authData.user.email;

  // Check if the user's email matches the admin email from the environment variable
  return userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
}
