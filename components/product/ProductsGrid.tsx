'use client';
import { useGetFeaturedProducts, useGetProducts } from '@/lib/hooks/useProducts';
import { ProductCard, ProductSkeleton } from './ProductCard';
import { Button } from '../ui/button';
import { WrapText } from 'lucide-react';
import Link from 'next/link';

export const ProductsGrid: React.FC = () => {
    //const { products, isPending, isError } = useGetProducts();
    const { products, isPending, isError } = useGetFeaturedProducts();
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
                className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                id="products"
            >
                {products && products.map((product) => (
                    <ProductCard product={product} key={product.id} />
                ))} 
            </div> 

            <div className="flex justify-center">
                <Link href={'#products'} className="flex justify-center">
                    <Button className="font-bold cursor-pointer" variant={'outline'}>
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
      {[...Array(12)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};
