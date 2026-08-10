import { api } from "./client";

import type {
    Cart,
} from "../types/Cart";

export interface AddToCartRequest {
    product_id: number;
    quantity?: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

/**
 * Получить корзину текущего пользователя
 */
export async function getCart(): Promise<Cart> {
    const response = await api.get<Cart>("/cart");

    return response.data;
}

/**
 * Добавить товар в корзину
 */
export async function addToCart(
    data: AddToCartRequest,
): Promise<void> {
    await api.post("/cart/items", data);
}

/**
 * Изменить количество товара
 */
export async function updateCartItem(
    productId: number,
    data: UpdateCartItemRequest,
): Promise<void> {
    await api.patch(
        `/cart/items/${productId}`,
        data,
    );
}

/**
 * Удалить товар из корзины
 */
export async function removeCartItem(
    productId: number,
): Promise<void> {
    await api.delete(
        `/cart/items/${productId}`,
    );
}

/**
 * Очистить корзину
 */
export async function clearCart(): Promise<void> {
    await api.delete("/cart");
}

/**
 * Применить купон
 */
export async function applyCoupon(
    code: string,
): Promise<void> {
    await api.post("/cart/coupon", {
        code,
    });
}

/**
 * Удалить купон
 */
export async function removeCoupon(): Promise<void> {
    await api.delete("/cart/coupon");
}