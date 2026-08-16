import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    createProductReview,
    deleteReview,
    getProductReviews,
    updateReview,
    type ReviewCreate,
    type ReviewUpdate,
} from '../api/reviews';

export const reviewKeys = {
    all: ['reviews'] as const,

    product: (
        productSlug: string,
        limit: number,
        offset: number
    ) => [
        ...reviewKeys.all,
        'product',
        productSlug,
        limit,
        offset,
    ] as const,
};

export const useProductReviews = (
    productSlug: string,
    limit = 20,
    offset = 0
) => {
    return useQuery({
        queryKey: reviewKeys.product(
            productSlug,
            limit,
            offset
        ),
        queryFn: () =>
            getProductReviews(
                productSlug,
                limit,
                offset
            ),
        enabled: Boolean(productSlug),
    });
};

export const useCreateReview = (
    productSlug: string
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReviewCreate) =>
            createProductReview(productSlug, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    ...reviewKeys.all,
                    'product',
                    productSlug,
                ],
            });
        },
    });
};

export const useUpdateReview = (
    productSlug: string
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            reviewId,
            data,
        }: {
            reviewId: number;
            data: ReviewUpdate;
        }) => updateReview(reviewId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    ...reviewKeys.all,
                    'product',
                    productSlug,
                ],
            });
        },
    });
};

export const useDeleteReview = (
    productSlug: string
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: number) =>
            deleteReview(reviewId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    ...reviewKeys.all,
                    'product',
                    productSlug,
                ],
            });
        },
    });
};