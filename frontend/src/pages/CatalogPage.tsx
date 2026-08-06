import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CategoryTree from "../components/catalog/CategoryTree";
import ProductGrid from "../components/catalog/ProductGrid";
import CatalogToolbar from "../components/catalog/CatalogToolbar";

import { useCategories } from "../hooks/useCategories";

import { getProducts } from "../api/products";

import type { Product } from "../types/Product";


function CatalogPage() {
    const { categories } = useCategories();


    const [searchParams, setSearchParams] = useSearchParams();


    const selectedCategory =
        searchParams.get("category")
            ? Number(searchParams.get("category"))
            : null;



    const [products, setProducts] = useState<Product[]>([]);


    const [loadingProducts, setLoadingProducts] = useState(false);



    useEffect(() => {

        async function loadProducts() {

            setLoadingProducts(true);


            try {

                const data = await getProducts(
                    selectedCategory ?? undefined
                );


                setProducts(data);


            } catch (error) {

                console.error(error);


            } finally {

                setLoadingProducts(false);

            }

        }


        loadProducts();


    }, [selectedCategory]);





    function handleCategorySelect(
        categoryId: number | null
    ) {

        if (categoryId === null) {

            setSearchParams({});

            return;

        }


        setSearchParams({
            category: String(categoryId),
        });

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

                <main
                    className="
                        min-w-0
                    "
                >

                    <CatalogToolbar
                        total={products.length}
                    />



                    {
                        loadingProducts ? (

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

                        )
                    }



                </main>



            </div>


        </div>

    );
}


export default CatalogPage;