import React from 'react';
import { ProductsGrid } from '@/components/product/ProductsGrid';
import { Separator } from '@/components/ui/separator';
import { SectionHeading } from '@/components/ui/section-heading';
import { ConsultationCard } from '@/components/ConsultationCard';
import { ImagesAPI } from '@/lib/api/ImagesAPI';
import { HeroSection } from '@/components/HeroSection';
import MapsClient from '@/components/MapsClient';
import { HomePageSEOContent } from '@/components/SEO/SEOContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dezinfect MD - Dezinfectanți Profesionali și Echipamente Medicale Moldova',
  description: 'Magazin online #1 în Moldova pentru dezinfectanți profesionali, echipamente medicale și consumabile. Livrare rapidă în toată Moldova. Prețuri competitive.',
  keywords: ['dezinfectanți Moldova', 'echipamente medicale Chișinău', 'consumabile medicale', 'sterilizare medicală', 'dezinfecție profesională Moldova'],
  openGraph: {
    title: 'Dezinfect MD - Dezinfectanți și Echipamente Medicale Moldova',
    description: 'Cel mai mare magazin online de dezinfectanți și echipamente medicale din Moldova',
    url: 'https://dezinfect.md',
  },
};

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

        <Separator className="my-8" />
        
        {/* SEO Content Section */}
        {/* <HomePageSEOContent /> */}
    </main>
  );
}
