from typing import Annotated, Optional
from uuid import UUID

from fastapi import Depends, Request
from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase

from app.core.config import settings
from app.modules.users.models import User
from .providers import UserDBDep


class UserManager(UUIDIDMixin, BaseUserManager[User, UUID]):

    reset_password_token_secret = settings.JWT_SECRET_KEY
    verification_token_secret = settings.JWT_SECRET_KEY

    async def on_after_register(
        self,
        user: User,
        request: Optional[Request] = None
    ):
        print(f'Пользователь {user.id} зарегистрирован.')

    async def on_after_forgot_password(
        self,
        user: User,
        token: str,
        request: Optional[Request] = None
    ):
        print(f'Токен сброса пароля: {token}')

    async def on_after_request_verify(
        self,
        user: User,
        token: str,
        request: Optional[Request] = None
    ):
        print(f'Токен верификации: {token}')


async def get_user_manager(user_db: UserDBDep):
    yield UserManager(user_db)
