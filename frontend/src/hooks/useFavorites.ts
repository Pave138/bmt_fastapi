import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    addFavorite,
    getFavorites,
    removeFavorite,
} from "../api/favorites";

import {
    getProductBySlug,
} from "../api/products";

import {
    CURRENT_USER_QUERY_KEY,
} from "./useAuth";


export const FAVORITES_QUERY_KEY = [
    "favorites",
];


export function useFavorites(
    offset = 0,
    limit = 20,
) {

    const queryClient =
        useQueryClient();


    const favoritesQuery =
        useQuery({
            queryKey: [
                ...FAVORITES_QUERY_KEY,
                offset,
                limit,
            ],

            queryFn: () =>
                getFavorites(
                    offset,
                    limit,
                ),

            enabled:
                Boolean(
                    localStorage.getItem(
                        "access_token",
                    ),
                ),
        });


    const addMutation =
        useMutation({

            mutationFn:
                addFavorite,

            onSuccess: (
                _,
                productSlug,
            ) => {

                queryClient.invalidateQueries({
                    queryKey:
                        FAVORITES_QUERY_KEY,
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "products",
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "product",
                        productSlug,
                    ],
                });
            },
        });


    const removeMutation =
        useMutation({

            mutationFn:
                removeFavorite,

            onSuccess: (
                _,
                productSlug,
            ) => {

                queryClient.invalidateQueries({
                    queryKey:
                        FAVORITES_QUERY_KEY,
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "products",
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "product",
                        productSlug,
                    ],
                });
            },
        });


    function toggleFavorite(
        productSlug: string,
        isFavorite: boolean,
    ) {

        if (isFavorite) {

            return removeMutation.mutateAsync(
                productSlug,
            );

        }

        return addMutation.mutateAsync(
            productSlug,
        );
    }


    return {
        favorites:
            favoritesQuery.data?.items ?? [],

        total:
            favoritesQuery.data?.total ?? 0,

        isLoading:
            favoritesQuery.isLoading,

        isError:
            favoritesQuery.isError,

        toggleFavorite,

        isMutating:
            addMutation.isPending ||
            removeMutation.isPending,
    };
}