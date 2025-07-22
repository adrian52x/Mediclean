'use client';

import React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Search,
  LogInIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import LogoWithText from '../logo-with-text';
import { usePathname } from 'next/navigation';
import { CartNav } from '../CartNav';
import { ProductsButton, ServicesButton, NavBarButtons, UserNavButton } from './NavbarButtons';

export default function Navbar({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false); // Check this later where it is used
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

                {/* <ServicesButton />

                <ProductsButton /> */}

                {/* Cart Icon */}
                <CartNav />

                {/* Dark/Light Mode */}
                {/* <ThemeToggle /> */}

                {session && session.user ? (
                    <UserNavButton session={session} />
                ) : (
                    <LoginDialog />
                )}

                {/* Mobile Menu Trigger */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        >
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                        </svg>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>
                        Browse our store and find what you need.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                        <div className="relative mb-4 w-full">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pl-8"
                        />
                        </div>
                        <div className="space-y-3">
                        <Button variant="default" className="w-full justify-start">
                            Shop Now
                        </Button>
                        <Button variant="outline" className="w-full justify-between">
                            Categories <ChevronDown className="h-4 w-4" />
                        </Button>
                        <div className="hidden space-y-1 pl-4">
                            <Button variant="ghost" className="w-full justify-start">
                            Electronics
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                            Clothing
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                            Home & Garden
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                            Sports & Outdoors
                            </Button>
                        </div>
                        <Button variant="outline" className="w-full justify-between">
                            Account <ChevronDown className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    </SheetContent>
                </Sheet>
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
