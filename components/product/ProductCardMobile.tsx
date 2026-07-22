'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { ProductDetails } from '@/types';
import { getPrimaryImage } from '@/lib/utils';
import { useState, useMemo, useCallback } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { toast } from 'sonner';

// Compact product card for small screens (2-column grid, ~170px wide).
// Trimmed vs. the desktop ProductCard: no description, shorter image,
// category badge only, and a single "Adaugă" button (quantity defaults to 1 —
// full quantity/volume control lives on the product page).
// Rendered only below the `sm` breakpoint; the desktop ProductCard handles sm+.
export const ProductCardMobile = ({ product, priority = false }: { product: ProductDetails; priority?: boolean }) => {
    const addItem = useCartStore((state) => state.addItem);

    const { hasPrice, hasVolumes } = useMemo(() => ({
        hasPrice: product.price !== null,
        hasVolumes: product.product_volumes_price && product.product_volumes_price.length > 0,
    }), [product.price, product.product_volumes_price]);

    const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);

    const currentPrice = useMemo(() => {
        if (hasPrice) return product.price;
        if (hasVolumes) return product.product_volumes_price[selectedVolumeIndex]?.price || 0;
        return 0;
    }, [hasPrice, hasVolumes, product.price, product.product_volumes_price, selectedVolumeIndex]);

    const getCurrentVolume = useCallback(() => {
        if (hasVolumes) return product.product_volumes_price[selectedVolumeIndex]?.volume;
        return undefined;
    }, [hasVolumes, product.product_volumes_price, selectedVolumeIndex]);

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product, 1, getCurrentVolume());
        toast.success(`${product.title}${getCurrentVolume() ? ` (${getCurrentVolume()})` : ''} - adaugat în coș!`);
    }, [addItem, product, getCurrentVolume]);

    return (
        <Card className="h-full flex flex-col">
            {/* Clickable Image (shorter than desktop) */}
            <CardHeader className="p-1.5">
                <Link href={`/products/${product.id}`}>
                    <div className="relative h-32 w-full cursor-pointer">
                        <Image
                            className="rounded-t-lg"
                            src={getPrimaryImage(product)}
                            alt={product?.title || 'Placeholder image'}
                            fill
                            sizes="50vw"
                            quality={50}
                            priority={priority}
                            loading={priority ? undefined : 'lazy'}
                            style={{ objectFit: 'cover' }}
                        />
                        {/* Subtle gradient at the bottom of the image */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 rounded-b-lg bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                </Link>
            </CardHeader>

            <CardContent className="grid gap-1 p-2.5">
                {/* Category badge only (fewer badges on mobile) */}
                <Badge variant="primary" className="w-fit">
                    {product.category === 'equipment'
                        ? 'Echipament'
                        : product.category === 'disinfectants'
                        ? 'Dezinfectanți'
                        : product.category}
                </Badge>

                {/* Clickable Title */}
                <Link href={`/products/${product.id}`}>
                    <h2 className="mt-2 text-sm leading-snug line-clamp-2 cursor-pointer hover:underline">
                        {product.title}
                    </h2>
                </Link>
            </CardContent>

            <CardFooter className="flex flex-col items-stretch gap-3 px-2.5 mt-auto">
                {/* Volume selection — own row, left-aligned (only for volume-priced products) */}
                {hasVolumes && (
                    <div className="flex gap-1 flex-wrap">
                        {product.product_volumes_price.map((volumePrice, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant={selectedVolumeIndex === index ? 'default' : 'outline'}
                                className="h-6 text-[11px] px-1.5 py-0 cursor-pointer border-2"
                                onClick={() => setSelectedVolumeIndex(index)}
                            >
                                {volumePrice.volume}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Price — own row, right-aligned */}
                <h2 className="self-end font-bold text-lg flex items-baseline gap-1">
                    <span>{currentPrice}</span>
                    <span className="text-xs font-normal">MDL</span>
                </h2>

                {/* Single add-to-cart button (quantity fixed at 1) */}
                <Button
                    size="sm"
                    className="w-full cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={currentPrice === 0}
                >
                    Adaugă <ShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    );
};
