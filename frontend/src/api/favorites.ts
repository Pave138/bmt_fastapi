import { api } from "./client";

import type {
    ProductListResponse,
} from "../types/Product";


export interface FavoriteListResponse {
    items: ProductListResponse[];
    total: number;
}


export async function getFavorites(
    offset = 0,
    limit = 20,
): Promise<FavoriteListResponse> {

    const response =
        await api.get<FavoriteListResponse>(
            "/favorites",
            {
                params: {
                    offset,
                    limit,
                },
            },
        );

    return response.data;
}


export async function addFavorite(
    productSlug: string,
): Promise<void> {

    await api.post(
        `/favorites/${productSlug}`,
    );
}


export async function removeFavorite(
    productSlug: string,
): Promise<void> {

    await api.delete(
        `/favorites/${productSlug}`,
    );
}