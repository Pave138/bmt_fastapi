import { api } from "./client";

import type {
    Product,
} from "../types/Product";


/*
 * Получить список товаров
 */
export async function getProducts(
    categorySlug?: string,
    search?: string,
): Promise<Product[]> {

    const response = await api.get<Product[]>(
        "/products",
        {
            params: {
                category_slug: categorySlug,
                search,
            },
        },
    );

    return response.data;
}


/*
 * Получить товар по slug
 */
export async function getProductBySlug(
    productSlug: string,
): Promise<Product> {

    const response = await api.get<Product>(
        `/products/${productSlug}`,
    );

    return response.data;
}