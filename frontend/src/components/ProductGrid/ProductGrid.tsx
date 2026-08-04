import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../../api/products";
import ProductCard from "../ProductCard/ProductCard";

function ProductGrid() {
    const [searchParams] = useSearchParams();

    const categoryId =
        Number(searchParams.get("category")) || null;

    const search =
        searchParams.get("search") ?? "";

    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["products", categoryId, search],
        queryFn: () =>
            getProducts(categoryId, search),
    });

    if (isLoading) {
        return (
            <div className="py-20 text-center">
                Загрузка товаров...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                {(error as Error).message}
            </div>
        );
    }

    if (!products?.length) {
        return (
            <div className="py-20 text-center text-gray-500">
                Товары не найдены
            </div>
        );
    }

    return (
        <div
            className="
                grid
                grid-cols-1
                gap-6

                sm:grid-cols-2

                lg:grid-cols-3

                xl:grid-cols-4
            "
        >
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}

export default ProductGrid;