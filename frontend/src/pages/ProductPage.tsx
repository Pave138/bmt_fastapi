import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Plus,
    ShoppingCart,
    Star,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import type {
    Product,
} from "../types/Product";

import {
    useCart,
} from "../context/CartContext";

import {
    formatPrice,
} from "../utils/formatPrice";

import {
    getProductById,
} from "../api/products";


function ProductPage() {

    /*
     * =========================
     * URL
     * =========================
     */

    const {
        id,
    } = useParams();


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
     * PRODUCT
     * =========================
     */

    const [
        product,
        setProduct,
    ] = useState<Product | null>(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState<string | null>(null);


    /*
     * =========================
     * ACTIVE IMAGE
     * =========================
     */

    const [
        currentImage,
        setCurrentImage,
    ] = useState(0);


    /*
     * =========================
     * LOAD PRODUCT
     * =========================
     */

    useEffect(() => {

        if (!id) {

            setError(
                "Товар не найден"
            );

            setLoading(false);

            return;
        }


        const loadProduct =
            async () => {

                try {

                    setLoading(true);

                    setError(null);

                    setCurrentImage(0);


                    const data =
                        await getProductById(
                            Number(id)
                        );


                    setProduct(data);

                } catch (error) {

                    console.error(
                        error
                    );

                    setProduct(null);

                    setError(
                        "Не удалось загрузить товар"
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadProduct();

    }, [id]);


    /*
     * =========================
     * IMAGES
     * =========================
     *
     * Хук находится ДО условительных
     * return, поэтому порядок хуков
     * всегда одинаковый.
     */

    const images = useMemo(() => {

        if (!product) {
            return [];
        }


        if (
            product.images &&
            product.images.length > 0
        ) {

            return product.images;

        }


        if (product.main_image) {

            return [
                product.main_image,
            ];

        }


        return [];

    }, [product]);


    /*
     * =========================
     * CURRENT IMAGE
     * =========================
     */

    const activeImage =
        images[currentImage] ?? null;


    /*
     * =========================
     * CART ITEM
     * =========================
     */

    const cartItem =
        product
            ? cart?.items.find(
                  (item) =>
                      item.product_id ===
                      product.id
              )
            : undefined;


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
            product?.stock ?? 0
        );


    const isOutOfStock =
        stock <= 0;


    const canIncrease =
        quantity < stock;


    /*
     * =========================
     * DISCOUNT
     * =========================
     */

    const hasDiscount =
        product !== null &&
        product.old_price !== null &&
        Number(product.old_price) >
            Number(product.price);


    const discount =
        hasDiscount && product
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
                        `Средне: ${stock} шт.`,

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
     * IMAGE NAVIGATION
     * =========================
     */

    const previousImage = () => {

        if (images.length <= 1) {
            return;
        }


        setCurrentImage(
            (current) =>
                current === 0
                    ? images.length - 1
                    : current - 1
        );

    };


    const nextImage = () => {

        if (images.length <= 1) {
            return;
        }


        setCurrentImage(
            (current) =>
                (current + 1) %
                images.length
        );

    };


    /*
     * =========================
     * ADD TO CART
     * =========================
     */

    const handleAddToCart =
        async () => {

            if (!product) {
                return;
            }


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

            if (!product) {
                return;
            }


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

            if (!product) {
                return;
            }


            if (quantity <= 0) {
                return;
            }


            /*
             * При quantity === 1
             * передаём 0.
             *
             * CartContext должен удалить
             * товар из корзины.
             */

            await updateQuantity(
                product.id,
                quantity - 1
            );

        };


    /*
     * =========================
     * LOADING
     * =========================
     */

    if (loading) {

        return (

            <div
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    text-gray-500
                "
            >
                Загрузка товара...
            </div>

        );

    }


    /*
     * =========================
     * ERROR
     * =========================
     */

    if (error || !product) {

        return (

            <div
                className="
                    flex
                    min-h-[500px]
                    flex-col
                    items-center
                    justify-center
                    gap-4
                "
            >

                <h1
                    className="
                        text-2xl
                        font-bold
                    "
                >
                    Товар не найден
                </h1>


                <p
                    className="
                        text-gray-500
                    "
                >
                    {error}
                </p>


                <Link
                    to="/"
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#FFA500]
                        px-5
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-orange-600
                    "
                >

                    <ArrowLeft
                        size={18}
                    />

                    Вернуться в каталог

                </Link>

            </div>

        );

    }


    return (

        <div
            className="
                mx-auto
                w-full
                max-w-[1800px]
                px-8
                py-8
            "
        >

            {/* ========================= */}
            {/* BACK */}
            {/* ========================= */}

            <Link
                to="/"
                className="
                    mb-6
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-gray-500
                    transition
                    hover:text-gray-900
                "
            >

                <ArrowLeft
                    size={17}
                />

                Вернуться в каталог

            </Link>


            {/* ========================= */}
            {/* PRODUCT */}
            {/* ========================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-10
                    lg:grid-cols-2
                "
            >

                {/* ========================= */}
                {/* GALLERY */}
                {/* ========================= */}

                <div>

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-200
                            bg-gray-100
                        "
                    >

                        {/* DISCOUNT */}

                        {hasDiscount && (

                            <span
                                className="
                                    absolute
                                    left-4
                                    top-4
                                    z-20
                                    rounded-lg
                                    bg-red-500
                                    px-3
                                    py-1.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                "
                            >
                                -{discount}%
                            </span>

                        )}


                        {/* IMAGE */}

                        <div
                            className="
                                flex
                                aspect-square
                                items-center
                                justify-center
                            "
                        >

                            {activeImage ? (

                                <img
                                    src={
                                        activeImage.image_url
                                    }
                                    alt={
                                        product.name
                                    }
                                    className="
                                        h-full
                                        w-full
                                        object-contain
                                        p-6
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        text-gray-400
                                    "
                                >
                                    Нет изображения
                                </div>

                            )}

                        </div>


                        {/* PREVIOUS */}

                        {images.length > 1 && (

                            <button
                                type="button"
                                onClick={
                                    previousImage
                                }
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    flex
                                    h-11
                                    w-11
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    shadow-md
                                    transition
                                    hover:bg-gray-50
                                    active:scale-95
                                "
                                aria-label="Предыдущее изображение"
                            >

                                <ChevronLeft
                                    size={22}
                                />

                            </button>

                        )}


                        {/* NEXT */}

                        {images.length > 1 && (

                            <button
                                type="button"
                                onClick={
                                    nextImage
                                }
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    flex
                                    h-11
                                    w-11
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    shadow-md
                                    transition
                                    hover:bg-gray-50
                                    active:scale-95
                                "
                                aria-label="Следующее изображение"
                            >

                                <ChevronRight
                                    size={22}
                                />

                            </button>

                        )}

                    </div>


                    {/* ========================= */}
                    {/* THUMBNAILS */}
                    {/* ========================= */}

                    {images.length > 1 && (

                        <div
                            className="
                                mt-4
                                flex
                                gap-3
                                overflow-x-auto
                                pb-2
                            "
                        >

                            {images.map(
                                (
                                    image,
                                    index
                                ) => (

                                    <button
                                        key={
                                            image.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            setCurrentImage(
                                                index
                                            )
                                        }
                                        className={`
                                            h-20
                                            w-20
                                            shrink-0
                                            overflow-hidden
                                            rounded-xl
                                            border-2
                                            bg-gray-100
                                            transition

                                            ${
                                                index ===
                                                currentImage
                                                    ? "border-[#FFA500]"
                                                    : "border-transparent hover:border-gray-300"
                                            }
                                        `}
                                        aria-label={
                                            `Изображение ${index + 1}`
                                        }
                                    >

                                        <img
                                            src={
                                                image.image_url
                                            }
                                            alt={
                                                `${product.name} ${index + 1}`
                                            }
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ========================= */}
                {/* INFORMATION */}
                {/* ========================= */}

                <div
                    className="
                        flex
                        flex-col
                        justify-center
                    "
                >

                    {/* RATING */}

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                            "
                        >

                            <Star
                                size={18}
                                className="
                                    fill-yellow-400
                                    text-yellow-400
                                "
                            />

                            <span
                                className="
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                {product.avg_rating.toFixed(
                                    1
                                )}
                            </span>

                        </div>

                        <span>
                            {product.reviews_count} отзывов
                        </span>

                    </div>


                    {/* NAME */}

                    <h1
                        className="
                            text-3xl
                            font-bold
                            leading-tight
                            text-gray-900
                            lg:text-4xl
                        "
                    >
                        {product.name}
                    </h1>


                    {/* PRICE */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            items-end
                            gap-3
                        "
                    >

                        <span
                            className="
                                text-4xl
                                font-bold
                                text-[#FFA500]
                            "
                        >
                            {formatPrice(
                                product.price
                            )} ₽
                        </span>


                        {hasDiscount && (

                            <span
                                className="
                                    text-lg
                                    text-gray-400
                                    line-through
                                "
                            >
                                {formatPrice(
                                    product.old_price!
                                )} ₽
                            </span>

                        )}

                    </div>


                    {/* STOCK */}

                    <div
                        className="
                            mt-5
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


                    {/* DESCRIPTION */}

                    {product.description && (

                        <div
                            className="
                                mt-8
                                border-t
                                border-gray-200
                                pt-6
                            "
                        >

                            <h2
                                className="
                                    mb-3
                                    text-lg
                                    font-semibold
                                "
                            >
                                Описание
                            </h2>


                            <p
                                className="
                                    whitespace-pre-line
                                    leading-7
                                    text-gray-600
                                "
                            >
                                {
                                    product.description
                                }
                            </p>

                        </div>

                    )}


                    {/* ========================= */}
                    {/* ACTIONS */}
                    {/* ========================= */}

                    <div
                        className="
                            mt-8
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

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
                                    min-h-12
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[#FFA500]
                                    px-6
                                    py-3
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-orange-600
                                    active:scale-[0.98]
                                    disabled:cursor-not-allowed
                                    disabled:bg-gray-300
                                "
                            >

                                <ShoppingCart
                                    size={20}
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
                                    flex-1
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
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        transition
                                        hover:bg-gray-100
                                        active:scale-95
                                    "
                                    aria-label="Уменьшить количество"
                                >

                                    <Minus
                                        size={18}
                                    />

                                </button>


                                {/* QUANTITY */}

                                <div
                                    className="
                                        flex
                                        h-12
                                        flex-1
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-green-600
                                        font-semibold
                                        text-white
                                    "
                                >

                                    <ShoppingCart
                                        size={19}
                                    />

                                    {quantity}

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
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        transition
                                        hover:bg-gray-100
                                        active:scale-95
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                    aria-label="Увеличить количество"
                                >

                                    <Plus
                                        size={18}
                                    />

                                </button>

                            </div>

                        )}


                        {/* FAVORITE */}

                        <button
                            type="button"
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                transition
                                hover:border-red-300
                                hover:bg-red-50
                                hover:text-red-500
                            "
                            aria-label="Добавить в избранное"
                        >

                            <Heart
                                size={20}
                            />

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default ProductPage;
