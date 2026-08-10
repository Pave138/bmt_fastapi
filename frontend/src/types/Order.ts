export type OrderStatus =
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled";

export type PaymentMethod =
    | "cash"
    | "yookassa";

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    price: string;
    quantity: number;
    subtotal: string;
}

export interface Order {
    id: number;
    status: OrderStatus;
    items: OrderItem[];
    total_price: string;
    coupon_code: string | null;
    confirmation_url: string | null;
}