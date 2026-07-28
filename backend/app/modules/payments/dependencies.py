from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.payments.repositories import PaymentRepository


def get_payment_repository(session: SessionDep) -> PaymentRepository:
    return PaymentRepository(session)


PaymentRepositoryDep = Annotated[
    PaymentRepository,
    Depends(get_payment_repository)
]
