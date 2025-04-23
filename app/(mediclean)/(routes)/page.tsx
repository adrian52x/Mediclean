import { Button } from '@/components/ui/button';
import React from 'react';
import { ProductDetails } from '@/types';
import { getProducts, getImages } from '@/app/actions/productActions';
import { isVariableValid } from '@/lib/utils';
import { ProductGrid, ProductSkeletonGrid } from '@/components/Product';
import Carousel from '@/components/Carousel';
import { Separator } from '@/components/ui/separator';
import { SectionHeading } from '@/components/ui/section-heading';

export default async function Home() {
  const products = await getProducts();
  const images = await getImages();

  console.log("Images", images);
  
  return (
    <main className="py-6">
      <Carousel images={images} />

      <Separator className="my-8" />

      <SectionHeading title="Produse" description='Below is a list of products we have available for you.'/>
      {isVariableValid(products) ? (
        <ProductGrid products={products} />
      ) : (
        <ProductSkeletonGrid />
      )}

    </main>
  );
}
