# 🧪 Backend Tests

pytest test suite for the Physical AI Textbook backend.

## 📁 Structure

```
tests/
├── __init__.py           # Package initialization
├── test_auth.py          # Authentication tests
├── test_rag.py           # RAG engine tests
└── test_translation.py   # Translation tests
```

## 🏃 Running Tests

```bash
cd physical-ai-textbook/backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# Run specific test function
pytest tests/test_auth.py::test_register_user

# Run with coverage
pytest --cov=app --cov-report=html

# Run only fast tests (skip integration)
pytest -m "not integration"
```

## 📋 Test Files

### test_auth.py

Tests for authentication module:

- `test_register_user` - New user registration
- `test_register_duplicate_email` - Duplicate email handling
- `test_login_success` - Valid credentials login
- `test_login_invalid_password` - Wrong password rejection
- `test_login_nonexistent_user` - Unknown email handling
- `test_jwt_token_generation` - Token creation
- `test_jwt_token_validation` - Token verification
- `test_get_user_from_token` - User retrieval from JWT

### test_rag.py

Tests for RAG engine:

- `test_generate_embedding` - Embedding creation
- `test_search_qdrant` - Vector search
- `test_ask_question` - Full Q&A flow
- `test_ask_selection` - Selection-based Q&A
- `test_empty_question` - Empty input handling
- `test_context_building` - Context assembly

### test_translation.py

Tests for Urdu translation:

- `test_translate_simple_text` - Basic translation
- `test_translate_with_code` - Code block preservation
- `test_translate_technical_terms` - Technical term handling
- `test_empty_text` - Empty input handling

## 🔧 Test Configuration

### conftest.py

Create `tests/conftest.py` for shared fixtures:

```python
import pytest
from unittest.mock import AsyncMock, patch

@pytest.fixture
def mock_openai():
    """Mock OpenAI API calls."""
    with patch('app.rag.openai') as mock:
        mock.embeddings.create = AsyncMock(return_value={
            'data': [{'embedding': [0.1] * 1536}]
        })
        yield mock

@pytest.fixture
def mock_qdrant():
    """Mock Qdrant client."""
    with patch('app.rag.QdrantClient') as mock:
        yield mock

@pytest.fixture
async def test_db():
    """Initialize test database."""
    from app.db import init_db
    await init_db()
    yield
    # Cleanup after test
```

### pytest.ini

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
asyncio_mode = auto
markers =
    integration: marks tests as integration tests
    slow: marks tests as slow
```

## 📝 Writing Tests

### Unit Test Template

```python
import pytest
from unittest.mock import AsyncMock, patch

class TestMyFeature:
    """Tests for my feature."""
    
    @pytest.mark.asyncio
    async def test_success_case(self):
        """Test successful operation."""
        result = await my_function("input")
        assert result["status"] == "success"
    
    @pytest.mark.asyncio
    async def test_error_handling(self):
        """Test error is raised for invalid input."""
        with pytest.raises(ValueError):
            await my_function("")
```

### Integration Test Template

```python
import pytest

@pytest.mark.integration
@pytest.mark.asyncio
async def test_full_flow():
    """Test complete user flow."""
    # 1. Register user
    user = await register_user("test@example.com", "password123")
    assert user["email"] == "test@example.com"
    
    # 2. Login
    result = await login_user("test@example.com", "password123")
    assert "token" in result
    
    # 3. Use token
    user_info = await get_user_from_token(result["token"])
    assert user_info["id"] == user["id"]
```

## 🎯 Coverage Goals

| Module | Target Coverage |
|--------|-----------------|
| auth.py | 90%+ |
| db.py | 85%+ |
| rag.py | 80%+ |
| quiz.py | 90%+ |
| personalization.py | 80%+ |
| translation.py | 85%+ |

## 🔄 CI Integration

Tests run automatically on:
- Pull requests to `main`
- Push to `main` branch

See `.github/workflows/` for CI configuration.

---

Part of the [Physical AI Textbook Backend](../README.md)
