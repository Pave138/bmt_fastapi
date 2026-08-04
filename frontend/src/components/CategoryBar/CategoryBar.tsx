// src/components/CategoryBar/CategoryBar.tsx

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getCategories } from "../../api/categories";

function CategoryBar() {
    const { data: categories, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategoryId = Number(searchParams.get("category")) || null;

    if (isLoading) {
        return <p>Загрузка категорий...</p>;
    }

    function selectCategory(categoryId: number | null) {
        const params = new URLSearchParams(searchParams);

        if (categoryId === null) {
            params.delete("category");
        } else {
            params.set("category", String(categoryId));
        }

        setSearchParams(params);
    }

    return (
        <div className="flex flex-wrap gap-3">
            <button
                onClick={() => selectCategory(null)}
                className={
                    selectedCategoryId === null
                        ? "rounded-full bg-orange-600 px-5 py-2 text-white"
                        : "rounded-full border px-5 py-2 transition hover:bg-gray-100"
                }
            >
                Все
            </button>

            {categories?.map((category) => (
                <button
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className={
                        selectedCategoryId === category.id
                            ? "rounded-full bg-orange-600 px-5 py-2 text-white"
                            : "rounded-full border px-5 py-2 transition hover:bg-gray-100"
                    }
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}

export default CategoryBar;