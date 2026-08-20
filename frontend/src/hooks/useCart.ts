import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    addToCart,
    applyCoupon,
    clearCart,
    getCart,
    removeCartItem,
    removeCoupon,
    updateCartItem,
} from "../api/cart";

import type {
    AddToCart,
    CartResponse,
    UpdateCartItem,
} from "../api/cart";


export const CART_QUERY_KEY = [
    "cart",
];


/*
 * =========================================================
 * USE CART
 * =========================================================
 */

export function useCart() {

    const queryClient =
        useQueryClient();


    /*
     * =====================================================
     * GET CART
     * =====================================================
     */

    const cartQuery =
        useQuery<CartResponse>({
            queryKey:
                CART_QUERY_KEY,

            queryFn:
                getCart,

            /*
             * Не нужно повторно создавать query
             * при каждом рендере.
             */
            staleTime: 0,
        });


    /*
     * =====================================================
     * ADD TO CART
     * =====================================================
     */

    const addMutation =
        useMutation({
            mutationFn:
                (
                    data: AddToCart,
                ) =>
                    addToCart(data),

            onSuccess:
                async () => {

                    /*
                     * Немедленно запрашиваем
                     * актуальную корзину.
                     *
                     * В отличие от простого invalidateQueries,
                     * refetchQueries гарантирует, что Header
                     * получит новые данные сразу.
                     */

                    await queryClient.refetchQueries({
                        queryKey:
                            CART_QUERY_KEY,
                    });
                },
        });


    /*
     * =====================================================
     * UPDATE CART ITEM
     * =====================================================
     */

    const updateMutation =
        useMutation({
            mutationFn:
                ({
                    productId,
                    data,
                }: {
                    productId: number;
                    data: UpdateCartItem;
                }) =>
                    updateCartItem(
                        productId,
                        data,
                    ),

            onSuccess:
                async () => {

                    await queryClient.refetchQueries({
                        queryKey:
                            CART_QUERY_KEY,
                    });
                },
        });


    /*
     * =====================================================
     * REMOVE CART ITEM
     * =====================================================
     */

    const removeMutation =
        useMutation({
            mutationFn:
                removeCartItem,

            onSuccess:
                async () => {

                    await queryClient.refetchQueries({
                        queryKey:
                            CART_QUERY_KEY,
                    });
                },
        });


    /*
     * =====================================================
     * CLEAR CART
     * =====================================================
     */

    const clearMutation =
        useMutation({
            mutationFn:
                clearCart,

            onSuccess:
                async () => {

                    /*
                     * Можно сразу установить пустую корзину,
                     * чтобы интерфейс обновился мгновенно.
                     */

                    queryClient.setQueryData(
                        CART_QUERY_KEY,
                        (
                            current: CartResponse | undefined,
                        ) => {

                            if (!current) {
                                return current;
                            }

                            return {
                                ...current,
                                items: [],
                            };
                        },
                    );


                    /*
                     * Затем синхронизируемся
                     * с backend.
                     */

                    await queryClient.refetchQueries({
                        queryKey:
                            CART_QUERY_KEY,
                    });
                },
        });


    /*
     * =====================================================
     * APPLY COUPON
     * =====================================================
     */

    const couponMutation =
        useMutation({
            mutationFn:
                applyCoupon,

            onSuccess:
                async () => {

                    await queryClient.refetchQueries({
                        queryKey:
                            CART_QUERY_KEY,
                    });
                },
        });


    /*
     * =====================================================
     * REMOVE COUPON
     * =====================================================
     */

    const removeCouponMutation =
        useMutation({
            mutationFn:
                removeCoupon,

            onSuccess:
                async () => {

                    await queryClient.refetchQueries({
                        queryKey:
                            CART_QUERY_KEY,
                    });
                },
        });


    /*
     * =====================================================
     * RETURN
     * =====================================================
     */

    return {

        /*
         * Cart
         */
        cart:
            cartQuery.data,

        isLoading:
            cartQuery.isLoading,

        isFetching:
            cartQuery.isFetching,

        isError:
            cartQuery.isError,

        error:
            cartQuery.error,


        /*
         * Add
         */
        addToCart:
            addMutation.mutate,

        addToCartAsync:
            addMutation.mutateAsync,

        isAdding:
            addMutation.isPending,


        /*
         * Update
         */
        updateItem:
            updateMutation.mutate,

        updateItemAsync:
            updateMutation.mutateAsync,

        isUpdating:
            updateMutation.isPending,


        /*
         * Remove
         */
        removeItem:
            removeMutation.mutate,

        removeItemAsync:
            removeMutation.mutateAsync,

        isRemoving:
            removeMutation.isPending,


        /*
         * Clear
         */
        clearCart:
            clearMutation.mutate,

        clearCartAsync:
            clearMutation.mutateAsync,

        isClearing:
            clearMutation.isPending,


        /*
         * Coupon
         */
        applyCoupon:
            couponMutation.mutate,

        applyCouponAsync:
            couponMutation.mutateAsync,

        isApplyingCoupon:
            couponMutation.isPending,


        /*
         * Remove coupon
         */
        removeCoupon:
            removeCouponMutation.mutate,

        removeCouponAsync:
            removeCouponMutation.mutateAsync,

        isRemovingCoupon:
            removeCouponMutation.isPending,
    };
}