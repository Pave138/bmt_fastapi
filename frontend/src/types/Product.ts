export interface ProductImage {
    id: number;
    image_url: string;
}

export interface ProductReview {
    id: number;
    user_username: string;
    rating: number;
    comment: string | null;
}

export interface ProductSpecification {
    id: number;
    name: string;
    value: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;

    price: string;
    old_price: string | null;

    category_id: number;
    stock: number;
    is_active: boolean;

    avg_rating: number;
    reviews_count: number;

    main_image: ProductImage | null;

    images: ProductImage[];

    specifications: ProductSpecification[];

    reviews: ProductReview[];
}