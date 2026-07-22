'use client';
import { ProductDetails } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductCardMobile } from './ProductCardMobile';

// Renders the compact mobile card below the `sm` breakpoint and the full
// desktop card at `sm` and up. The switch is pure CSS (both are in the DOM,
// one is hidden) so there's no SSR/hydration flicker — unlike a JS media query.
export const ResponsiveProductCard = ({ product, priority = false }: { product: ProductDetails; priority?: boolean }) => {
    return (
        <>
            <div className="block sm:hidden h-full">
                <ProductCardMobile product={product} priority={priority} />
            </div>
            <div className="hidden sm:block h-full">
                <ProductCard product={product} priority={priority} />
            </div>
        </>
    );
};
