import { useQuery } from "@tanstack/react-query";
import { ProductTypesAPI } from "../api/ProductTypesAPI";


export const useGetProductTypes = () => {
    const { data: productTypes, isPending, isError } = useQuery({
        queryKey: ["productTypes"],
        queryFn: ProductTypesAPI.fetchProductTypes,
        retry: 2
    });

    return { productTypes, isPending, isError };
}