import {
    useQuery,
} from "@tanstack/react-query";

import {
    getProducts,
} from "../api/products";


export function useProducts(
    categorySlug?: string,
    search?: string,
) {
    return useQuery({
        queryKey: [
            "products",
            categorySlug,
            search,
        ],

        queryFn: () =>
            getProducts(
                categorySlug,
                search,
            ),
    });
}