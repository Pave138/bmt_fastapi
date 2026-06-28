from fastapi import APIRouter, Depends

from app.modules.auth.dependencies import current_superuser
from app.modules.coupons.dependencies import CouponServiceDep
from app.modules.coupons.schemas import CouponCreate, CouponResponse

router = APIRouter()


@router.post(
    '/',
    summary='Создать купон (superuser only)',
    response_model=CouponResponse,
    dependencies=[Depends(current_superuser)]
)
async def create_coupon(
    data: CouponCreate,
    service: CouponServiceDep
) -> CouponResponse:
    return await service.create(data)


@router.get(
    '/',
    summary='Получить все купоны (superuser only)',
    response_model=list[CouponResponse],
    dependencies=[Depends(current_superuser)]
)
async def get_all_coupons(service: CouponServiceDep) -> list[CouponResponse]:
    return await service.get_all()
