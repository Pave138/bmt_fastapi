from fastapi import APIRouter

from app.modules.auth.dependencies import fastapi_users
from .schemas import UserRead, UserUpdate

router = APIRouter()


router.include_router(
    fastapi_users.get_users_router(
        UserRead,
        UserUpdate,
    ),
    prefix="",
    tags=["users"],
)