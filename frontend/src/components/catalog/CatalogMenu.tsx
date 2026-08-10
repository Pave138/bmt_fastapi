import {
    useEffect,
    useRef,
    useState,
} from "react";


interface Category {
    id: number;
    name: string;
    children?: Category[];
}


interface CatalogMenuProps {
    categories: Category[];

    onSelect: (
        categoryId: number | null,
    ) => void;
}


export default function CatalogMenu({
    categories,
    onSelect,
}: CatalogMenuProps) {

    /*
     * =========================
     * STATE
     * =========================
     */

    const [
        isOpen,
        setIsOpen,
    ] = useState(false);


    const [
        activeCategory,
        setActiveCategory,
    ] = useState<Category | null>(
        categories[0] ?? null,
    );


    const menuRef =
        useRef<HTMLDivElement | null>(
            null,
        );


    const closeTimeoutRef =
        useRef<ReturnType<
            typeof setTimeout
        > | null>(null);


    /*
     * =========================
     * ACTIVE CATEGORY
     * =========================
     */

    useEffect(() => {

        if (
            categories.length > 0 &&
            !activeCategory
        ) {

            setActiveCategory(
                categories[0],
            );

        }

    }, [
        categories,
        activeCategory,
    ]);


    /*
     * Если список категорий
     * обновился и текущая категория
     * больше не существует —
     * выбираем первую.
     */

    useEffect(() => {

        if (
            activeCategory &&
            !categories.some(
                (category) =>
                    category.id ===
                    activeCategory.id,
            )
        ) {

            setActiveCategory(
                categories[0] ?? null,
            );

        }

    }, [
        categories,
        activeCategory,
    ]);


    /*
     * =========================
     * OUTSIDE CLICK
     * =========================
     */

    useEffect(() => {

        function handleClickOutside(
            event: MouseEvent,
        ) {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node,
                )
            ) {

                setIsOpen(false);

            }

        }


        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );

        };

    }, []);


    /*
     * =========================
     * ESC
     * =========================
     */

    useEffect(() => {

        function handleKeyDown(
            event: KeyboardEvent,
        ) {

            if (
                event.key === "Escape"
            ) {

                setIsOpen(false);

            }

        }


        document.addEventListener(
            "keydown",
            handleKeyDown,
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

        };

    }, []);


    /*
     * =========================
     * OPEN
     * =========================
     */

    function openMenu() {

        if (
            closeTimeoutRef.current
        ) {

            clearTimeout(
                closeTimeoutRef.current,
            );

            closeTimeoutRef.current =
                null;

        }


        setIsOpen(true);

    }


    /*
     * =========================
     * CLOSE
     * =========================
     */

    function scheduleClose() {

        if (
            closeTimeoutRef.current
        ) {

            clearTimeout(
                closeTimeoutRef.current,
            );

        }


        closeTimeoutRef.current =
            setTimeout(() => {

                setIsOpen(false);

            }, 200);

    }


    function cancelClose() {

        if (
            closeTimeoutRef.current
        ) {

            clearTimeout(
                closeTimeoutRef.current,
            );

            closeTimeoutRef.current =
                null;

        }

    }


    /*
     * =========================
     * SELECT CATEGORY
     * =========================
     */

    function handleSelect(
        categoryId: number | null,
    ) {

        setIsOpen(false);

        onSelect(categoryId);

    }


    /*
     * =========================
     * SUBCATEGORIES
     * =========================
     */

    const children =
        activeCategory?.children ?? [];


    /*
     * =========================
     * RENDER
     * =========================
     */

    return (
        <div
            ref={menuRef}
            className="relative"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
        >

            {/* =================================
                CATALOG BUTTON
                ================================= */}

            <button
                type="button"
                onClick={() =>
                    setIsOpen(
                        (value) => !value,
                    )
                }
                onMouseEnter={openMenu}
                aria-expanded={isOpen}
                className={`
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-xl
                    px-4
                    text-sm
                    font-semibold
                    transition
                    ${
                        isOpen
                            ? "bg-gray-900 text-white"
                            : "bg-gray-800 text-white hover:bg-gray-900"
                    }
                `}
            >

                {/* Hamburger */}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                >

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                    />

                </svg>


                <span>
                    Каталог
                </span>


                {/* Arrow */}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`
                        h-4
                        w-4
                        transition-transform
                        ${
                            isOpen
                                ? "rotate-180"
                                : ""
                        }
                    `}
                >

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                    />

                </svg>

            </button>


            {/* =================================
                DROPDOWN
                ================================= */}

            {isOpen && (

                <div
                    className="
                        absolute
                        left-0
                        top-full
                        z-50
                        w-[760px]
                        pt-2
                    "
                >

                    <div
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            shadow-2xl
                        "
                    >

                        <div
                            className="
                                grid
                                min-h-[420px]
                                grid-cols-[280px_1fr]
                            "
                        >

                            {/* =================================
                                LEFT — MAIN CATEGORIES
                                ================================= */}

                            <div
                                className="
                                    max-h-[520px]
                                    overflow-y-auto
                                    border-r
                                    border-gray-100
                                    p-3
                                "
                            >

                                <div
                                    className="
                                        mb-2
                                        px-3
                                        py-2
                                    "
                                >

                                    <span
                                        className="
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-gray-400
                                        "
                                    >
                                        Категории
                                    </span>

                                </div>


                                {categories.map(
                                    (
                                        category,
                                    ) => {

                                        const isActive =
                                            activeCategory?.id ===
                                            category.id;


                                        const hasChildren =
                                            (
                                                category
                                                    .children
                                                    ?.length ??
                                                0
                                            ) > 0;


                                        return (

                                            <button
                                                key={
                                                    category.id
                                                }
                                                type="button"
                                                onMouseEnter={() =>
                                                    setActiveCategory(
                                                        category,
                                                    )
                                                }
                                                onClick={() =>
                                                    handleSelect(
                                                        category.id,
                                                    )
                                                }
                                                className={`
                                                    group
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                    rounded-lg
                                                    px-3
                                                    py-2.5
                                                    text-left
                                                    text-sm
                                                    transition
                                                    ${
                                                        isActive
                                                            ? "bg-gray-100 font-semibold text-gray-900"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    }
                                                `}
                                            >

                                                <span
                                                    className="
                                                        line-clamp-2
                                                    "
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </span>


                                                {hasChildren && (

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className={`
                                                            h-4
                                                            w-4
                                                            shrink-0
                                                            transition
                                                            ${
                                                                isActive
                                                                    ? "text-gray-900"
                                                                    : "text-gray-300 group-hover:text-gray-500"
                                                            }
                                                        `}
                                                    >

                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m9 18 6-6-6-6"
                                                        />

                                                    </svg>

                                                )}

                                            </button>

                                        );

                                    },
                                )}

                            </div>


                            {/* =================================
                                RIGHT — SUBCATEGORIES
                                ================================= */}

                            <div
                                className="
                                    bg-gray-50/60
                                    p-6
                                "
                            >

                                {activeCategory ? (

                                    <>

                                        {/* HEADER */}

                                        <div
                                            className="
                                                mb-5
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <div>

                                                <h3
                                                    className="
                                                        text-lg
                                                        font-semibold
                                                        text-gray-900
                                                    "
                                                >
                                                    {
                                                        activeCategory.name
                                                    }
                                                </h3>


                                                {children.length >
                                                    0 && (

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-gray-400
                                                        "
                                                    >
                                                        {
                                                            children.length
                                                        }{" "}
                                                        подкатегорий
                                                    </p>

                                                )}

                                            </div>


                                            {/* Все товары */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSelect(
                                                        activeCategory.id,
                                                    )
                                                }
                                                className="
                                                    shrink-0
                                                    rounded-lg
                                                    bg-white
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-medium
                                                    text-gray-700
                                                    shadow-sm
                                                    ring-1
                                                    ring-gray-200
                                                    transition
                                                    hover:bg-gray-900
                                                    hover:text-white
                                                    hover:ring-gray-900
                                                "
                                            >
                                                Все товары
                                            </button>

                                        </div>


                                        {/* =================================
                                            CHILDREN
                                            ================================= */}

                                        {children.length >
                                        0 ? (

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-2
                                                    gap-x-6
                                                    gap-y-1
                                                "
                                            >

                                                {children.map(
                                                    (
                                                        child,
                                                    ) => (

                                                        <button
                                                            key={
                                                                child.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelect(
                                                                    child.id,
                                                                )
                                                            }
                                                            className="
                                                                rounded-lg
                                                                px-3
                                                                py-2.5
                                                                text-left
                                                                text-sm
                                                                text-gray-600
                                                                transition
                                                                hover:bg-white
                                                                hover:text-gray-900
                                                                hover:shadow-sm
                                                            "
                                                        >
                                                            {
                                                                child.name
                                                            }
                                                        </button>

                                                    ),
                                                )}

                                            </div>

                                        ) : (

                                            <div
                                                className="
                                                    flex
                                                    h-48
                                                    items-center
                                                    justify-center
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-400
                                                    "
                                                >
                                                    В этой категории нет
                                                    подкатегорий
                                                </p>

                                            </div>

                                        )}

                                    </>

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-full
                                            min-h-[380px]
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                text-gray-400
                                            "
                                        >
                                            Наведите на категорию
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================
                            FOOTER
                            ================================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-t
                                border-gray-100
                                px-5
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-xs
                                    text-gray-400
                                "
                            >
                                Наведите на категорию,
                                чтобы увидеть подкатегории
                            </span>


                            <button
                                type="button"
                                onClick={() =>
                                    handleSelect(null)
                                }
                                className="
                                    text-xs
                                    font-medium
                                    text-gray-600
                                    transition
                                    hover:text-gray-900
                                "
                            >
                                Все товары →
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}