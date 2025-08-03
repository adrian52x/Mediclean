'use client';

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue,
    SelectGroup 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CategoryEnum, ProductDetails, PriceTypeEnum, InsertProduct } from "@/types";
import { 
    useDeleteProduct, 
    useUpdateProduct, 
    useAddProductImage, 
    useAddProductVolumePrice,
    useDeleteProductVolumePrices,
    useDeleteProductImages
} from "@/lib/hooks/useProducts";
import { useGetProductTypes } from "@/lib/hooks/useProducTypes";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";
import { ImageUploadWithPreview } from "./ImageUploadWithPreview";
import { VolumePriceFields } from "./VolumePriceFields";
import { ImagesAPI } from "@/lib/api/ImagesAPI";
import React from "react";

interface ProductUpdateSheetProps {
    selectedProduct: ProductDetails | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductUpdateSheet: React.FC<ProductUpdateSheetProps> = ({
    selectedProduct,
    isOpen,
    onClose
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        category: CategoryEnum.Disinfectants,
        product_type: '',
        stomatologie: false,
        medicina_generala: false
    });
    const [priceType, setPriceType] = useState(PriceTypeEnum.Fixed);
    const [volumes, setVolumes] = useState([{ volume: '', price: '' }]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const [pdfToDelete, setPdfToDelete] = useState(false);

    const { deleteProduct } = useDeleteProduct();
    const { updateProduct } = useUpdateProduct();
    const { addProductImage } = useAddProductImage();
    const { addProductVolumePrice } = useAddProductVolumePrice();
    const { deleteVolumePrices } = useDeleteProductVolumePrices();
    const { deleteProductImages } = useDeleteProductImages();
    const { productTypes } = useGetProductTypes();

    // Reset form when product changes or sheet opens
    useEffect(() => {
        if (selectedProduct && isOpen) {
            setFormData({
                title: selectedProduct.title,
                description: selectedProduct.description || '',
                price: selectedProduct.price || 0,
                category: selectedProduct.category,
                product_type: selectedProduct.product_type?.type_name || '',
                stomatologie: selectedProduct.stomatologie,
                medicina_generala: selectedProduct.medicina_generala
            });

            // Set price type and volumes based on existing data
            if (selectedProduct.product_volumes_price && selectedProduct.product_volumes_price.length > 0) {
                setPriceType(PriceTypeEnum.Volume);
                setVolumes(selectedProduct.product_volumes_price.map(vp => ({
                    volume: vp.volume,
                    price: vp.price.toString()
                })));
            } else {
                setPriceType(PriceTypeEnum.Fixed);
                setVolumes([{ volume: '', price: '' }]);
            }

            // Reset image and PDF states
            setImageFiles([]);
            setImagesToDelete([]);
            setPdfToDelete(false);
        }
    }, [selectedProduct, isOpen]);

    // Reset delete confirmation when sheet closes
    useEffect(() => {
        if (!isOpen) {
            setShowDeleteConfirm(false);
            setUploading(false);
            setImageFiles([]);
            setImagesToDelete([]);
            setPdfToDelete(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setUploading(true);

        try {
            const form = e.currentTarget as HTMLFormElement;
            const formDataObj = new FormData(form);
            const pdfFile = formDataObj.get("pdf") as File | null;

            // 1. Handle PDF upload/deletion
            let newPdfUrl: string | undefined = selectedProduct.doc_url || undefined;
            
            // Delete current PDF if requested
            if (pdfToDelete && selectedProduct.doc_url) {
                const match = selectedProduct.doc_url.match(/\/product-pdfs\/(.+)$/);
                const pdfPath = match ? match[1] : null;
                if (pdfPath) {
                    await ImagesAPI.deleteFiles('product-pdfs', pdfPath);
                }
                newPdfUrl = undefined;
            }

            // Upload new PDF if provided
            if (pdfFile?.size) {
                if (selectedProduct.doc_url && !pdfToDelete) {
                    toast.error("Please delete current PDF first before uploading a new one.");
                    setUploading(false);
                    return;
                }

                const pdfResult = await ImagesAPI.uploadPdf(
                    pdfFile, 
                    formData.title, 
                    priceType === PriceTypeEnum.Fixed ? formData.price : 0
                );

                if (pdfResult.error) {
                    toast.error("Failed to upload PDF: " + pdfResult.error.message);
                    setUploading(false);
                    return;
                }

                newPdfUrl = pdfResult.url;
            }

            // 2. Handle image management
            const currentImages = selectedProduct.product_images || [];
            const remainingImages = currentImages.filter(img => !imagesToDelete.includes(img.url));
            
            // Check if total images (remaining + new) exceed limit
            if (remainingImages.length + imageFiles.length > 3) {
                toast.error(`Total images cannot exceed 3. You have ${remainingImages.length} existing images and trying to add ${imageFiles.length} new ones.`);
                setUploading(false);
                return;
            }

            // Upload new images
            let newImageUrls: string[] = [];
            if (imageFiles.length > 0) {
                const { urls: imageUrls, paths, errors } = await ImagesAPI.uploadMultipleImages(
                    imageFiles, 
                    formData.title, 
                    priceType === PriceTypeEnum.Fixed ? formData.price : 0
                );

                if (errors.length > 0) {
                    // Delete already uploaded images
                    const validPaths = paths.filter(Boolean);
                    if (validPaths.length > 0) {
                        await ImagesAPI.deleteFiles('product-images', validPaths);
                    }
                    errors.forEach((error, idx) => {
                        toast.error(`Failed to upload image ${idx + 1}: ${error.message}`);
                    });
                    setUploading(false);
                    return;
                }

                newImageUrls = imageUrls;
            }

            // 3. Delete marked images from storage
            if (imagesToDelete.length > 0) {
                const pathsToDelete = imagesToDelete.map(url => {
                    const match = url.match(/\/product-images\/(.+)$/);
                    return match ? match[1] : null;
                }).filter((path): path is string => path !== null);

                if (pathsToDelete.length > 0) {
                    await ImagesAPI.deleteFiles('product-images', pathsToDelete);
                }
            }

            // 4. Update product basic info
            const selectedProductType = productTypes?.find(
                type => type.type_name === formData.product_type
            );

            const updates = {
                title: formData.title,
                description: formData.description || undefined,
                price: priceType === PriceTypeEnum.Fixed ? formData.price : null,
                category: formData.category,
                product_type: selectedProductType?.product_type_id || selectedProduct.product_type.type_name,
                stomatologie: formData.stomatologie,
                medicina_generala: formData.medicina_generala,
                doc_url: newPdfUrl === undefined ? null : newPdfUrl
            } as InsertProduct;

            await updateProduct.mutateAsync({ id: selectedProduct.id, updates });

            // 5. Handle volume prices - only if something actually changed
            const currentVolumes = selectedProduct.product_volumes_price || [];
            const newValidVolumes = volumes.filter(v => v.volume && v.price);
            
            // Check if we're switching price types
            const wasVolumePrice = currentVolumes.length > 0;
            const isNowVolumePrice = priceType === PriceTypeEnum.Volume;
            
            // Only update volumes if:
            // 1. We're switching from fixed to volume price
            // 2. We're switching from volume to fixed price  
            // 3. We're staying with volume price but the volumes changed
            const priceTypeChanged = wasVolumePrice !== isNowVolumePrice;
            
            let volumesChanged = false;
            if (wasVolumePrice && isNowVolumePrice) {
                // Improved comparison: check if arrays are actually different
                // Sort both arrays by volume for proper comparison
                const sortedCurrent = [...currentVolumes].sort((a, b) => a.volume.localeCompare(b.volume));
                const sortedNew = [...newValidVolumes].sort((a, b) => a.volume.localeCompare(b.volume));
                
                volumesChanged = sortedCurrent.length !== sortedNew.length ||
                    sortedCurrent.some((cv, idx) => {
                        const nv = sortedNew[idx];
                        return !nv || cv.volume !== nv.volume || cv.price !== Number(nv.price);
                    });
                
                console.log('Volume comparison:', {
                    currentVolumes: sortedCurrent,
                    newVolumes: sortedNew,
                    volumesChanged
                });
            }
            
            if (priceTypeChanged || volumesChanged) {
                console.log('Updating volumes because:', { priceTypeChanged, volumesChanged });
                
                // Delete existing volume prices if any
                if (currentVolumes.length > 0) {
                    await deleteVolumePrices.mutateAsync(selectedProduct.id);
                }
                
                // Add new volume prices if switching to volume pricing
                if (isNowVolumePrice && newValidVolumes.length > 0) {
                    const volumePromises = newValidVolumes.map(v =>
                        addProductVolumePrice.mutateAsync({
                            product_id: selectedProduct.id,
                            volume: v.volume,
                            price: Number(v.price),
                        })
                    );
                    await Promise.all(volumePromises);
                }
            } else {
                console.log('Skipping volume update - no changes detected');
            }

            // 6. Handle image database updates
            if (imagesToDelete.length > 0 || newImageUrls.length > 0) {
                console.log('Updating images:', { imagesToDelete: imagesToDelete.length, newImages: newImageUrls.length });
                
                // Calculate what the final image list should be
                const currentImages = selectedProduct.product_images || [];
                const remainingImages = currentImages.filter(img => !imagesToDelete.includes(img.url));
                
                // Smart ordering: Keep existing order for remaining images, append new images
                // This way, if user doesn't delete the primary image, it stays primary
                const allFinalImageUrls = [
                    ...remainingImages.map(img => img.url), // Existing images maintain their order
                    ...newImageUrls                         // New images are appended
                ];

                // Delete all current image records
                await deleteProductImages.mutateAsync(selectedProduct.id);
                
                // Re-insert all images that should remain (existing + new)
                if (allFinalImageUrls.length > 0) {
                    const imagePromises = allFinalImageUrls.map(url =>
                        addProductImage.mutateAsync({
                            product_id: selectedProduct.id,
                            url,
                        })
                    );
                    await Promise.all(imagePromises);
                }
                
                console.log('Images updated successfully. Final count:', allFinalImageUrls.length);
                console.log('Final images:', allFinalImageUrls);
            } else {
                console.log('Skipping image update - no changes detected');
            }

            toast.success("Product updated successfully!");
            onClose();
        } catch (error: any) {
            toast.error("Failed to update product: " + (error?.message || "Unknown error"));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        
        try {
            await deleteProduct.mutateAsync(selectedProduct.id);
            toast.success("Product deleted successfully!");
            onClose();
        } catch (error: any) {
            toast.error("Failed to delete product: " + (error?.message || "Unknown error"));
        }
        setShowDeleteConfirm(false);
    };

    const handleImageDelete = (imageUrl: string) => {
        setImagesToDelete(prev => [...prev, imageUrl]);
    };

    const getCurrentImages = () => {
        if (!selectedProduct?.product_images) return [];
        return selectedProduct.product_images.filter(img => !imagesToDelete.includes(img.url));
    };

    return (
        <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
            <SheetContent side="left" className="max-w-md w-full overflow-y-auto" aria-describedby={undefined}>
                <SheetHeader>
                    <SheetTitle>Edit Product</SheetTitle>
                </SheetHeader>
                {selectedProduct && (
                <div className="relative">
                    {uploading && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className={`space-y-6 px-4 ${uploading ? "pointer-events-none" : ""}`}>
                        <div>
                            <Label className="block mb-1 font-medium">Product Name</Label>
                            <Input 
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nume produs..."
                                required
                            />
                        </div>

                        <div>
                            <Label className="block mb-1 font-medium">Description</Label>
                            <Textarea 
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                placeholder={`Descriere produs (optional)\n\nFormatare disponibilă:\n- Listă cu puncte\n**Text îngroșat**\n*Text italic*`}
                            />
                        </div>

                        {/* Category select */}
                        <div>
                            <Label className="block mb-1 font-medium">Category</Label>
                            <Select 
                                value={formData.category}
                                onValueChange={(value: CategoryEnum) => setFormData(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="disinfectants">Dezinfectanți</SelectItem>
                                        <SelectItem value="equipment">Echipamente</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sub-Category select / Product Type */}
                        <div>
                            <Label className="block mb-1 font-medium">Product Type</Label>
                            <Select 
                                value={formData.product_type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, product_type: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a sub-category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {(productTypes ?? []).map((type, idx) => (
                                            <React.Fragment key={type.product_type_id}>
                                                <SelectItem value={type.type_name}>
                                                    {type.type_name}
                                                </SelectItem>
                                                {idx === 3 && (
                                                    <Separator key={`separator-updateForm`} className="my-2" />   
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Checkboxes */}
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    id="stomatologie-update"
                                    checked={formData.stomatologie}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stomatologie: !!checked }))}
                                />
                                <Label htmlFor="stomatologie-update">Stomatologie</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    id="medicina_generala-update"
                                    checked={formData.medicina_generala}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, medicina_generala: !!checked }))}
                                />
                                <Label htmlFor="medicina_generala-update">Medicină generală</Label>
                            </div>
                        </div>

                        {/* Price Type Tabs: Fixed / Volumes */}
                        <div>
                            <Tabs
                                value={priceType}
                                onValueChange={(value) => setPriceType(value as PriceTypeEnum)}
                                className="w-full"
                            >
                                <TabsList>
                                    <TabsTrigger value={PriceTypeEnum.Fixed}>Pret fix</TabsTrigger>
                                    <TabsTrigger value={PriceTypeEnum.Volume}>Pret volum</TabsTrigger>
                                </TabsList>
                                <TabsContent value={PriceTypeEnum.Fixed}>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        placeholder="Pret - MDL"
                                        min={0}
                                        required
                                    /> 
                                </TabsContent>
                                <TabsContent value={PriceTypeEnum.Volume}>
                                    <VolumePriceFields volumes={volumes} setVolumes={setVolumes} />
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Current Images Display */}
                        {selectedProduct.product_images && selectedProduct.product_images.length > 0 && (
                            <div>
                                <Label className="block mb-2 font-medium">Current Images ({getCurrentImages().length}/3)</Label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {selectedProduct.product_images.map((img, idx) => (
                                        <div key={idx} className="relative">
                                            <img 
                                                src={img.url} 
                                                alt={`Product ${idx + 1}`}
                                                className={`w-full h-20 object-cover rounded border ${
                                                    imagesToDelete.includes(img.url) ? 'opacity-30 grayscale' : ''
                                                }`}
                                            />
                                            {idx === 0 && !imagesToDelete.includes(img.url) && (
                                                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">
                                                    PRIMARY
                                                </div>
                                            )}
                                            {!imagesToDelete.includes(img.url) && (
                                                <div className="absolute top-1 right-1">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => handleImageDelete(img.url)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                            {imagesToDelete.includes(img.url) && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded">
                                                    <span className="text-white text-xs font-bold">WILL DELETE</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images Upload */}
                        <div>
                            <Label className="block mb-2 font-medium">
                                Add New Images - {3 - getCurrentImages().length - imageFiles.length} slots
                            </Label>
                            <ImageUploadWithPreview 
                                key={`update-images-${selectedProduct?.id || 'new'}`} // Unique key to prevent conflicts
                                onImagesChange={setImageFiles}
                                maxImages={3 - getCurrentImages().length}
                                isUpdatingProduct={true}
                            />
                        </div>

                        {/* Current PDF Display */}
                        {selectedProduct.doc_url && !pdfToDelete && (
                            <div>
                                <Label className="block mb-2 font-medium">Current PDF</Label>
                                <div className="flex items-center gap-2 p-2 border rounded">
                                    <a 
                                        href={selectedProduct.doc_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline text-sm flex-1"
                                    >
                                        View Current PDF
                                    </a>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setPdfToDelete(true)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* PDF marked for deletion */}
                        {pdfToDelete && (
                            <div>
                                <Label className="block mb-2 font-medium text-red-600">PDF marked for deletion</Label>
                                <div className="flex items-center gap-2 p-2 border border-red-200 rounded bg-red-50">
                                    <span className="text-red-600 text-sm flex-1">PDF will be deleted on save</span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setPdfToDelete(false)}
                                    >
                                        Restore
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* New PDF Upload */}
                        {(!selectedProduct.doc_url || pdfToDelete) && (
                            <div>
                                <Label htmlFor="pdf-update" className="block mb-2 font-medium">Upload New PDF (optional) - max 5MB</Label>
                                <Input name="pdf" id="pdf-update" type="file" accept="application/pdf" />
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full mt-4"
                            disabled={updateProduct.isPending || uploading}
                        >
                            {uploading ? "Uploading..." : updateProduct.isPending ? "Saving..." : "Save Changes"}
                        </Button>

                        {/* Delete Section */}
                        <div className="py-6 border-t border-gray-200 dark:border-gray-700">
                            {!showDeleteConfirm ? (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    disabled={deleteProduct.isPending || uploading}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Product
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm text-center text-red-600 dark:text-red-400 font-medium">
                                        Are you sure you want to delete this product?
                                        <br />
                                        <span className="text-xs">This action cannot be undone.</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={deleteProduct.isPending || uploading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={handleDelete}
                                            disabled={deleteProduct.isPending || uploading}
                                        >
                                            {deleteProduct.isPending ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
