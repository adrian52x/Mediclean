'use client';

import { useMemo } from 'react';
import { useGetProducts } from '@/lib/hooks/useProducts';
import { ProductCard } from '../ProductCard';
import { ProductDetails } from '@/types';
import { Loader } from '../../ui/loader';
import { SectionHeading } from '../../ui/section-heading';

interface SimilarProductsProps {
    currentProduct: ProductDetails;
    maxItems?: number;
}

export const SimilarProducts: React.FC<SimilarProductsProps> = ({ 
    currentProduct, 
    maxItems = 4 
}) => {
    const { products, isPending } = useGetProducts();

    // Filter products by same product type, excluding current product
    const similarProducts = useMemo(() => {
        if (!products || !currentProduct.product_type?.type_name) return [];
        
        return products
            .filter(product => 
                product.id !== currentProduct.id && 
                product.product_type?.type_name === currentProduct.product_type?.type_name
            )
            .slice(0, maxItems);
    }, [products, currentProduct.id, currentProduct.product_type?.type_name, maxItems]);

    if (isPending) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Produse similare</h2>
                <div className="flex justify-center items-center h-32">
                    <Loader />
                </div>
            </div>
        );
    }

    if (similarProducts.length === 0) {
        return null; // Don't show section if no similar products
    }

    return (
        <div className="mt-8">
            <SectionHeading
                title="Produse similare"
                description={`Alte produse din categoria ${currentProduct.product_type?.type_name}.
                `}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
