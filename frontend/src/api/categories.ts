import { api } from "./client";

import type { Category } from "../types/Category";
import type { Product } from "../types/Product";


export async function getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(
        "/categories",
    );

    return response.data;
}


export async function getCategoryProducts(
    categorySlug: string,
    limit = 20,
    offset = 0,
): Promise<Product[]> {
    const response = await api.get<Product[]>(
        `/categories/${categorySlug}/products`,
        {
            params: {
                limit,
                offset,
            },
        },
    );

    return response.data;
}