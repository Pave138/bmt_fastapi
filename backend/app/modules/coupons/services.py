from app.core.constants import COUPON_CODE_ALREADY_EXISTS_MSG
from app.core.exceptions import ConflictException

from .repositories import CouponRepository
from .schemas import CouponCreate, CouponResponse, CouponResponseListAdapter


class CouponService:

    def __init__(
        self,
        repository: CouponRepository
    ):
        self.repository = repository

    async def create(self, data: CouponCreate) -> CouponResponse:
        existing = await self.repository.get_by_code(data.code)

        if existing is not None:
            raise ConflictException(
                COUPON_CODE_ALREADY_EXISTS_MSG.format(code=data.code)
            )

        coupon = await self.repository.create(**data.model_dump())

        await self.repository.session.commit()
        await self.repository.session.refresh(coupon)

        return CouponResponse.model_validate(coupon)

    async def get_all(self) -> list[CouponResponse]:
        coupons = await self.repository.get_all()

        return CouponResponseListAdapter.validate_python(coupons)
