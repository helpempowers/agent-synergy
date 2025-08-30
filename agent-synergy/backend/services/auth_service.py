from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from models.user import User
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from core.config import settings
import logging

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service for JWT token management"""
    
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    
    def create_access_token(self, data: Dict[str, Any]) -> str:
        """Create JWT access token"""
        try:
            to_encode = data.copy()
            
            # Set expiration time
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
            to_encode.update({"exp": expire})
            
            # Create JWT token
            encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
            
            logger.info(f"Access token created for user: {data.get('sub', 'unknown')}")
            return encoded_jwt
            
        except Exception as e:
            logger.error(f"Failed to create access token: {str(e)}")
            raise
    
    def decode_token(self, token: str) -> Dict[str, Any]:
        """Decode and validate JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check if token is expired
            exp = payload.get("exp")
            if exp is None:
                raise JWTError("Token has no expiration")
            
            if datetime.utcnow() > datetime.fromtimestamp(exp):
                raise JWTError("Token has expired")
            
            return payload
            
        except JWTError as e:
            logger.warning(f"JWT decode error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Token decode failed: {str(e)}")
            raise
    
    def verify_token(self, token: str) -> bool:
        """Verify if token is valid"""
        try:
            self.decode_token(token)
            return True
        except:
            return False
    
    def get_user_id_from_token(self, token: str) -> Optional[str]:
        """Extract user ID from token"""
        try:
            payload = self.decode_token(token)
            return payload.get("user_id")
        except:
            return None
    
    def get_user_email_from_token(self, token: str) -> Optional[str]:
        """Extract user email from token"""
        try:
            payload = self.decode_token(token)
            return payload.get("sub")
        except:
            return None
    
    def create_password_reset_token(self, email: str) -> str:
        """Create password reset token"""
        try:
            data = {
                "sub": email,
                "type": "password_reset",
                "exp": datetime.utcnow() + timedelta(hours=24)  # 24 hour expiry
            }
            
            token = jwt.encode(data, self.secret_key, algorithm=self.algorithm)
            logger.info(f"Password reset token created for: {email}")
            return token
            
        except Exception as e:
            logger.error(f"Failed to create password reset token: {str(e)}")
            raise
    
    def verify_password_reset_token(self, token: str) -> Optional[str]:
        """Verify password reset token and return email"""
        try:
            payload = self.decode_token(token)
            
            # Check if it's a password reset token
            if payload.get("type") != "password_reset":
                return None
            
            return payload.get("sub")
            
        except:
            return None

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Global auth service instance
auth_service = AuthService()

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Get current user from JWT token"""
    try:
        payload = auth_service.decode_token(token)
        user_id = payload.get("user_id")
        
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database
        # For now, return a mock user
        # TODO: Implement actual database lookup
        return User(
            id=user_id,
            email=payload.get("sub", ""),
            username=payload.get("username", ""),
            is_active=True
        )
        
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
