import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getCurrentUser,
    login as loginRequest,
} from "../api/auth";

import type {
    LoginCredentials,
} from "../api/auth";


export const ACCESS_TOKEN_KEY =
    "access_token";


export const CURRENT_USER_QUERY_KEY =
    ["current-user"];


export function useAuth() {

    const queryClient =
        useQueryClient();


    /*
     * =========================
     * CURRENT USER
     * =========================
     */

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey:
            CURRENT_USER_QUERY_KEY,

        queryFn:
            getCurrentUser,

        enabled:
            Boolean(
                localStorage.getItem(
                    ACCESS_TOKEN_KEY,
                ),
            ),

        retry: false,
    });


    /*
     * =========================
     * LOGIN
     * =========================
     */

    const loginMutation =
        useMutation({
            mutationFn:
                (
                    credentials: LoginCredentials,
                ) =>
                    loginRequest(
                        credentials,
                    ),

            onSuccess:
                async (data) => {

                    /*
                     * Сохраняем access token
                     */
                    localStorage.setItem(
                        ACCESS_TOKEN_KEY,
                        data.access_token,
                    );


                    /*
                     * Получаем текущего
                     * авторизованного пользователя.
                     */
                    await queryClient.fetchQuery({
                        queryKey:
                            CURRENT_USER_QUERY_KEY,

                        queryFn:
                            getCurrentUser,
                    });


                    /*
                     * =========================
                     * PRODUCTS
                     * =========================
                     *
                     * is_favorite зависит
                     * от авторизованного
                     * пользователя.
                     *
                     * Поэтому после входа
                     * товары нужно получить
                     * заново.
                     */
                    await queryClient.invalidateQueries({
                        queryKey: [
                            "products",
                        ],
                    });


                    /*
                     * =========================
                     * FAVORITES
                     * =========================
                     *
                     * Если страница избранного
                     * уже была открыта/закеширована,
                     * она тоже должна обновиться.
                     */
                    await queryClient.invalidateQueries({
                        queryKey: [
                            "favorites",
                        ],
                    });
                },
        });


    /*
     * =========================
     * LOGIN HANDLER
     * =========================
     */

    async function login(
        username: string,
        password: string,
    ) {

        await loginMutation.mutateAsync({
            username,
            password,
        });
    }


    /*
     * =========================
     * LOGOUT
     * =========================
     */

    function logout() {

        /*
         * Удаляем access token
         */
        localStorage.removeItem(
            ACCESS_TOKEN_KEY,
        );


        /*
         * Сбрасываем текущего пользователя
         */
        queryClient.setQueryData(
            CURRENT_USER_QUERY_KEY,
            null,
        );


        /*
         * Удаляем query текущего пользователя
         */
        queryClient.removeQueries({
            queryKey:
                CURRENT_USER_QUERY_KEY,
        });


        /*
         * После выхода is_favorite
         * должен пересчитаться.
         */
        queryClient.invalidateQueries({
            queryKey: [
                "products",
            ],
        });


        /*
         * Избранное больше недоступно
         * для текущего пользователя.
         */
        queryClient.removeQueries({
            queryKey: [
                "favorites",
            ],
        });
    }


    return {
        user:
            user ?? null,

        isAuthenticated:
            Boolean(user),

        isLoading,

        isError,

        login,

        logout,

        loginLoading:
            loginMutation.isPending,

        loginError:
            loginMutation.error,
    };
}