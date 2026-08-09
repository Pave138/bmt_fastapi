import { api } from "./client";

export interface Review {
    id: number;
    product_id: number;
    user_username: string;
    rating: number;
    comment: string | null;
}

export interface CreateReviewData {
    product_id: number;
    rating: number;
    comment?: string | null;
}

export async function createReview(
    data: CreateReviewData
): Promise<Review> {

    const response = await api.post<Review>(
        "/reviews",
        data
    );

    return response.data;
}

export async function updateReview(
    reviewId: number,
    data: {
        rating?: number;
        comment?: string | null;
    }
): Promise<Review> {

    const response = await api.patch<Review>(
        `/reviews/${reviewId}`,
        data
    );

    return response.data;
}

export async function deleteReview(
    reviewId: number
): Promise<void> {

    await api.delete(
        `/reviews/${reviewId}`
    );
}
