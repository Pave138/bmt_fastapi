from sqlalchemy.ext.asyncio import AsyncSession


class OrderItemRepository:

    def __init__(
        self,
        session: AsyncSession
    ):
        self.session = session

