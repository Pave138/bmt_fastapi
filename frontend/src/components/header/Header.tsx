import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    Heart,
    Package,
    ShoppingCart,
    User,
} from "lucide-react";

import Logo from "../Logo";
import Search from "./Search";
import CartButton from "./CartButton";
import CatalogMenu from "../catalog/CatalogMenu";

import { useAuth } from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";


function Header() {

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const {
        categories,
    } = useCategories();

    const navigate = useNavigate();


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

                {/* LOGO */}

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


                {/* CATALOG */}

                <div
                    className="
                        hidden
                        shrink-0
                        lg:block
                    "
                >

                    <CatalogMenu
                        categories={categories}
                        onSelect={handleCategorySelect}
                    />

                </div>


                {/* SEARCH */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <Search />

                </div>


                {/* ACTIONS */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                    "
                >

                    {/* ACCOUNT */}

                    {isAuthenticated && user ? (

                        <Link
                            to="/profile"
                            className="
                                hidden
                                min-w-[80px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                sm:flex
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

                    ) : (

                        <Link
                            to="/login"
                            className="
                                flex
                                min-w-[70px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
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


                    {/* ORDERS */}

                    {isAuthenticated && (

                        <Link
                            to="/orders"
                            className="
                                hidden
                                min-w-[70px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
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


                    {/* FAVORITES */}

                    {isAuthenticated && (

                        <Link
                            to="/favorites"
                            className="
                                hidden
                                min-w-[70px]
                                flex-col
                                items-center
                                justify-center
                                rounded-xl
                                px-3
                                py-2
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                sm:flex
                            "
                        >

                            <Heart
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
                                Избранное
                            </span>

                        </Link>

                    )}


                    {/* CART */}

                    <div
                        className="
                            flex
                            min-w-[70px]
                            items-center
                            justify-center
                        "
                    >

                        <CartButton />

                    </div>

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


                    {isAuthenticated && (

                        <button
                            type="button"
                            onClick={logout}
                            className="
                                ml-auto
                                whitespace-nowrap
                                text-sm
                                font-medium
                                text-gray-500
                                transition
                                hover:text-red-500
                            "
                        >
                            Выйти
                        </button>

                    )}

                </div>

            </div>

        </header>
    );
}


export default Header;