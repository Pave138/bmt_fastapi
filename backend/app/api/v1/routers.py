from fastapi import APIRouter

from app.modules.auth.routers import router as auth_router
from app.modules.carts.routers import router as cart_router
from app.modules.categories.routers import router as category_router
from app.modules.products.routers import router as product_router
from app.modules.users.routers import router as user_router

main_router = APIRouter()

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
