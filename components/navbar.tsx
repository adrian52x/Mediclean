'use client';

import React, { useEffect } from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ChevronDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import LogoWithText from './logo-with-text';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function Navbar({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false); // Check this later where it is used
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const supabase = supabaseBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Only apply scroll-based classes after hydration is complete
  const navClasses = cn(
    'sticky top-0 z-50 border-b transition-all duration-300',
    // Only apply conditional classes when scrolled is not null (after hydration)
    scrolled === null
      ? 'bg-background' // Initial state for SSR
      : scrolled
        ? 'bg-background shadow-md dark:bg-background dark:border-border'
        : 'bg-background/80 backdrop-blur-sm dark:bg-background/80 dark:border-border',
  );

  // Hide the Navbar on the /auth route
  if (pathname === '/auth') {
    return null;
  }

  return (
    <nav className={navClasses}>
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <LogoWithText />
        </div>

        {/* Search Bar */}
        <div className="relative mx-4 hidden w-full max-w-sm lg:flex">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-full bg-stone-50 pl-8 shadow-lg focus-visible:ring-0 dark:bg-zinc-700 dark:text-white"
          />
        </div>

        {/* Navigation Items - Desktop */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Regular Button */}
          {session && session.user ? (
            <div className="hidden space-x-2 md:flex">
              <div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
                {/* <span>{session.user.email}</span> */}
              </div>
              <Button onClick={() => router.push('/admin')}>Admin</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => router.push('/auth')}>
              Login
            </Button>
          )}

          {/* Navigation Menu for Dropdowns */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Categories Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    {/* <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">All Categories</div>
                          <p className="text-sm leading-tight text-muted-foreground">Browse all product categories</p>
                        </a>
                      </NavigationMenuLink>
                    </li> */}
                    <ListItem href="/electronics" title="Electronics">
                      Phones, laptops, and gadgets
                    </ListItem>
                    <ListItem href="/clothing" title="Clothing">
                      Fashion and apparel
                    </ListItem>
                    <ListItem href="/home" title="Home & Garden">
                      Furniture and decor
                    </ListItem>
                    <ListItem href="/sports" title="Sports & Outdoors">
                      Equipment and gear
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Account Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <ListItem href="/profile" title="Profile">
                      Manage your account
                    </ListItem>
                    <ListItem href="/orders" title="Orders">
                      View your order history
                    </ListItem>
                    <ListItem href="/wishlist" title="Wishlist">
                      Your saved items
                    </ListItem>
                    <ListItem href="/signout" title="Sign Out">
                      Log out of your account
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Cart Icon */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              3
            </span>
          </Button>

          {/* Dark/Light Mode */}
          <ThemeToggle />

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

// Helper component for navigation menu items
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
