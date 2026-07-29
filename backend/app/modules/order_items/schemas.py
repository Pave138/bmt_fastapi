from pydantic import BaseModel, ConfigDict


class OrderItemResponse(BaseModel):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
