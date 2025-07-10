import { ProductPageView } from "@/components/product/ProductPageView";
interface ProductPageProps {
    id: string;
}

export default async function ProductPage({params}: {params: Promise<ProductPageProps>}) {
    
    const { id } = await params;
  
    return (
        <ProductPageView
            productId={id}
        />
    );
}