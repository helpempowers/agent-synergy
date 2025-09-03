"""
Common response schemas for the API
"""
from pydantic import BaseModel
from typing import Any, Optional, Dict
from datetime import datetime

class BaseResponse(BaseModel):
    """Base response model"""
    status: str
    message: str
    timestamp: datetime

class SuccessResponse(BaseResponse):
    """Success response model"""
    data: Any

class ErrorResponse(BaseResponse):
    """Error response model"""
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class PaginatedResponse(BaseResponse):
    """Paginated response model"""
    data: list
    total: int
    page: int
    per_page: int
    total_pages: int

class HealthCheckResponse(BaseModel):
    """Health check response model"""
    status: str
    service: str
    version: str
    timestamp: datetime
    database: Optional[str] = None
