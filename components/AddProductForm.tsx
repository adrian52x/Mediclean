'use client';
import { useState } from "react";
import { useCreateProducts } from "@/lib/hooks/useProducts";
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
        const price = formData.get("price") as string
        const description = formData.get("description") as string;
        const category = formData.get("category") as "disinfectants" | "equipment";
        const stomatologie = formData.get("stomatologie") === "on";
        const medicina_generala = formData.get("medicina_generala") === "on";

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
            description,
            price: Number(price),
            image: imageResult.url ?? '',
            doc_url: pdfResult.url,
            category,
            stomatologie,
            medicina_generala
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
            <form onSubmit={handleSubmit} className={`space-y-6 ${uploading || createProduct.isPending ? "pointer-events-none select-none" : ""}`}>
            <label className="mb-1 block">Titlu</label>
            <input
                name="title"
                type="text"
                placeholder="Produs"
                required
                className="border p-2 rounded w-full"
            />
            <label className="mb-1 block">Pret</label>
            <input
                name="price"
                type="number"
                placeholder="0.00"
                required
                className="border p-2 rounded w-full"
            />

            <label className="mb-1 block">Descriere (optional)</label>
            <textarea
                name="description"
                placeholder="Descriere produs"
                className="border p-2 rounded w-full"
                rows={3}
            />
            
            {/* Category select */}
            <label className="mb-1 block">Category</label>
            <select
                name="category"
                required
                className="border p-2 rounded w-full bg-white dark:bg-neutral-950 text-black dark:text-white"
                defaultValue="disinfectants"
            >
                <option value="disinfectants">Dezinfectanți</option>
                <option value="equipment">Echipamente</option>
            </select>

            {/* Checkboxes */}
            <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="stomatologie"
                        className="accent-blue-600"
                    />
                    <span>Stomatologie</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="medicina_generala"
                        className="accent-blue-600"
                    />
                    <span>Medicină generală</span>
                </label>
            </div>

            <label className="mb-1 block">Upload Image | max 300KB</label>
            <input
                name="image"
                type="file"
                accept="image/*"
                required
                className="border p-2 rounded w-full"
            />

            <label className="mb-1 block">Upload PDF | max 5MB (optional)</label>
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

        </div>
    );
}