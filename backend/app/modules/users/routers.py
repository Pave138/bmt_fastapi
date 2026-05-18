from fastapi import APIRouter

from app.modules.auth.dependencies import fastapi_users

from .schemas import UserRead, UserUpdate

router = APIRouter()

users_router = fastapi_users.get_users_router(UserRead, UserUpdate)
users_router.routes = [
    route for route in users_router.routes if route.name != 'users:delete_user'
]

router.include_router(users_router)
