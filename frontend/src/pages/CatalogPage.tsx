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
    ] = useSearchParams();


    const categoryParam =
        searchParams.get("category");

    const search =
        searchParams.get("search")
        ?? undefined;


    const selectedCategory =
        categoryParam
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

                </div>


                {/* ==========================================
                    PRODUCTS
                    ========================================== */}

                <CatalogToolbar
                    total={
                        products.length
                    }
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