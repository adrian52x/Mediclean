'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import ThemeToggle from '../theme-toggle';
import Link from 'next/link';

export default function Navbar2({ session }: { session: any }) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const supabase = supabaseBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Hide the Navbar on the /auth route
  if (pathname === '/auth') {
    return null;
  }

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <main className="flex gap-3">
      <Button onClick={() => router.push('/')}>Home</Button>
      {session && session.user ? (
        <div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <span>{session.user.email}</span>
        </div>
      ) : (
        <Button variant="outline" onClick={() => router.push('/auth')}>
          Login
        </Button>
      )}

      <Button onClick={() => router.push('/admin')}>Admin</Button>

      <Button asChild>
        <Link href="/auth">Login</Link>
      </Button>

      <ThemeToggle />
    </main>
  );
}
