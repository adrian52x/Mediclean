import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductsAPI } from "../api/ProductsAPI";
import { InsertProduct } from "@/types";



export const useProducts = () => {
    const queryClient = useQueryClient();

    // Fetch products
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ["products"],
        queryFn: ProductsAPI.fetchProducts,

    });

    const createProduct = useMutation({
        mutationFn: (product: InsertProduct) => ProductsAPI.addProduct(product),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    return { products, isLoading, isError, createProduct };
}




