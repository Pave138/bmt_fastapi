import uuid
import structlog
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIDMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):
        request_id = str(uuid.uuid4())

        request.state.request_id = request_id

        structlog.contextvars.bind_contextvars(
            request_id=request_id
        )

        response = await call_next(request)
        structlog.contextvars.clear_contextvars()

        return response
