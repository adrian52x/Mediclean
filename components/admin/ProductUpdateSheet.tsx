'use client';

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "@/types";
import { useDeleteProduct } from "@/lib/hooks/useProducts";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ImagesAPI } from "@/lib/api/ImagesAPI";

interface ProductUpdateSheetProps {
    selectedProduct: ProductDetails | null;
    isOpen: boolean;
    onClose: () => void;
}

const categories = ["disinfectants", "equipment"];

export const ProductUpdateSheet: React.FC<ProductUpdateSheetProps> = ({
    selectedProduct,
    isOpen,
    onClose
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { deleteProduct } = useDeleteProduct();

    // Reset delete confirmation when sheet closes
    useEffect(() => {
        if (!isOpen) {
            setShowDeleteConfirm(false);
        }
    }, [isOpen]);


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
    return (
        <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
            <SheetContent side="left" className="max-w-md w-full" aria-describedby={undefined}>
                <SheetHeader>
                    <SheetTitle>Edit Product</SheetTitle>
                </SheetHeader>
                {selectedProduct && (
                <form className="space-y-4 px-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <Input defaultValue={selectedProduct.title} />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Price</label>
                        <Input type="number" defaultValue={selectedProduct.price} />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Category</label>
                        <select 
                            defaultValue={selectedProduct.category} 
                            className="border rounded p-2 w-full bg-white dark:bg-neutral-950 text-black dark:text-white"
                        >
                            {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat[0].toUpperCase() + cat.slice(1)}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea 
                            defaultValue={selectedProduct.description ?? ""} 
                            className="border rounded p-2 w-full" 
                            rows={3} 
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked={selectedProduct.stomatologie} />
                            Stomatologie
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked={selectedProduct.medicina_generala} />
                            Medicină generală
                        </label>
                    </div>

                    {/* You can add image/pdf upload/edit here */}
                    <Button disabled={true} type="submit" className="w-full">
                        Save Changes
                    </Button>

                    {/* Delete Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        {!showDeleteConfirm ? (
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={deleteProduct.isPending}
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
                                        disabled={deleteProduct.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={handleDelete}
                                        disabled={deleteProduct.isPending}
                                    >
                                        {deleteProduct.isPending ? "Deleting..." : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                )}
            </SheetContent>
        </Sheet>
    );
};
