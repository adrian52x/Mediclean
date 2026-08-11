'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { ProductDetails } from '@/types';
import { getPrimaryImage } from '@/lib/utils';
import { useState, useMemo, useCallback } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { toast } from 'sonner';
import { getPlainTextPreview } from '@/lib/utils/textPreview';
import { formatText } from '@/lib/utils/textFormatter';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

// Compact product card for small screens (2-column grid, ~170px wide).
// Trimmed vs. the desktop ProductCard: shorter image, category badge only,
// a 2-line description preview that opens a bottom drawer with the full text,
// and a single "Adaugă" button (quantity defaults to 1 —
// full quantity/volume control lives on the product page).
// Rendered only below the `sm` breakpoint; the desktop ProductCard handles sm+.
export const ProductCardMobile = ({ product, priority = false }: { product: ProductDetails; priority?: boolean }) => {
    const addItem = useCartStore((state) => state.addItem);

    const { hasPrice, hasVolumes } = useMemo(() => ({
        hasPrice: product.price !== null,
        hasVolumes: product.product_volumes_price && product.product_volumes_price.length > 0,
    }), [product.price, product.product_volumes_price]);

    const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

    // Short plain-text teaser; the full (formatted) text lives in the drawer
    const descriptionPreview = useMemo(
        () => getPlainTextPreview(product.description ?? '', 80),
        [product.description]
    );

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

                {/* Description teaser — tapping anywhere on it opens the full text in a drawer.
                    The explicit "Vezi mai mult" row is the affordance (no hover on touch). */}
                {product.description && (
                    <button
                        type="button"
                        onClick={() => setIsDescriptionOpen(true)}
                        aria-label={`Vezi descrierea completă pentru ${product.title}`}
                        className="mt-0.5 text-left cursor-pointer"
                    >
                        <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400 line-clamp-2">
                            {descriptionPreview}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-medium text-cyan-700 dark:text-cyan-400">
                            Vezi mai mult
                            <ChevronDown className="size-3" />
                        </span>
                    </button>
                )}
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

            {/* Full description in a bottom drawer — same pattern as the cart,
                so the grid never reflows and the sheet stays thumb-reachable. */}
            <Drawer open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-md">
                        <DrawerHeader className="text-left">
                            <DrawerTitle className="text-base leading-snug">{product.title}</DrawerTitle>
                            <DrawerDescription className="sr-only">Descrierea produsului</DrawerDescription>
                        </DrawerHeader>

                        <div className="px-4 flex gap-2 flex-wrap">
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
                            {product.product_type?.type_name && (
                                <Badge variant="primary" className="w-fit">
                                    {product.product_type.type_name}
                                </Badge>
                            )}
                        </div>

                        <div className="mt-3 max-h-[45vh] overflow-y-auto px-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                            {formatText(product.description ?? '')}
                        </div>

                        <DrawerFooter className="gap-2">
                            <Button
                                className="w-full cursor-pointer"
                                onClick={(e) => {
                                    handleAddToCart(e);
                                    setIsDescriptionOpen(false);
                                }}
                                disabled={currentPrice === 0}
                            >
                                Adaugă în coş — {currentPrice} MDL <ShoppingCart />
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/products/${product.id}`}>Vezi pagina produsului</Link>
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </Card>
    );
};
