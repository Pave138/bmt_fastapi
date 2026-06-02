from fastapi import APIRouter

from app.modules.auth.backends import auth_backend
from app.modules.auth.dependencies import fastapi_users
from app.modules.users.schemas import UserCreate, UserRead

router = APIRouter()


router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_register_router(
        UserRead,
        UserCreate
    ),
    prefix="/register",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/reset-password",
    tags=["auth"],
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/verify",
    tags=["auth"],
)