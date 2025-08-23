import { ProductDetails, ProductFilters } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isVariableValid(variable: any) {
    return variable !== null && variable !== undefined;
}

export function validateBoolean(variable: any, value: any) {
    if (isVariableValid(variable) && variable === value) {
        return true;
    }

    return false;
}

export function filterProducts(
    products: ProductDetails[],
    filters: ProductFilters,
    searchQuery: string = ''
): ProductDetails[] {
    if (!products) return [];

    return products.filter((product: ProductDetails) => {
        // Search query filter
        if (searchQuery.trim()) {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = (
                product.title.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.product_type?.type_name.toLowerCase().includes(searchLower)
            );
            
            if (!matchesSearch) return false;
        }

        // Category filter
        if (filters.categories.length > 0) {
            const productCategory = product.category?.toLowerCase();
            const matchesCategory = filters.categories.some(cat => 
                cat.toLowerCase() === productCategory
            );
            
            if (!matchesCategory) return false;
        }

        // Product type filter
        if (filters.productTypes.length > 0) {
            const productTypeName = product.product_type?.type_name;
            const matchesProductType = filters.productTypes.some(type => 
                type === productTypeName
            );
            
            if (!matchesProductType) return false;
        }

        // Medical field filter
        if (filters.medicalFields.length > 0) {
            const matchesMedicalField = filters.medicalFields.some(field => {
                if (field === 'stomatologie') return product.stomatologie;
                if (field === 'medicina_generala') return product.medicina_generala;
                return false;
            });
            
            if (!matchesMedicalField) return false;
        }

        return true;
    });
}

export function getFilteredProductsCount(
    products: ProductDetails[] | undefined,
    filters: ProductFilters,
    searchQuery: string = ''
): number {
    if (!products) return 0;
    return filterProducts(products, filters, searchQuery).length;
}

export function isUserAdminClientSide(session: any): boolean {
    const userEmail = session.user.email;
    return userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL2 
}

// Each product has max 3 images, named like:
// name_price_1.jpg, name_price_2.jpg, name_price_3.jpg
// This function returns the primary image (the one with _1 in the name) 
export function getPrimaryImageOLD(product: ProductDetails): string {
    if (!product?.product_images?.length) return '/images/mediclean-logo.jpg';
    const main = product.product_images.find(img => /_1\.[a-zA-Z0-9]+$/.test(img.url));
    return main?.url || product.product_images[0]?.url || '/images/mediclean-logo.jpg';
}

// Each product has max 3 images. The primary image is the first one in the product_images array
// (determined by the order they were inserted/arranged by the user)
export function getPrimaryImage(product: ProductDetails): string {
    if (!product?.product_images?.length) return '/images/mediclean-logo.jpg';
    // The first image in the array is the primary image
    return product.product_images[0]?.url || '/images/mediclean-logo.jpg';
}

// Example: DEZ-23/08/2025-1435-67
export function generateOrderId() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const random2digits = Math.floor(10 + Math.random() * 90); // 2-digit random
    return `DEZ-${day}/${month}/${year}-${hour}${minute}-${random2digits}`;
};

// Email validation function
export function validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        return '';
    }
    if (!emailRegex.test(email)) {
        return 'Adresa de email nu este validă';
    }
    return '';
};