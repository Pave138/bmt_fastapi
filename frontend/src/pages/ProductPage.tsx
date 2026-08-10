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

import type {
    FormEvent,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

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

import {
    createReview,
} from "../api/reviews";


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


    const [
        imageDirection,
        setImageDirection,
    ] = useState(1);


    /*
     * =========================
     * REVIEW FORM
     * =========================
     */

    const [
        reviewRating,
        setReviewRating,
    ] = useState(5);


    const [
        reviewComment,
        setReviewComment,
    ] = useState("");


    const [
        reviewSubmitting,
        setReviewSubmitting,
    ] = useState(false);


    const [
        reviewError,
        setReviewError,
    ] = useState<string | null>(null);


    const [
        reviewSuccess,
        setReviewSuccess,
    ] = useState<string | null>(null);


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
     * IMAGE NAVIGATION
     * =========================
     */

    const goToImage =
        (
            index: number,
            direction: number
        ) => {

            if (
                images.length <= 1 ||
                index === currentImage
            ) {
                return;
            }


            setImageDirection(
                direction
            );

            setCurrentImage(
                index
            );

        };


    const previousImage = () => {

        if (images.length <= 1) {
            return;
        }


        setImageDirection(
            -1
        );


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


        setImageDirection(
            1
        );


        setCurrentImage(
            (current) =>
                (current + 1) %
                images.length
        );

    };


    /*
     * =========================
     * SWIPE
     * =========================
     */

    const handleDragEnd =
        (
            _event: MouseEvent | TouchEvent | PointerEvent,
            info: {
                offset: {
                    x: number;
                };
            }
        ) => {

            if (
                images.length <= 1
            ) {
                return;
            }


            const swipeDistance =
                Math.abs(
                    info.offset.x
                );


            if (
                swipeDistance < 50
            ) {
                return;
            }


            if (
                info.offset.x < 0
            ) {

                nextImage();

            } else {

                previousImage();

            }

        };


    /*
     * =========================
     * CART ACTIONS
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


    const handleDecrease =
        async () => {

            if (!product) {
                return;
            }


            if (quantity <= 0) {
                return;
            }


            await updateQuantity(
                product.id,
                quantity - 1
            );

        };


    /*
     * =========================
     * REVIEW SUBMIT
     * =========================
     */

    const handleReviewSubmit =
        async (
            event: FormEvent<HTMLFormElement>
        ) => {

            event.preventDefault();


            if (!product) {
                return;
            }


            setReviewError(null);

            setReviewSuccess(null);

            setReviewSubmitting(true);


            try {

                await createReview({
                    product_id:
                        product.id,

                    rating:
                        reviewRating,

                    comment:
                        reviewComment.trim()
                            ? reviewComment.trim()
                            : null,
                });


                const updatedProduct =
                    await getProductById(
                        product.id
                    );


                setProduct(
                    updatedProduct
                );


                setReviewRating(
                    5
                );

                setReviewComment(
                    ""
                );


                setReviewSuccess(
                    "Спасибо! Ваш отзыв успешно добавлен."
                );

            } catch (error) {

                console.error(
                    error
                );


                setReviewError(
                    "Не удалось добавить отзыв. Возможно, вы уже оставляли отзыв на этот товар."
                );

            } finally {

                setReviewSubmitting(
                    false
                );

            }

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
                                    z-30
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
                                relative
                                aspect-square
                                overflow-hidden
                            "
                        >

                            {activeImage ? (

                                <AnimatePresence
                                    initial={false}
                                    custom={
                                        imageDirection
                                    }
                                    mode="wait"
                                >

                                    <motion.img
                                        key={
                                            activeImage.id
                                        }
                                        src={
                                            activeImage.image_url
                                        }
                                        alt={
                                            product.name
                                        }
                                        custom={
                                            imageDirection
                                        }
                                        initial={{
                                            opacity: 0,
                                            x:
                                                imageDirection *
                                                80,
                                            scale: 0.98,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x:
                                                imageDirection *
                                                -80,
                                            scale: 0.98,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: [
                                                0.22,
                                                1,
                                                0.36,
                                                1,
                                            ],
                                        }}
                                        drag={
                                            images.length >
                                            1
                                                ? "x"
                                                : false
                                        }
                                        dragConstraints={{
                                            left: 0,
                                            right: 0,
                                        }}
                                        dragElastic={0.7}
                                        onDragEnd={
                                            handleDragEnd
                                        }
                                        className="
                                            absolute
                                            inset-0
                                            h-full
                                            w-full
                                            cursor-grab
                                            object-contain
                                            p-6
                                            active:cursor-grabbing
                                            select-none
                                        "
                                        draggable={false}
                                    />

                                </AnimatePresence>

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
                                        z-20
                                        flex
                                        h-11
                                        w-11
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white/95
                                        shadow-md
                                        backdrop-blur-sm
                                        transition
                                        hover:bg-white
                                        hover:shadow-lg
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
                                        z-20
                                        flex
                                        h-11
                                        w-11
                                        -translate-y-1/2
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white/95
                                        shadow-md
                                        backdrop-blur-sm
                                        transition
                                        hover:bg-white
                                        hover:shadow-lg
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

                    </div>


                    {/* THUMBNAILS */}

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

                                    <motion.button
                                        key={
                                            image.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            goToImage(
                                                index,
                                                index >
                                                    currentImage
                                                    ? 1
                                                    : -1
                                            )
                                        }
                                        whileHover={{
                                            scale: 1.04,
                                        }}
                                        whileTap={{
                                            scale: 0.96,
                                        }}
                                        className={`
                                            h-20
                                            w-20
                                            shrink-0
                                            overflow-hidden
                                            rounded-xl
                                            border-2
                                            bg-gray-100
                                            transition
                                            duration-200

                                            ${
                                                index ===
                                                currentImage
                                                    ? "border-[#FFA500] shadow-sm"
                                                    : "border-transparent hover:border-gray-300"
                                            }
                                        `}
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
                                            draggable={false}
                                        />

                                    </motion.button>

                                )
                            )}

                        </div>

                    )}


                    {/* IMAGE COUNTER */}

                    {images.length > 1 && (

                        <div
                            className="
                                mt-2
                                text-center
                                text-xs
                                text-gray-400
                            "
                        >
                            {currentImage + 1} /{" "}
                            {images.length}
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


                    {/* ACTIONS */}

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
                                >

                                    <Minus
                                        size={18}
                                    />

                                </button>


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
                                >

                                    <Plus
                                        size={18}
                                    />

                                </button>

                            </div>

                        )}


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


            {/* ================================================== */}
            {/* TECHNICAL SPECIFICATIONS + RIGHT COLUMN            */}
            {/* ================================================== */}

            <div
                className="
                    mt-16
                    grid
                    grid-cols-1
                    items-start
                    gap-8
                    lg:grid-cols-2
                "
            >

                {/* ================================================== */}
                {/* LEFT: SPECIFICATIONS                              */}
                {/* ================================================== */}

                <section>

                    <div
                        className="
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-6
                            shadow-sm
                        "
                    >

                        <div
                            className="
                                mb-6
                            "
                        >

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    text-gray-900
                                "
                            >
                                Технические характеристики
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Основные характеристики товара
                            </p>

                        </div>


                        {product.specifications &&
                        product.specifications.length > 0 ? (

                            <div
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-gray-200
                                "
                            >

                                {product.specifications.map(
                                    (
                                        specification,
                                        index
                                    ) => (

                                        <div
                                            key={`${specification.name}-${index}`}
                                            className={`
                                                grid
                                                grid-cols-1
                                                gap-1
                                                px-4
                                                py-3.5
                                                sm:grid-cols-[minmax(170px,0.8fr)_minmax(0,1.2fr)]

                                                ${
                                                    index % 2 === 0
                                                        ? "bg-gray-50"
                                                        : "bg-white"
                                                }

                                                ${
                                                    index !==
                                                    product.specifications.length - 1
                                                        ? "border-b border-gray-200"
                                                        : ""
                                                }
                                            `}
                                        >

                                            <span
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-gray-500
                                                "
                                            >
                                                {
                                                    specification.name
                                                }
                                            </span>


                                            <span
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-900
                                                "
                                            >
                                                {
                                                    specification.value
                                                }
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-gray-300
                                    bg-gray-50
                                    px-5
                                    py-8
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Технические характеристики не указаны
                            </div>

                        )}

                    </div>

                </section>


                {/* ================================================== */}
                {/* RIGHT COLUMN                                       */}
                {/* ================================================== */}

                <div
                    className="
                        space-y-8
                    "
                >

                    {/* ================================================== */}
                    {/* CREATE REVIEW                                       */}
                    {/* ================================================== */}

                    <section>

                        <div
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            <div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-yellow-50
                                        "
                                    >

                                        <Star
                                            size={21}
                                            className="
                                                fill-yellow-400
                                                text-yellow-400
                                            "
                                        />

                                    </div>


                                    <div>

                                        <h2
                                            className="
                                                text-2xl
                                                font-bold
                                                text-gray-900
                                            "
                                        >
                                            Оставить отзыв
                                        </h2>


                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-gray-500
                                            "
                                        >
                                            Поделитесь своим мнением о товаре
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <form
                                onSubmit={
                                    handleReviewSubmit
                                }
                                className="
                                    mt-6
                                "
                            >

                                {/* RATING */}

                                <div>

                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        Ваша оценка
                                    </label>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            gap-1
                                        "
                                    >

                                        {Array.from(
                                            {
                                                length: 5,
                                            }
                                        ).map(
                                            (
                                                _,
                                                index
                                            ) => {

                                                const rating =
                                                    index + 1;


                                                return (

                                                    <button
                                                        key={
                                                            rating
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setReviewRating(
                                                                rating
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            p-1
                                                            transition
                                                            hover:scale-110
                                                        "
                                                        aria-label={
                                                            `Оценка ${rating}`
                                                        }
                                                    >

                                                        <Star
                                                            size={30}
                                                            className={
                                                                rating <=
                                                                reviewRating
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            }
                                                        />

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-gray-500
                                        "
                                    >
                                        {reviewRating} из 5
                                    </p>

                                </div>


                                {/* COMMENT */}

                                <div
                                    className="
                                        mt-5
                                    "
                                >

                                    <label
                                        htmlFor="review-comment"
                                        className="
                                            block
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                        "
                                    >
                                        Комментарий
                                    </label>


                                    <textarea
                                        id="review-comment"
                                        value={
                                            reviewComment
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setReviewComment(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Расскажите, что вам понравилось или не понравилось..."
                                        maxLength={1000}
                                        rows={6}
                                        className="
                                            mt-2
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-gray-50
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-900
                                            outline-none
                                            transition
                                            placeholder:text-gray-400
                                            focus:border-[#FFA500]
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-orange-100
                                        "
                                    />


                                    <div
                                        className="
                                            mt-1
                                            text-right
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        {
                                            reviewComment.length
                                        } / 1000
                                    </div>

                                </div>


                                {/* ERROR */}

                                {reviewError && (

                                    <div
                                        className="
                                            mt-4
                                            rounded-xl
                                            bg-red-50
                                            px-4
                                            py-3
                                            text-sm
                                            text-red-600
                                        "
                                    >
                                        {
                                            reviewError
                                        }
                                    </div>

                                )}


                                {/* SUCCESS */}

                                {reviewSuccess && (

                                    <div
                                        className="
                                            mt-4
                                            rounded-xl
                                            bg-green-50
                                            px-4
                                            py-3
                                            text-sm
                                            text-green-600
                                        "
                                    >
                                        {
                                            reviewSuccess
                                        }
                                    </div>

                                )}


                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    disabled={
                                        reviewSubmitting
                                    }
                                    className="
                                        mt-5
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-[#FFA500]
                                        px-5
                                        py-3
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-orange-600
                                        active:scale-[0.98]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    <Star
                                        size={18}
                                    />

                                    {reviewSubmitting
                                        ? "Отправка..."
                                        : "Оставить отзыв"
                                    }

                                </button>

                            </form>

                        </div>

                    </section>


                    {/* ================================================== */}
                    {/* REVIEWS                                            */}
                    {/* ================================================== */}

                    <section>

                        <div
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    mb-6
                                    flex
                                    flex-wrap
                                    items-end
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-2xl
                                            font-bold
                                            text-gray-900
                                        "
                                    >
                                        Отзывы покупателей
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        {product.reviews_count}{" "}
                                        {product.reviews_count === 1
                                            ? "отзыв"
                                            : product.reviews_count >= 2 &&
                                              product.reviews_count <= 4
                                                ? "отзыва"
                                                : "отзывов"
                                        }
                                        {" "}о товаре
                                    </p>

                                </div>


                                {/* AVERAGE RATING */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        bg-yellow-50
                                        px-4
                                        py-3
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
                                            size={22}
                                            className="
                                                fill-yellow-400
                                                text-yellow-400
                                            "
                                        />

                                        <span
                                            className="
                                                text-lg
                                                font-bold
                                                text-gray-900
                                            "
                                        >
                                            {product.avg_rating.toFixed(
                                                1
                                            )}
                                        </span>

                                    </div>


                                    <span
                                        className="
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        из 5
                                    </span>

                                </div>

                            </div>


                            {/* REVIEWS LIST */}

                            {product.reviews &&
                            product.reviews.length > 0 ? (

                                <div
                                    className="
                                        space-y-4
                                    "
                                >

                                    {product.reviews.map(
                                        (
                                            review
                                        ) => (

                                            <article
                                                key={
                                                    review.id
                                                }
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    bg-gray-50
                                                    p-5
                                                    transition
                                                    hover:border-gray-300
                                                    hover:bg-white
                                                "
                                            >

                                                {/* USER + RATING */}

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-4
                                                    "
                                                >

                                                    <div>

                                                        <div
                                                            className="
                                                                font-semibold
                                                                text-gray-900
                                                            "
                                                        >
                                                            {
                                                                review.user_username
                                                            }
                                                        </div>


                                                        <div
                                                            className="
                                                                mt-2
                                                                flex
                                                                items-center
                                                                gap-0.5
                                                            "
                                                        >

                                                            {Array.from(
                                                                {
                                                                    length: 5,
                                                                }
                                                            ).map(
                                                                (
                                                                    _,
                                                                    index
                                                                ) => (

                                                                    <Star
                                                                        key={
                                                                            index
                                                                        }
                                                                        size={16}
                                                                        className={
                                                                            index <
                                                                            review.rating
                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                : "text-gray-300"
                                                                        }
                                                                    />

                                                                )
                                                            )}

                                                        </div>

                                                    </div>


                                                    <span
                                                        className="
                                                            shrink-0
                                                            rounded-lg
                                                            bg-white
                                                            px-2.5
                                                            py-1
                                                            text-xs
                                                            font-medium
                                                            text-gray-500
                                                        "
                                                    >
                                                        {review.rating}/5
                                                    </span>

                                                </div>


                                                {/* COMMENT */}

                                                {review.comment ? (

                                                    <p
                                                        className="
                                                            mt-4
                                                            whitespace-pre-line
                                                            leading-7
                                                            text-gray-600
                                                        "
                                                    >
                                                        {
                                                            review.comment
                                                        }
                                                    </p>

                                                ) : (

                                                    <p
                                                        className="
                                                            mt-4
                                                            text-sm
                                                            italic
                                                            text-gray-400
                                                        "
                                                    >
                                                        Пользователь оставил только оценку.
                                                    </p>

                                                )}

                                            </article>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-dashed
                                        border-gray-300
                                        bg-gray-50
                                        px-6
                                        py-12
                                        text-center
                                    "
                                >

                                    <Star
                                        size={36}
                                        className="
                                            mx-auto
                                            text-gray-300
                                        "
                                    />


                                    <p
                                        className="
                                            mt-3
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        Пока нет отзывов
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        Будьте первым, кто оставит отзыв
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                </div>

            </div>

        </div>

    );

}


export default ProductPage;
