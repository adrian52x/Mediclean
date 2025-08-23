'use client';

import React, { useState } from 'react';
import {
  Droplets,
  ListChecks,
  Stethoscope,
  Info,
  MapPin,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const MobileMenuButton: React.FC = () => {
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
                
                <Accordion type="single" collapsible className="w-full">
                    {/* Products Section */}
                    <AccordionItem value="products">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 text-lg">
                                <ListChecks className="h-4 w-4" />
                                Produse
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col space-y-2">
                                <Link href="/products" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-start">
                                        <ListChecks className="h-4 w-4 mr-2" />
                                        Toate produsele
                                    </Button>
                                </Link>
                                
                                <Link href="/products?category=disinfectants" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-start">
                                        <Droplets className="h-4 w-4 mr-2" />
                                        Dezinfectanți
                                    </Button>
                                </Link>
                                
                                <Link href="/products?category=equipment" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-start">
                                        <Stethoscope className="h-4 w-4 mr-2" />
                                        Echipament
                                    </Button>
                                </Link>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Services Section */}
                    <AccordionItem value="services">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 text-lg">
                                <Info className="h-4 w-4" />
                                Servicii
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                <Link href="/#services" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-start">
                                        <Info className="h-4 w-4 mr-2" />
                                        Consultanță
                                    </Button>
                                </Link>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Location/Contact Section */}
                    <AccordionItem value="contact">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 text-lg">
                                <MapPin className="h-4 w-4" />
                                Locație / Contact
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col space-y-2">
                                <Link href="/#location" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-start">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Str. Nicolae Zelinski 36/6
                                    </Button>
                                </Link>
                                
                                <Button variant="secondary" className="w-full justify-start cursor-default">
                                    <Phone className="h-4 w-4 mr-2" />
                                    <span className="select-text cursor-text">079410042</span>
                                </Button>

                                <Button variant="secondary" className="w-full justify-start cursor-default">
                                    <Phone className="h-4 w-4 mr-2" />
                                    <span className="select-text cursor-text">079509564</span>
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SheetContent>
        </Sheet>
    );
};
