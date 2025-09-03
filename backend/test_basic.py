#!/usr/bin/env python3
"""
Basic test file to verify Agent Synergy backend structure
"""

import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported correctly"""
    try:
        # Test core modules
        from core.config import settings
        print("✅ Core config imported successfully")
        
        from core.database import init_db, get_supabase
        print("✅ Core database imported successfully")
        
        # Test models
        from models.user import User, UserCreate
        print("✅ User models imported successfully")
        
        from models.agent import Agent, AgentType, AgentStatus
        print("✅ Agent models imported successfully")
        
        from models.conversation import Conversation, ConversationStatus
        print("✅ Conversation models imported successfully")
        
        # Test services
        from services.auth_service import AuthService
        print("✅ Auth service imported successfully")
        
        from services.agent_service import AgentService
        print("✅ Agent service imported successfully")
        
        # Test API routers
        from api.v1.auth import router as auth_router
        print("✅ Auth router imported successfully")
        
        from api.v1.agents import router as agents_router
        print("✅ Agents router imported successfully")
        
        from api.v1.users import router as users_router
        print("✅ Users router imported successfully")
        
        from api.v1.integrations import router as integrations_router
        print("✅ Integrations router imported successfully")
        
        from api.v1.analytics import router as analytics_router
        print("✅ Analytics router imported successfully")
        
        print("\n🎉 All imports successful! Backend structure is correct.")
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_config():
    """Test configuration settings"""
    try:
        from core.config import settings
        
        print(f"\n📋 Configuration test:")
        print(f"  Project Name: {settings.PROJECT_NAME}")
        print(f"  API Version: {settings.API_V1_STR}")
        print(f"  Host: {settings.HOST}")
        print(f"  Port: {settings.PORT}")
        print(f"  Debug: {settings.DEBUG}")
        print(f"  Environment: {settings.ENVIRONMENT}")
        
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def test_models():
    """Test model creation"""
    try:
        from models.user import UserCreate
        from models.agent import AgentCreate
        from models.conversation import ConversationCreate
        
        # Test user creation
        user_data = UserCreate(
            email="test@example.com",
            company_name="Test Company",
            company_size="11-50",
            password="testpassword123",
            confirm_password="testpassword123"
        )
        print("✅ User model creation successful")
        
        # Test agent creation
        agent_data = AgentCreate(
            user_id="123e4567-e89b-12d3-a456-426614174000",
            name="Test Support Agent",
            agent_type="support",
            description="A test support agent",
            config={"company_name": "Test Company"}
        )
        print("✅ Agent model creation successful")
        
        # Test conversation creation
        conversation_data = ConversationCreate(
            agent_id="123e4567-e89b-12d3-a456-426614174000",
            user_id="123e4567-e89b-12d3-a456-426614174000",
            message="Hello, I need help",
            conversation_type="support_ticket"
        )
        print("✅ Conversation model creation successful")
        
        return True
        
    except Exception as e:
        print(f"❌ Model test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Agent Synergy Backend - Structure Test")
    print("=" * 50)
    
    tests = [
        ("Import Test", test_imports),
        ("Configuration Test", test_config),
        ("Model Test", test_models)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name}...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is ready for development.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
