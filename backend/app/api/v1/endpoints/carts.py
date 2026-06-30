from fastapi import APIRouter, status

from app.modules.auth.dependencies import CurrentUserDep
from app.modules.carts.dependencies import CartServiceDep
from app.modules.carts.schemas import (
    AddToCart,
    ApplyCoupon,
    CartResponse,
    UpdateCartItemSchema,
)

router = APIRouter()


@router.get(
    '/',
    response_model=CartResponse,
    summary='Получить корзину'
)
async def get_cart(
    user: CurrentUserDep,
    service: CartServiceDep
) -> CartResponse:
    return await service.get_cart_response(
        user.id
    )


@router.post(
    '/items',
    summary='Добавить товар',
    status_code=status.HTTP_204_NO_CONTENT
)
async def add_product(
    data: AddToCart,
    user: CurrentUserDep,
    service: CartServiceDep
) -> None:
    await service.add_product(
        user_id=user.id,
        product_id=data.product_id,
        quantity=data.quantity
    )


@router.patch(
    '/items/{product_id}',
    summary='Изменить количество',
    status_code=status.HTTP_204_NO_CONTENT
)
async def update_quantity(
    product_id: int,
    data: UpdateCartItemSchema,
    user: CurrentUserDep,
    service: CartServiceDep
) -> None:
    await service.update_quantity(
        user_id=user.id,
        product_id=product_id,
        quantity=data.quantity
    )


@router.delete(
    '/items/{product_id}',
    summary='Удалить товар',
    status_code=status.HTTP_204_NO_CONTENT
)
async def remove_product(
    product_id: int,
    user: CurrentUserDep,
    service: CartServiceDep
) -> None:
    await service.remove_product(
        user_id=user.id,
        product_id=product_id
    )


@router.delete(
    '/',
    summary='Очистить корзину',
    status_code=status.HTTP_204_NO_CONTENT
)
async def clear_cart(
    user: CurrentUserDep,
    service: CartServiceDep
) -> None:
    await service.clear_cart(
        user_id=user.id
    )


@router.post(
    '/coupon',
    summary='Применить купон',
    status_code=status.HTTP_204_NO_CONTENT
)
async def apply_coupon_cart(
    data: ApplyCoupon,
    user: CurrentUserDep,
    service: CartServiceDep
) -> None:
    await service.apply_coupon(data, user.id)


@router.delete(
    '/coupon',
    summary='Удалить купон',
    status_code=status.HTTP_204_NO_CONTENT
)
async def deactivate_coupon_cart(
    user: CurrentUserDep,
    service: CartServiceDep
) -> None:
    await service.deactivate_coupon(user.id)
