import {
    useSearchParams,
} from "react-router-dom";

import ProductGrid from "../components/catalog/ProductGrid";
import CatalogToolbar from "../components/catalog/CatalogToolbar";

import {
    useProducts,
} from "../hooks/useProducts";


function CatalogPage() {

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    /*
     * =========================
     * URL PARAMETERS
     * =========================
     */

    const categorySlug =
        searchParams.get("category")
        ?? undefined;

    const search =
        searchParams.get("search")
        ?? undefined;


    /*
     * =========================
     * PRODUCTS
     * =========================
     */

    const {
        data: products = [],
        isLoading: loadingProducts,
        isError,
        error,
    } = useProducts(
        categorySlug,
        search,
    );


    /*
     * =========================
     * ERROR
     * =========================
     */

    if (isError) {

        console.error(error);

        return (
            <div
                className="
                    flex
                    h-64
                    items-center
                    justify-center
                "
            >

                <p
                    className="
                        text-red-500
                    "
                >
                    Не удалось загрузить товары
                </p>

            </div>
        );
    }


    /*
     * =========================
     * CLEAR CATEGORY
     * =========================
     */

    function clearCategory() {

        const params =
            new URLSearchParams(
                searchParams,
            );

        params.delete("category");

        setSearchParams(params);
    }


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (
        <main
            className="
                w-full
                px-6
                py-6
                lg:px-8
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1800px]
                "
            >

                {/* ==========================================
                    HEADER
                    ========================================== */}

                <div
                    className="
                        mb-6
                    "
                >

                    {categorySlug && (

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Категория
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                    "
                                >
                                    {categorySlug}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={clearCategory}
                                className="
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-600
                                    transition
                                    hover:border-gray-300
                                    hover:bg-gray-50
                                    hover:text-gray-900
                                "
                            >
                                Сбросить
                            </button>

                        </div>

                    )}

                </div>


                {/* ==========================================
                    TOOLBAR
                    ========================================== */}

                <CatalogToolbar
                    total={
                        products.length
                    }
                />


                {/* ==========================================
                    PRODUCTS
                    ========================================== */}

                {loadingProducts ? (

                    <div
                        className="
                            flex
                            h-64
                            items-center
                            justify-center
                        "
                    >

                        <p
                            className="
                                text-gray-500
                            "
                        >
                            Загрузка товаров...
                        </p>

                    </div>

                ) : (

                    <ProductGrid
                        products={products}
                    />

                )}

            </div>

        </main>
    );
}


export default CatalogPage;