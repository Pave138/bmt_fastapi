from fastapi_users.authentication import (
    AuthenticationBackend, BearerTransport, JWTStrategy
)

from app.core.config import settings
from app.core.constants import TOKEN_URL, NAME_AUTH_BACKEND

bearer_transport_strategy = BearerTransport(tokenUrl=TOKEN_URL)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.JWT_SECRET_KEY,
        lifetime_seconds=settings.JWT_LIFETIME
    )


auth_backend = AuthenticationBackend(
    name=NAME_AUTH_BACKEND,
    transport=bearer_transport_strategy,
    get_strategy=get_jwt_strategy
)
