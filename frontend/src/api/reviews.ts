import { api } from "./client";


export type Review = {
    id: number;
    user_username: string;
    product_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
};


export type ReviewCreate = {
    rating: number;
    comment?: string | null;
};


export type ReviewUpdate = {
    rating?: number;
    comment?: string | null;
};


export type ReviewListResponse = {
    items: Review[];
    total: number;
};


export async function getProductReviews(
    productSlug: string,
    limit: number = 20,
    offset: number = 0,
): Promise<ReviewListResponse> {

    const response = await api.get<ReviewListResponse>(
        `/products/${productSlug}/reviews`,
        {
            params: {
                limit,
                offset,
            },
        },
    );

    return response.data;
}


export async function createProductReview(
    productSlug: string,
    data: ReviewCreate,
): Promise<Review> {

    const response = await api.post<Review>(
        `/products/${productSlug}/reviews`,
        data,
    );

    return response.data;
}


export async function updateReview(
    reviewId: number,
    data: ReviewUpdate,
): Promise<Review> {

    const response = await api.patch<Review>(
        `/reviews/${reviewId}`,
        data,
    );

    return response.data;
}


export async function deleteReview(
    reviewId: number,
): Promise<void> {

    await api.delete(
        `/reviews/${reviewId}`,
    );
}