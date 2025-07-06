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
import { Button } from './ui/button';
import { WrapText } from 'lucide-react';
import { useGetProducts } from '@/lib/hooks/useProducts';
import { ProductDetails } from '@/types';
import { getPrimaryImage } from '@/lib/utils';
import { useState } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { toast } from 'sonner';

export const ProductGrid: React.FC = () => {
    const { products, isPending, isError } = useGetProducts();
    console.log('Products:', products);
    

    if (isPending) {
        return (
            <ProductSkeletonGrid />
        )
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-40 text-red-500">
                Eroare la încărcarea produselor.
            </div>
        );
    }
    
    return (
        <>
            <div
                className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                id="products"
            >
                {products && products.map((product) => (
                    <Product product={product} key={product.id} />
                ))}
                
            </div> 

            <div className="flex justify-center">
                <Link href={'#products'} className="flex justify-center">
                    <Button className="font-bold" variant={'outline'}>
                        <WrapText />
                        <p>Vezi toate produsele</p>
                    </Button>
                </Link>
            </div>
        </>
    );
};

export const ProductSkeletonGrid = () => {
  return (
    <div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {[...Array(12)].map(() => (
        <ProductSkeleton key={Math.random()} />
      ))}
    </div>
  );
};

export const Product = ({ product }: { product: ProductDetails }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [quantity, setQuantity] = useState(1);
    
    // Determine product type and pricing
    const hasPrice = product.price !== null;
    const hasVolumes = product.product_volumes_price && product.product_volumes_price.length > 0;
    
    // For volume-based products, track selected volume
    const [selectedVolumeIndex, setSelectedVolumeIndex] = useState(0);
    
    // Get current price based on product Price OR selected volume price
    const getCurrentPrice = () => {
        if (hasPrice) {
            return product.price;
        } else if (hasVolumes) {
            return product.product_volumes_price[selectedVolumeIndex]?.price || 0;
        }
        return 0;
    };

    // Get current volume (if applicable)
    const getCurrentVolume = () => {
        if (hasVolumes) {
            return product.product_volumes_price[selectedVolumeIndex]?.volume;
        }
        return undefined;
    };
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent any unwanted navigation
        addItem(product, quantity, getCurrentVolume()); // Pass volume if exists
        toast.success(`Added ${quantity}x ${product.title}${getCurrentVolume() ? ` (${getCurrentVolume()})` : ''} to cart!`);
    };

    const currentPrice = getCurrentPrice();

    return (
        <Card className="h-full flex flex-col">
            {/* Clickable Image */}
            <CardHeader className="p-0">
                <Link href={`/products/${product.id}`}>
                    <div className="relative h-60 w-full cursor-pointer">
                        <Image
                            className="rounded-t-lg transition-transform duration-300 ease-in-out hover:scale-105"
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

                <p className="text-xs text-neutral-500 line-clamp-3">
                    {product.description}
                </p>
            </CardContent>

            {/* Footer that sticks to bottom */}
            <CardFooter className="flex flex-col gap-2 px-4 mt-auto"> 
                <div className="flex items-center justify-between w-full">
                    <h2 className="font-semibold">{currentPrice} MDL</h2>
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
                                    className="text-xs px-2 py-1 cursor-pointer"
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
                        Add to Cart
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
