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

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
    const queryClient = useQueryClient();

    /*
     * Получение корзины
     */
    const cartQuery = useQuery({
        queryKey: CART_QUERY_KEY,
        queryFn: getCart,
    });

    /*
     * Добавление товара
     */
    const addMutation = useMutation({
        mutationFn: addToCart,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CART_QUERY_KEY,
            });
        },
    });

    /*
     * Изменение количества
     */
    const updateMutation = useMutation({
        mutationFn: ({
            productId,
            quantity,
        }: {
            productId: number;
            quantity: number;
        }) =>
            updateCartItem(
                productId,
                {
                    quantity,
                },
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CART_QUERY_KEY,
            });
        },
    });

    /*
     * Удаление товара
     */
    const removeMutation = useMutation({
        mutationFn: removeCartItem,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CART_QUERY_KEY,
            });
        },
    });

    /*
     * Очистка корзины
     */
    const clearMutation = useMutation({
        mutationFn: clearCart,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CART_QUERY_KEY,
            });
        },
    });

    /*
     * Применение купона
     */
    const couponMutation = useMutation({
        mutationFn: applyCoupon,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CART_QUERY_KEY,
            });
        },
    });

    /*
     * Удаление купона
     */
    const removeCouponMutation = useMutation({
        mutationFn: removeCoupon,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CART_QUERY_KEY,
            });
        },
    });

    return {
        // Query
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        error: cartQuery.error,

        // Add
        addToCart: addMutation.mutate,
        addToCartAsync: addMutation.mutateAsync,
        isAdding: addMutation.isPending,

        // Update
        updateItem: updateMutation.mutate,
        updateItemAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,

        // Remove
        removeItem: removeMutation.mutate,
        removeItemAsync: removeMutation.mutateAsync,
        isRemoving: removeMutation.isPending,

        // Clear
        clearCart: clearMutation.mutate,
        clearCartAsync: clearMutation.mutateAsync,
        isClearing: clearMutation.isPending,

        // Coupon
        applyCoupon: couponMutation.mutate,
        applyCouponAsync: couponMutation.mutateAsync,
        isApplyingCoupon: couponMutation.isPending,

        removeCoupon: removeCouponMutation.mutate,
        removeCouponAsync:
            removeCouponMutation.mutateAsync,
        isRemovingCoupon:
            removeCouponMutation.isPending,
    };
}