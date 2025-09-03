from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from datetime import datetime

from core.database import get_supabase
from models.user import User, UserUpdate
from services.auth_service import AuthService

# Create router
router = APIRouter()

# Security
security = HTTPBearer()

# Services
auth_service = AuthService()

@router.get("/", response_model=List[User])
async def get_users(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all users (admin only)"""
    # This would typically check for admin role
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin access required"
    )

@router.get("/me", response_model=User)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    try:
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
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
        
        user_data = result.data[0]
        return User(
            id=user_data['id'],
            email=user_data['email'],
            company_name=user_data['company_name'],
            company_size=user_data['company_size'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            is_active=user_data['is_active'],
            is_verified=user_data['is_verified'],
            created_at=datetime.fromisoformat(user_data['created_at']),
            updated_at=datetime.fromisoformat(user_data['updated_at']) if user_data['updated_at'] else None,
            last_login=datetime.fromisoformat(user_data['last_login']) if user_data['last_login'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )

@router.put("/me", response_model=User)
async def update_current_user(
    user_update: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update current authenticated user"""
    try:
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Prepare update data
        update_data = {}
        if user_update.company_name is not None:
            update_data['company_name'] = user_update.company_name
        if user_update.company_size is not None:
            update_data['company_size'] = user_update.company_size
        if user_update.first_name is not None:
            update_data['first_name'] = user_update.first_name
        if user_update.last_name is not None:
            update_data['last_name'] = user_update.last_name
        
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        # Update user
        result = supabase.table('users').update(update_data).eq('id', user_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user"
            )
        
        # Return updated user
        updated_user = result.data[0]
        return User(
            id=updated_user['id'],
            email=updated_user['email'],
            company_name=updated_user['company_name'],
            company_size=updated_user['company_size'],
            first_name=updated_user['first_name'],
            last_name=updated_user['last_name'],
            is_active=updated_user['is_active'],
            is_verified=updated_user['is_verified'],
            created_at=datetime.fromisoformat(updated_user['created_at']),
            updated_at=datetime.fromisoformat(updated_user['updated_at']) if updated_user['updated_at'] else None,
            last_login=datetime.fromisoformat(updated_user['last_login']) if updated_user['last_login'] else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

@router.delete("/me")
async def delete_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Delete current authenticated user"""
    try:
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Delete user (this would typically be a soft delete)
        supabase.table('users').delete().eq('id', user_id).execute()
        
        return {"message": "User deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        )
