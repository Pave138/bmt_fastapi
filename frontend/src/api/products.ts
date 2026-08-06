import { api } from "./client";

import type { Product } from "../types/Product";

export async function getProducts(
    categoryId?: number,
    search?: string
): Promise<Product[]> {
    const response = await api.get<Product[]>("/products", {
        params: {
            category_id: categoryId,
            search,
        },
    });

    return response.data;
}