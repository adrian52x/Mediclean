'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';

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

    // Build the PDF URL. doc_url is the full Supabase URL; serve it via our own
    // domain (/docs/<file>) using the rewrite in next.config.ts, falling back to
    // the original URL if the filename can't be extracted. Cache-busted by updated_at.
    const pdfUrl = useMemo(() => {
        if (!product?.doc_url) return null;
        const cacheBust = `?v=${new Date(product.updated_at).getTime()}`;
        const filename = product.doc_url.match(/\/product-pdfs\/(.+)$/)?.[1];
        return filename ? `/docs/${filename}${cacheBust}` : `${product.doc_url}${cacheBust}`;
    }, [product?.doc_url, product?.updated_at]);

    const pdfTriggerClasses =
        "flex gap-4 items-center h-fit w-full border rounded-xl p-3 hover:dark:bg-neutral-800 hover:bg-zinc-200 bg-white dark:bg-neutral-900 cursor-pointer";

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

                {/* Availability notice */}
                <p className="text-xs text-gray-500 mb-2">Disponibil în limita stocului.</p>

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

            {pdfUrl && (
                <>
                    {/* Desktop (sm+): in-page modal with an embedded iframe viewer.
                        Iframe PDF embedding works in desktop/Android browsers. */}
                    <div className="hidden sm:block">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className={pdfTriggerClasses}>
                                    <FileText />
                                    <p>Documentatie produs</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="lg:max-w-[1000px]">
                                <DialogHeader>
                                    <DialogTitle>PDF</DialogTitle>
                                    <DialogDescription>
                                        <iframe
                                            src={pdfUrl}
                                            width="100%"
                                            height="550px"
                                            className="border rounded"
                                            allow="fullscreen"
                                        />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Mobile (below sm): open the PDF in a new tab. iOS Safari (WebKit)
                        only renders the first page of an iframe-embedded PDF, so a
                        top-level navigation is required to get the full native viewer. */}
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${pdfTriggerClasses} block sm:hidden`}
                    >
                        <span className="flex gap-4 items-center">
                            <FileText />
                            <span>Documentatie produs</span>
                        </span>
                    </a>
                </>
            )}
        </div>
    );
};
