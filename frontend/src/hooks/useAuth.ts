import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getCurrentUser
} from "../api/auth";

const ACCESS_TOKEN_KEY = "access_token";

export function useAuth() {
    const queryClient = useQueryClient();

    const token = localStorage.getItem(
        ACCESS_TOKEN_KEY
    );

    const {
        data: user,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["current-user"],
        queryFn: getCurrentUser,
        enabled: Boolean(token),
        retry: false,
    });

    function handleLogout() {
        localStorage.removeItem(
            ACCESS_TOKEN_KEY
        );

        queryClient.setQueryData(
            ["current-user"],
            null
        );

        queryClient.invalidateQueries({
            queryKey: ["current-user"],
        });
    }

    return {
        user: user ?? null,
        isAuthenticated: Boolean(user),
        isLoading,
        isError,
        logout: handleLogout,
    };
}