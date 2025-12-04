"""
FastAPI backend for Physical AI Textbook RAG Chatbot
"""
from dotenv import load_dotenv
load_dotenv()  # Load .env file before anything else

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
from contextlib import asynccontextmanager
import os

from .db import init_db, close_pool
from .rag import RAGEngine
from .auth import (
    register_user, login_user, get_github_auth_url, 
    github_callback, get_user_from_token
)
from .quiz import get_questions, submit_quiz, get_user_quiz_results
from .personalization import get_personalized_content
from .translation import get_urdu_translation


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Initialize SQLite database on startup
    await init_db()
    yield
    # Cleanup on shutdown
    await close_pool()


app = FastAPI(
    title="Physical AI Textbook API",
    description="RAG-powered Q&A for robotics education",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class AskRequest(BaseModel):
    question: str


class AskSelectionRequest(BaseModel):
    question: str
    selection: str


class AskResponse(BaseModel):
    answer: str
    sources: List[dict] = []


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    user: dict
    token: str


class QuizSubmitRequest(BaseModel):
    answers: Dict[int, str]


class PersonalizeRequest(BaseModel):
    chapter_slug: str
    content: str


class TranslateRequest(BaseModel):
    text: str = ""
    content: str = ""
    chapter_slug: str = "selected-text"
    target_language: str = "urdu"


# Helper to get current user
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    return await get_user_from_token(token)


# Health Check
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "physical-ai-textbook-api"}


# RAG Endpoints
@app.post("/api/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """RAG Q&A on full textbook content"""
    try:
        rag = RAGEngine()
        result = await rag.ask(request.question)
        return AskResponse(
            answer=result["answer"],
            sources=result.get("sources", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ask-selection", response_model=AskResponse)
async def ask_about_selection(request: AskSelectionRequest):
    """Q&A about selected text"""
    try:
        rag = RAGEngine()
        result = await rag.ask_selection(
            question=request.question,
            selection=request.selection
        )
        return AskResponse(answer=result["answer"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Auth Endpoints
@app.post("/api/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register new user with email/password"""
    try:
        result = await register_user(request.email, request.password)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login with email/password"""
    try:
        result = await login_user(request.email, request.password)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/auth/github")
async def github_login():
    """Redirect to GitHub OAuth"""
    url = await get_github_auth_url()
    return RedirectResponse(url)


@app.get("/api/auth/github/callback")
async def github_oauth_callback(code: str):
    """Handle GitHub OAuth callback"""
    try:
        result = await github_callback(code)
        # Redirect to frontend with token
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        return RedirectResponse(
            f"{frontend_url}?token={result['token']}"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/auth/me")
async def get_me(user=Depends(get_current_user)):
    """Get current user info"""
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


# Quiz Endpoints
@app.get("/api/quiz/questions")
async def quiz_questions():
    """Get quiz questions"""
    return {"questions": get_questions()}


@app.post("/api/quiz/submit")
async def quiz_submit(request: QuizSubmitRequest, user=Depends(get_current_user)):
    """Submit quiz answers"""
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        result = await submit_quiz(user["id"], request.answers)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/quiz/results")
async def quiz_results(user=Depends(get_current_user)):
    """Get user's quiz results"""
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return await get_user_quiz_results(user["id"])


# Personalization Endpoint
@app.post("/api/personalize")
async def personalize_content(request: PersonalizeRequest, user=Depends(get_current_user)):
    """Personalize chapter content based on user level"""
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        result = await get_personalized_content(
            request.chapter_slug,
            user["id"],
            request.content
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Translation Endpoint
@app.post("/api/translate")
async def translate_to_urdu(request: TranslateRequest):
    """Translate text to Urdu"""
    try:
        # Support both 'text' and 'content' fields
        text_to_translate = request.text or request.content
        
        if not text_to_translate:
            raise HTTPException(status_code=400, detail="No text provided for translation")
        
        result = await get_urdu_translation(request.chapter_slug, text_to_translate)
        
        # Return in format frontend expects
        return {
            "translation": result.get("urdu_content", ""),
            "translated_text": result.get("urdu_content", ""),
            "urdu_content": result.get("urdu_content", ""),
            "original": text_to_translate
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
