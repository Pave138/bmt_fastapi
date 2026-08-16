import structlog
from redis.asyncio import Redis

from app.core.constants import (
    CACHE_TTL,
    PRODUCT_NOT_FOUND_MSG,
    REVIEW_NOT_FOUND_MSG,
)
from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ValidationException,
)
from app.modules.products.repositories import ProductRepository
from app.modules.users.models import User
from app.services.base_service import BaseService
from app.services.cache.keys import get_product_reviews_key
from app.services.cache.service import CacheService

from .models import Review
from .repositories import ReviewRepository
from .schemas import (
    ReviewCreate,
    ReviewDB,
    ReviewListResponse,
    ReviewResponse,
    ReviewUpdate,
    reviews_list_adapter_response,
)

logger = structlog.get_logger()


class ReviewService(BaseService):

    def __init__(
        self,
        repository: ReviewRepository,
        product_repository: ProductRepository,
        redis: Redis,
        cache_service: CacheService
    ):
        self.repository = repository
        self.product_repository = product_repository
        self.redis = redis
        self.cache_service = cache_service

    async def get_by_product_slug(
        self,
        product_slug: str,
        user: User | None,
        offset: int,
        limit: int
    ) -> ReviewListResponse:
        product = await self.product_repository.get_by_slug(product_slug)
        
        if product is None:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        reviews = await self.repository.get_by_product_id(
            product.id,
            offset,
            limit
        )
        
        current_username = (
            user.username
            if user is not None
            else None
        )
        
        items = [
            ReviewResponse(
                id=review.id,
                user_username=review.user_username,
                rating=review.rating,
                comment=review.comment,
                is_owner=current_username == review.user_username,
                created_at=review.created_at,
                updated_at=review.updated_at
            )
            for review in reviews
        ]
        
        total = await self.repository.count_by_product_id(
            product.id
        )

        return ReviewListResponse(
            items=items,
            total=total
        )

    async def create(
        self,
        product_slug: str,
        user: User,
        data: ReviewCreate
    ):
        product = await self.product_repository.get_by_slug(product_slug)

        if product is None:
            raise NotFoundException(
                PRODUCT_NOT_FOUND_MSG
            )

        existing_review = await self.repository.get_by_user_and_product(
            user.username,
            product.id
        )
        
        if existing_review is not None:
            raise ConflictException(
                'Вы уже оставляли отзыв на этот товар'
            )

        review = await self.repository.create(
            {
                'user_username': user.username,
                'product_id': product.id,
                'rating': data.rating,
                'comment': data.comment
            }
        )
        await self.repository.session.commit()

        return ReviewResponse(
            id=review.id,
            user_username=review.user_username,
            rating=review.rating,
            comment=review.comment,
            is_owner=True,
            created_at=review.created_at,
            updated_at=review.updated_at
        )





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

    async def update(
        self,
        review_id: int,
        user: User,
        data: ReviewUpdate
    ) -> ReviewResponse:
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

        review = await self.update_model(
            review,
            update_data,
            self.repository.session
        )

        return ReviewResponse(
            id=review.id,
            user_username=review.user_username,
            rating=review.rating,
            comment=review.comment,
            is_owner=True,
            created_at=review.created_at,
            updated_at=review.updated_at,
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
