import { api } from "./client";

import type { User } from "../types/User";

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    username?: string;
}

export async function login(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    const body = new URLSearchParams();

    body.append("username", credentials.username);
    body.append("password", credentials.password);

    const response = await api.post<LoginResponse>(
        "/auth/jwt/login",
        body,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    );

    localStorage.setItem(
        "access_token",
        response.data.access_token,
    );

    return response.data;
}

export async function getMe(): Promise<User> {
    const response = await api.get<User>("/users/me");

    return response.data;
}

// Алиас для старого кода
export const getCurrentUser = getMe;

export async function register(
    data: RegisterData,
): Promise<User> {
    const response = await api.post<User>(
        "/auth/register",
        data,
    );

    return response.data;
}

export function logout(): void {
    localStorage.removeItem("access_token");
}