import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsAPI } from "../api/ProductsAPI";
import { InsertProduct, InsertProductImage, InsertProductVolumePrice } from "@/types";


export const useGetProducts = () => {
    const { data: products, isPending, isError } = useQuery({
        queryKey: ["products"],
        queryFn: ProductsAPI.fetchProducts,
        retry: 2
    });

    return { products, isPending, isError };
}

export const useGetNewProducts = () => {
    const { data: products, isPending, isError } = useQuery({
        queryKey: ["newest-products"],
        queryFn: ProductsAPI.fetchNewProducts,
        retry: 2
    });

    return { products, isPending, isError };
}

export const useGetProductById = (id: string) => {
    const { data: product, isPending, isError } = useQuery({
        queryKey: ["product", id],
        queryFn: () => ProductsAPI.fetchProductById(id),
        retry: 2
    });

    return { product, isPending, isError };
}

export const useCreateProducts = () => {
    const queryClient = useQueryClient();

    const createProduct = useMutation({
        mutationFn: (product: InsertProduct) => ProductsAPI.addProduct(product), // try to call another API
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    return { createProduct };
}

export const useAddProductImage = () => {
    const queryClient = useQueryClient();

    const addProductImage = useMutation({
        mutationFn: (productImage: InsertProductImage | InsertProductImage[]) => 
            ProductsAPI.addProductImage(productImage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["newest-products"] });
        }
    });

    return { addProductImage };
}

export const useAddProductVolumePrice = () => {
    const queryClient = useQueryClient();

    const addProductVolumePrice = useMutation({
        mutationFn: (productVolumePrice: InsertProductVolumePrice | InsertProductVolumePrice[]) => 
            ProductsAPI.addProductVolumePrice(productVolumePrice),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    return { addProductVolumePrice };
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    const deleteProduct = useMutation({
        mutationFn: (productId: string) => ProductsAPI.deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["newest-products"] });
        }
    });

    return { deleteProduct };
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    const updateProduct = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<InsertProduct> }) => 
            ProductsAPI.updateProduct(id, updates),
        onSuccess: (data, variables) => {
            console.log("HOOK CALLED: Product updated successfully:", data);
            
            // Invalidate the specific product and lists
            queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["newest-products"] });
        }
    });

    return { updateProduct };
}

export const useDeleteProductVolumePrices = () => {

    const deleteVolumePrices = useMutation({
        mutationFn: (productId: string) => ProductsAPI.deleteProductVolumePrices(productId)
    });

    return { deleteVolumePrices };
}

export const useDeleteProductImages = () => {
    const queryClient = useQueryClient();

    const deleteProductImages = useMutation({
        mutationFn: (productId: string) => ProductsAPI.deleteProductImages(productId),
        onSuccess: (data, productId) => {
            // Invalidate the specific product and lists
            queryClient.invalidateQueries({ queryKey: ["product", productId] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["newest-products"] });
        }
    });

    return { deleteProductImages };
}

// export const useUpdateProductPdf = () => {
//     const queryClient = useQueryClient();

//     const updateProductPdf = useMutation({
//         mutationFn: ({ id, docUrl }: { id: string; docUrl: string | null }) => 
//             ProductsAPI.updateProductPdf(id, docUrl),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["products"] });
//         }
//     });

//     return { updateProductPdf };
// }



