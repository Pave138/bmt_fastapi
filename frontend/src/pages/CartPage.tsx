import {
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
    Tag,
    CheckCircle,
    AlertCircle,
    Banknote,
    CreditCard,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useCart,
} from "../context/CartContext";

import {
    formatPrice,
} from "../utils/formatPrice";

import {
    createOrder,
    type PaymentMethod,
} from "../api/orders";


function CartPage() {

    const navigate = useNavigate();


    /*
     * =========================
     * CART
     * =========================
     */

    const {
        cart,
        loading,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        couponLoading,
        couponError,
    } = useCart();


    /*
     * =========================
     * COUPON
     * =========================
     */

    const [
        couponCode,
        setCouponCode,
    ] = useState("");


    const [
        couponSuccess,
        setCouponSuccess,
    ] = useState(false);


    /*
     * =========================
     * PAYMENT
     * =========================
     */

    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState<PaymentMethod>("cash");


    /*
     * =========================
     * ORDER
     * =========================
     */

    const [
        orderLoading,
        setOrderLoading,
    ] = useState(false);


    const [
        orderError,
        setOrderError,
    ] = useState<string | null>(null);


    /*
     * =========================
     * TOTALS
     * =========================
     *
     * Сумма всех товаров
     * без учёта купона.
     */

    const totalBeforeDiscount = cart
        ? cart.items.reduce(
              (
                  total,
                  item,
              ) =>
                  total +
                  Number(
                      item.product.price,
                  ) *
                      item.quantity,
              0,
          )
        : 0;


    /*
     * Итоговая сумма корзины
     *
     * Backend уже возвращает
     * total_price с учётом купона.
     */

    const totalAfterDiscount = cart
        ? Number(cart.total_price)
        : 0;


    /*
     * =========================
     * DISCOUNT
     * =========================
     */

    const discountAmount =
        Math.max(
            0,
            totalBeforeDiscount -
                totalAfterDiscount,
        );


    const hasDiscount =
        Boolean(cart?.coupon) &&
        discountAmount > 0;


    /*
     * =========================
     * COUPON ACTIONS
     * =========================
     */

    const handleApplyCoupon = async () => {

        const code =
            couponCode.trim();


        if (!code) {
            return;
        }


        setCouponSuccess(false);


        try {

            await applyCoupon(code);

            setCouponCode("");

            setCouponSuccess(true);

        } catch {

            setCouponSuccess(false);

        }

    };


    const handleRemoveCoupon = async () => {

        setCouponSuccess(false);

        await removeCoupon();

    };


    /*
     * =========================
     * CREATE ORDER
     * =========================
     */

    const handleCreateOrder = async () => {

        if (
            !cart ||
            cart.items.length === 0
        ) {
            return;
        }


        setOrderError(null);

        setOrderLoading(true);


        try {

            const order =
                await createOrder({
                    payment_method:
                        paymentMethod,
                });


            /*
             * =========================
             * YOOKASSA
             * =========================
             */

            if (
                paymentMethod ===
                    "yookassa" &&
                order.confirmation_url
            ) {

                window.location.href =
                    order.confirmation_url;

                return;
            }


            /*
             * =========================
             * CASH
             * =========================
             */

            navigate(
                `/orders/${order.id}`,
            );

        } catch (error) {

            console.error(
                "Не удалось оформить заказ:",
                error,
            );


            setOrderError(
                "Не удалось оформить заказ. Попробуйте ещё раз.",
            );

        } finally {

            setOrderLoading(false);

        }

    };


    /*
     * =========================
     * LOADING
     * =========================
     */

    if (
        loading &&
        !cart
    ) {

        return (
            <div
                className="
                    flex
                    min-h-[400px]
                    items-center
                    justify-center
                    text-gray-500
                "
            >
                Загрузка корзины...
            </div>
        );

    }


    /*
     * =========================
     * EMPTY CART
     * =========================
     */

    if (
        !cart ||
        cart.items.length === 0
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

                <ShoppingCart
                    size={64}
                    className="
                        text-gray-300
                    "
                />


                <h1
                    className="
                        text-2xl
                        font-bold
                    "
                >
                    Корзина пуста
                </h1>


                <p
                    className="
                        text-gray-500
                    "
                >
                    Добавьте товары, чтобы оформить заказ
                </p>

            </div>
        );

    }


    /*
     * =========================
     * PAGE
     * =========================
     */

    return (

        <div
            className="
                mx-auto
                w-full
                max-w-[1800px]
                px-4
                py-8
                sm:px-6
                lg:px-8
            "
        >

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div
                className="
                    mb-8
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                        "
                    >
                        Корзина
                    </h1>


                    <p
                        className="
                            mt-1
                            text-gray-500
                        "
                    >
                        {cart.total_items} товаров
                    </p>

                </div>


                <button
                    type="button"
                    onClick={clearCart}
                    className="
                        flex
                        w-fit
                        items-center
                        gap-2
                        text-sm
                        text-red-500
                        transition
                        hover:text-red-700
                    "
                >

                    <Trash2 size={17} />

                    Очистить корзину

                </button>

            </div>


            {/* ========================= */}
            {/* CONTENT */}
            {/* ========================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-8
                    lg:grid-cols-[1fr_380px]
                "
            >

                {/* ================================================== */}
                {/* PRODUCTS */}
                {/* ================================================== */}

                <div
                    className="
                        space-y-4
                    "
                >

                    {cart.items.map(
                        (item) => {

                            const itemPrice =
                                Number(
                                    item.product.price,
                                );


                            const itemTotalBeforeDiscount =
                                itemPrice *
                                item.quantity;


                            const itemTotalAfterDiscount =
                                Number(
                                    item.subtotal,
                                );


                            const itemHasDiscount =
                                Boolean(
                                    cart.coupon,
                                ) &&
                                itemTotalBeforeDiscount >
                                    itemTotalAfterDiscount;


                            return (

                                <div
                                    key={
                                        item.product_id
                                    }
                                    className="
                                        flex
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        p-4
                                        sm:gap-5
                                        sm:p-5
                                    "
                                >

                                    {/* ========================= */}
                                    {/* IMAGE */}
                                    {/* ========================= */}

                                    <div
                                        className="
                                            h-24
                                            w-24
                                            shrink-0
                                            overflow-hidden
                                            rounded-xl
                                            bg-gray-100
                                            sm:h-28
                                            sm:w-28
                                        "
                                    >

                                        {item.main_image?.image_url ? (

                                            <img
                                                src={
                                                    item.main_image
                                                        .image_url
                                                }
                                                alt={
                                                    item.product.name
                                                }
                                                className="
                                                    h-full
                                                    w-full
                                                    object-contain
                                                "
                                                loading="lazy"
                                                onError={(
                                                    event,
                                                ) => {

                                                    event.currentTarget.style.display =
                                                        "none";


                                                    const parent =
                                                        event.currentTarget
                                                            .parentElement;


                                                    if (
                                                        parent
                                                    ) {

                                                        parent.classList.add(
                                                            "flex",
                                                            "items-center",
                                                            "justify-center",
                                                        );


                                                        const icon =
                                                            document.createElement(
                                                                "div",
                                                            );


                                                        icon.innerHTML =
                                                            "🛒";


                                                        icon.className =
                                                            "text-2xl";


                                                        parent.appendChild(
                                                            icon,
                                                        );

                                                    }

                                                }}
                                            />

                                        ) : (

                                            <div
                                                className="
                                                    flex
                                                    h-full
                                                    w-full
                                                    items-center
                                                    justify-center
                                                "
                                            >

                                                <ShoppingCart
                                                    size={32}
                                                    className="
                                                        text-gray-300
                                                    "
                                                />

                                            </div>

                                        )}

                                    </div>


                                    {/* ========================= */}
                                    {/* INFO */}
                                    {/* ========================= */}

                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            flex-1
                                            flex-col
                                            justify-between
                                        "
                                    >

                                        <div>

                                            <h2
                                                className="
                                                    line-clamp-2
                                                    font-semibold
                                                    text-gray-900
                                                "
                                            >
                                                {
                                                    item.product.name
                                                }
                                            </h2>


                                            <div
                                                className="
                                                    mt-1
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    gap-2
                                                "
                                            >

                                                {itemHasDiscount && (

                                                    <span
                                                        className="
                                                            text-sm
                                                            text-gray-400
                                                            line-through
                                                        "
                                                    >
                                                        {formatPrice(
                                                            String(
                                                                itemTotalBeforeDiscount,
                                                            ),
                                                        )}{" "}
                                                        ₽
                                                    </span>

                                                )}


                                                <span
                                                    className={`
                                                        text-sm
                                                        ${
                                                            itemHasDiscount
                                                                ? "font-semibold text-green-600"
                                                                : "text-gray-500"
                                                        }
                                                    `}
                                                >
                                                    {formatPrice(
                                                        String(
                                                            itemTotalAfterDiscount /
                                                                item.quantity,
                                                        ),
                                                    )}{" "}
                                                    ₽ / шт.
                                                </span>

                                            </div>

                                        </div>


                                        {/* ========================= */}
                                        {/* QUANTITY + SUBTOTAL */}
                                        {/* ========================= */}

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                flex-col
                                                gap-4
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >

                                            {/* QUANTITY */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    disabled={
                                                        item.quantity <=
                                                        1
                                                    }
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product_id,
                                                            item.quantity -
                                                                1,
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        transition
                                                        hover:bg-gray-100
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-40
                                                    "
                                                >

                                                    <Minus
                                                        size={16}
                                                    />

                                                </button>


                                                <span
                                                    className="
                                                        min-w-[24px]
                                                        text-center
                                                        font-semibold
                                                    "
                                                >
                                                    {
                                                        item.quantity
                                                    }
                                                </span>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product_id,
                                                            item.quantity +
                                                                1,
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        border
                                                        transition
                                                        hover:bg-gray-100
                                                    "
                                                >

                                                    <Plus
                                                        size={16}
                                                    />

                                                </button>

                                            </div>


                                            {/* SUBTOTAL */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-5
                                                    sm:justify-end
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >

                                                    {itemHasDiscount && (

                                                        <span
                                                            className="
                                                                text-sm
                                                                text-gray-400
                                                                line-through
                                                            "
                                                        >
                                                            {formatPrice(
                                                                String(
                                                                    itemTotalBeforeDiscount,
                                                                ),
                                                            )}{" "}
                                                            ₽
                                                        </span>

                                                    )}


                                                    <span
                                                        className="
                                                            text-lg
                                                            font-bold
                                                            text-gray-900
                                                        "
                                                    >
                                                        {formatPrice(
                                                            String(
                                                                itemTotalAfterDiscount,
                                                            ),
                                                        )}{" "}
                                                        ₽
                                                    </span>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            item.product_id,
                                                        )
                                                    }
                                                    className="
                                                        text-gray-400
                                                        transition
                                                        hover:text-red-500
                                                    "
                                                >

                                                    <Trash2
                                                        size={18}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        },
                    )}

                </div>


                {/* ================================================== */}
                {/* SUMMARY */}
                {/* ================================================== */}

                <div
                    className="
                        h-fit
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        lg:sticky
                        lg:top-6
                    "
                >

                    <h2
                        className="
                            mb-6
                            text-xl
                            font-bold
                        "
                    >
                        Итого
                    </h2>


                    {/* ================================================== */}
                    {/* COUPON */}
                    {/* ================================================== */}

                    <div
                        className="
                            mb-6
                        "
                    >

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                            "
                        >
                            Промокод
                        </label>


                        {!cart.coupon ? (

                            <>

                                <div
                                    className="
                                        flex
                                        gap-2
                                    "
                                >

                                    <div
                                        className="
                                            relative
                                            flex-1
                                        "
                                    >

                                        <Tag
                                            size={17}
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-gray-400
                                            "
                                        />


                                        <input
                                            type="text"
                                            value={
                                                couponCode
                                            }
                                            onChange={(
                                                event,
                                            ) => {

                                                setCouponCode(
                                                    event
                                                        .target
                                                        .value,
                                                );

                                                setCouponSuccess(
                                                    false,
                                                );

                                            }}
                                            onKeyDown={(
                                                event,
                                            ) => {

                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {

                                                    handleApplyCoupon();

                                                }

                                            }}
                                            placeholder="Введите промокод"
                                            disabled={
                                                couponLoading
                                            }
                                            className="
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                border-gray-300
                                                pl-10
                                                pr-3
                                                text-sm
                                                uppercase
                                                outline-none
                                                transition
                                                focus:border-[#FFA500]
                                                focus:ring-2
                                                focus:ring-orange-100
                                                disabled:bg-gray-100
                                            "
                                        />

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleApplyCoupon
                                        }
                                        disabled={
                                            couponLoading ||
                                            !couponCode.trim()
                                        }
                                        className="
                                            h-11
                                            rounded-xl
                                            bg-gray-900
                                            px-4
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-gray-800
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {couponLoading
                                            ? "..."
                                            : "Применить"
                                        }

                                    </button>

                                </div>


                                {/* SUCCESS */}

                                {couponSuccess && (

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-green-200
                                            bg-green-50
                                            px-3
                                            py-2.5
                                            text-sm
                                            text-green-700
                                        "
                                    >

                                        <CheckCircle
                                            size={17}
                                            className="
                                                shrink-0
                                                text-green-600
                                            "
                                        />

                                        <span>
                                            Купон успешно применён
                                        </span>

                                    </div>

                                )}


                                {/* ERROR */}

                                {couponError && (

                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-red-200
                                            bg-red-50
                                            px-3
                                            py-2.5
                                            text-sm
                                            text-red-700
                                        "
                                    >

                                        <AlertCircle
                                            size={17}
                                            className="
                                                shrink-0
                                                text-red-600
                                            "
                                        />

                                        <span>
                                            {
                                                couponError
                                            }
                                        </span>

                                    </div>

                                )}

                            </>

                        ) : (

                            /* APPLIED COUPON */

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-green-200
                                    bg-green-50
                                    px-4
                                    py-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <Tag
                                        size={17}
                                        className="
                                            text-green-600
                                        "
                                    />


                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                text-green-700
                                            "
                                        >
                                            {
                                                cart
                                                    .coupon
                                                    .code
                                            }
                                        </p>


                                        <p
                                            className="
                                                text-xs
                                                text-green-600
                                            "
                                        >
                                            Купон применён
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleRemoveCoupon
                                    }
                                    disabled={
                                        couponLoading
                                    }
                                    className="
                                        text-sm
                                        font-medium
                                        text-red-500
                                        transition
                                        hover:text-red-700
                                        disabled:opacity-50
                                    "
                                >

                                    {couponLoading
                                        ? "..."
                                        : "Удалить"
                                    }

                                </button>

                            </div>

                        )}

                    </div>


                    {/* ================================================== */}
                    {/* PAYMENT METHOD */}
                    {/* ================================================== */}

                    <div
                        className="
                            mb-6
                        "
                    >

                        <h3
                            className="
                                mb-3
                                text-sm
                                font-semibold
                                text-gray-900
                            "
                        >
                            Способ оплаты
                        </h3>


                        <div
                            className="
                                space-y-3
                            "
                        >

                            {/* CASH */}

                            <button
                                type="button"
                                onClick={() =>
                                    setPaymentMethod(
                                        "cash",
                                    )
                                }
                                className={`
                                    w-full
                                    rounded-xl
                                    border
                                    p-4
                                    text-left
                                    transition

                                    ${
                                        paymentMethod ===
                                        "cash"
                                            ? `
                                                border-[#FFA500]
                                                bg-orange-50
                                                ring-2
                                                ring-orange-100
                                            `
                                            : `
                                                border-gray-200
                                                bg-white
                                                hover:border-gray-300
                                            `
                                    }
                                `}
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className={`
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg

                                            ${
                                                paymentMethod ===
                                                "cash"
                                                    ? "bg-orange-100"
                                                    : "bg-gray-100"
                                            }
                                        `}
                                    >

                                        <Banknote
                                            size={21}
                                            className={
                                                paymentMethod ===
                                                "cash"
                                                    ? "text-orange-600"
                                                    : "text-gray-500"
                                            }
                                        />

                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        <p
                                            className="
                                                font-semibold
                                                text-gray-900
                                            "
                                        >
                                            Наличными
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-gray-500
                                            "
                                        >
                                            Оплата при получении
                                        </p>

                                    </div>


                                    <div
                                        className={`
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border-2

                                            ${
                                                paymentMethod ===
                                                "cash"
                                                    ? "border-[#FFA500]"
                                                    : "border-gray-300"
                                            }
                                        `}
                                    >

                                        {paymentMethod ===
                                            "cash" && (

                                            <div
                                                className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-[#FFA500]
                                                "
                                            />

                                        )}

                                    </div>

                                </div>

                            </button>


                            {/* YOOKASSA */}

                            <button
                                type="button"
                                onClick={() =>
                                    setPaymentMethod(
                                        "yookassa",
                                    )
                                }
                                className={`
                                    w-full
                                    rounded-xl
                                    border
                                    p-4
                                    text-left
                                    transition

                                    ${
                                        paymentMethod ===
                                        "yookassa"
                                            ? `
                                                border-[#FFA500]
                                                bg-orange-50
                                                ring-2
                                                ring-orange-100
                                            `
                                            : `
                                                border-gray-200
                                                bg-white
                                                hover:border-gray-300
                                            `
                                    }
                                `}
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className={`
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg

                                            ${
                                                paymentMethod ===
                                                "yookassa"
                                                    ? "bg-orange-100"
                                                    : "bg-gray-100"
                                            }
                                        `}
                                    >

                                        <CreditCard
                                            size={21}
                                            className={
                                                paymentMethod ===
                                                "yookassa"
                                                    ? "text-orange-600"
                                                    : "text-gray-500"
                                            }
                                        />

                                    </div>


                                    <div
                                        className="
                                            min-w-0
                                            flex-1
                                        "
                                    >

                                        <p
                                            className="
                                                font-semibold
                                                text-gray-900
                                            "
                                        >
                                            ЮKassa
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-gray-500
                                            "
                                        >
                                            Банковская карта или другой способ оплаты
                                        </p>

                                    </div>


                                    <div
                                        className={`
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border-2

                                            ${
                                                paymentMethod ===
                                                "yookassa"
                                                    ? "border-[#FFA500]"
                                                    : "border-gray-300"
                                            }
                                        `}
                                    >

                                        {paymentMethod ===
                                            "yookassa" && (

                                            <div
                                                className="
                                                    h-2.5
                                                    w-2.5
                                                    rounded-full
                                                    bg-[#FFA500]
                                                "
                                            />

                                        )}

                                    </div>

                                </div>

                            </button>

                        </div>

                    </div>


                    {/* ================================================== */}
                    {/* TOTALS */}
                    {/* ================================================== */}

                    <div
                        className="
                            space-y-3
                        "
                    >

                        {/* TOTAL BEFORE / AFTER DISCOUNT */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                text-gray-600
                            "
                        >

                            <span>
                                Товары
                            </span>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
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
                                            String(
                                                totalBeforeDiscount,
                                            ),
                                        )}{" "}
                                        ₽
                                    </span>

                                )}


                                <span
                                    className="
                                        font-medium
                                        text-gray-900
                                    "
                                >
                                    {formatPrice(
                                        String(
                                            totalAfterDiscount,
                                        ),
                                    )}{" "}
                                    ₽
                                </span>

                            </div>

                        </div>


                        {/* DISCOUNT */}

                        {hasDiscount && cart.coupon && (

                            <div
                                className="
                                    flex
                                    justify-between
                                    text-green-600
                                "
                            >

                                <span>
                                    Скидка (
                                    {
                                        cart
                                            .coupon
                                            .value
                                    }
                                    {
                                        cart
                                            .coupon
                                            .discount_type ===
                                        "percent"
                                            ? "%"
                                            : " ₽"
                                    }
                                    )
                                </span>


                                <span>
                                    -{" "}
                                    {formatPrice(
                                        String(
                                            discountAmount,
                                        ),
                                    )}{" "}
                                    ₽
                                </span>

                            </div>

                        )}


                        <div
                            className="
                                my-4
                                border-t
                                border-gray-200
                            "
                        />


                        {/* FINAL TOTAL */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >

                            <span
                                className="
                                    text-lg
                                    font-semibold
                                "
                            >
                                К оплате
                            </span>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                {hasDiscount && (

                                    <span
                                        className="
                                            text-base
                                            text-gray-400
                                            line-through
                                        "
                                    >
                                        {formatPrice(
                                            String(
                                                totalBeforeDiscount,
                                            ),
                                        )}{" "}
                                        ₽
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
                                        String(
                                            totalAfterDiscount,
                                        ),
                                    )}{" "}
                                    ₽
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ================================================== */}
                    {/* ORDER ERROR */}
                    {/* ================================================== */}

                    {orderError && (

                        <div
                            className="
                                mt-4
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                            "
                        >
                            {orderError}
                        </div>

                    )}


                    {/* ================================================== */}
                    {/* CREATE ORDER */}
                    {/* ================================================== */}

                    <button
                        type="button"
                        onClick={
                            handleCreateOrder
                        }
                        disabled={
                            orderLoading
                        }
                        className="
                            mt-6
                            w-full
                            rounded-xl
                            bg-[#FFA500]
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-orange-600
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {orderLoading
                            ? "Оформление..."
                            : paymentMethod ===
                              "yookassa"
                                ? "Перейти к оплате"
                                : "Оформить заказ"
                        }

                    </button>

                </div>

            </div>

        </div>

    );
}


export default CartPage;