'use client';
import { ImageSkeleton } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { ProductDetails } from '@/types';
import { getPrimaryImage } from '@/lib/utils';
import { useState, useMemo, useCallback } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { toast } from 'sonner';
import { getPlainTextPreview } from '@/lib/utils/textPreview';

export const ProductCard = ({ product }: { product: ProductDetails }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);
    
    // Memoize product type and pricing calculations (these run on every render)
    const { hasPrice, hasVolumes } = useMemo(() => ({
        hasPrice: product.price !== null,
        hasVolumes: product.product_volumes_price && product.product_volumes_price.length > 0
    }), [product.price, product.product_volumes_price]);
    
    // For volume-based products, track selected volume
    const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);
    
    // Memoize current price calculation (expensive on every render)
    const currentPrice = useMemo(() => {
        if (hasPrice) {
            return product.price;
        } else if (hasVolumes) {
            return product.product_volumes_price[selectedVolumeIndex]?.price || 0;
        }
        return 0;
    }, [hasPrice, hasVolumes, product.price, product.product_volumes_price, selectedVolumeIndex]);
    
    // Get current volume (if applicable) - keeping as function since it's simple
    const getCurrentVolume = () => {
        if (hasVolumes) {
            return product.product_volumes_price[selectedVolumeIndex]?.volume;
        }
        return undefined;
    };
    
    // Memoize the add to cart handler to prevent recreation on every render
    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product, quantity, getCurrentVolume());
        toast.success(`[${quantity}] ${product.title}${getCurrentVolume() ? ` (${getCurrentVolume()})` : ''} - adaugat în coș!`);
    }, [addItem, product, quantity, selectedVolumeIndex]); // selectedVolumeIndex affects getCurrentVolume

    return (
        <Card className="h-full flex flex-col">
            {/* Clickable Image */}
            <CardHeader className="p-2">
                <Link href={`/products/${product.id}`}>
                    <div className="relative h-60 w-full cursor-pointer">
                        <Image
                            className="rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-104"
                            src={getPrimaryImage(product)} 
                            alt={product?.title || 'Placeholder image'}
                            fill
                            sizes="(min-width: 1000px) 30vw, 50vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </Link>
            </CardHeader>

            <CardContent className="grid gap-1 p-4"> 
                <div className="flex gap-2 flex-wrap">
                    {product.stomatologie && (
                        <Badge variant="primary" className="w-fit">
                            Stomatologie
                        </Badge>
                    )}
                    {product.medicina_generala && (
                        <Badge variant="primary" className="w-fit whitespace-nowrap">
                            Medicină generală
                        </Badge>
                    )}

                    {/* Category badge*/}
                    <Badge variant="primary" className="w-fit">
                        {product.category === 'equipment'
                            ? 'Echipament'
                            : product.category === 'disinfectants'
                            ? 'Dezinfectanti'
                            : product.category}
                    </Badge>

                    {/* Subcategory/type badge */}
                    <Badge variant="primary" className="w-fit">
                        {product.product_type?.type_name}
                    </Badge>
                </div>

                {/* Clickable Title */}
                <Link href={`/products/${product.id}`}>
                    <h2 className="mt-2 cursor-pointer hover:underline">
                        {product.title}
                    </h2>
                </Link>

                <div className="text-xs text-neutral-500 line-clamp-2">
                    {getPlainTextPreview(product.description ?? '', 100)}
                </div>
            </CardContent>

            {/* Footer that sticks to bottom */}
            <CardFooter className="flex flex-col gap-2 px-4 mt-auto"> 
                {/* Price */}
                <div className="w-full">
                    <h2 className="font-bold text-2xl flex items-baseline gap-1">
                        <span>{currentPrice}</span>
                        <span className="text-base font-normal">MDL</span>
                    </h2>
                </div>
                
                {/* Volume Selection for liquid products */}
                {hasVolumes && (
                    <div className="w-full">
                        <p className="text-xs mb-2">Volume:</p>
                        <div className="flex gap-1 flex-wrap">
                            {product.product_volumes_price.map((volumePrice, index) => (
                                <Button
                                    key={index}
                                    size="sm"
                                    variant={selectedVolumeIndex === index ? "default" : "outline"}
                                    className="text-xs px-2 py-1 cursor-pointer border-2"
                                    onClick={() => setSelectedVolumeIndex(index)}
                                >
                                    {volumePrice.volume}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Quantity and Add to Cart - Show for both types */}
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <div className="flex items-center border rounded">
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
                        disabled={currentPrice === 0} // Disable if no price available
                    >
                        Adaugă în coş<ShoppingCart />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export function ProductSkeleton() {
  return (
    <Link href="#">
      <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="relative h-full w-full">
          <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700">
            <ImageSkeleton />
          </div>
        </div>
        <div className="p-5">
          <div className="w-full">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="h-2 max-w-[360px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    </Link>
  );
}
