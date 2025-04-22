import { Button } from '@/components/ui/button';
import React from 'react';
import { ProductDetails } from '@/types';
import { getProducts } from '@/app/actions/productActions';
import { isVariableValid } from '@/lib/utils';
import { ProductGrid, ProductSkeletonGrid } from '@/components/Product';

export default async function Home() {
  const products = await getProducts();
  return (
    <main className="py-4">
       {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
    </main>
  );
}
