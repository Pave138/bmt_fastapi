import { api } from "./client";
import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
    const response = await api.get("/categories");

    return response.data;
}