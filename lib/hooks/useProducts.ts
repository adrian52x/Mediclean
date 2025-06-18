import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsAPI } from "../api/ProductsAPI";
import { InsertProduct } from "@/types";


export const useGetProducts = () => {
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: ProductsAPI.fetchProducts,
        retry: 2
    });

    return { products, isLoading, isError };
}

export const useGetProductById = (id: string) => {
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ["product", id],
        queryFn: () => ProductsAPI.fetchProductById(id),
        retry: 2
    });

    return { product, isLoading, isError };
}

export const useCreateProducts = () => {
    const queryClient = useQueryClient();

    const createProduct = useMutation({
        mutationFn: (product: InsertProduct) => ProductsAPI.addProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    return { createProduct };
}




