'use client';

import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Carousel({
  images,
}: {
  images: { name: string; url: string }[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function selectHandler() {
      const index = emblaApi?.selectedScrollSnap();
      setSelectedIndex(index || 0);
    }

    emblaApi?.on('select', selectHandler);

    return () => {
      emblaApi?.off('select', selectHandler);
    };
  }, [emblaApi]);

  return (
    <>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map(({ url }, i) => (
            // <div className="relative flex-[0_0_100%] h-96" key={i}>
            // <div className="relative flex-[0_0_100%] aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/4]" key={i}>
            <div className="relative aspect-[16/4] flex-[0_0_100%]" key={i}>
              <Image
                //src={url}
                src={`${url}?width=1280&height=384`} // Resize the image dynamically
                fill
                className="object-cover"
                alt=""
                priority={i === 0} // Add priority only to the first image
              />
            </div>
          ))}
        </div>
      </div>
      <Dots itemsLength={images.length} selectedIndex={selectedIndex} />
    </>
  );
}

type Props = {
  itemsLength: number;
  selectedIndex: number;
};
const Dots = ({ itemsLength, selectedIndex }: Props) => {
  const arr = new Array(itemsLength).fill(0);
  return (
    <div className="flex -translate-y-8 justify-center gap-1">
      {arr.map((_, index) => {
        const selected = index === selectedIndex;
        return (
          <div
            className={cn({
              'bg-primary-foreground h-3 w-3 rounded-full transition-all duration-300':
                true,
              // tune down the opacity if slide is not selected
              'h-3 w-3 opacity-50': !selected,
            })}
            key={index}
          />
        );
      })}
    </div>
  );
};
