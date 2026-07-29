from decimal import Decimal
from uuid import uuid4, UUID

from yookassa import Configuration, Payment

from app.core.config import settings

Configuration.account_id = settings.YOOKASSA_ACCOUNT_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY


def payment_create(
    amount: Decimal,
    order_id: int,
    username: UUID
):
    return Payment.create({
        'amount': {
            'value': amount,
            'currency': 'RUB'
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': settings.YOOKASSA_RETURN_URL
        },
        'capture': True,
        'description': f'Order ID: {order_id}, username: {username}'
    }, uuid4())
