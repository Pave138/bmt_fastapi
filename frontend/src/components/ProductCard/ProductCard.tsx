// src/components/ProductCard/ProductCard.tsx

import { ShoppingCart } from "lucide-react";

import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/formatPrice";

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Изображение */}
            <div className="aspect-square overflow-hidden bg-gray-100">
                {product.main_image ? (
                    <img
                        src={product.main_image.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Нет изображения
                    </div>
                )}
            </div>

            {/* Контент */}
            <div className="p-4">
                {/* Рейтинг */}
                <div className="text-sm text-gray-500">
                    ⭐ {product.avg_rating.toFixed(1)} ({product.reviews_count})
                </div>

                {/* Название */}
                <h3 className="mt-2 line-clamp-2 min-h-14 text-lg font-semibold">
                    {product.name}
                </h3>

                {/* Цена */}
                <div className="mt-4 flex items-end gap-2">
                    {product.old_price && (
                        <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.old_price)} ₽
                        </span>
                    )}

                    <span className="text-2xl font-bold text-orange-600">
                        {formatPrice(product.price)} ₽
                    </span>
                </div>

                {/* Кнопка */}
                <button
                    className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-orange-600
                        py-2
                        font-medium
                        text-white
                        transition
                        hover:bg-orange-700
                    "
                >
                    <ShoppingCart size={18} />
                    В корзину
                </button>
            </div>
        </div>
    );
}

export default ProductCard;