from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Import routers
from api.v1.auth import router as auth_router
from api.v1.agents import router as agents_router
from api.v1.integrations import router as integrations_router
from api.v1.analytics import router as analytics_router
from api.v1.users import router as users_router
from api.v1.conversations import router as conversations_router

# Import database and config
from core.config import settings
from core.database import init_db

# Load environment variables
load_dotenv()

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Agent Synergy API...")
    await init_db()
    print("✅ Database initialized")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Agent Synergy API...")

# Create FastAPI app
app = FastAPI(
    title="Agent Synergy API",
    description="Plug-and-play AI agents that work like employees",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(agents_router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(integrations_router, prefix="/api/v1/integrations", tags=["Integrations"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(conversations_router, prefix="/api/v1/conversations", tags=["Conversations"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Agent Synergy API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "agent-synergy-api",
        "version": "1.0.0"
    }

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "api": "Agent Synergy",
        "status": "operational",
        "timestamp": "2025-12-19T00:00:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
