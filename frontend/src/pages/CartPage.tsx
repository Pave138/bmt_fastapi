import {
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
    Tag,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useCart,
} from "../context/CartContext";

import {
    formatPrice,
} from "../utils/formatPrice";


function CartPage() {

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


    const [
        couponCode,
        setCouponCode,
    ] = useState("");


    const [
        couponSuccess,
        setCouponSuccess,
    ] = useState(false);


    const handleApplyCoupon = async () => {

        const code = couponCode.trim();


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


    if (loading && !cart) {

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


    if (!cart || cart.items.length === 0) {

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
                    className="text-gray-300"
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

            <div
                className="
                    mb-8
                    flex
                    items-center
                    justify-between
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


            <div
                className="
                    grid
                    grid-cols-1
                    gap-8
                    lg:grid-cols-[1fr_380px]
                "
            >

                {/* ТОВАРЫ */}

                <div
                    className="
                        space-y-4
                    "
                >

                    {cart.items.map(
                        (item) => (

                            <div
                                key={item.product_id}
                                className="
                                    flex
                                    gap-5
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white
                                    p-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-28
                                        w-28
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-gray-100
                                    "
                                >

                                    <ShoppingCart
                                        size={32}
                                        className="
                                            text-gray-300
                                        "
                                    />

                                </div>


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
                                            "
                                        >
                                            {item.product.name}
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-gray-500
                                            "
                                        >
                                            {formatPrice(
                                                item.product.price
                                            )} ₽ / шт.
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

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
                                                    item.quantity <= 1
                                                }
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product_id,
                                                        item.quantity - 1
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

                                                <Minus size={16} />

                                            </button>


                                            <span
                                                className="
                                                    min-w-[24px]
                                                    text-center
                                                    font-semibold
                                                "
                                            >
                                                {item.quantity}
                                            </span>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product_id,
                                                        item.quantity + 1
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

                                                <Plus size={16} />

                                            </button>

                                        </div>


                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-5
                                            "
                                        >

                                            <span
                                                className="
                                                    text-lg
                                                    font-bold
                                                "
                                            >
                                                {formatPrice(
                                                    item.subtotal
                                                )} ₽
                                            </span>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(
                                                        item.product_id
                                                    )
                                                }
                                                className="
                                                    text-gray-400
                                                    transition
                                                    hover:text-red-500
                                                "
                                            >

                                                <Trash2 size={18} />

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* ИТОГО */}

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


                    {/* ПРОМОКОД */}

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
                                            value={couponCode}
                                            onChange={(event) => {

                                                setCouponCode(
                                                    event.target.value
                                                );

                                                setCouponSuccess(false);

                                            }}
                                            onKeyDown={(event) => {

                                                if (
                                                    event.key === "Enter"
                                                ) {

                                                    handleApplyCoupon();

                                                }

                                            }}
                                            placeholder="Введите промокод"
                                            disabled={couponLoading}
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
                                        onClick={handleApplyCoupon}
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


                                {/* СТАТУС КУПОНА */}

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
                                            {couponError}
                                        </span>

                                    </div>

                                )}

                            </>

                        ) : (

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
                                            {cart.coupon.code}
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
                                    onClick={handleRemoveCoupon}
                                    disabled={couponLoading}
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


                    {/* СУММА */}

                    <div
                        className="
                            space-y-3
                        "
                    >

                        <div
                            className="
                                flex
                                justify-between
                                text-gray-600
                            "
                        >

                            <span>
                                Товары
                            </span>

                            <span>
                                {formatPrice(
                                    cart.total_price
                                )} ₽
                            </span>

                        </div>


                        {cart.coupon && (

                            <div
                                className="
                                    flex
                                    justify-between
                                    text-green-600
                                "
                            >

                                <span>
                                    Скидка
                                </span>

                                <span>
                                    -{cart.coupon.value}
                                    {cart.coupon.discount_type === "percent"
                                        ? "%"
                                        : " ₽"
                                    }
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


                        <div
                            className="
                                flex
                                items-center
                                justify-between
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

                            <span
                                className="
                                    text-2xl
                                    font-bold
                                    text-[#FFA500]
                                "
                            >
                                {formatPrice(
                                    cart.total_price
                                )} ₽
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
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
                        "
                    >
                        Оформить заказ
                    </button>

                </div>

            </div>

        </div>

    );

}


export default CartPage;
