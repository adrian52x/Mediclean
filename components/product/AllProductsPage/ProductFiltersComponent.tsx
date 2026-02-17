'use client';

import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';
import { X } from 'lucide-react';
import React from 'react';
import { ProductFilters } from '@/types';

interface ProductFiltersProps {
    availableCategories: Array<{ value: string; label: string }>;
    availableProductTypes: Array<{ value: string; label: string }>;
    filters: ProductFilters;
    onFiltersChange: (filters: ProductFilters) => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
    availableCategories,
    availableProductTypes,
    filters,
    onFiltersChange
}) => {
    // Handle category filter changes
    const handleCategoryChange = (category: string, checked: boolean) => {
        const newCategories = checked 
            ? [...filters.categories, category]
            : filters.categories.filter(c => c !== category);
        
        onFiltersChange({
            ...filters,
            categories: newCategories
        });
    };

    // Handle product type filter changes
    const handleProductTypeChange = (productType: string, checked: boolean) => {
        const newProductTypes = checked 
            ? [...filters.productTypes, productType]
            : filters.productTypes.filter(pt => pt !== productType);
        
        onFiltersChange({
            ...filters,
            productTypes: newProductTypes
        });
    };

    // Handle medical field filter changes
    const handleMedicalFieldChange = (field: string, checked: boolean) => {
        const newMedicalFields = checked 
            ? [...filters.medicalFields, field]
            : filters.medicalFields.filter(mf => mf !== field);
        
        onFiltersChange({
            ...filters,
            medicalFields: newMedicalFields
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        onFiltersChange({
            categories: [],
            productTypes: [],
            medicalFields: []
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.categories.length > 0 || 
                            filters.productTypes.length > 0 || 
                            filters.medicalFields.length > 0;

    return (
        <div className="w-full bg-white dark:bg-neutral-900 border rounded-xl p-6 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filtrează produsele</h3>
                {hasActiveFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Șterge toate
                    </Button>
                )}
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm">Categorii</h4>
                <div className="space-y-2">
                    {availableCategories.map((category) => (
                        <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category.value}`}
                                className="cursor-pointer"
                                checked={filters.categories.includes(category.value)}
                                onCheckedChange={(checked) => 
                                    handleCategoryChange(category.value, checked === true)
                                }
                            />
                            <Label 
                                htmlFor={`category-${category.value}`}
                                className="text-sm cursor-pointer hover:underline"
                            >
                                {category.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Product Types Filter */}
            <div className="mb-6">
                <h4 className="font-medium mb-3 text-sm">Tipuri de produse</h4>
                <div className="space-y-2">
                    {availableProductTypes.map((productType, idx) => (
                        <React.Fragment key={productType.value}>
                            <div key={productType.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`productType-${productType.value}`}
                                    checked={filters.productTypes.includes(productType.value)}
                                    onCheckedChange={(checked) => 
                                        handleProductTypeChange(productType.value, checked === true)
                                    }
                                />
                                <Label 
                                    htmlFor={`productType-${productType.value}`}
                                    className="text-sm cursor-pointer hover:underline"
                                >
                                    {productType.label}
                                </Label>
                                
                            </div>
                            {idx === 3 && (
                                <Separator key={`separator-TypesFilter`} className="my-2" />   
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <Separator className="my-4" />

            {/* Medical Fields Filter */}
            <div className="mb-4">
                <h4 className="font-medium mb-3 text-sm">Domenii medicale</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="medical-stomatologie"
                            checked={filters.medicalFields.includes('stomatologie')}
                            onCheckedChange={(checked) => 
                                handleMedicalFieldChange('stomatologie', checked === true)
                            }
                        />
                        <Label 
                            htmlFor="medical-stomatologie"
                            className="text-sm cursor-pointer hover:underline"
                        >
                            Stomatologie
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="medical-medicina-generala"
                            checked={filters.medicalFields.includes('medicina_generala')}
                            onCheckedChange={(checked) => 
                                handleMedicalFieldChange('medicina_generala', checked === true)
                            }
                        />
                        <Label 
                            htmlFor="medical-medicina-generala"
                            className="text-sm cursor-pointer hover:underline"
                        >
                            Medicină generală
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
};
