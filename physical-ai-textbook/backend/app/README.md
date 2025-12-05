# 🔧 Backend Application

FastAPI application modules for the Physical AI Textbook API.

## 📁 Modules

```
app/
├── __init__.py           # Package initialization
├── main.py               # FastAPI app, routes, CORS
├── auth.py               # Authentication (JWT, GitHub OAuth)
├── db.py                 # SQLite database operations
├── rag.py                # RAG engine (OpenAI + Qdrant)
├── quiz.py               # Quiz questions & scoring
├── personalization.py    # Content adaptation by level
└── translation.py        # Urdu translation via GPT
```

## 📋 Module Details

### main.py

**Purpose**: FastAPI application entry point

**Responsibilities**:
- App initialization with lifespan events
- CORS middleware configuration
- All route definitions
- Request/Response Pydantic models

**Key Routes**:
```python
GET  /                    # API info
GET  /api/health          # Health check
POST /api/ask             # RAG Q&A
POST /api/ask-selection   # Selection Q&A
POST /api/auth/register   # User registration
POST /api/auth/login      # User login
GET  /api/auth/me         # Current user
GET  /api/auth/github     # GitHub OAuth
GET  /api/quiz/questions  # Get quiz
POST /api/quiz/submit     # Submit quiz
POST /api/personalize     # Personalize content
POST /api/translate       # Urdu translation
```

### auth.py

**Purpose**: User authentication

**Features**:
- Email/password registration with bcrypt hashing
- JWT token generation and validation
- GitHub OAuth flow
- User retrieval from token

**Key Functions**:
```python
async def register_user(email: str, password: str) -> dict
async def login_user(email: str, password: str) -> dict
async def get_github_auth_url() -> str
async def github_callback(code: str) -> dict
async def get_user_from_token(token: str) -> dict | None
```

### db.py

**Purpose**: SQLite database operations

**Tables**:
- `users` - User accounts (id, email, password_hash, level, github_id)
- `quiz_results` - Quiz submissions (user_id, score, level, timestamp)

**Key Functions**:
```python
async def init_db() -> None           # Create tables
async def close_pool() -> None        # Cleanup
async def create_user(...) -> dict    # Insert user
async def get_user_by_email(...) -> dict | None
async def update_user_level(...) -> None
async def save_quiz_result(...) -> None
```

### rag.py

**Purpose**: RAG (Retrieval-Augmented Generation) engine

**Flow**:
1. Generate embedding for user question
2. Search Qdrant for relevant chunks
3. Build context from matched content
4. Generate answer with GPT-4o-mini

**Class**: `RAGEngine`
```python
class RAGEngine:
    async def ask(question: str) -> dict
    async def ask_selection(question: str, selection: str) -> dict
```

**Dependencies**:
- OpenAI API (embeddings + chat)
- Qdrant Cloud (vector search)

### quiz.py

**Purpose**: Background knowledge assessment

**Features**:
- 10 multiple-choice questions
- Covers ROS2, simulation, Isaac, VLA topics
- Scoring with level determination:
  - 0-3: Beginner
  - 4-6: Intermediate
  - 7-10: Advanced

**Key Functions**:
```python
def get_questions() -> list[dict]
async def submit_quiz(user_id: str, answers: dict) -> dict
async def get_user_quiz_results(user_id: str) -> list[dict]
```

### personalization.py

**Purpose**: Adapt content to user level

**Behavior**:
- Retrieves user's level from quiz results
- Sends content to GPT with level-specific prompt
- Returns simplified/expanded content

**Key Functions**:
```python
async def get_personalized_content(
    chapter_slug: str,
    user_id: str,
    content: str
) -> dict
```

### translation.py

**Purpose**: Urdu translation

**Features**:
- Uses GPT-4o-mini for translation
- Preserves technical terms
- Handles code blocks appropriately

**Key Functions**:
```python
async def get_urdu_translation(
    chapter_slug: str,
    content: str
) -> dict
```

## 🔧 Configuration

All modules read from environment variables:

```python
import os
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
JWT_SECRET = os.getenv("JWT_SECRET")
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run specific module tests
pytest tests/test_auth.py -v

# Run with coverage
pytest --cov=app
```

## 📦 Adding New Endpoints

1. Define Pydantic models in `main.py`
2. Create business logic in appropriate module
3. Add route in `main.py`
4. Add tests in `tests/`

### Example:

```python
# In main.py
class NewFeatureRequest(BaseModel):
    data: str

@app.post("/api/new-feature")
async def new_feature(request: NewFeatureRequest):
    result = await process_new_feature(request.data)
    return {"result": result}
```

---

Part of the [Physical AI Textbook Backend](../README.md)
