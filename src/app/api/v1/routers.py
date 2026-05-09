from fastapi import APIRouter

from app.modules.auth.routers import router as auth_router
from app.modules.users.routers import router as user_router
from app.modules.categories.routers import router as category_router

main_router = APIRouter()
main_router.include_router(auth_router, prefix='/auth')
main_router.include_router(user_router, prefix='/users', tags=['Пользователи'])
main_router.include_router(
    category_router,
    prefix='/categories',
    tags=['Категории']
)
