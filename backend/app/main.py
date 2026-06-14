from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.asyncio import Redis

from app.api.v1.routers import main_router
from app.core.config import settings
from app.core.logger import setup_logging
from app.db import models  # noqa
from app.middlewares.latency import LatencyMiddleware
from app.middlewares.request_id import RequestIDMiddleware

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
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS.split(', '),           # Allowed domains
    allow_credentials=True,          # Allow cookies and auth headers
    allow_methods=["*"],             # Allow all standard HTTP methods
    allow_headers=["*"],             # Allow all HTTP headers
)

app.include_router(main_router)
