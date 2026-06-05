from fastapi import APIRouter

from app.core.constants import API_V1_PREFIX

from .endpoints import *

main_router = APIRouter(prefix=API_V1_PREFIX)

main_router.include_router(
    auth_router,
    prefix='/auth'
)

main_router.include_router(
    user_router,
    prefix='/users',
    tags=['Пользователи']
)

main_router.include_router(
    category_router,
    prefix='/categories',
    tags=['Категории']
)

main_router.include_router(
    product_router,
    prefix='/products',
    tags=['Товары']
)

main_router.include_router(
    cart_router,
    prefix='/carts',
    tags=['Корзины']
)

main_router.include_router(
    review_router,
    prefix='/reviews',
    tags=['Отзывы']
)
