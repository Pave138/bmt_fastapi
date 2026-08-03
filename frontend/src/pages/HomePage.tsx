import { useEffect, useState } from "react";

import { getProducts } from "../api/products";
import type { Product } from "../types/product";

import ProductCard from "../components/ProductCard/ProductCard";

function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadProducts() {
            const data = await getProducts();

            setProducts(data);
        }

        loadProducts();
    }, []);

    return (
        <div className="grid grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}

export default HomePage;