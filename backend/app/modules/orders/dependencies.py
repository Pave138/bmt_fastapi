from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.carts.dependencies import CartRepositoryDep
from app.modules.order_items.dependencies import OrderItemRepositoryDep
from app.modules.orders.repositories import OrderRepository
from app.modules.orders.services import OrderService
from app.modules.payments.dependencies import PaymentRepositoryDep


def get_order_repository(session: SessionDep) -> OrderRepository:
    return OrderRepository(session)


OrderRepositoryDep = Annotated[
    OrderRepository,
    Depends(get_order_repository)
]


def get_order_service(
        repository: OrderRepositoryDep,
        cart_repository: CartRepositoryDep,
        payment_repository: PaymentRepositoryDep,
        order_item_repository: OrderItemRepositoryDep
) -> OrderService:
    return OrderService(
        repository=repository,
        cart_repository=cart_repository,
        payment_repository=payment_repository,
        order_item_repository=order_item_repository
    )


OrderServiceDep = Annotated[
    OrderService,
    Depends(get_order_service)
]
