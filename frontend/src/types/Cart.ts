export type DiscountType = "fixed" | "percent";

export interface CartCoupon {
    code: string;
    discount_type: DiscountType;
    value: string;
    min_order_amount: string | null;
}

export interface CartProduct {
    id: number;
    name: string;
    price: string;
}

export interface ProductImage {
    id: number;
    product_id: number;
    original_filename: string;
    content_type: string;
    file_size: number;
    width: number;
    height: number;
    is_main: boolean;
    image_url: string;
}

export interface CartItem {
    product_id: number;
    quantity: number;
    subtotal: string;
    product: CartProduct;
    main_image: ProductImage | null;
}

export interface Cart {
    id: number;
    total_items: number;
    total_price: string;
    coupon: CartCoupon | null;
    items: CartItem[];
}