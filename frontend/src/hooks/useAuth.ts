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
     *
     * Не сохраняем token в переменную
     * на уровне render и не используем
     * его как источник React-состояния.
     *
     * Проверяем localStorage непосредственно
     * при выполнении query.
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

                    localStorage.setItem(
                        ACCESS_TOKEN_KEY,
                        data.access_token,
                    );


                    /*
                     * После установки токена
                     * заново запрашиваем текущего
                     * пользователя.
                     */
                    await queryClient
                        .fetchQuery({
                            queryKey:
                                CURRENT_USER_QUERY_KEY,

                            queryFn:
                                getCurrentUser,
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

        await loginMutation
            .mutateAsync({
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

        localStorage.removeItem(
            ACCESS_TOKEN_KEY,
        );


        queryClient.setQueryData(
            CURRENT_USER_QUERY_KEY,
            null,
        );


        queryClient.removeQueries({
            queryKey:
                CURRENT_USER_QUERY_KEY,
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
