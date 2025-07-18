'use client';

import { Badge } from '../ui/badge';
import { ProductDetails } from '@/types';

interface ProductPageInfoProps {
    product: ProductDetails;
}

export const ProductPageInfo: React.FC<ProductPageInfoProps> = ({ product }) => {
    return (
        <div className="w-full border rounded-xl p-5 bg-white dark:bg-neutral-900">
            {product.description && (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                        {product.stomatologie && (
                            <Badge variant="primary" className="w-fit">
                                Stomatologie
                            </Badge>
                        )}
                        {product.medicina_generala && (
                            <Badge variant="primary" className="w-fit whitespace-nowrap">
                                Medicină generală
                            </Badge>
                        )}

                        {/* Category badge*/}
                        <Badge variant="primary" className="w-fit">
                            {product.category === 'equipment'
                                ? 'Echipament'
                                : product.category === 'disinfectants'
                                ? 'Dezinfectanti'
                                : product.category}
                        </Badge>

                        {/* Subcategory/type badge */}
                        <Badge variant="primary" className="w-fit">
                            {product.product_type?.type_name}
                        </Badge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                </div>
            )}
        </div>
    );
};
