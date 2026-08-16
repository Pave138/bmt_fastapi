import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Minus,
    Pencil,
    Plus,
    ShoppingCart,
    Star,
    Trash2,
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
    useAuth,
} from "../hooks/useAuth";

import {
    formatPrice,
} from "../utils/formatPrice";

import {
    getProductBySlug,
} from "../api/products";

import {
    createProductReview,
    getProductReviews,
    updateReview,
    deleteReview,
    type Review,
} from "../api/reviews";


function getReviewWord(
    count: number,
): string {

    const mod10 = count % 10;
    const mod100 = count % 100;

    if (
        mod10 === 1 &&
        mod100 !== 11
    ) {
        return "отзыв";
    }

    if (
        mod10 >= 2 &&
        mod10 <= 4 &&
        (
            mod100 < 10 ||
            mod100 >= 20
        )
    ) {
        return "отзыва";
    }

    return "отзывов";
}


function ProductPage() {

    /*
     * =========================
     * URL
     * =========================
     */

    const {
        slug,
    } = useParams();


    /*
     * =========================
     * AUTH
     * =========================
     */

    const {
        user,
    } = useAuth();


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
     * REVIEWS
     * =========================
     */

    const [
        reviews,
        setReviews,
    ] = useState<Review[]>([]);

    const [
        reviewsTotal,
        setReviewsTotal,
    ] = useState(0);

    const [
        reviewsLoading,
        setReviewsLoading,
    ] = useState(true);


    /*
     * =========================
     * REVIEW STATS
     * =========================
     */

    const [
        averageRating,
        setAverageRating,
    ] = useState(0);


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
     * REVIEW EDIT
     * =========================
     */

    const [
        editingReview,
        setEditingReview,
    ] = useState(false);

    const [
        editRating,
        setEditRating,
    ] = useState(5);

    const [
        editComment,
        setEditComment,
    ] = useState("");

    const [
        editSubmitting,
        setEditSubmitting,
    ] = useState(false);

    const [
        editError,
        setEditError,
    ] = useState<string | null>(null);


    /*
     * =========================
     * REVIEW DELETE
     * =========================
     */

    const [
        deletingReview,
        setDeletingReview,
    ] = useState(false);


    /*
     * =========================
     * LOAD PRODUCT
     * =========================
     */

    useEffect(() => {

        if (!slug) {

            setProduct(null);

            setError(
                "Товар не найден",
            );

            setLoading(false);

            return;
        }


        const loadProduct = async () => {

            try {

                setLoading(true);

                setError(null);

                setCurrentImage(0);


                const data =
                    await getProductBySlug(
                        slug,
                    );


                setProduct(data);

            } catch (error) {

                console.error(error);

                setProduct(null);

                setError(
                    "Не удалось загрузить товар",
                );

            } finally {

                setLoading(false);

            }

        };


        loadProduct();

    }, [slug]);


    /*
     * =========================
     * LOAD REVIEWS
     * =========================
     */

    const loadReviews = async () => {

        if (!slug) {
            return;
        }


        try {

            setReviewsLoading(true);


            /*
             * Загружаем до 100 отзывов.
             *
             * Это позволяет найти отзыв
             * текущего пользователя среди
             * существующих отзывов.
             */

            const data =
                await getProductReviews(
                    slug,
                    100,
                    0,
                );


            setReviews(
                data.items,
            );


            setReviewsTotal(
                data.total,
            );


            if (data.items.length > 0) {

                const totalRating =
                    data.items.reduce(
                        (
                            sum,
                            review,
                        ) =>
                            sum +
                            review.rating,
                        0,
                    );


                setAverageRating(
                    totalRating /
                    data.items.length,
                );

            } else {

                setAverageRating(0);

            }

        } catch (error) {

            console.error(error);

            setReviews([]);

            setReviewsTotal(0);

            setAverageRating(0);

        } finally {

            setReviewsLoading(false);

        }

    };


    useEffect(() => {

        loadReviews();

    }, [slug]);


    /*
     * =========================
     * CURRENT USER REVIEW
     * =========================
     */

    const myReview = useMemo(() => {

        if (!user) {
            return null;
        }


        return (
            reviews.find(
                (review) =>
                    review.user_username ===
                    user.username,
            ) ?? null
        );

    }, [
        reviews,
        user,
    ]);


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
                      product.id,
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
            product?.stock ?? 0,
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
                              product.old_price,
                          )
                  ) * 100,
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

    const goToImage = (
        index: number,
        direction: number,
    ) => {

        if (
            images.length <= 1 ||
            index === currentImage
        ) {
            return;
        }


        setImageDirection(direction);

        setCurrentImage(index);

    };


    const previousImage = () => {

        if (images.length <= 1) {
            return;
        }


        setImageDirection(-1);


        setCurrentImage(
            (current) =>
                current === 0
                    ? images.length - 1
                    : current - 1,
        );

    };


    const nextImage = () => {

        if (images.length <= 1) {
            return;
        }


        setImageDirection(1);


        setCurrentImage(
            (current) =>
                (current + 1) %
                images.length,
        );

    };


    /*
     * =========================
     * SWIPE
     * =========================
     */

    const handleDragEnd = (
        _event:
            MouseEvent |
            TouchEvent |
            PointerEvent,
        info: {
            offset: {
                x: number;
            };
        },
    ) => {

        if (images.length <= 1) {
            return;
        }


        if (
            Math.abs(info.offset.x) < 50
        ) {
            return;
        }


        if (info.offset.x < 0) {

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
                1,
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
                quantity + 1,
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
                quantity - 1,
            );

        };


    /*
     * =========================
     * CREATE REVIEW
     * =========================
     */

    const handleReviewSubmit =
        async (
            event:
                FormEvent<HTMLFormElement>,
        ) => {

            event.preventDefault();


            if (
                !user ||
                !product ||
                !slug
            ) {
                return;
            }


            setReviewError(null);

            setReviewSuccess(null);

            setReviewSubmitting(true);


            try {

                await createProductReview(
                    slug,
                    {
                        rating:
                            reviewRating,

                        comment:
                            reviewComment.trim()
                                ? reviewComment.trim()
                                : null,
                    },
                );


                await loadReviews();


                setReviewRating(5);

                setReviewComment("");


                setReviewSuccess(
                    "Спасибо! Ваш отзыв успешно добавлен.",
                );

            } catch (error) {

                console.error(error);


                setReviewError(
                    "Не удалось добавить отзыв. Возможно, вы уже оставляли отзыв на этот товар.",
                );

            } finally {

                setReviewSubmitting(false);

            }

        };


    /*
     * =========================
     * START EDIT REVIEW
     * =========================
     */

    const handleStartEditReview = () => {

        if (!myReview) {
            return;
        }


        setEditRating(
            myReview.rating,
        );

        setEditComment(
            myReview.comment ?? "",
        );

        setEditError(null);

        setEditingReview(true);

    };


    /*
     * =========================
     * CANCEL EDIT
     * =========================
     */

    const handleCancelEditReview = () => {

        setEditingReview(false);

        setEditError(null);

    };


    /*
     * =========================
     * UPDATE REVIEW
     * =========================
     */

    const handleUpdateReview =
        async (
            event:
                FormEvent<HTMLFormElement>,
        ) => {

            event.preventDefault();


            if (!myReview) {
                return;
            }


            setEditError(null);

            setEditSubmitting(true);


            try {

                await updateReview(
                    myReview.id,
                    {
                        rating:
                            editRating,

                        comment:
                            editComment.trim()
                                ? editComment.trim()
                                : null,
                    },
                );


                await loadReviews();

                setEditingReview(false);

            } catch (error) {

                console.error(error);

                setEditError(
                    "Не удалось изменить отзыв.",
                );

            } finally {

                setEditSubmitting(false);

            }

        };


    /*
     * =========================
     * DELETE REVIEW
     * =========================
     */

    const handleDeleteReview =
        async () => {

            if (!myReview) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Вы действительно хотите удалить свой отзыв?",
                );


            if (!confirmed) {
                return;
            }


            try {

                setDeletingReview(true);


                await deleteReview(
                    myReview.id,
                );


                await loadReviews();

            } catch (error) {

                console.error(error);

                setEditError(
                    "Не удалось удалить отзыв.",
                );

            } finally {

                setDeletingReview(false);

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

    if (
        error ||
        !product
    ) {

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

                {/* GALLERY */}

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
                                    custom={imageDirection}
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
                                            images.length > 1
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


                            {images.length > 1 && (

                                <>

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

                                </>

                            )}

                        </div>

                    </div>


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
                                    index,
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
                                                    : -1,
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

                                            ${
                                                index ===
                                                currentImage
                                                    ? "border-[#FFA500]"
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

                                ),
                            )}

                        </div>

                    )}

                </div>


                {/* INFORMATION */}

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
                            {averageRating.toFixed(1)}
                        </span>


                        <span>
                            {reviewsTotal}{" "}
                            {
                                getReviewWord(
                                    reviewsTotal,
                                )
                            }
                        </span>

                    </div>


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
                                product.price,
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
                                    product.old_price!,
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
                                {product.description}
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
            {/* SPECIFICATIONS + REVIEWS                          */}
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

                {/* SPECIFICATIONS */}

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


                        {product.specifications &&
                        product.specifications.length > 0 ? (

                            <div
                                className="
                                    mt-6
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-gray-200
                                "
                            >

                                {product.specifications.map(
                                    (
                                        specification,
                                        index,
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

                                    ),
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    mt-6
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


                {/* REVIEWS */}

                <div
                    className="
                        space-y-8
                    "
                >

                    {/* ================================================== */}
                    {/* MY REVIEW / CREATE REVIEW                           */}
                    {/* ================================================== */}

                    <section>

                        {!user ? (

                            /*
                             * ============================================
                             * ПОЛЬЗОВАТЕЛЬ НЕ АВТОРИЗОВАН
                             * ============================================
                             */

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
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-gray-100
                                        "
                                    >
                                        <Star
                                            size={21}
                                            className="text-gray-400"
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
                                            Войдите в аккаунт, чтобы оставить отзыв
                                            о товаре
                                        </p>
                                    </div>

                                </div>

                                <div
                                    className="
                                        mt-6
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-xl
                                        bg-gray-50
                                        px-5
                                        py-4
                                    "
                                >
                                    <p className="text-sm text-gray-600">
                                        Авторизуйтесь, чтобы поделиться своим мнением
                                    </p>

                                    <Link
                                        to="/login"
                                        className="
                                            shrink-0
                                            rounded-xl
                                            bg-gray-900
                                            px-5
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-gray-800
                                        "
                                    >
                                        Войти
                                    </Link>
                                </div>

                            </div>

                        ) : myReview ? (

                            /*
                             * ============================================
                             * У ПОЛЬЗОВАТЕЛЯ УЖЕ ЕСТЬ ОТЗЫВ
                             * ============================================
                             */

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

                                {!editingReview ? (

                                    <>

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

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
                                                        bg-green-50
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
                                                        Ваш отзыв
                                                    </h2>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-gray-500
                                                        "
                                                    >
                                                        Вы уже оставляли отзыв на этот товар
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* RATING */}

                                        <div
                                            className="
                                                mt-6
                                                flex
                                                items-center
                                                gap-1
                                            "
                                        >

                                            {Array.from({
                                                length: 5,
                                            }).map(
                                                (
                                                    _,
                                                    index,
                                                ) => (

                                                    <Star
                                                        key={
                                                            index
                                                        }
                                                        size={25}
                                                        className={
                                                            index <
                                                            myReview.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }
                                                    />

                                                ),
                                            )}

                                        </div>


                                        <div
                                            className="
                                                mt-1
                                                text-sm
                                                font-medium
                                                text-gray-500
                                            "
                                        >
                                            {myReview.rating} из 5
                                        </div>


                                        {/* COMMENT */}

                                        {myReview.comment ? (

                                            <p
                                                className="
                                                    mt-5
                                                    whitespace-pre-line
                                                    leading-7
                                                    text-gray-600
                                                "
                                            >
                                                {
                                                    myReview.comment
                                                }
                                            </p>

                                        ) : (

                                            <p
                                                className="
                                                    mt-5
                                                    text-sm
                                                    italic
                                                    text-gray-400
                                                "
                                            >
                                                Вы оставили только оценку.
                                            </p>

                                        )}


                                        {/* ACTIONS */}

                                        <div
                                            className="
                                                mt-6
                                                flex
                                                gap-3
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={
                                                    handleStartEditReview
                                                }
                                                className="
                                                    flex
                                                    flex-1
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-gray-300
                                                    bg-white
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    font-semibold
                                                    text-gray-700
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >

                                                <Pencil
                                                    size={17}
                                                />

                                                Изменить

                                            </button>


                                            <button
                                                type="button"
                                                onClick={
                                                    handleDeleteReview
                                                }
                                                disabled={
                                                    deletingReview
                                                }
                                                className="
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-red-200
                                                    bg-red-50
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    font-semibold
                                                    text-red-600
                                                    transition
                                                    hover:bg-red-100
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-60
                                                "
                                            >

                                                <Trash2
                                                    size={17}
                                                />

                                                {deletingReview
                                                    ? "Удаление..."
                                                    : "Удалить"
                                                }

                                            </button>

                                        </div>


                                        {editError && (

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
                                                {editError}
                                            </div>

                                        )}

                                    </>

                                ) : (

                                    /*
                                     * ====================================
                                     * РЕДАКТИРОВАНИЕ СВОЕГО ОТЗЫВА
                                     * ====================================
                                     */

                                    <form
                                        onSubmit={
                                            handleUpdateReview
                                        }
                                    >

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

                                                <Pencil
                                                    size={20}
                                                    className="
                                                        text-yellow-500
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
                                                    Изменить отзыв
                                                </h2>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-gray-500
                                                    "
                                                >
                                                    Измените свою оценку или комментарий
                                                </p>

                                            </div>

                                        </div>


                                        {/* RATING */}

                                        <label
                                            className="
                                                mt-6
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

                                            {Array.from({
                                                length: 5,
                                            }).map(
                                                (
                                                    _,
                                                    index,
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
                                                                setEditRating(
                                                                    rating,
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
                                                                    editRating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }
                                                            />

                                                        </button>

                                                    );

                                                },
                                            )}

                                        </div>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-gray-500
                                            "
                                        >
                                            {editRating} из 5
                                        </p>


                                        {/* COMMENT */}

                                        <div
                                            className="
                                                mt-5
                                            "
                                        >

                                            <label
                                                htmlFor="edit-review-comment"
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
                                                id="edit-review-comment"
                                                value={
                                                    editComment
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    setEditComment(
                                                        event.target.value,
                                                    )
                                                }
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
                                                {editComment.length} / 1000
                                            </div>

                                        </div>


                                        {editError && (

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
                                                {editError}
                                            </div>

                                        )}


                                        <div
                                            className="
                                                mt-5
                                                flex
                                                gap-3
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCancelEditReview
                                                }
                                                className="
                                                    flex-1
                                                    rounded-xl
                                                    border
                                                    border-gray-300
                                                    bg-white
                                                    px-5
                                                    py-3
                                                    font-semibold
                                                    text-gray-700
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >
                                                Отмена
                                            </button>


                                            <button
                                                type="submit"
                                                disabled={
                                                    editSubmitting
                                                }
                                                className="
                                                    flex-1
                                                    rounded-xl
                                                    bg-[#FFA500]
                                                    px-5
                                                    py-3
                                                    font-semibold
                                                    text-white
                                                    shadow-sm
                                                    transition
                                                    hover:bg-orange-600
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-60
                                                "
                                            >
                                                {editSubmitting
                                                    ? "Сохранение..."
                                                    : "Сохранить"
                                                }
                                            </button>

                                        </div>

                                    </form>

                                )}

                            </div>

                        ) : (

                            /*
                             * ============================================
                             * ФОРМА НОВОГО ОТЗЫВА
                             * ============================================
                             */

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


                                <form
                                    onSubmit={
                                        handleReviewSubmit
                                    }
                                    className="
                                        mt-6
                                    "
                                >

                                    {/* RATING */}

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

                                        {Array.from({
                                            length: 5,
                                        }).map(
                                            (
                                                _,
                                                index,
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
                                                                rating,
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

                                            },
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
                                                event,
                                            ) =>
                                                setReviewComment(
                                                    event.target.value,
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
                                            {reviewComment.length} / 1000
                                        </div>

                                    </div>


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
                                            {reviewError}
                                        </div>

                                    )}


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
                                            {reviewSuccess}
                                        </div>

                                    )}


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

                        )}

                    </section>


                    {/* ================================================== */}
                    {/* REVIEWS LIST                                       */}
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
                                        {reviewsTotal}{" "}
                                        {
                                            getReviewWord(
                                                reviewsTotal,
                                            )
                                        }{" "}
                                        о товаре
                                    </p>

                                </div>


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
                                        {averageRating.toFixed(1)}
                                    </span>


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


                            {reviewsLoading ? (

                                <div
                                    className="
                                        rounded-xl
                                        bg-gray-50
                                        px-6
                                        py-12
                                        text-center
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Загрузка отзывов...
                                </div>

                            ) : reviews.length > 0 ? (

                                <div
                                    className="
                                        space-y-4
                                    "
                                >

                                    {reviews.map(
                                        (
                                            review,
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

                                                            {Array.from({
                                                                length: 5,
                                                            }).map(
                                                                (
                                                                    _,
                                                                    index,
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

                                                                ),
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

                                        ),
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