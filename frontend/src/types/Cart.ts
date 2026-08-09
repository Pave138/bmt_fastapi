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

export interface Cart {
    id: number;
    total_items: number;
    total_price: string;
    coupon: CartCoupon | null;
    items: CartItem[];
}