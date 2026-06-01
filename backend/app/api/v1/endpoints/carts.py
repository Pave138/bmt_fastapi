from fastapi import APIRouter, Depends, status

from app.modules.auth.dependencies import CurrentUserDep, current_superuser
from app.modules.carts.dependencies import CartServiceDep
from app.modules.carts.models import Cart
from app.modules.carts.schemas import CartCreate, CartResponse

router = APIRouter()


@router.get(
    '/{cart_id}',
    response_model=CartResponse,
    dependencies=[Depends(current_superuser)],
    summary='Получить корзину по ID (superuser only)'
)
async def get_cart(cart_id: int, service: CartServiceDep) -> Cart:
    return await service.get_cart(cart_id)


@router.get(
    '/user/me',
    response_model=CartResponse,
    summary='Получить корзину текущего пользователя'
)
async def get_user_cart(
        user: CurrentUserDep,
        service: CartServiceDep
) -> Cart:
    return await service.get_user_cart(user.id)


@router.post(
    '/',
    response_model=CartResponse,
    status_code=status.HTTP_201_CREATED,
    summary='Создать корзину'
)
async def create_cart(
        data: CartCreate,
        service: CartServiceDep
) -> Cart:
    return await service.create_cart(data)


@router.delete(
    '/{cart_id}',
    status_code=status.HTTP_204_NO_CONTENT,
    summary='Удалить корзину'
)
async def delete_cart(
        cart_id: int,
        service: CartServiceDep
) -> None:
    await service.delete_cart(cart_id)
