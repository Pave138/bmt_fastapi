import { useSearchParams } from "react-router-dom";

import CategoryTree from "../components/catalog/CategoryTree";
import ProductGrid from "../components/catalog/ProductGrid";
import CatalogToolbar from "../components/catalog/CatalogToolbar";

import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

function CatalogPage() {
    const { categories } = useCategories();

    const [searchParams, setSearchParams] = useSearchParams();

    const categoryParam = searchParams.get("category");
    const search = searchParams.get("search") ?? undefined;

    const selectedCategory = categoryParam
        ? Number(categoryParam)
        : null;

    const {
        data: products = [],
        isLoading: loadingProducts,
        isError,
        error,
    } = useProducts(
        selectedCategory,
        search,
    );

    function handleCategorySelect(
        categoryId: number | null,
    ) {
        const params = new URLSearchParams(searchParams);

        if (categoryId === null) {
            params.delete("category");
        } else {
            params.set(
                "category",
                String(categoryId),
            );
        }

        setSearchParams(params);
    }

    if (isError) {
        console.error(error);

        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-red-500">
                    Не удалось загрузить товары
                </p>
            </div>
        );
    }

    return (
        <div
            className="
                w-full
                px-8
                py-8
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1800px]
                    grid-cols-1
                    gap-8
                    lg:grid-cols-[300px_1fr]
                "
            >
                {/* Категории */}

                <div
                    className="
                        sticky
                        top-6
                        h-fit
                    "
                >
                    <CategoryTree
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelect={handleCategorySelect}
                    />
                </div>

                {/* Товары */}

                <main className="min-w-0">
                    <CatalogToolbar
                        total={products.length}
                    />

                    {loadingProducts ? (
                        <div
                            className="
                                flex
                                h-64
                                items-center
                                justify-center
                            "
                        >
                            <p className="text-gray-500">
                                Загрузка товаров...
                            </p>
                        </div>
                    ) : (
                        <ProductGrid
                            products={products}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default CatalogPage;
