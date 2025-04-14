'use client'

import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { KeyRound } from 'lucide-react'
import React from 'react'

import { FcGoogle } from "react-icons/fc";


export default function page() {

    const handleLoginWithOAuth = () => {
        const supabase = supabaseBrowser();

        supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

    }

  return (
    <div className="flex items-center justify-center h-screen w-full">
        <div className="w-96 rounded-md border p-5 space-y-5">

            <div className="flex items-center gap-2">
                <KeyRound />
                <h1 className="text-2xl font-bold">Autentificare</h1> 
            </div>

            <Button 
                className="block w-full flex items-center gap-2" 
                variant="outline"
                onClick={() => handleLoginWithOAuth()}
            >
                <FcGoogle className="mr-2" /> Autentificare cu Google
            </Button>

        </div>
    </div>
  )
}
