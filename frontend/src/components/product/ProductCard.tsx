import {
    Heart,
    ShoppingCart,
    Star,
    Minus,
    Plus,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    useMemo,
} from "react";

import {
    formatPrice,
} from "../../utils/formatPrice";

import type {
    Product,
} from "../../types/Product";

import {
    useCart,
} from "../../context/CartContext";


interface Props {
    product: Product;
}


function ProductCard({
    product,
}: Props) {

    /*
     * =========================
     * CART
     * =========================
     */

    const {
        cart,
        addToCart,
        updateQuantity,
    } = useCart();


    /*
     * =========================
     * CART ITEM
     * =========================
     */

    const cartItem =
        cart?.items.find(
            (item) =>
                item.product_id ===
                product.id
        );


    /*
     * =========================
     * QUANTITY
     * =========================
     */

    const quantity =
        cartItem?.quantity ?? 0;

    const isInCart =
        quantity > 0;


    /*
     * =========================
     * STOCK
     * =========================
     */

    const stock =
        Number(
            product.stock ?? 0
        );

    const isOutOfStock =
        stock <= 0;

    const canIncrease =
        quantity < stock;


    /*
     * =========================
     * STOCK STATUS
     * =========================
     */

    const stockStatus =
        useMemo(() => {

            if (stock <= 0) {

                return {
                    text:
                        "Нет в наличии",

                    className:
                        "text-red-500",

                    dotClass:
                        "bg-red-500",
                };

            }


            if (stock <= 5) {

                return {
                    text:
                        `Мало: ${stock} шт.`,

                    className:
                        "text-red-500",

                    dotClass:
                        "bg-red-500",
                };

            }


            if (stock <= 20) {

                return {
                    text:
                        `Достаточно: ${stock} шт.`,

                    className:
                        "text-yellow-600",

                    dotClass:
                        "bg-yellow-500",
                };

            }


            return {
                text:
                    `Много: ${stock} шт.`,

                className:
                    "text-green-600",

                dotClass:
                    "bg-green-500",
            };

        }, [stock]);


    /*
     * =========================
     * DISCOUNT
     * =========================
     */

    const hasDiscount =
        product.old_price !== null &&
        Number(product.old_price) >
            Number(product.price);


    const discount =
        hasDiscount
            ? Math.round(
                  (
                      1 -
                      Number(product.price) /
                          Number(
                              product.old_price
                          )
                  ) * 100
              )
            : null;


    /*
     * =========================
     * ADD TO CART
     * =========================
     */

    const handleAddToCart =
        async () => {

            if (isOutOfStock) {
                return;
            }

            await addToCart(
                product.id,
                1
            );

        };


    /*
     * =========================
     * INCREASE
     * =========================
     */

    const handleIncrease =
        async () => {

            if (!canIncrease) {
                return;
            }

            await updateQuantity(
                product.id,
                quantity + 1
            );

        };


    /*
     * =========================
     * DECREASE
     * =========================
     */

    const handleDecrease =
        async () => {

            if (quantity <= 0) {
                return;
            }

            await updateQuantity(
                product.id,
                quantity - 1
            );

        };


    return (

        <div
            className="
                group
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                transition-all
                duration-300
                ease-out
                hover:border-orange-200
                hover:shadow-[0_16px_40px_rgba(255,165,0,0.12)]
            "
        >

            {/* ========================= */}
            {/* IMAGE */}
            {/* ========================= */}

            <div
                className="
                    relative
                "
            >

                {/* DISCOUNT */}

                {hasDiscount && (

                    <span
                        className="
                            absolute
                            left-3
                            top-3
                            z-20
                            rounded-lg
                            bg-red-500
                            px-2
                            py-1
                            text-xs
                            font-semibold
                            text-white
                            shadow-sm
                        "
                    >
                        -{discount}%
                    </span>

                )}


                {/* FAVORITE */}

                <button
                    type="button"
                    className="
                        absolute
                        right-3
                        top-3
                        z-20
                        rounded-full
                        bg-white
                        p-2
                        shadow-sm
                        transition-all
                        duration-200
                        hover:scale-110
                        hover:bg-red-50
                        hover:text-red-500
                    "
                    aria-label="Добавить в избранное"
                >

                    <Heart
                        size={18}
                    />

                </button>


                {/* PRODUCT IMAGE */}

                <div
                    className="
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        bg-gray-100
                    "
                >

                    <Link
                        to={`/products/${product.slug}`}
                        className="
                            block
                            h-full
                            w-full
                        "
                    >

                        {product.main_image ? (

                            <img
                                src={
                                    product.main_image.image_url
                                }
                                alt={
                                    product.name
                                }
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-opacity
                                    duration-200
                                    group-hover:opacity-90
                                "
                            />

                        ) : (

                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-center
                                    text-gray-400
                                "
                            >
                                Нет изображения
                            </div>

                        )}

                    </Link>

                </div>

            </div>


            {/* ========================= */}
            {/* CONTENT */}
            {/* ========================= */}

            <div
                className="
                    space-y-3
                    p-5
                "
            >

                {/* RATING */}

                <div
                    className="
                        flex
                        items-center
                        gap-1
                        text-sm
                        text-gray-500
                    "
                >

                    <Star
                        size={15}
                        className="
                            fill-yellow-400
                            text-yellow-400
                        "
                    />

                    <span>
                        {product.avg_rating.toFixed(1)}
                    </span>

                    <span>
                        ({product.reviews_count})
                    </span>

                </div>


                {/* NAME */}

                <Link
                    to={`/products/${product.slug}`}
                    className="
                        block
                        line-clamp-2
                        min-h-[56px]
                        text-base
                        font-semibold
                        text-gray-900
                        transition-colors
                        duration-200
                        hover:text-[#FFA500]
                    "
                >
                    {product.name}
                </Link>


                {/* STOCK */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <span
                        className={`
                            h-2.5
                            w-2.5
                            rounded-full
                            ${stockStatus.dotClass}
                        `}
                    />

                    <span
                        className={`
                            text-sm
                            font-medium
                            ${stockStatus.className}
                        `}
                    >
                        {stockStatus.text}
                    </span>

                </div>


                {/* PRICE */}

                <div
                    className="
                        flex
                        items-end
                        gap-2
                    "
                >

                    {hasDiscount && (

                        <span
                            className="
                                text-sm
                                text-gray-400
                                line-through
                            "
                        >
                            {formatPrice(
                                product.old_price!
                            )} ₽
                        </span>

                    )}


                    <span
                        className="
                            text-2xl
                            font-bold
                            text-[#FFA500]
                        "
                    >
                        {formatPrice(
                            product.price
                        )} ₽
                    </span>

                </div>


                {/* ========================= */}
                {/* CART */}
                {/* ========================= */}

                {!isInCart ? (

                    <button
                        type="button"
                        onClick={
                            handleAddToCart
                        }
                        disabled={
                            isOutOfStock
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[#FFA500]
                            py-3
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:bg-orange-600
                            hover:shadow-md
                            active:scale-[0.98]
                            disabled:cursor-not-allowed
                            disabled:bg-gray-300
                            disabled:shadow-none
                        "
                    >

                        <ShoppingCart
                            size={18}
                        />

                        {isOutOfStock
                            ? "Нет в наличии"
                            : "В корзину"
                        }

                    </button>

                ) : (

                    <div
                        className="
                            flex
                            w-full
                            items-center
                            gap-2
                        "
                    >

                        {/* MINUS */}

                        <button
                            type="button"
                            onClick={
                                handleDecrease
                            }
                            disabled={
                                quantity <= 0
                            }
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                transition-all
                                duration-200
                                hover:border-gray-400
                                hover:bg-gray-100
                                active:scale-95
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <Minus
                                size={18}
                            />

                        </button>


                        {/* QUANTITY */}

                        <div
                            className="
                                flex
                                h-11
                                flex-1
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-green-600
                                font-semibold
                                text-white
                                shadow-sm
                                transition-colors
                                duration-200
                                group-hover:bg-green-700
                            "
                        >

                            <ShoppingCart
                                size={18}
                            />

                            <span>
                                {quantity}
                            </span>

                        </div>


                        {/* PLUS */}

                        <button
                            type="button"
                            onClick={
                                handleIncrease
                            }
                            disabled={
                                !canIncrease
                            }
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                transition-all
                                duration-200
                                hover:border-gray-400
                                hover:bg-gray-100
                                active:scale-95
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >

                            <Plus
                                size={18}
                            />

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}


export default ProductCard;