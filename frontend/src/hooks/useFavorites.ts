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


    /*
     * =========================
     * FAVORITES QUERY
     * =========================
     */

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

            staleTime: 0,
        });


    /*
     * =========================
     * ADD FAVORITE
     * =========================
     */

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


    /*
     * =========================
     * REMOVE FAVORITE
     * =========================
     */

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


    /*
     * =========================
     * TOGGLE
     * =========================
     */

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


    /*
     * =========================
     * RETURN
     * =========================
     */

    return {

        /*
         * Массив избранных товаров
         */
        favorites:
            favoritesQuery.data?.items ?? [],


        /*
         * Общее количество избранных.
         *
         * Именно это значение нужно
         * использовать в Header.
         */
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