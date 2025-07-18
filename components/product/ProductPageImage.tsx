'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getPrimaryImage } from '@/lib/utils';
import { ProductDetails } from '@/types';

interface ProductPageImageProps {
    product: ProductDetails;
}

export const ProductPageImage: React.FC<ProductPageImageProps> = ({ product }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    return (
        <div className="border rounded-xl p-5 bg-white dark:bg-neutral-900">
            {/* Main Image */}
            <div className="mb-4 relative h-[400px] w-full">
                <Image
                    className="rounded-lg"
                    src={selectedImageIndex === 0 ? getPrimaryImage(product) : product.product_images[selectedImageIndex - 1].url} 
                    alt={product?.title || 'Placeholder image'}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    style={{ objectFit: 'cover' }}
                />
            </div>
            
            {/* Thumbnail Images - Show additional images only */}
            {product.product_images && product.product_images.length > 0 && (
                <div className="flex gap-2">
                    {product.product_images.map((imageData, index) => (
                        <div
                            key={index}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 w-[80px] h-[80px] ${
                                selectedImageIndex === index + 1 
                                    ? 'border-blue-500 ring-2 ring-blue-200' 
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => setSelectedImageIndex(index + 1)}
                        >
                            <Image
                                src={imageData.url}
                                alt={`${product.title} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
