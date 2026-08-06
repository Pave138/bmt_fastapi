import {
    useQuery,
} from "@tanstack/react-query";

import {
    getProducts,
} from "../api/products";

import type { Product } from "../types/Product";


export function useProducts(
    categoryId?: number | null,
    search?: string
) {

    return useQuery<Product[]>({

        queryKey: [
            "products",
            categoryId,
            search,
        ],


        queryFn: () =>
            getProducts(
                categoryId ?? undefined,
                search
            ),

    });
}