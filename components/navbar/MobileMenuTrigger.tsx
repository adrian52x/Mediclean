'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
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

export const MobileMenuTrigger: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
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
            <SheetContent side="right" className='p-4'>
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
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
            </SheetContent>
        </Sheet>
    );
};
