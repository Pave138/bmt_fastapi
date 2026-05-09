from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth_router, category_router
)

main_router = APIRouter()
main_router.include_router(auth_router, prefix='/auth')
main_router.include_router(
    category_router,
    prefix='/category',
    tags=['Категории']
)
