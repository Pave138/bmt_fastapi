import type { Product } from "../../types/product";

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow">
            <img
                src={product.main_image?.image_url}
                alt={product.name}
                className="mb-3 h-48 w-full rounded object-cover"
            />

            <h3 className="text-lg font-semibold">
                {product.name}
            </h3>

            <p className="mt-2 text-xl font-bold text-orange-600">
                {product.price} ₽
            </p>
        </div>
    );
}

export default ProductCard;