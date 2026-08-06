import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";
import type { Category } from "../types/Category";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getCategories();
                setCategories(data);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        categories,
        loading,
    };
}