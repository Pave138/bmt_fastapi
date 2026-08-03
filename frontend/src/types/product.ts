export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    old_price: string | null;

    avg_rating: number;
    reviews_count: number;

    main_image: {
        image_url: string;
    } | null;
}