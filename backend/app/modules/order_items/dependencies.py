from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.order_items.repositories import OrderItemRepository


def get_order_item_repository(session: SessionDep) -> OrderItemRepository:
    return OrderItemRepository(session)


OrderItemRepositoryDep = Annotated[
    OrderItemRepository,
    Depends(get_order_item_repository)
]