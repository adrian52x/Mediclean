'use client';

import { useGetProductById } from "@/lib/hooks/useProducts";
import { Loader } from "../../ui/loader";
import { ProductPageImage } from "./ProductPageImage";
import { ProductPageInfo } from "./ProductPageInfo";
import { ProductPagePurchaseAndPdf } from "./ProductPagePurchaseAndPdf";
import { SimilarProducts } from "./SimilarProducts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";

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
            <Breadcrumb className="mb-5">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-lg">
                                <Link href="/">Pagina principală</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="text-lg">
                                <Link href="/products">Produse</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-lg">{product.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
            </Breadcrumb>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px] xl:grid-cols-[1fr_1fr_400px] gap-6">
                {/* IMG section */}
                <ProductPageImage product={product} />

                {/* Details section */}
                <ProductPageInfo product={product} />

                {/* Price / Volume / Quantity & add to cart */}
                <ProductPagePurchaseAndPdf product={product} />
            </div>

            {/* Similar Products Section */}
            <SimilarProducts currentProduct={product} maxItems={4} />
        </div>
    );
}