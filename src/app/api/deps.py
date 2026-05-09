from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import SessionDep
from app.repositories.category import CategoryRepository
from app.services.category import CategoryService


async def get_category_service(session: SessionDep):
    repository = CategoryRepository(session)
    return CategoryService(repository)