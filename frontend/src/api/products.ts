import { api } from "./client";
import type { Product } from "../types/product";

export async function getProducts(
    categoryId: number | null,
    search: string,
): Promise<Product[]> {
    const response = await api.get("/products", {
        params: {
            category_id: categoryId ?? undefined,
            search: search || undefined,
        },
    });

    return response.data;
}