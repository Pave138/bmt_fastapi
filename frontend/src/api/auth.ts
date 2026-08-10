import { api } from "./client";

import type {
    User,
} from "../types/User";


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

    const body =
        new URLSearchParams();

    body.append(
        "username",
        credentials.username
    );

    body.append(
        "password",
        credentials.password
    );


    const response =
        await api.post<LoginResponse>(
            "/auth/jwt/login",
            body,
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
            },
        );


    return response.data;
}


export async function getMe(): Promise<User> {

    const response =
        await api.get<User>(
            "/users/me"
        );

    return response.data;
}


export const getCurrentUser =
    getMe;


export async function register(
    data: RegisterData,
) {

    const response =
        await api.post(
            "/auth/register",
            data,
        );

    return response.data;
}