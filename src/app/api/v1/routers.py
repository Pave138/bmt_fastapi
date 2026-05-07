from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router

main_router = APIRouter()
main_router.include_router(auth_router, prefix="/auth")
