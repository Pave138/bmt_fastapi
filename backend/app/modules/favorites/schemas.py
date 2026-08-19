from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FavoriteFields(BaseModel):
    user_id: UUID
    product_id: int
    

class FavoriteCreate(FavoriteFields):
    pass


class FavoriteResponse(FavoriteFields):
    model_config = ConfigDict(from_attributes=True)
