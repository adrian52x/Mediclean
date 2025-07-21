'use client';

import { useMemo } from 'react';
import { useGetProducts } from '@/lib/hooks/useProducts';
import { ProductCard } from '../ProductCard';
import { ProductDetails, ProductFilters } from '@/types';
import { filterProducts } from '@/lib/utils';
import { Skeleton } from '../../ui/skeleton';

interface FilteredProductsGridProps {
    filters: ProductFilters;
    searchQuery?: string;
}

export const FilteredProductsGrid: React.FC<FilteredProductsGridProps> = ({
    filters,
    searchQuery = ''
}) => {
    const { products, isPending, isError } = useGetProducts();

    // Filter products based on active filters
    const filteredProducts = useMemo(() => {
        return filterProducts(products || [], filters, searchQuery);
    }, [products, filters, searchQuery]);

    if (isPending) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">
                    A apărut o eroare la încărcarea produselor.
                </p>
            </div>
        );
    }

    if (!filteredProducts.length) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                    Nu au fost găsite produse care să corespundă filtrelor selectate.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: ProductDetails) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
