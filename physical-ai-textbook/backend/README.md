# Physical AI Textbook Backend

FastAPI backend for the Physical AI Textbook platform with RAG-powered Q&A, authentication, quizzes, and translation.

## 🚀 Live API

**Production**: https://physical-ai-textbook-api.onrender.com

> **Note**: Free tier spins down after 15 min inactivity. First request may take 30-60s.

## 📋 Features

- 🤖 **RAG Q&A** - GPT-4o-mini + Qdrant vector search
- 🔐 **Authentication** - Email/password + GitHub OAuth
- 📊 **Quiz System** - Background level assessment
- 🎯 **Personalization** - Content adapted to user level
- 🇵🇰 **Translation** - Urdu language support

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | FastAPI |
| AI | OpenAI GPT-4o-mini |
| Vector DB | Qdrant Cloud |
| Database | SQLite (aiosqlite) |
| Auth | JWT + bcrypt |

## 🏃 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Run server
uvicorn app.main:app --reload
```

API docs available at http://localhost:8000/docs

## 🔧 Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.io:6333
QDRANT_API_KEY=your-api-key
JWT_SECRET=your-secret-key

# Optional (for GitHub OAuth)
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app & routes
│   ├── auth.py           # Authentication logic
│   ├── db.py             # SQLite database
│   ├── rag.py            # RAG engine (OpenAI + Qdrant)
│   ├── quiz.py           # Quiz system
│   ├── personalization.py # Content adaptation
│   └── translation.py    # Urdu translation
├── data/                 # SQLite database files
├── scripts/
│   └── index_content.py  # Index docs to Qdrant
├── tests/                # pytest tests
├── requirements.txt
├── render.yaml           # Render deployment config
└── Dockerfile
```

## 📊 API Endpoints

### Health
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/api/health` | GET | Health check |

### RAG Q&A
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ask` | POST | Ask question about textbook |
| `/api/ask-selection` | POST | Ask about selected text |

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register with email/password |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/github` | GET | GitHub OAuth redirect |
| `/api/auth/github/callback` | GET | GitHub OAuth callback |

### Quiz
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/quiz/questions` | GET | Get quiz questions |
| `/api/quiz/submit` | POST | Submit answers (auth required) |
| `/api/quiz/results` | GET | Get user results (auth required) |

### Personalization & Translation
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/personalize` | POST | Personalize content (auth required) |
| `/api/translate` | POST | Translate to Urdu |

## 🔍 RAG Indexing

Index textbook content to Qdrant:

```bash
python scripts/index_content.py
```

This parses MDX files from `../docs/` and uploads embeddings to Qdrant.

## 🧪 Testing

```bash
pytest
```

## 🚀 Deployment (Render)

1. Connect GitHub repo to Render
2. Set environment variables in Render dashboard
3. Deploy using `render.yaml` config

The `render.yaml` in the root directory configures:
- Python environment
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/api/health`

## 📝 API Examples

### Ask Question
```bash
curl -X POST https://physical-ai-textbook-api.onrender.com/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is ROS2?"}'
```

### Register User
```bash
curl -X POST https://physical-ai-textbook-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST https://physical-ai-textbook-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

---

Part of the [Physical AI Textbook](../README.md) project 🤖
