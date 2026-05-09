from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi_users import FastAPIUsers

from .backends import auth_backend
from .managers import get_user_manager
from app.modules.users.models import User


fastapi_users = FastAPIUsers[User, UUID](
    get_user_manager, [auth_backend]
)

current_user = fastapi_users.current_user()
current_superuser = fastapi_users.current_user(superuser=True)
current_verified_user = fastapi_users.current_user(verified=True)
current_active_user = fastapi_users.current_user(active=True)

CurrentUser = Annotated[User, Depends(current_user)]
CurrentSuperuser = Annotated[User, Depends(current_superuser)]
CurrentVerifiedUser = Annotated[User, Depends(current_verified_user)]
CurrentActiveUser = Annotated[User, Depends(current_active_user)]
