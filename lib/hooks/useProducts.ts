import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsAPI } from "../api/ProductsAPI";
import { InsertProduct, InsertProductImage, InsertProductVolumePrice } from "@/types";
import { ImagesAPI } from "../api/ImagesAPI";


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
        mutationFn: (productImage: InsertProductImage) => ProductsAPI.addProductImage(productImage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] }); // invalidata just a specific product?
        }
    });

    return { addProductImage };
}

export const useAddProductVolumePrice = () => {
    const queryClient = useQueryClient();

    const addProductVolumePrice = useMutation({
        mutationFn: (productVolumePrice: InsertProductVolumePrice) => 
            ProductsAPI.addProductVolumePrice(productVolumePrice),
        onSuccess: () => {
            //queryClient.invalidateQueries({ queryKey: ["products"] });
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



