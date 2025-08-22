'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetProducts } from '@/lib/hooks/useProducts';
import { useGetProductTypes } from '@/lib/hooks/useProducTypes';
import { ProductFiltersComponent } from '@/components/product/AllProductsPage/ProductFiltersComponent';
import { FilteredProductsGrid } from '@/components/product/AllProductsPage/FilteredProductsGrid';
import { ProductSearch } from '@/components/product/AllProductsPage/ProductSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryEnum, ProductFilters } from '@/types';
import { getFilteredProductsCount } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link';

export default function ProductsClientComponent() {
    const { products } = useGetProducts();
    const { productTypes } = useGetProductTypes();
    const searchParams = useSearchParams();

    // Initialize filters with URL parameters directly
    const [filters, setFilters] = useState<ProductFilters>(() => {
        const categoryParam = searchParams.get('category');
        return {
            categories: categoryParam ? [categoryParam] : [],
            productTypes: [],
            medicalFields: []
        };
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Prepare available filter options
    const availableCategories = useMemo(() => [
        { value: CategoryEnum.Disinfectants, label: 'Dezinfectanți' },
        { value: CategoryEnum.Equipment, label: 'Echipamente' }
    ], []);

    const availableProductTypes = useMemo(() => {
        if (!productTypes) return [];
        return productTypes.map(type => ({
            value: type.type_name,
            label: type.type_name
        }));
    }, [productTypes]);

    // Get products count for display using utility function
    const filteredCount = useMemo(() => {
        return getFilteredProductsCount(products, filters, searchQuery);
    }, [products, filters, searchQuery]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-lg">
                                <Link href="/">Pagina principală</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-lg">Produse</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Search and Results Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <ProductSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Caută produse..."
                />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {products ? (
                        `${filteredCount} produse găsite`
                    ) : (
                        <Skeleton className="h-4 w-24" />
                    )}
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Filters */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20">
                        <ProductFiltersComponent
                            availableCategories={availableCategories}
                            availableProductTypes={availableProductTypes}
                            filters={filters}
                            onFiltersChange={setFilters}
                        />
                    </div>
                </div>

                {/* Right Content - Products Grid */}
                <div className="lg:col-span-3">
                    <FilteredProductsGrid
                        filters={filters}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>
        </div>
    );
}
