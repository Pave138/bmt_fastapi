import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.benzomototech.ru/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});