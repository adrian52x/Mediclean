'use client';
import { ImageSkeleton } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
//import { ProductWithIncludes } from '@/types/prisma'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { WrapText } from 'lucide-react';
import { useGetProducts } from '@/lib/hooks/useProducts';
import { ProductDetails } from '@/types';
import { getPrimaryImage } from '@/lib/utils';

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
  return (
    <Link className="" href={`/products/${product.id}`}>
      <Card className="h-full transition-transform duration-300 ease-in-out hover:scale-105">
        <CardHeader className="p-0">
          <div className="relative h-60 w-full">
            <Image
              className="rounded-t-lg"
              src={getPrimaryImage(product)} 
              alt={product?.title || 'Placeholder image'}
              fill
              sizes="(min-width: 1000px) 30vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
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


          <h2 className="mt-2">{product.title}</h2>
          <p className="text-justify text-xs text-neutral-500 line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter>
          {true ? <h2>${product.price}</h2> : <Badge variant="secondary">Out of stock</Badge>}
        </CardFooter>
      </Card>
    </Link>
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
