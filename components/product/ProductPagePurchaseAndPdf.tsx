'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '../ui/button';
import { FileText, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/stores/cartStore';
import { ProductDetails } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductPagePurchaseAndPdfProps {
    product: ProductDetails;
}

export const ProductPagePurchaseAndPdf: React.FC<ProductPagePurchaseAndPdfProps> = ({ product }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);
    const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);

    // Memoize product type and pricing calculations
    const { hasPrice, hasVolumes } = useMemo(() => ({
        hasPrice: product?.price !== null,
        hasVolumes: product?.product_volumes_price && product.product_volumes_price.length > 0
    }), [product?.price, product?.product_volumes_price]);

    // Memoize current price calculation
    const currentPrice = useMemo(() => {
        if (!product) return 0;
        if (hasPrice) {
            return product.price;
        } else if (hasVolumes) {
            return product.product_volumes_price[selectedVolumeIndex]?.price || 0;
        }
        return 0;
    }, [hasPrice, hasVolumes, product?.price, product?.product_volumes_price, selectedVolumeIndex]);

    // Get current volume (if applicable)
    const getCurrentVolume = () => {
        if (hasVolumes && product) {
            return product.product_volumes_price[selectedVolumeIndex]?.volume;
        }
        return undefined;
    };

    // Memoize the add to cart handler
    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (!product) return;
        addItem(product, quantity, getCurrentVolume());
        toast.success(`Added ${quantity}x ${product.title}${getCurrentVolume() ? ` (${getCurrentVolume()})` : ''} to cart!`);
    }, [addItem, product, quantity, selectedVolumeIndex]);

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex flex-col h-fit justify-between w-full border rounded-xl p-5 bg-white dark:bg-neutral-900">
                {/* Volume Selection for liquid products */}
                {hasVolumes && (
                    <div className="mb-6">
                        <p className="text-xs mb-2">Volume disponibile:</p>
                        <div className="flex flex-col gap-2">
                            {product.product_volumes_price.map((volumePrice, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-2">
                                    <Button
                                        size="default"
                                        variant={selectedVolumeIndex === index ? "default" : "outline"}
                                        className="px-2 py-1 cursor-pointer border-2 w-[70px]"
                                        onClick={() => setSelectedVolumeIndex(index)}
                                    >
                                        {volumePrice.volume}
                                    </Button>
                                    <h2 className={`font-bold text-2xl flex items-baseline gap-1 ${
                                        selectedVolumeIndex === index 
                                            ? 'text-black dark:text-white' 
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                        <span>{volumePrice.price}</span>
                                        <span className="text-base font-normal">MDL</span>
                                    </h2>                                            
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Base Price if no volumes*/}
                {hasPrice && !hasVolumes && (
                    <div className="flex flex-row justify-between items-center mb-4">
                        <p className=" mb-1">Preț / unitate:</p>
                        <h2 className="font-bold text-2xl flex items-baseline gap-1">
                            <span>{product.price}</span>
                            <span className="text-base font-normal">MDL</span>
                        </h2>
                    </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="flex gap-2">
                    <div className="border rounded">
                        <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="sm"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            -
                        </Button>
                        <span className="px-3 py-1 text-sm">{quantity}</span>
                        <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="sm"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </Button>
                    </div>
                    <Button 
                        size="sm" 
                        className="flex-1 min-w-[120px] cursor-pointer"
                        onClick={handleAddToCart}
                        disabled={currentPrice === 0}
                    >
                        Adaugă în coş<ShoppingCart />
                    </Button>
                </div>
            </div>

            {product.doc_url && (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="flex gap-4 items-center h-fit w-full border rounded-xl p-3 hover:dark:bg-neutral-800 hover:bg-zinc-200 bg-white dark:bg-neutral-900 cursor-pointer">
                            <FileText/>
                            <p>Documentatie produs</p>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="lg:max-w-[1000px]">
                        <DialogHeader>
                            <DialogTitle>PDF</DialogTitle>
                            <DialogDescription>
                                <iframe
                                    src={product.doc_url}
                                    width="100%"
                                    height="700px"
                                    className="border rounded"
                                    allow="fullscreen"
                                />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
