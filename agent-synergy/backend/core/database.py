from supabase import create_client, Client
from core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global Supabase client
supabase: Client = None

async def init_db():
    """Initialize database connection"""
    global supabase
    
    try:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            logger.error("Missing Supabase configuration")
            return False
        
        # Create Supabase client
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY
        )
        
        # Test connection
        response = supabase.table('users').select('count').limit(1).execute()
        logger.info("✅ Database connection successful")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database connection failed: {str(e)}")
        return False

def get_supabase() -> Client:
    """Get Supabase client instance"""
    if supabase is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return supabase

async def create_tables():
    """Create database tables if they don't exist"""
    try:
        # This would typically be done through Supabase migrations
        # For now, we'll just log that tables should be created manually
        logger.info("📋 Please create tables manually in Supabase dashboard:")
        logger.info("   - users")
        logger.info("   - agents") 
        logger.info("   - conversations")
        logger.info("   - integrations")
        logger.info("   - analytics")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Table creation failed: {str(e)}")
        return False

async def health_check():
    """Check database health"""
    try:
        if supabase is None:
            return False, "Database not initialized"
        
        # Simple query to test connection
        response = supabase.table('users').select('count').limit(1).execute()
        return True, "Database healthy"
        
    except Exception as e:
        return False, f"Database error: {str(e)}"
