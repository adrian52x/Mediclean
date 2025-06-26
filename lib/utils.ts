import { ProductDetails } from '@/types';
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

export function isUserAdminClientSide(session: any): boolean {
    const userEmail = session.user.email;
    return userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL2 
}

// Each product has max 3 images, named like:
// name_price_1.jpg, name_price_2.jpg, name_price_3.jpg
// This function returns the primary image (the one with _1 in the name) 
export function getPrimaryImage(product: ProductDetails): string {
    if (!product?.product_images?.length) return '/images/mediclean-logo.jpg';
    const main = product.product_images.find(img => /_1\.[a-zA-Z0-9]+$/.test(img.url));
    return main?.url || product.product_images[0]?.url || '/images/mediclean-logo.jpg';
}