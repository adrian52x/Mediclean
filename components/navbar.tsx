'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function Navbar({session}: {session: any}) {
    const router = useRouter();

    const supabase = supabaseBrowser();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
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
            <Button onClick={() => router.push('/admin')}>Go to Admin</Button>
            
        </main>
    )
}
