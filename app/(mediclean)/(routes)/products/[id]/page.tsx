import ProductPageView from "@/components/ProductPageView";

export default function ProductPage(props: { params: { id: string } }) {
    const { params } = props;
    const productId = params.id;
  
    return (
        <ProductPageView
            id={productId}
        />
    );
}