'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function Navbar({session}: {session: any}) {

    const router = useRouter();
    const pathname = usePathname(); // Get the current route
    const supabase = supabaseBrowser();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    // Hide the Navbar on the /auth route
    if (pathname === '/auth') {
        return null;
    }

    return (
        <main className='flex gap-3'>
            <Button onClick={() => router.push('/')}>Home</Button>
            {session && session.user ? (
        
                <div>
                    <Button onClick={handleLogout}>Logout</Button>
                    <span>{session.user.email}</span>
                </div>
                
            ) : (
                <Button onClick={() => router.push('/auth')}>Login</Button>
            )}
            
            <Button onClick={() => router.push('/admin')}>Admin</Button>
            
        </main>
    )
}
