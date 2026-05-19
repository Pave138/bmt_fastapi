from fastapi import FastAPI

from app.api.v1.routers import main_router
from app.core.config import settings
from app.db import models  # noqa

app = FastAPI(title=settings.APP_TITLE)

app.include_router(main_router)
