import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    getMe,
    login as loginRequest,
} from "../api/auth";

import type { User } from "../types/User";

interface AuthContextValue {
    user: User | null;
    loading: boolean;

    login: (
        username: string,
        password: string
    ) => Promise<void>;

    logout: () => void;
}

const AuthContext =
    createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadUser() {
            const token =
                localStorage.getItem(
                    "access_token"
                );

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser =
                    await getMe();

                setUser(currentUser);
            } catch (error) {
                console.error(
                    "Не удалось получить пользователя:",
                    error
                );

                localStorage.removeItem(
                    "access_token"
                );

                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function login(
        username: string,
        password: string
    ) {
        const data =
            await loginRequest({
                username,
                password,
            });

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        const currentUser =
            await getMe();

        setUser(currentUser);
    }

    function logout() {
        localStorage.removeItem(
            "access_token"
        );

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}