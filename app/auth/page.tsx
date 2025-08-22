'use client';

import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { KeyRound } from 'lucide-react';
import React from 'react';

import { FcGoogle } from 'react-icons/fc';

export default function page() {
  const handleLoginWithOAuth = async () => {
    const supabase = supabaseBrowser();

    // Explicitly set the correct redirect URL based on the current domain
    const currentOrigin = window.location.origin;
    const redirectUrl = `${currentOrigin}/auth/callback`;

    console.log('OAuth redirect URL:', redirectUrl); // Debug log

    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account', // Force account selection to ensure fresh auth
        },
      },
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-96 space-y-5 rounded-md border p-5">
        <div className="flex items-center gap-2">
          <KeyRound />
          <h1 className="text-2xl font-bold">Autentificare</h1>
        </div>

        <Button
          className="block flex w-full items-center gap-2"
          variant="outline"
          onClick={() => handleLoginWithOAuth()}
        >
          <FcGoogle className="mr-2" /> Autentificare cu Google
        </Button>
      </div>
    </div>
  );
}
