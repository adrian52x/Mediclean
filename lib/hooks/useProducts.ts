import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsAPI } from "../api/ProductsAPI";
import { InsertProduct } from "@/types";


export const useGetProducts = () => {
    const { data: products, isPending, isError } = useQuery({
        queryKey: ["products"],
        queryFn: ProductsAPI.fetchProducts,
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
        mutationFn: (product: InsertProduct) => ProductsAPI.addProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    return { createProduct };
}




