from typing import Annotated

from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase

from app.db.session import SessionDep
from app.modules.users.models import User


async def get_user_db(
    session: SessionDep
):
    yield SQLAlchemyUserDatabase(
        session,
        User
    )


UserDBDep = Annotated[
    SQLAlchemyUserDatabase,
    Depends(get_user_db)
]