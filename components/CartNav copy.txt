'use client'
import {
    Minus,
  Plus,
  ShoppingBasketIcon,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCart } from '@/lib/hooks/useCart';
import { useEffect, useState } from 'react';

export function CartNav() {
    const { cart, updateQuantity, removeFromCart, isLoaded } = useCart();

    console.log('CartNav re-render:', { 
        totalItems: cart.totalItems, 
        itemsLength: cart.items.length,
        isLoaded 
    });
    

    // Don't render cart count until loaded
    const displayCount = isLoaded ? cart.totalItems : 0;

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button size="icon" variant="outline" className="h-9 w-fit min-w-9"
                        onFocus={(e) => {
                        // Ensure button loses focus when drawer opens
                        e.currentTarget.blur();
                        }}
                    >
                        <ShoppingBasketIcon className="h-4" />
                        {displayCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {displayCount}
                            </span>
                        )}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Cart Items ({cart.totalItems})</DrawerTitle>
                            <DrawerDescription>Total: ${cart.totalPrice.toFixed(2)}</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 max-h-96 overflow-y-auto">
                        {cart.items.length === 0 ? (
                            <p className="text-center text-gray-500">Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={50}
                                        height={50}
                                        className="rounded object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{item.title}</h4>
                                        {item.volume && (
                                        <p className="text-xs text-gray-500">{item.volume}</p>
                                        )}
                                        <p className="text-sm font-bold">${item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>

                                        <span className="text-sm">{item.quantity}</span>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeFromCart(item.id)}
                                            >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                        <DrawerFooter>
                            <Button>Submit</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}