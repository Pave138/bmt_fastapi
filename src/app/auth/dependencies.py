from fastapi_users import FastAPIUsers

from app.auth.backend import auth_backend
from app.auth.manager import get_user_manager
from app.auth.schemas import (
    UserCreate, UserRead, UserUpdate
)
from app.models.user import User


fastapi_users = FastAPIUsers[User, str](
    get_user_manager, [auth_backend]
)

current_user = fastapi_users.current_user()
current_superuser = fastapi_users.current_user(superuser=True)