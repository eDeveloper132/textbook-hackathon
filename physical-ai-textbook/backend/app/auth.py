"""
Authentication module with email/password and GitHub OAuth
"""
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import bcrypt
from jose import JWTError, jwt
import httpx

from .db import fetch_one, execute

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def create_access_token(data: dict) -> str:
    """Create JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


async def register_user(email: str, password: str) -> Dict[str, Any]:
    """Register new user with email/password"""
    # Validate password length (bcrypt limit is 72 bytes)
    if len(password.encode('utf-8')) > 72:
        raise ValueError("Password too long. Maximum 72 characters allowed.")
    
    if len(password) < 6:
        raise ValueError("Password too short. Minimum 6 characters required.")
    
    existing = await fetch_one("SELECT id FROM users WHERE email = $1", email)
    if existing:
        raise ValueError("Email already registered")
    
    password_hash = hash_password(password)
    await execute(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
        email, password_hash
    )
    
    user = await fetch_one("SELECT id, email FROM users WHERE email = $1", email)
    token = create_access_token({"sub": str(user["id"]), "email": email})
    
    return {"user": user, "token": token}


async def login_user(email: str, password: str) -> Dict[str, Any]:
    """Login with email/password"""
    user = await fetch_one(
        "SELECT id, email, password_hash FROM users WHERE email = $1", 
        email
    )
    
    if not user or not verify_password(password, user["password_hash"]):
        raise ValueError("Invalid credentials")
    
    token = create_access_token({"sub": str(user["id"]), "email": email})
    return {"user": {"id": user["id"], "email": user["email"]}, "token": token}


async def get_github_auth_url() -> str:
    """Get GitHub OAuth authorization URL"""
    return (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&scope=user:email"
    )


async def github_callback(code: str) -> Dict[str, Any]:
    """Handle GitHub OAuth callback"""
    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise ValueError("Failed to get GitHub access token")
        
        # Get user info
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        github_user = user_response.json()
        
        # Get user email
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        emails = email_response.json()
        primary_email = next(
            (e["email"] for e in emails if e.get("primary")), 
            github_user.get("email")
        )
    
    github_id = str(github_user["id"])
    
    # Check if user exists
    user = await fetch_one(
        "SELECT id, email FROM users WHERE github_id = $1", 
        github_id
    )
    
    if not user:
        # Create new user
        await execute(
            "INSERT INTO users (email, github_id) VALUES ($1, $2)",
            primary_email, github_id
        )
        user = await fetch_one(
            "SELECT id, email FROM users WHERE github_id = $1", 
            github_id
        )
    
    token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
    return {"user": user, "token": token}


async def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user by ID"""
    user = await fetch_one(
        "SELECT u.id, u.email, ul.level FROM users u "
        "LEFT JOIN user_levels ul ON u.id = ul.user_id "
        "WHERE u.id = $1",
        user_id
    )
    return user


async def get_user_from_token(token: str) -> Optional[Dict[str, Any]]:
    """Get user from JWT token"""
    payload = decode_token(token)
    if not payload:
        return None
    
    user_id = int(payload.get("sub"))
    return await get_user_by_id(user_id)
