from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any
from datetime import datetime
import uuid

from core.database import get_supabase
from services.auth_service import AuthService

# Create router
router = APIRouter()

# Security
security = HTTPBearer()

# Services
auth_service = AuthService()

@router.get("/")
async def get_integrations(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get all integrations for the current user"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Get user's integrations
        result = supabase.table('integrations').select('*').eq('user_id', user_id).execute()
        
        return result.data or []
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get integrations: {str(e)}"
        )

@router.post("/slack")
async def configure_slack_integration(
    config: Dict[str, Any],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Configure Slack integration"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Check if integration already exists
        existing = supabase.table('integrations').select('*').eq('user_id', user_id).eq('platform', 'slack').execute()
        
        if existing.data:
            # Update existing integration
            integration_id = existing.data[0]['id']
            result = supabase.table('integrations').update({
                'config': config,
                'status': 'active',
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', integration_id).execute()
        else:
            # Create new integration
            integration_id = str(uuid.uuid4())
            result = supabase.table('integrations').insert({
                'id': integration_id,
                'user_id': user_id,
                'platform': 'slack',
                'config': config,
                'status': 'active',
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to configure Slack integration"
            )
        
        return {"message": "Slack integration configured successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to configure Slack integration: {str(e)}"
        )

@router.post("/google-sheets")
async def configure_google_sheets_integration(
    config: Dict[str, Any],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Configure Google Sheets integration"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Check if integration already exists
        existing = supabase.table('integrations').select('*').eq('user_id', user_id).eq('platform', 'google_sheets').execute()
        
        if existing.data:
            # Update existing integration
            integration_id = existing.data[0]['id']
            result = supabase.table('integrations').update({
                'config': config,
                'status': 'active',
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', integration_id).execute()
        else:
            # Create new integration
            integration_id = str(uuid.uuid4())
            result = supabase.table('integrations').insert({
                'id': integration_id,
                'user_id': user_id,
                'platform': 'google_sheets',
                'config': config,
                'status': 'active',
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to configure Google Sheets integration"
            )
        
        return {"message": "Google Sheets integration configured successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to configure Google Sheets integration: {str(e)}"
        )

@router.post("/jira")
async def configure_jira_integration(
    config: Dict[str, Any],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Configure Jira integration"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Check if integration already exists
        existing = supabase.table('integrations').select('*').eq('user_id', user_id).eq('platform', 'jira').execute()
        
        if existing.data:
            # Update existing integration
            integration_id = existing.data[0]['id']
            result = supabase.table('integrations').update({
                'config': config,
                'status': 'active',
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', integration_id).execute()
        else:
            # Create new integration
            integration_id = str(uuid.uuid4())
            result = supabase.table('integrations').insert({
                'id': integration_id,
                'user_id': user_id,
                'platform': 'jira',
                'config': config,
                'status': 'active',
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to configure Jira integration"
            )
        
        return {"message": "Jira integration configured successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to configure Jira integration: {str(e)}"
        )

@router.delete("/{platform}")
async def remove_integration(
    platform: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Remove an integration"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Remove integration
        result = supabase.table('integrations').delete().eq('user_id', user_id).eq('platform', platform).execute()
        
        return {"message": f"{platform} integration removed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove integration: {str(e)}"
        )

@router.get("/status")
async def get_integration_status(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get status of all integrations"""
    try:
        # Get current user
        token = credentials.credentials
        user_id = auth_service.get_user_id_from_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        supabase = get_supabase()
        
        # Get user's integrations
        result = supabase.table('integrations').select('*').eq('user_id', user_id).execute()
        
        integrations = result.data or []
        
        # Check status of each integration
        status_report = {}
        for integration in integrations:
            platform = integration['platform']
            status = integration['status']
            
            # This would typically test the actual connection
            # For now, just return the stored status
            status_report[platform] = {
                'status': status,
                'last_checked': integration.get('updated_at'),
                'config': integration.get('config', {})
            }
        
        return status_report
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get integration status: {str(e)}"
        )
