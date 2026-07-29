import uuid
from decimal import Decimal

from fastapi import APIRouter, status, Query
from yookassa import Configuration, Payment

from app.core.config import settings
from app.modules.auth.dependencies import CurrentUserDep
from app.modules.orders.dependencies import OrderServiceDep
from app.modules.orders.schemas import OrderResponse
from app.modules.payments.models import PaymentMethod

# Configuration.account_id = settings.YOOKASSA_ACCOUNT_ID
# Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

router = APIRouter()


@router.post(
    '/',
    summary='Создать заказ',
    response_model=OrderResponse
)
async def create_order(
    user: CurrentUserDep,
    service: OrderServiceDep,
    payment_method: PaymentMethod
) -> OrderResponse:
    return await service.create(user.id, payment_method)


@router.get(
    '/',
    summary='Получить все заказы',
    response_model=list[OrderResponse]
)
async def get_orders(
    user: CurrentUserDep,
    service: OrderServiceDep
) -> list[OrderResponse]:
    return await service.get_by_user_id(user.id)
