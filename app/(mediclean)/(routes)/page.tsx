import React from 'react';
import { isVariableValid } from '@/lib/utils';
import { ProductGrid, ProductSkeletonGrid } from '@/components/Product';
import Carousel from '@/components/Carousel';
import { Separator } from '@/components/ui/separator';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceGrid, ServiceSkeletonGrid } from '@/components/ServiceCard';
import Maps from '@/components/Maps';
import { ImagesAPI } from '@/lib/api/ImagesAPI';
import { HeroSection } from '@/components/HeroSection';

export default async function Home() {

  const bannerImages = await ImagesAPI.getProductsImages();
  const servicesImages = await ImagesAPI.getServicesImages();

  const services = [
    {
      id: 1,
      title: 'Testing & Diagnostics',
      description: 'Descriere',
      image: servicesImages[0]?.url || '/images/no-img.png',
    },
    {
      id: 2,
      title: 'Consulting / Advisory Services',
      description: 'Descriere',
      image: servicesImages[1]?.url || '/images/no-img.png',
    },
    {
      id: 3,
      title: 'Equipment Maintenance & Setup',
      description: 'Descriere',
      image: servicesImages[2]?.url || '/images/no-img.png',
    },
  ];

  return (
    <main className="py-6">
      {/* <Carousel images={bannerImages} /> */}

      <HeroSection images={servicesImages}/>

      <Separator className="my-8" />

      <SectionHeading
        title="Produse"
        description="Below is a list of products we have available for you."
      />

      <ProductGrid />


      <Separator className="my-8" />

      <SectionHeading
        title="Servicii"
        description="Below is a list of services we have available for you."
      />
      {isVariableValid(services) ? (
        <ServiceGrid services={services} />
      ) : (
        <ServiceSkeletonGrid />
      )}

      <Separator className="my-8" />

      <SectionHeading
        title="Locatie"
        description="Str. Mihail Kogălniceanu 1, Chișinău, Moldova"
      />
      <Maps />
    </main>
  );
}
