from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
import uuid

from core.config import settings
from core.database import get_supabase
from models.user import UserCreate, User, UserLogin, UserPasswordReset, UserPasswordChange
from services.auth_service import AuthService

# Create router
router = APIRouter()

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Auth service
auth_service = AuthService()

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Validate passwords match
        if user_data.password != user_data.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Passwords do not match"
            )
        
        # Check if user already exists
        supabase = get_supabase()
        existing_user = supabase.table('users').select('*').eq('email', user_data.email).execute()
        
        if existing_user.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = pwd_context.hash(user_data.password)
        
        # Create user
        user_id = str(uuid.uuid4())
        user_record = {
            'id': user_id,
            'email': user_data.email,
            'company_name': user_data.company_name,
            'company_size': user_data.company_size,
            'first_name': user_data.first_name,
            'last_name': user_data.last_name,
            'hashed_password': hashed_password,
            'is_active': True,
            'is_verified': False,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('users').insert(user_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        # Return user without password
        created_user = result.data[0]
        return User(
            id=created_user['id'],
            email=created_user['email'],
            company_name=created_user['company_name'],
            company_size=created_user['company_size'],
            first_name=created_user['first_name'],
            last_name=created_user['last_name'],
            is_active=created_user['is_active'],
            is_verified=created_user['is_verified'],
            created_at=datetime.fromisoformat(created_user['created_at']),
            updated_at=datetime.fromisoformat(created_user['updated_at']) if created_user['updated_at'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login")
async def login(user_credentials: UserLogin):
    """Login user and return access token"""
    try:
        supabase = get_supabase()
        
        # Get user by email
        result = supabase.table('users').select('*').eq('email', user_credentials.email).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = result.data[0]
        
        # Verify password
        if not pwd_context.verify(user_credentials.password, user['hashed_password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user['is_active']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Generate access token
        access_token = auth_service.create_access_token(
            data={"sub": user['email'], "user_id": user['id']}
        )
        
        # Update last login
        supabase.table('users').update({
            'last_login': datetime.utcnow().isoformat()
        }).eq('id', user['id']).execute()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user['id'],
                "email": user['email'],
                "company_name": user['company_name'],
                "company_size": user['company_size'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "is_active": user['is_active'],
                "is_verified": user['is_verified']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Refresh access token"""
    try:
        token = credentials.credentials
        payload = auth_service.decode_token(token)
        
        # Generate new token
        new_token = auth_service.create_access_token(
            data={"sub": payload.get("sub"), "user_id": payload.get("user_id")}
        )
        
        return {
            "access_token": new_token,
            "token_type": "bearer"
        }
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user (token invalidation would be handled client-side)"""
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(user_data: UserPasswordReset):
    """Send password reset email"""
    # This would integrate with email service
    return {"message": "Password reset email sent (if user exists)"}

@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    """Reset password with token"""
    # This would validate reset token and update password
    return {"message": "Password reset successful"}

@router.get("/me", response_model=User)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    try:
        token = credentials.credentials
        payload = auth_service.decode_token(token)
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = result.data[0]
        return User(
            id=user['id'],
            email=user['email'],
            company_name=user['company_name'],
            company_size=user['company_size'],
            first_name=user['first_name'],
            last_name=user['last_name'],
            is_active=user['is_active'],
            is_verified=user['is_verified'],
            created_at=datetime.fromisoformat(user['created_at']),
            updated_at=datetime.fromisoformat(user['updated_at']) if user['updated_at'] else None,
            last_login=datetime.fromisoformat(user['last_login']) if user['last_login'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )
