'use client';

import { useGetProductById } from "@/lib/hooks/useProducts";
import { Loader } from "../ui/loader";
import { getPrimaryImage } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cartStore";
import { Badge } from "../ui/badge";

interface ProductPageViewProps {
    productId: string;
}

export const ProductPageView: React.FC<ProductPageViewProps> = ({ productId }) => {
    const { product, isPending } = useGetProductById(productId);
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    
    // Memoize product type and pricing calculations (these run on every render)
    const { hasPrice, hasVolumes } = useMemo(() => ({
        hasPrice: product?.price !== null,
        hasVolumes: product?.product_volumes_price && product.product_volumes_price.length > 0
    }), [product?.price, product?.product_volumes_price]);
    
    // For volume-based products, track selected volume
    const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);
    
    // Memoize current price calculation (expensive on every render)
    const currentPrice = useMemo(() => {
        if (!product) return 0;
        if (hasPrice) {
            return product.price;
        } else if (hasVolumes) {
            return product.product_volumes_price[selectedVolumeIndex]?.price || 0;
        }
        return 0;
    }, [hasPrice, hasVolumes, product?.price, product?.product_volumes_price, selectedVolumeIndex]);
    
    // Get current volume (if applicable) - keeping as function since it's simple
    const getCurrentVolume = () => {
        if (hasVolumes && product) {
            return product.product_volumes_price[selectedVolumeIndex]?.volume;
        }
        return undefined;
    };
    
    // Memoize the add to cart handler to prevent recreation on every render
    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (!product) return;
        addItem(product, quantity, getCurrentVolume());
        toast.success(`Added ${quantity}x ${product.title}${getCurrentVolume() ? ` (${getCurrentVolume()})` : ''} to cart!`);
    }, [addItem, product, quantity, selectedVolumeIndex]); // selectedVolumeIndex affects getCurrentVolume

    console.log("Product data:", product);
    

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!product) return <div>Produsul nu a fost găsit.</div>;

    return (
        // <div className="w-full border mt-4 rounded-lg p-3 bg-white dark:bg-neutral-900 text-black dark:text-white">
        <div className="w-full mt-4 rounded-lg text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px] xl:grid-cols-[1fr_1fr_400px] gap-6">
                {/* IMG section */}
                <div className="border rounded-xl p-5 bg-white dark:bg-neutral-900">
                    {/* Main Image */}
                    <div className="mb-4 relative h-[400px] w-full">
                        <Image
                            className="rounded-lg"
                            src={selectedImageIndex === 0 ? getPrimaryImage(product) : product.product_images[selectedImageIndex - 1].url} 
                            alt={product?.title || 'Placeholder image'}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    
                    {/* Thumbnail Images - Show additional images only */}
                    {product.product_images && product.product_images.length > 0 && (
                        <div className="flex gap-2">
                            {product.product_images.map((imageData, index) => (
                                <div
                                    key={index}
                                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 w-[80px] h-[80px] ${
                                        selectedImageIndex === index + 1 
                                            ? 'border-blue-500 ring-2 ring-blue-200' 
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onClick={() => setSelectedImageIndex(index + 1)}
                                >
                                    <Image
                                        src={imageData.url}
                                        alt={`${product.title} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details section */}
                <div className="w-full border rounded-xl p-5 bg-white dark:bg-neutral-900">
                    {product.description && (
                        <div className="flex flex-col gap-2">
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
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                        </div>
                    )}
                </div>

                

                {/* Price / Volume / Quantity & add to cart */}
                <div className="flex flex-col h-[200px] justify-between w-full border rounded-xl p-5 bg-white dark:bg-neutral-900">

                    {/* Volume Selection for liquid products */}
                    {hasVolumes && (
                        <div className="flex gap-4 justify-between items-center mb-4">
                            <div className="flex-col">
                                <p className="text-xs mb-1">Volume disponibile:</p>
                                <div className="flex gap-1 flex-wrap">
                                    {product.product_volumes_price.map((volumePrice, index) => (
                                        <Button
                                            key={index}
                                            size="default"
                                            variant={selectedVolumeIndex === index ? "default" : "outline"}
                                            className="px-2 py-1 cursor-pointer border-2"
                                            onClick={() => setSelectedVolumeIndex(index)}
                                        >
                                            {volumePrice.volume}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-col">
                                <p className="text-xs mb-1">Preț:</p>
                                <h2 className="font-bold text-2xl flex items-baseline gap-1">
                                    <span>{currentPrice}</span>
                                    <span className="text-base font-normal">MDL</span>
                                </h2>
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
                    <div className="flex flex-row gap-2">
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
            </div>

            {/* PDF */}
            <div>
                {product.doc_url ? (
                    <div className="mt-6">
                    <h2 className="font-semibold mb-2">Document PDF</h2>
                    <iframe
                        src={product.doc_url}
                        width="100%"
                        height="600px"
                        className="border rounded"
                        allow="fullscreen"
                    />
                    {/* Or, for download: */}
                    {/* <a href={product.doc_url} target="_blank" rel="noopener" className="text-blue-600 underline">Descarcă PDF</a> */}
                    </div>
                ) : (
                    <div className="text-gray-500 mt-6">Nu există document atașat.</div>
                )}
            </div>
        </div>
    );
}