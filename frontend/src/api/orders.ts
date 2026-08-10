import { api } from "./client";

import type { Order } from "../types/Order";


export type PaymentMethod =
    | "cash"
    | "yookassa";


export interface CreateOrderParams {
    payment_method: PaymentMethod;
}


export async function createOrder(
    params: CreateOrderParams,
): Promise<Order> {

    const response =
        await api.post<Order>(
            "/orders",
            null,
            {
                params: {
                    payment_method:
                        params.payment_method,
                },
            },
        );

    return response.data;
}


export async function getOrders(): Promise<Order[]> {

    const response =
        await api.get<Order[]>(
            "/orders",
        );

    return response.data;
}


export async function getOrderById(
    orderId: number,
): Promise<Order> {

    const response =
        await api.get<Order>(
            `/orders/${orderId}`,
        );

    return response.data;
}
