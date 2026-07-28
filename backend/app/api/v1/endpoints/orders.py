import uuid
from decimal import Decimal

from fastapi import APIRouter, status, Query
from yookassa import Configuration, Payment

from app.core.config import settings
from app.modules.auth.dependencies import CurrentUserDep
from app.modules.orders.dependencies import OrderServiceDep
from app.modules.payments.models import PaymentMethod

Configuration.account_id = settings.YOOKASSA_ACCOUNT_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

router = APIRouter()


@router.post(
    '/',
    summary='Создать заказ',
    status_code=status.HTTP_204_NO_CONTENT
)
async def create_order(
    user: CurrentUserDep,
    service: OrderServiceDep,
    payment_method: PaymentMethod
):
    return await service.create(user.id, payment_method)
