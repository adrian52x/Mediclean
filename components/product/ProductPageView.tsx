'use client';

import { useGetProductById } from "@/lib/hooks/useProducts";
import { Loader } from "../ui/loader";
import { ProductPageImage } from "./ProductPageImage";
import { ProductPageInfo } from "./ProductPageInfo";
import { ProductPagePurchaseAndPdf } from "./ProductPagePurchaseAndPdf";

interface ProductPageViewProps {
    productId: string;
}

export const ProductPageView: React.FC<ProductPageViewProps> = ({ productId }) => {
    const { product, isPending } = useGetProductById(productId);

    console.log("Product data:", product);

    if (isPending) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!product) return <div>Produsul nu a fost găsit.</div>;

    return (
        <div className="w-full mt-4 rounded-lg text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px] xl:grid-cols-[1fr_1fr_400px] gap-6">
                {/* IMG section */}
                <ProductPageImage product={product} />

                {/* Details section */}
                <ProductPageInfo product={product} />

                {/* Price / Volume / Quantity & add to cart */}
                <ProductPagePurchaseAndPdf product={product} />
            </div>
        </div>
    );
}