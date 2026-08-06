import ProductCard from "../product/ProductCard";

import type { Product } from "../../types/Product";


interface ProductGridProps {
    products: Product[];
}


function ProductGrid({
    products,
}: ProductGridProps) {


    if (products.length === 0) {
        return (
            <div
                className="
                    flex
                    h-64
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-gray-300
                    bg-white
                "
            >
                <p
                    className="
                        text-lg
                        text-gray-500
                    "
                >
                    Товары не найдены
                </p>
            </div>
        );
    }


    return (
        <div
            className="
                grid
                grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
                gap-6
            "
        >

            {
                products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))
            }

        </div>
    );
}


export default ProductGrid;