'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function Navbar() {
    const router = useRouter();

    return (
        <main className='flex gap-3'>
            <div>navbar</div>
            <Button onClick={() => router.push('/auth')}>Go to Auth</Button>
            <Button onClick={() => router.push('/admin')}>Go to Admin</Button>
        </main>
    )
}
