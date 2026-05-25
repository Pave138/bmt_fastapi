from contextlib import asynccontextmanager
from fastapi import FastAPI
from redis.asyncio import Redis

from app.api.v1.routers import main_router
from app.core.config import settings
from app.core.logger import setup_logging
from app.db import models  # noqa
from app.middlewares.request_id import RequestIDMiddleware
from app.middlewares.latency import LatencyMiddleware

setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.redis = Redis.from_url(
        settings.REDIS_URL,
        decode_responses=True
    )

    await app.state.redis.ping()
    # logger.info('Redis connected')

    try:
        yield

    finally:
        await app.state.redis.close()
        # logger.info('Redis disconnected')

app = FastAPI(
    title=settings.APP_TITLE,
    lifespan=lifespan
)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(LatencyMiddleware)

app.include_router(main_router)
