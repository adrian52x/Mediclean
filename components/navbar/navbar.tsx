'use client';

import React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Search,
  LogInIcon,
  ShoppingBasketIcon,
} from 'lucide-react';

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
import LogoWithText from '../logo-with-text';
import { usePathname } from 'next/navigation';
import { UserNav } from './user-nav';

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

        {/* Search Bar */}
        {/* <div className="relative mx-4 hidden w-full max-w-sm lg:flex">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-full bg-stone-50 pl-8 shadow-lg focus-visible:ring-0 dark:bg-zinc-700 dark:text-white"
          />
        </div> */}

        {/* Navigation Items - Desktop */}
        <div className="ml-auto flex items-center space-x-4">
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
                    <ListItem href="#products" title="Disinfectants">
                      Surface Disinfectants, Hand Sanitizers, Alcohol Wipes
                    </ListItem>
                    <ListItem href="#products" title="Medical Equipment">
                      Thermometers
                    </ListItem>
                    <ListItem href="#products" title="Medical Supplies">
                      First Aid Kits
                    </ListItem>
                    <ListItem href="#products" title="Hygiene Products">
                      Surface Cleaners, Dispensers (Soap/Sanitizer)
                    </ListItem>
                    <ListItem href="#products" title="Consumables">
                      Vitamins & Supplements
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Account Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <ListItem href="#services" title="Testing & Diagnostics">
                      Workplace Health Screening
                    </ListItem>
                    <ListItem
                      href="#services"
                      title="Consulting / Advisory Services"
                    >
                      Hygiene & Safety Compliance Audits
                    </ListItem>
                    <ListItem
                      href="#services"
                      title="Equipment Maintenance & Setup"
                    >
                      Medical Equipment Installation
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar V2*/}
          <div className="hidden sm:block">
            <Button
              variant="outline"
              className="text-muted-foreground relative w-full justify-start text-sm font-light sm:pr-12 md:w-40 lg:w-64"
            >
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <span className="inline-flex pl-6">Search...</span>
            </Button>
          </div>

          {/* Cart Icon */}
          <CartNav />

          {/* Dark/Light Mode */}
          {/* <ThemeToggle /> */}

          {session && session.user ? (
            <UserNav session={session} />
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

export function CartNav() {
  return (
    <Link href="/cart">
      <Button size="icon" variant="outline" className="h-9">
        <ShoppingBasketIcon className="h-4" />
      </Button>
    </Link>
  );
}

// Helper component for navigation menu items
const ListItem = React.forwardRef<
  //React.ElementRef<'a'>,
  React.ComponentRef<'a'>,
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
