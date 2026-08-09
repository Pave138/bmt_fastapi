import { api } from "./client";

import type {
    Product,
} from "../types/Product";


/*
 * Получить список товаров
 */
export async function getProducts(
    categoryId?: number,
    search?: string,
): Promise<Product[]> {

    const response = await api.get<Product[]>(
        "/products",
        {
            params: {
                category_id: categoryId,
                search,
            },
        },
    );

    return response.data;
}


/*
 * Получить товар по ID
 */
export async function getProductById(
    productId: number,
): Promise<Product> {

    const response = await api.get<Product>(
        `/products/${productId}`,
    );

    return response.data;
}