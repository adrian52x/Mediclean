'use client';
import { useState } from "react";
import { useCreateProducts } from "@/lib/hooks/useProducts";
import { ProductsAPI } from "@/lib/api/ProductsAPI";
import { InsertProduct } from "@/types";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export default function AddProductForm() {
    const { createProduct } = useCreateProducts();

    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
            toast.error("Failed to upload Image: " + imageResult.error.message);
            // Rollback PDF if uploaded
            if (pdfResult.path) {
                await ProductsAPI.deleteFile('product-pdfs', pdfResult.path);
            }
            setUploading(false);
            return;
        }
        if (pdfResult.error) {
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
        <div className="relative w-full border rounded p-3 bg-white dark:bg-neutral-900 text-black dark:text-white">
            {(uploading || createProduct.isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/50">
                    <Loader />                
                </div>
            )}
            <form onSubmit={handleSubmit} className={`space-y-8 ${uploading || createProduct.isPending ? "pointer-events-none select-none" : ""}`}>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Nume produs..."
                    className="max-w-md"
                />

                <Input
                    type="number"
                    name="price"
                    placeholder="Pret - MDL"
                    className="max-w-md"
                    min={0}
                />

                <Textarea className="max-w-md" name="description" placeholder="Descriere produs (optional)" />
                
                {/* Category select */}
                <Select name="category" required>
                    <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup >
                        <SelectItem value="disinfectants">Dezinfectanți</SelectItem>
                        <SelectItem value="equipment">Echipamente</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Checkboxes */}
                <div className="flex space-x-4">
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" name="stomatologie" />
                        <Label htmlFor="terms">Stomatologie</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="terms" name="medicina_generala" />
                        <Label htmlFor="terms">Medicină generală</Label>
                    </div>                
                </div>

                {/* IMGs */}
                <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="picture">Imagini | max 300KB</Label>
                    <Input name="image" id="picture" type="file" accept="image/*" required />
                </div>

                {/* PDF */}
                <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="pdfdoc">PDF (optional) - max 5MB</Label>
                    <Input name="pdf" id="pdfdoc" type="file" accept="application/pdf" />
                </div>

                <Button
                    type="submit"
                    variant={"default"}
                    disabled={uploading || createProduct.isPending}                >
                    Add Product
                </Button>
            </form>

        </div>
    );
}