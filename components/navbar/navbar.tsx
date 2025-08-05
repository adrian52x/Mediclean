'use client';

import React from 'react';

import Link from 'next/link';
import {
  LogInIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LogoWithText from './logo-with-text';
import { usePathname } from 'next/navigation';
import { CartNav } from './CartNav';
import { NavBarButtons, UserNavButton } from './NavbarButtons';
import { MobileMenuTrigger } from './MobileMenuTrigger';

export default function Navbar({ session }: { session: any }) {
  const pathname = usePathname(); // Get the current route

  //console.log('session navbar', session);

  const navClasses = cn(
    'sticky top-0 z-50 border-b transition-all duration-300',
    'bg-background/80 backdrop-blur-sm dark:bg-background/80 dark:border-border shadow-sm',
  );

  // Hide the Navbar on the /auth route
  if (pathname === '/auth') {
    return null;
  }

  return (
    <nav className={navClasses}>
      {/* <div className="flex h-16 items-center px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]"> */}
        <div className="container mx-auto flex px-8">
            {/* Logo */}
            <div className="flex-shrink-0">
                <LogoWithText />
            </div>

            {/* Navigation Items - Desktop */}
            <div className="ml-auto flex items-center space-x-4">

                <NavBarButtons />

                {/* Mobile Menu Trigger */}
                <MobileMenuTrigger />

                {/* Cart Icon */}
                <CartNav />

                {/* Dark/Light Mode */}
                {/* <ThemeToggle /> */}

                {session && session.user ? (
                    <UserNavButton session={session} />
                ) : (
                    <LoginDialog />
                )}
            </div>
        </div>
    </nav>
  );
}

function LoginDialog() {
  return (
    <Link href="/auth">
      <Button className="flex gap-2 font-medium">
        <LogInIcon className="h-4" />
        <p>Login</p>
      </Button>
    </Link>
  );
}
