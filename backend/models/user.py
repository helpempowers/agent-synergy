from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    company_name: Optional[str] = None
    company_size: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., min_length=8)
    confirm_password: str

class UserUpdate(BaseModel):
    """User update model"""
    company_name: Optional[str] = None
    company_size: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserInDB(UserBase):
    """User in database model"""
    id: UUID
    hashed_password: str
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

class User(UserBase):
    """User response model"""
    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserWithAgents(User):
    """User with agents model"""
    agents: List['Agent'] = []

class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str

class UserPasswordReset(BaseModel):
    """User password reset model"""
    email: EmailStr

class UserPasswordChange(BaseModel):
    """User password change model"""
    current_password: str
    new_password: str = Field(..., min_length=8)
    confirm_new_password: str
