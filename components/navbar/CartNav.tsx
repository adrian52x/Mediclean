'use client'
import {
    Minus,
    Plus,
    ShoppingBasketIcon,
    X,
} from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import { useCartStore } from '@/lib/stores/cartStore';
import { Card } from '../ui/card';

export function CartNav() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const cartItems = useCartStore((state) => state.cartItems);
    const cartCount = useCartStore((state) => state.cartCount);
    const totalPrice = useCartStore((state) => state.totalPrice);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    console.log('🔄 CartNav render, count:', cartCount, 'items:', cartItems);

    const handleCheckout = () => {
        setIsOpen(false); // Close the drawer
        router.push('/checkout');
    };

    return (
        <>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    <Button size="icon" variant="outline" className="h-9 w-fit min-w-9 relative"
                        onFocus={(e) => {
                        e.currentTarget.blur();
                        }}
                    >
                        <ShoppingBasketIcon className="h-4" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto md:w-full max-w-md">
                        <DrawerHeader>
                            <DrawerTitle>Produse în coș  ({cartCount})</DrawerTitle>
                            <DrawerDescription>Total MDL: {totalPrice.toFixed(2)}</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 max-h-96 overflow-y-auto md:max-w-2xl md:mx-auto">
                        {cartItems.length === 0 ? (
                            <p className="text-center text-gray-500">Coșul tău este gol</p>
                        ) : (
                            <div className="space-y-4"> {/* md:grid md:grid-cols-2 gap-4 */}
                                {cartItems.map((item) => (
                                    <Card key={item.id} className="flex items-center gap-3 p-2">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={50}
                                            height={50}
                                            className="rounded object-cover w-[50px] h-[50px]"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.title}</h4>
                                            {item.volume && (
                                            <p className="text-xs text-gray-500">{item.volume}</p>
                                            )}
                                            <p className="text-sm font-bold">MDL {item.price}</p>
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
                                                onClick={() => removeItem(item.id)}
                                                >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                </div>
                            )}
                        </div>
                        <DrawerFooter>
                            {cartItems.length > 0 && (
                                <Button 
                                    className="w-full" 
                                    onClick={handleCheckout}
                                >
                                    Finalizează - {totalPrice.toFixed(2)} MDL
                                </Button>
                            )}
                            <DrawerClose asChild>
                                <Button variant="outline">Închide</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}