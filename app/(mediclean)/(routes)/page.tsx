import React from 'react';
import { ProductsGrid } from '@/components/product/ProductsGrid';
import { Separator } from '@/components/ui/separator';
import { SectionHeading } from '@/components/ui/section-heading';
import { ConsultationCard } from '@/components/ConsultationCard';
import { ImagesAPI } from '@/lib/api/ImagesAPI';
import { HeroSection } from '@/components/HeroSection';
import MapsClient from '@/components/MapsClient';

export default async function Home() {

  const heroSectionImages = await ImagesAPI.getServicesImages();


  return (
    <main className="py-6">

        <HeroSection images={heroSectionImages}/>

        <Separator className="my-8" />

        <SectionHeading
            title="Produse noi"
        />
        <ProductsGrid />


        <Separator className="my-8" />

        <SectionHeading
            id="services"
            title="Consultanță"
        />
        <ConsultationCard />

        <Separator className="my-8" />

        <SectionHeading
            id="location"
            title="Locație"
            description="Str. Nicolae Zelinski 36/6, Chișinău, Moldova"
        />
        <MapsClient />
    </main>
  );
}
