import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import type {
    Cart,
} from "../types/Cart";

import {
    addToCart as addToCartApi,
    applyCoupon as applyCouponApi,
    clearCart as clearCartApi,
    getCart,
    removeCartItem as removeCartItemApi,
    removeCoupon as removeCouponApi,
    updateCartItem as updateCartItemApi,
} from "../api/cart";

import {
    useAuth,
} from "../hooks/useAuth";


interface CartContextValue {
    cart: Cart | null;

    loading: boolean;

    couponLoading: boolean;

    couponError: string | null;

    loadCart: () => Promise<void>;

    addToCart: (
        productId: number,
        quantity?: number,
    ) => Promise<void>;

    updateQuantity: (
        productId: number,
        quantity: number,
    ) => Promise<void>;

    removeItem: (
        productId: number,
    ) => Promise<void>;

    clearCart: () => Promise<void>;

    applyCoupon: (
        code: string,
    ) => Promise<void>;

    removeCoupon: () => Promise<void>;
}


const CartContext = createContext<
    CartContextValue | undefined
>(undefined);


interface CartProviderProps {
    children: ReactNode;
}


export function CartProvider({
    children,
}: CartProviderProps) {

    /*
     * =========================
     * AUTH
     * =========================
     */
    const {
        isAuthenticated,
        isLoading: authLoading,
    } = useAuth();


    /*
     * =========================
     * CART STATE
     * =========================
     */
    const [
        cart,
        setCart,
    ] = useState<Cart | null>(null);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        couponLoading,
        setCouponLoading,
    ] = useState(false);


    const [
        couponError,
        setCouponError,
    ] = useState<string | null>(null);


    /*
     * =========================
     * LOAD CART
     * =========================
     */
    const loadCart = useCallback(
        async () => {

            /*
             * Если пользователь не авторизован,
             * корзину не запрашиваем.
             */
            if (!isAuthenticated) {

                setCart(null);

                return;
            }


            try {

                setLoading(true);

                const data =
                    await getCart();

                setCart(data);

            } finally {

                setLoading(false);

            }

        },
        [
            isAuthenticated,
        ],
    );


    /*
     * =========================
     * LOAD CART AFTER AUTH
     * =========================
     *
     * Этот effect срабатывает:
     *
     * 1. после первоначальной проверки auth;
     * 2. после login, когда
     *    isAuthenticated становится true;
     * 3. после logout, когда
     *    isAuthenticated становится false.
     */
    useEffect(() => {

        if (authLoading) {
            return;
        }


        loadCart();

    }, [
        authLoading,
        loadCart,
    ]);


    /*
     * =========================
     * ADD TO CART
     * =========================
     */
    const addToCart = useCallback(
        async (
            productId: number,
            quantity = 1,
        ) => {

            if (
                !isAuthenticated ||
                quantity < 1
            ) {
                return;
            }


            await addToCartApi({
                product_id: productId,
                quantity,
            });


            await loadCart();

        },
        [
            isAuthenticated,
            loadCart,
        ],
    );


    /*
     * =========================
     * UPDATE QUANTITY
     * =========================
     */
    const updateQuantity = useCallback(
        async (
            productId: number,
            quantity: number,
        ) => {

            if (!isAuthenticated) {
                return;
            }


            /*
             * Если количество стало 0,
             * удаляем товар.
             */
            if (quantity <= 0) {

                await removeCartItemApi(
                    productId,
                );


                await loadCart();

                return;
            }


            /*
             * Обычное изменение количества.
             */
            await updateCartItemApi(
                productId,
                {
                    quantity,
                },
            );


            await loadCart();

        },
        [
            isAuthenticated,
            loadCart,
        ],
    );


    /*
     * =========================
     * REMOVE ITEM
     * =========================
     */
    const removeItem = useCallback(
        async (
            productId: number,
        ) => {

            if (!isAuthenticated) {
                return;
            }


            await removeCartItemApi(
                productId,
            );


            await loadCart();

        },
        [
            isAuthenticated,
            loadCart,
        ],
    );


    /*
     * =========================
     * CLEAR CART
     * =========================
     */
    const clearCart = useCallback(
        async () => {

            if (!isAuthenticated) {
                return;
            }


            await clearCartApi();

            await loadCart();

        },
        [
            isAuthenticated,
            loadCart,
        ],
    );


    /*
     * =========================
     * APPLY COUPON
     * =========================
     */
    const applyCoupon = useCallback(
        async (
            code: string,
        ) => {

            const normalizedCode =
                code
                    .trim()
                    .toUpperCase();


            if (!normalizedCode) {

                setCouponError(
                    "Введите код купона",
                );

                return;
            }


            try {

                setCouponLoading(true);

                setCouponError(null);


                await applyCouponApi(
                    normalizedCode,
                );


                await loadCart();

            } catch (error: any) {

                const message =
                    error?.response?.data?.detail
                    ??
                    "Не удалось применить купон";


                setCouponError(
                    typeof message === "string"
                        ? message
                        : "Не удалось применить купон",
                );


                throw error;

            } finally {

                setCouponLoading(false);

            }

        },
        [
            loadCart,
        ],
    );


    /*
     * =========================
     * REMOVE COUPON
     * =========================
     */
    const removeCoupon = useCallback(
        async () => {

            try {

                setCouponLoading(true);

                setCouponError(null);


                await removeCouponApi();


                await loadCart();

            } catch (error: any) {

                const message =
                    error?.response?.data?.detail
                    ??
                    "Не удалось удалить купон";


                setCouponError(
                    typeof message === "string"
                        ? message
                        : "Не удалось удалить купон",
                );


                throw error;

            } finally {

                setCouponLoading(false);

            }

        },
        [
            loadCart,
        ],
    );


    /*
     * =========================
     * CONTEXT
     * =========================
     */
    return (
        <CartContext.Provider
            value={{
                cart,

                loading,

                couponLoading,

                couponError,

                loadCart,

                addToCart,

                updateQuantity,

                removeItem,

                clearCart,

                applyCoupon,

                removeCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}


export function useCart() {

    const context =
        useContext(
            CartContext,
        );


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider",
        );

    }


    return context;
}
