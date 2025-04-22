'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
      setMounted(true);
   }, []);
   if (!mounted) return null; // Avoid SSR issues

   return (
      <Button
         variant="outline"
         size="icon"
         onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
         {resolvedTheme === 'dark' ? (
            <Sun className="h-4" />
         ) : (
            <Moon className="h-4" />
         )}
      </Button>
   )
}
