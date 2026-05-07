from fastapi import APIRouter

from app.auth.backend import auth_backend
from app.auth.dependencies import fastapi_users
from app.auth.schemas import (
    UserCreate, UserRead, UserUpdate
)

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix='/jwt',
    tags=['auth']
)

router.include_router(
    fastapi_users.get_register_router(
        UserRead,
        UserCreate
    ),
    prefix='/register',
    tags=['auth']
)

router.include_router(
    fastapi_users.get_reset_password_router(),
    prefix='/reset-password',
    tags=['auth'],
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix='/verify',
    tags=['auth'],
)

router.include_router(
    fastapi_users.get_users_router(
        UserRead,
        UserUpdate,
    ),
    prefix='/users',
    tags=['users'],
)