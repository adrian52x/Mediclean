'use client';
import { FormEvent, useState } from "react";
import { useCreateProducts } from "@/lib/hooks/useProducts";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ProductsAPI } from "@/lib/api/ProductsAPI";
import { InsertProduct } from "@/types";
import { Loader } from "./ui/loader";
import { toast } from "sonner";

export default function AddProductForm() {
    const { createProduct } = useCreateProducts();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        setUploadError(null);

        let doc_url: string | undefined = undefined;
        let pdf = formData.get("pdf") as File | null;

        // 1. Upload PDF if provided
        if (pdf?.size) {
            setUploadLoading(true);
            const { url, error } = await ProductsAPI.uploadPdf(pdf);
            setUploadLoading(false);
            if (error) {
                setUploadError("Failed to upload PDF: " + error.message);
                return;
            }
            doc_url = url;
            
        }

        const productData: InsertProduct = {
			title: formData.get("title") as string,
            price: Number(formData.get("price")),
            image: "img-upload-placeholder",
            doc_url: doc_url || undefined,
		};

        //2. Add product to DB
        createProduct.mutate(productData, {
            onSuccess: () => {
                toast("Product has been created.")
            }
        });

        console.log("Product data to create:", createProduct);
        



        // Reset form
        (e.target as HTMLFormElement).reset();
    }

    return (
        <div className="relative">
            {createProduct.isPending || uploadLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/50">
                    <Loader />                
                </div>
            )}
            <form onSubmit={handleSubmit} className={createProduct.isPending || uploadLoading ? "pointer-events-none select-none" : ""}>
            <input
                name="title"
                type="text"
                placeholder="Title"
                required
                className="border p-2 rounded w-full"
            />
            <input
                name="price"
                type="number"
                placeholder="Price"
                required
                className="border p-2 rounded w-full"
            />
            <input
                name="pdf"
                type="file"
                accept="application/pdf"
                //onChange={e => setPdf(e.target.files?.[0] || null)}
                className="border p-2 rounded w-full"
            />
            <div>Max 5MB</div>
            {uploadError && <div className="text-red-500">{uploadError}</div>}
            {uploadLoading && <div className="text-orange-500">Uploading file...</div>}
            <button
                type="submit"
                disabled={createProduct.isPending || uploadLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Add Product
            </button>
            </form>

            <button onClick={() => toast("This is a test toast!")} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
                show toast
            </button>
        </div>
    );
}