import time

import structlog
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger()


class LatencyMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):
        start = time.perf_counter()

        response = await call_next(request)

        duration_ms = round(
            (time.perf_counter() - start) * 1000,
            2
        )

        logger.info(
            'http.request',
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=duration_ms
        )
        return response