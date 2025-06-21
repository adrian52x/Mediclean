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

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadError(null);
        setUploading(true);

        const form = e.currentTarget;
        const formData = new FormData(form as HTMLFormElement);

        const title = formData.get("title") as string;
        const price = formData.get("price") as string;
        const imageFile = formData.get("image") as File | null;
        const pdfFile = formData.get("pdf") as File | null;

        // Prepare upload promises
        const uploadPromises = [
            imageFile?.size ? ProductsAPI.uploadImage(imageFile, title, Number(price)) : Promise.resolve({ url: undefined, error: null, path: undefined }),
            pdfFile?.size ? ProductsAPI.uploadPdf(pdfFile, title, Number(price)) : Promise.resolve({ url: undefined, error: null, path: undefined }),
        ];

        // Run uploads in parallel
        const [imageResult, pdfResult] = await Promise.all(uploadPromises);

        // Handle errors and rollback if needed
        if (imageResult.error) {
            //setUploadError("Failed to upload image: " + imageResult.error.message);
            toast.error("Failed to upload Image: " + imageResult.error.message);
            // Rollback PDF if uploaded
            if (pdfResult.path) {
                await ProductsAPI.deleteFile('product-pdfs', pdfResult.path);
            }
            setUploading(false);
            return;
        }
        if (pdfResult.error) {
            //setUploadError("Failed to upload PDF: " + pdfResult.error.message);
            toast.error("Failed to upload PDF: " + pdfResult.error.message);
            // Rollback image if uploaded
            if (imageResult.path) {
                await ProductsAPI.deleteFile('product-images', imageResult.path);
            }
            setUploading(false);
            return;
        }

        // All uploads succeeded
        const productData: InsertProduct = {
            title,
            price: Number(price),
            image: imageResult.url ?? '',
            doc_url: pdfResult.url,
        };

        createProduct.mutate(productData, {
            onSuccess: () => {
                toast.success("Product added successfully!");
            },
            onError: (error: any) => {
                toast.error("Failed to add product: " + (error?.message || "Unknown error"));
            }
        });
        form.reset();
        setUploading(false);
    };

    return (
        <div className="relative">
            {(uploading || createProduct.isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/50">
                    <Loader />                
                </div>
            )}
            <form onSubmit={handleSubmit} className={(uploading || createProduct.isPending) ? "pointer-events-none select-none" : ""}>
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
            <label className="">Upload Image | max 300KB</label>
            <input
                name="image"
                type="file"
                accept="image/*"
                required
                className="border p-2 rounded w-full"
            />

            <label className="">Upload PDF | max 5MB</label>
            <input
                name="pdf"
                type="file"
                accept="application/pdf"
                //onChange={e => setPdf(e.target.files?.[0] || null)}
                className="border p-2 rounded w-full"
            />

            {uploadError && <div className="text-red-500">{uploadError}</div>}

            <button
                type="submit"
                disabled={uploading || createProduct.isPending}
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