import { api } from "./client";

export interface CartProduct {
    id: number;
    name: string;
    price: string;
}

export interface CartItem {
    product_id: number;
    quantity: number;
    subtotal: string;
    product: CartProduct;
}

export interface CartCoupon {
    code: string;
    discount_type: string;
    value: string;
    min_order_amount: string | null;
}

export interface CartResponse {
    id: number;
    total_items: number;
    total_price: string;
    coupon: CartCoupon | null;
    items: CartItem[];
}

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
export async function getCart(): Promise<CartResponse> {
    const response = await api.get<CartResponse>("/cart");

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