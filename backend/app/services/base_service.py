from sqlalchemy.ext.asyncio import AsyncSession


class BaseService:

    @staticmethod
    async def update_model(
        obj,
        update_data: dict,
        session: AsyncSession
    ):
        for field, value in update_data.items():
            setattr(obj, field, value)

        try:
            await session.commit()
            await session.refresh(obj)
            return obj

        except Exception:
            await session.rollback()
            raise
