'use client';

import { useGetProductById } from "@/lib/hooks/useProducts";


export default function ProductPageView({ id }: { id: string }) {
    const { product, isLoading, isError } = useGetProductById(id);

    if (!product) return <div>Produsul nu a fost găsit.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="mb-2">Preț: {product.price} DKK</p>
        {/* ...other product info... */}

        {product.doc_url ? (
            <div className="mt-6">
            <h2 className="font-semibold mb-2">Document PDF</h2>
            <iframe
                src={product.doc_url}
                width="100%"
                height="600px"
                className="border rounded"
            />
            {/* Or, for download: */}
            {/* <a href={product.doc_url} target="_blank" rel="noopener" className="text-blue-600 underline">Descarcă PDF</a> */}
            </div>
        ) : (
            <div className="text-gray-500 mt-6">Nu există document atașat.</div>
        )}
        </div>
    );
}