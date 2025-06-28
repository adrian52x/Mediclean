'use client';
import { useState } from "react";
import { useAddProductImage, useAddProductVolumePrice, useCreateProducts } from "@/lib/hooks/useProducts";
import { ProductsAPI } from "@/lib/api/ProductsAPI";
import { CategoryEnum, DisinfectantSubCategoryEnum, DisinfectantVolumeEnum, InsertProduct, PriceTypeEnum, UploadFileResult } from "@/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ImagesAPI } from "@/lib/api/ImagesAPI";
import { useGetProductTypes } from "@/lib/hooks/useProducTypes";
import { Separator } from "../ui/separator";
import React from "react";
import { VolumePriceFields } from "./VolumePriceFields";

export default function AddProductForm() {
    const { createProduct } = useCreateProducts();
    const { addProductImage } = useAddProductImage();
    const { addProductVolumePrice } = useAddProductVolumePrice()
    const { productTypes } = useGetProductTypes();

    const [uploading, setUploading] = useState(false);
    const [volumes, setVolumes] = useState([{ volume: '', price: '' }]);
    const [priceType, setPriceType] = useState(PriceTypeEnum.Fixed);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);

        const form = e.currentTarget;
        const formData = new FormData(form as HTMLFormElement);

        const title = formData.get("title") as string;
        const price = formData.get("price") as string
        const description = formData.get("description") as string;
        const category = formData.get("category") as CategoryEnum;
        const subCategory = formData.get("sub-category") as string;
        const stomatologie = formData.get("stomatologie") === "on";
        const medicina_generala = formData.get("medicina_generala") === "on";

        //const imageFiles = formData.get("image") as File[] | null;
        let imageFiles = Array.from(formData.getAll("image") as File[]);
        
        if (imageFiles.length > 3) {
            toast.error("You can upload a maximum of 3 images.");
            setUploading(false);
            return;
        }
        const pdfFile = formData.get("pdf") as File | null;


        // 1. Upload PDF if provided
        let pdfResult: UploadFileResult = { url: undefined, path: undefined, error: null };
        if (pdfFile?.size) {
            pdfResult = await ProductsAPI.uploadPdf(pdfFile, title, Number(price));
        }

        if (pdfResult.error) {
            toast.error("Failed to upload PDF: " + pdfResult.error.message);
            setUploading(false);
            return;
        }

        // 2. Upload images
        const { urls: imageUrls, paths, errors } = await ImagesAPI.uploadMultipleImages(imageFiles, title, Number(price));
        if (errors.length > 0) {
            // Delete already uploaded images
            for (const path of paths) {
                if (path) {
                    console.log(`Deleting image at path: ${path}`);
                    
                    await ProductsAPI.deleteFile('product-images', path);
                }
            }
            errors.forEach((error, idx) => {
                toast.error(`Failed to upload image ${idx + 1}: ${error.message}`);
            });
            // Rollback PDF if it was uploaded
            if (pdfResult.path) {
                await ProductsAPI.deleteFile('product-pdfs', pdfResult.path);
            }
            setUploading(false);
            return;
        }

        // All uploads succeeded
        const productData: InsertProduct = {
            title,
            description,
            price: priceType === PriceTypeEnum.Fixed && price ? Number(price) : null,
            doc_url: pdfResult.url,
            category,
            product_type: subCategory,
            stomatologie,
            medicina_generala
        };

        await createProduct.mutateAsync(productData, {
            onSuccess: async (data) => {
                // Insert images in product_images table
                const imageInsertPromises = imageUrls.map((url) =>
                    addProductImage.mutateAsync({
                        product_id: data.id,
                        url,
                    })
                );

                // Insert volumes in product_volumes_price table (only if priceType is Volume)
                let volumeInsertPromises: Promise<any>[] = [];
                if (priceType === PriceTypeEnum.Volume) {
                    volumeInsertPromises = volumes.filter(v => v.volume && v.price).map((v) =>
                        addProductVolumePrice.mutateAsync({
                            product_id: data.id,
                            volume: v.volume,
                            price: Number(v.price),
                        })
                    );
                }

                try {
                    await Promise.all([...imageInsertPromises, ...volumeInsertPromises]);
                    toast.success("Product added successfully!");
                } catch (error: any) {
                    toast.warning("Product added, but some data maybe is missing" + (error?.message || "Unknown error"));
                }
            },
            onError: (error: any) => {
                toast.error("Failed to add product: " + (error?.message || "Unknown error"));
            },
        });

        form.reset();
        setVolumes([{ volume: '', price: '' }]);
        setUploading(false);
    };

    return (
        <div className="relative w-full border rounded p-3 bg-white dark:bg-neutral-900 text-black dark:text-white">
            {(uploading || createProduct.isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/50">
                    <Loader />                
                </div>
            )}
            <form name="addProduct" onSubmit={handleSubmit} className={`space-y-8 ${uploading || createProduct.isPending ? "pointer-events-none select-none" : ""}`}>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Nume produs..."
                    className="max-w-md"
                    required
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

                {/* Sub-Category select / Product Type */}
                <Select name="sub-category" required>
                    <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup >
                            {(productTypes ?? []).map((type, idx) => (
                                <React.Fragment key={type.product_type_id}>
                                    <SelectItem key={type.product_type_id} value={type.product_type_id}>
                                        {type.type_name}
                                    </SelectItem>
                                    {idx === 3 && (
                                        <Separator key={`separator-addForm`} className="my-2" />   
                                    )}
                                </React.Fragment>
                            ))}
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

                {/* Price Type Tabs:  Fixed / Volumes*/}
                <Tabs
                    defaultValue={priceType}
                    onValueChange={(value) => setPriceType(value as PriceTypeEnum)}
                    className="w-[400px]"
                >
                    <TabsList>
                        <TabsTrigger value={PriceTypeEnum.Fixed}>Pret fix</TabsTrigger>
                        <TabsTrigger value={PriceTypeEnum.Volume}>Pret volum</TabsTrigger>
                    </TabsList>
                    <TabsContent value={PriceTypeEnum.Fixed}>
                        <Input
                            type="number"
                            name="price"
                            placeholder="Pret - MDL"
                            className="max-w-xs"
                            min={0}
                            required
                        /> 
                    </TabsContent>
                    <TabsContent value={PriceTypeEnum.Volume}>
                        <VolumePriceFields volumes={volumes} setVolumes={setVolumes} />
                    </TabsContent>
                </Tabs>
                
                {/* IMGs */}
                <div className="grid w-full max-w-sm items-center gap-2">
                    <Label htmlFor="picture">Imagini | max 3 x 300KB</Label>
                    <Input name="image" id="picture" type="file" accept="image/*" multiple required />
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