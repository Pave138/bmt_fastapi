import structlog
from redis.asyncio import Redis

from app.core.constants import CACHE_TTL, REVIEW_NOT_FOUND_MSG, REVIEW_RATING_ERR_MSG
from app.core.exceptions import NotFoundException, ValidationException
from app.modules.products.services import ProductService
from app.modules.reviews.repositories import ReviewRepository
from app.modules.reviews.schemas import (
    ReviewResponse,
    ReviewUpdate,
    reviews_list_adapter, ReviewCreate,
)
from app.modules.users.models import User
from app.services.base_service import BaseService
from app.services.cache.keys import get_product_reviews_key, get_review_key
from app.core.constants import REVIEW_RATING_GE, REVIEW_RATING_LE

logger = structlog.get_logger()


class ReviewService(BaseService):

    def __init__(
        self,
        repository: ReviewRepository,
        product_service: ProductService,
        redis: Redis
    ):
        self.repository = repository
        self.product_service = product_service
        self.redis = redis

    async def get_by_id(self, review_id: int) -> ReviewResponse:
        cache_key = get_review_key(review_id)

        cached_review = await self.redis.get(cache_key)

        if cached_review:
            try:
                logger.debug(
                    'review.loaded',
                    source='redis',
                    review_id=review_id
                )
                return ReviewResponse.model_validate_json(cached_review)

            except Exception:
                logger.exception(
                    'Invalid cache for review',
                    review_id=review_id
                )
                await self.redis.delete(cache_key)

        review = await self.repository.get_by_id(review_id)

        if not review:
            logger.warning(
                'review.not_found',
                review_id=review_id
            )
            raise NotFoundException(REVIEW_NOT_FOUND_MSG)

        response = ReviewResponse.model_validate(review)

        await self.redis.set(
            cache_key,
            response.model_dump_json(),
            ex=CACHE_TTL
        )
        logger.debug(
            'review.loaded',
            source='db',
            review_id=review_id
        )
        return response

    async def get_all_by_product_id(
        self,
        product_id: int
    ) -> list[ReviewResponse]:
        await self.product_service.get_by_id(product_id)

        cache_key = get_product_reviews_key(product_id)

        cached_reviews = await self.redis.get(cache_key)

        if cached_reviews:
            logger.debug(
                'reviews.loaded',
                source='redis'
            )

            return reviews_list_adapter.validate_json(
                cached_reviews
            )

        reviews = await self.repository.get_all_by_product_id(product_id)

        response = [
            ReviewResponse.model_validate(review)
            for review in reviews
        ]

        await self.redis.set(
            cache_key,
            reviews_list_adapter.dump_json(response),
            ex=CACHE_TTL
        )

        logger.debug(
            'reviews.loaded',
            sourse='db'
        )
        return response

    async def create(
        self,
        product_id: int,
        user: User,
        data: ReviewCreate
    ) -> ReviewResponse:

        if REVIEW_RATING_LE <= data.rating <= REVIEW_RATING_GE:
            raise ValidationException(
                REVIEW_RATING_ERR_MSG
            )

        await self.product_service.get_by_id(product_id)

        try:
            review = await self.repository.create({
                **data.model_dump(),
                'product_id': product_id,
                'user_id': user.id
            })

            await self.repository.session.commit()
            await self.repository.session.refresh(review)
            logger.debug(
                'review.create',
                review_id=review.id
            )
            return ReviewResponse.model_validate(review)
        except Exception:
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
        data: ReviewUpdate
    ) -> ReviewResponse:
        review = self.get_by_id(review_id)

        update_data = data.model_dump(exclude_unset=True)

        return await self.update_model(
            review,
            update_data,
            self.repository.session
        )





