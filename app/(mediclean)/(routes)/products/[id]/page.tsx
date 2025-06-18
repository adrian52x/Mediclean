import { ProductPageView } from "@/components/ProductPageView";

export default async function ProductPage({params}: {params: Promise<{ id: string }>}) {
    
    const { id } = await params;
  
    return (
        <ProductPageView
            productId={id}
        />
    );
}