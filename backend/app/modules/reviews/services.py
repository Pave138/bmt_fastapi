import structlog
from redis.asyncio import Redis
from sqlalchemy.exc import IntegrityError

from app.core.constants import (
    CACHE_TTL,
    REVIEW_NOT_FOUND_MSG,
)
from app.core.exceptions import (
    ForbiddenException,
    NotFoundException,
    ValidationException,
)
from app.modules.products.services import ProductService
from app.modules.users.models import User
from app.services.base_service import BaseService
from app.services.cache.keys import get_product_reviews_key
from app.services.cache.service import CacheService

from .models import Review
from .repositories import ReviewRepository
from .schemas import (
    ReviewCreate,
    ReviewDB,
    ReviewUpdate,
    reviews_list_adapter_response,
)

logger = structlog.get_logger()


class ReviewService(BaseService):

    def __init__(
        self,
        repository: ReviewRepository,
        product_service: ProductService,
        redis: Redis,
        cache_service: CacheService
    ):
        self.repository = repository
        self.product_service = product_service
        self.redis = redis
        self.cache_service = cache_service

    async def get_by_id(self, review_id: int) -> Review:

        review = await self.repository.get_by_id(review_id)

        if not review:
            logger.warning(
                'review.not_found',
                review_id=review_id
            )
            raise NotFoundException(REVIEW_NOT_FOUND_MSG)

        logger.debug(
            'review.loaded',
            source='db',
            review_id=review_id
        )
        return review

    async def get_all_by_product_id(
        self,
        product_id: int
    ) -> list[ReviewDB]:
        await self.product_service.get_by_id(product_id)

        cache_key = get_product_reviews_key(product_id)

        cached_reviews = await self.redis.get(cache_key)

        if cached_reviews:
            logger.debug(
                'reviews.loaded',
                source='redis'
            )

            return reviews_list_adapter_response.validate_json(
                cached_reviews
            )

        reviews = await self.repository.get_all_by_product_id(product_id)

        response = [
            ReviewDB.model_validate(review)
            for review in reviews
        ]

        await self.redis.set(
            cache_key,
            reviews_list_adapter_response.dump_json(response),
            ex=CACHE_TTL
        )

        logger.debug(
            'reviews.loaded',
            sourse='db'
        )
        return response

    async def create(
        self,
        user: User,
        data: ReviewCreate
    ) -> ReviewDB:

        await self.product_service.get_by_id(data.product_id)

        try:
            review = await self.repository.create({
                **data.model_dump(),
                'user_username': user.username
            })

            await self.repository.session.commit()
            await self.repository.session.refresh(review)
            logger.debug(
                'review.create',
                review_id=review.id
            )

            await self.cache_service.invalidate_product_cache()

            return ReviewDB.model_validate(review)
        except IntegrityError:
            await self.repository.session.rollback()
            logger.exception(
                'review.create_failed'
            )
            raise ValidationException(
                'Вы уже оставляли отзыв на этот товар'
            )

    async def update(
        self,
        review_id: int,
        user: User,
        data: ReviewUpdate
    ) -> ReviewDB:
        review = await self.get_by_id(review_id)

        if user.username != review.user_username:
            logger.debug(
                'review.update_failed_user_not_owner',
                review_id=review_id,
                user_id=user.id
            )
            raise ValidationException(
                'Изменять чужие комментарии запрещено'
            )

        update_data = data.model_dump(exclude_unset=True)

        await self.cache_service.invalidate_product_cache()

        return await self.update_model(
            review,
            update_data,
            self.repository.session
        )

    async def delete(
        self,
        review_id: int,
        user: User
    ) -> None:
        review = await self.repository.get_by_id(review_id)

        if not review:
            logger.warning(
                'review.not_found',
                review_id=review_id
            )
            raise NotFoundException(REVIEW_NOT_FOUND_MSG)

        if review.user_username != user.username:
            logger.warning(
                'review.delete_forbidden',
                review_user_username=review.user_username,
                user_id=user.id
            )
            raise ForbiddenException(
                'Удалять чужие комментарии запрещено'
            )

        try:
            await self.repository.delete(review)
            await self.repository.session.commit()

            await self.cache_service.invalidate_product_cache()

            logger.debug(
                'review.delete',
                review_id=review_id
            )

        except Exception:
            await self.repository.session.rollback()

            logger.exception(
                'review.delete_failed',
                review_id=review_id
            )
            raise
