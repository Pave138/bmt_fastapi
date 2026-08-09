export interface ProductImage {
    id: number;
    image_url: string;
}

export interface Product {
    id: number;

    name: string;

    description: string | null;

    price: string;

    old_price: string | null;

    stock: number;

    avg_rating: number;

    reviews_count: number;

    main_image: ProductImage | null;

    images: ProductImage[];
}