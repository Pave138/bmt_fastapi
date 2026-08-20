import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Heart,
    LogOut,
    Package,
    ShoppingCart,
    User,
} from "lucide-react";

import Logo from "../Logo";
import Search from "./Search";
import CatalogMenu from "../catalog/CatalogMenu";

import { useAuth } from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";
import { useCart } from "../../hooks/useCart";
import { useFavorites } from "../../hooks/useFavorites";


function Header() {

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();


    const {
        categories,
    } = useCategories();


    const {
        cart,
    } = useCart();


    const {
        total: favoritesCount,
    } = useFavorites();


    const navigate =
        useNavigate();


    /*
     * =========================
     * CART COUNT
     * =========================
     */

    const cartItemsCount =
        cart?.items?.reduce(
            (
                total,
                item,
            ) =>
                total + item.quantity,
            0,
        ) ?? 0;


    /*
     * =========================
     * CATEGORY NAVIGATION
     * =========================
     */

    function handleCategorySelect(
        categorySlug: string | null,
    ) {

        if (categorySlug === null) {

            navigate("/");

            return;
        }


        navigate(
            `/?category=${categorySlug}`,
        );
    }


    return (
        <header
            className="
                sticky
                top-0
                z-50
                border-b
                border-gray-200
                bg-white
            "
        >

            {/* =========================================
                MAIN HEADER
                ========================================= */}

            <div
                className="
                    mx-auto
                    flex
                    h-[72px]
                    w-full
                    max-w-[1800px]
                    items-center
                    gap-4
                    px-6
                    lg:px-8
                "
            >

                {/* =================================
                    LOGO
                    ================================= */}

                <Link
                    to="/"
                    className="
                        shrink-0
                        transition
                        hover:opacity-80
                    "
                >
                    <Logo />
                </Link>


                {/* =================================
                    CATALOG
                    ================================= */}

                <div
                    className="
                        hidden
                        shrink-0
                        lg:block
                    "
                >

                    <CatalogMenu
                        categories={
                            categories
                        }
                        onSelect={
                            handleCategorySelect
                        }
                    />

                </div>


                {/* =================================
                    SEARCH
                    ================================= */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <Search />

                </div>


                {/* =================================
                    ACTIONS
                    ================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                    "
                >

                    {/* =================================
                        ACCOUNT
                        ================================= */}

                    {isAuthenticated && user ? (

                        <div
                            className="
                                group
                                relative
                            "
                        >

                            <Link
                                to="/profile"
                                className="
                                    flex
                                    min-w-[100px]
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    px-3
                                    py-2
                                    text-gray-700
                                    transition
                                    hover:bg-gray-100
                                    hover:text-orange-500
                                "
                            >

                                <User
                                    size={22}
                                    strokeWidth={1.8}
                                />

                                <span
                                    className="
                                        mt-1
                                        max-w-[90px]
                                        truncate
                                        text-xs
                                        font-medium
                                    "
                                >
                                    {user.username}
                                </span>

                            </Link>


                            {/* =================================
                                USER DROPDOWN
                                ================================= */}

                            <div
                                className="
                                    invisible
                                    absolute
                                    left-1/2
                                    top-full
                                    z-50
                                    mt-2
                                    w-52
                                    -translate-x-1/2
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    p-2
                                    opacity-0
                                    shadow-lg
                                    transition-all
                                    duration-150
                                    group-hover:visible
                                    group-hover:opacity-100
                                "
                            >

                                {/* PROFILE */}

                                <Link
                                    to="/profile"
                                    className="
                                        flex
                                        items-center
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        transition
                                        hover:bg-gray-100
                                        hover:text-orange-500
                                    "
                                >

                                    <User
                                        size={18}
                                        strokeWidth={1.8}
                                        className="mr-3"
                                    />

                                    Профиль

                                </Link>


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        transition
                                        hover:bg-red-50
                                        hover:text-red-500
                                    "
                                >

                                    <LogOut
                                        size={18}
                                        strokeWidth={1.8}
                                        className="mr-3"
                                    />

                                    Выйти

                                </button>

                            </div>

                        </div>

                    ) : (

                        <Link
                            to="/login"
                            className="
                                flex
                                min-w-[100px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                hover:text-orange-500
                            "
                        >

                            <User
                                size={22}
                                strokeWidth={1.8}
                            />

                            <span
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                "
                            >
                                Войти
                            </span>

                        </Link>

                    )}


                    {/* =================================
                        ORDERS
                        ================================= */}

                    {isAuthenticated && (

                        <Link
                            to="/orders"
                            className="
                                relative
                                hidden
                                min-w-[100px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                hover:text-orange-500
                                xl:flex
                            "
                        >

                            <Package
                                size={22}
                                strokeWidth={1.8}
                            />

                            <span
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                "
                            >
                                Заказы
                            </span>

                        </Link>

                    )}


                    {/* =================================
                        FAVORITES
                        ================================= */}

                    {isAuthenticated && (

                        <Link
                            to="/favorites"
                            className="
                                relative
                                hidden
                                min-w-[100px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                hover:text-orange-500
                                sm:flex
                            "
                        >

                            <div
                                className="
                                    relative
                                "
                            >

                                <Heart
                                    size={22}
                                    strokeWidth={1.8}
                                />


                                {/* =================================
                                    FAVORITES COUNTER
                                    ================================= */}

                                {favoritesCount > 0 && (

                                    <span
                                        className="
                                            absolute
                                            -right-2
                                            -top-2
                                            flex
                                            min-h-4
                                            min-w-4
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-orange-500
                                            px-1
                                            text-[10px]
                                            font-semibold
                                            leading-none
                                            text-white
                                        "
                                    >
                                        {favoritesCount > 99
                                            ? "99+"
                                            : favoritesCount}
                                    </span>

                                )}

                            </div>


                            <span
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                "
                            >
                                Избранное
                            </span>

                        </Link>

                    )}


                    {/* =================================
                        CART / REGISTRATION
                        ================================= */}

                    {isAuthenticated ? (

                        <Link
                            to="/cart"
                            className="
                                relative
                                flex
                                min-w-[100px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                hover:text-orange-500
                            "
                        >

                            <div
                                className="
                                    relative
                                "
                            >

                                <ShoppingCart
                                    size={22}
                                    strokeWidth={1.8}
                                />


                                {/* =================================
                                    CART COUNTER
                                    ================================= */}

                                {cartItemsCount > 0 && (

                                    <span
                                        className="
                                            absolute
                                            -right-2
                                            -top-2
                                            flex
                                            min-h-4
                                            min-w-4
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-orange-500
                                            px-1
                                            text-[10px]
                                            font-semibold
                                            leading-none
                                            text-white
                                        "
                                    >
                                        {cartItemsCount > 99
                                            ? "99+"
                                            : cartItemsCount}
                                    </span>

                                )}

                            </div>


                            <span
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                "
                            >
                                Корзина
                            </span>

                        </Link>

                    ) : (

                        <Link
                            to="/register"
                            className="
                                flex
                                min-w-[100px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                hover:text-orange-500
                            "
                        >

                            <User
                                size={22}
                                strokeWidth={1.8}
                            />

                            <span
                                className="
                                    mt-1
                                    text-xs
                                    font-medium
                                "
                            >
                                Регистрация
                            </span>

                        </Link>

                    )}

                </div>

            </div>


            {/* =========================================
                SECONDARY NAVIGATION
                ========================================= */}

            <div
                className="
                    border-t
                    border-gray-100
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-11
                        w-full
                        max-w-[1800px]
                        items-center
                        gap-6
                        overflow-x-auto
                        px-6
                        lg:px-8
                    "
                >

                    {/* =================================
                        ALL PRODUCTS
                        ================================= */}

                    <Link
                        to="/"
                        className="
                            whitespace-nowrap
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-orange-500
                        "
                    >
                        Все товары
                    </Link>


                    {/* =================================
                        PROMOTIONS
                        ================================= */}

                    <Link
                        to="/promotions"
                        className="
                            whitespace-nowrap
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-orange-500
                        "
                    >
                        Акции
                    </Link>


                    {/* =================================
                        FAVORITES
                        ================================= */}

                    {isAuthenticated && (

                        <Link
                            to="/favorites"
                            className="
                                whitespace-nowrap
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:text-orange-500
                            "
                        >
                            Избранное
                        </Link>

                    )}


                    {/* =================================
                        ORDERS
                        ================================= */}

                    {isAuthenticated && (

                        <Link
                            to="/orders"
                            className="
                                whitespace-nowrap
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:text-orange-500
                            "
                        >
                            Заказы
                        </Link>

                    )}


                    {/* =================================
                        CONTACTS
                        ================================= */}

                    <Link
                        to="/contacts"
                        className="
                            whitespace-nowrap
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-orange-500
                        "
                    >
                        Контакты
                    </Link>

                </div>

            </div>

        </header>
    );
}


export default Header;