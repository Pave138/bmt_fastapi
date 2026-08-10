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
     * Загрузка корзины
     */
    const loadCart = useCallback(
        async () => {

            try {

                setLoading(true);

                const data = await getCart();

                setCart(data);

            } finally {

                setLoading(false);

            }

        },
        [],
    );


    /*
     * Добавить товар в корзину
     */
    const addToCart = useCallback(
        async (
            productId: number,
            quantity = 1,
        ) => {

            if (quantity < 1) {
                return;
            }

            await addToCartApi({
                product_id: productId,
                quantity,
            });

            await loadCart();

        },
        [loadCart],
    );


    /*
     * Изменить количество товара
     *
     * quantity <= 0
     * → товар удаляется из корзины
     */
    const updateQuantity = useCallback(
        async (
            productId: number,
            quantity: number,
        ) => {

            /*
             * Если количество стало 0
             * или меньше — удаляем товар.
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
        [loadCart],
    );


    /*
     * Удалить товар из корзины
     */
    const removeItem = useCallback(
        async (
            productId: number,
        ) => {

            await removeCartItemApi(
                productId,
            );

            await loadCart();

        },
        [loadCart],
    );


    /*
     * Очистить корзину
     */
    const clearCart = useCallback(
        async () => {

            await clearCartApi();

            await loadCart();

        },
        [loadCart],
    );


    /*
     * Применить купон
     */
    const applyCoupon = useCallback(
        async (
            code: string,
        ) => {

            const normalizedCode = code
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


                /*
                 * После применения купона
                 * получаем пересчитанную корзину.
                 */
                await loadCart();

            } catch (error: any) {

                const message =
                    error?.response?.data?.detail
                    ?? "Не удалось применить купон";


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
        [loadCart],
    );


    /*
     * Удалить купон
     */
    const removeCoupon = useCallback(
        async () => {

            try {

                setCouponLoading(true);

                setCouponError(null);


                await removeCouponApi();


                /*
                 * После удаления купона
                 * получаем пересчитанную корзину.
                 */
                await loadCart();

            } catch (error: any) {

                const message =
                    error?.response?.data?.detail
                    ?? "Не удалось удалить купон";


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
        [loadCart],
    );


    /*
     * Первичная загрузка корзины
     */
    useEffect(() => {

        loadCart();

    }, [loadCart]);


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

    const context = useContext(
        CartContext,
    );


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider",
        );

    }


    return context;
}