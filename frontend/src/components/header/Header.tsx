import { Link } from "react-router-dom";

import Logo from "../Logo";
import Search from "./Search";
import CartButton from "./CartButton.tsx";

import { useAuth } from "../../hooks/useAuth";

function Header() {
    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    return (
        <header className="border-b border-gray-200 bg-white">
            <div
                className="
                    mx-auto
                    flex
                    min-h-20
                    w-full
                    max-w-[1800px]
                    items-center
                    gap-6
                    px-6
                    lg:px-8
                "
            >
                {/* Логотип */}

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


                {/* Поиск */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-1
                        justify-center
                    "
                >
                    <Search />
                </div>


                {/* Навигация */}

                <nav
                    className="
                        hidden
                        shrink-0
                        items-center
                        gap-5
                        xl:flex
                    "
                >
                    <Link
                        to="/"
                        className="
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-orange-500
                        "
                    >
                        Каталог
                    </Link>

                    <Link
                        to="/promotions"
                        className="
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-orange-500
                        "
                    >
                        Акции
                    </Link>

                    <Link
                        to="/contacts"
                        className="
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:text-orange-500
                        "
                    >
                        Контакты
                    </Link>
                </nav>


                {/* Авторизация + корзина */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                    "
                >
                    {isAuthenticated && user ? (
                        <>
                            {/* Профиль */}

                            <Link
                                to="/profile"
                                className="
                                    hidden
                                    rounded-lg
                                    border
                                    border-gray-200
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition

                                    hover:border-orange-400
                                    hover:text-orange-500

                                    sm:block
                                "
                            >
                                {user.username}
                            </Link>


                            {/* Выход */}

                            <button
                                type="button"
                                onClick={logout}
                                className="
                                    hidden
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-500
                                    transition

                                    hover:bg-red-50
                                    hover:text-red-500

                                    lg:block
                                "
                            >
                                Выйти
                            </button>


                            {/* Корзина */}

                            <CartButton />
                        </>
                    ) : (
                        <>
                            {/* Вход */}

                            <Link
                                to="/login"
                                className="
                                    rounded-lg
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition

                                    hover:bg-gray-100
                                    hover:text-orange-500
                                "
                            >
                                Войти
                            </Link>


                            {/* Регистрация */}

                            <Link
                                to="/register"
                                className="
                                    hidden
                                    rounded-lg
                                    bg-orange-500
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition

                                    hover:bg-orange-600
                                    hover:shadow

                                    sm:block
                                "
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
