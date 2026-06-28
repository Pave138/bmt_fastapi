from typing import Annotated

from fastapi import Depends

from app.db.session import SessionDep
from app.modules.coupons.repositories import CouponRepository
from app.modules.coupons.services import CouponService


def get_coupon_repository(
    session: SessionDep
) -> CouponRepository:
    return CouponRepository(session)


CouponRepositoryDep = Annotated[
    CouponRepository,
    Depends(get_coupon_repository)
]


def get_coupon_service(
    repository: CouponRepositoryDep
) -> CouponService:
    return CouponService(repository)


CouponServiceDep = Annotated[
    CouponService,
    Depends(get_coupon_service)
]
