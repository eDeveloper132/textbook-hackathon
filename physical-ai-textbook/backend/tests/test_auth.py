"""
Tests for authentication endpoints
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app
from app.auth import hash_password, verify_password, create_access_token, decode_token

client = TestClient(app)


def test_password_hashing():
    """Test password hashing and verification"""
    password = "test_password_123"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_jwt_token():
    """Test JWT token creation and decoding"""
    data = {"sub": "123", "email": "test@example.com"}
    token = create_access_token(data)
    
    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "123"
    assert decoded["email"] == "test@example.com"


def test_invalid_jwt_token():
    """Test invalid JWT token returns None"""
    decoded = decode_token("invalid.token.here")
    assert decoded is None


@pytest.mark.asyncio
async def test_register_endpoint():
    """Test user registration"""
    mock_result = {
        "user": {"id": 1, "email": "test@example.com"},
        "token": "jwt_token_here"
    }
    
    with patch("app.main.register_user", new_callable=AsyncMock) as mock_register:
        mock_register.return_value = mock_result
        
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "password123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert "token" in data


@pytest.mark.asyncio
async def test_login_endpoint():
    """Test user login"""
    mock_result = {
        "user": {"id": 1, "email": "test@example.com"},
        "token": "jwt_token_here"
    }
    
    with patch("app.main.login_user", new_callable=AsyncMock) as mock_login:
        mock_login.return_value = mock_result
        
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "password123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert "token" in data


def test_get_me_unauthorized():
    """Test /api/auth/me without token returns 401"""
    response = client.get("/api/auth/me")
    assert response.status_code == 401
