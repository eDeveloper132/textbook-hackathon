"""
Tests for translation endpoint
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import time

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app

client = TestClient(app)


@pytest.mark.asyncio
async def test_translate_endpoint():
    """Test /api/translate returns Urdu content"""
    mock_result = {
        "urdu_content": "یہ اردو میں ترجمہ شدہ متن ہے",
        "chapter_slug": "intro"
    }
    
    with patch("app.main.get_urdu_translation", new_callable=AsyncMock) as mock_translate:
        mock_translate.return_value = mock_result
        
        response = client.post(
            "/api/translate",
            json={"chapter_slug": "intro", "content": "This is English content"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "urdu_content" in data


@pytest.mark.asyncio
async def test_translate_response_time():
    """Test translation completes within 8 seconds (cached)"""
    mock_result = {
        "urdu_content": "کیشڈ ترجمہ",
        "chapter_slug": "intro"
    }
    
    with patch("app.main.get_urdu_translation", new_callable=AsyncMock) as mock_translate:
        mock_translate.return_value = mock_result
        
        start = time.time()
        response = client.post(
            "/api/translate",
            json={"chapter_slug": "intro", "content": "Test content"}
        )
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 8.0, f"Translation took {elapsed}s, expected <8s"


def test_translate_invalid_request():
    """Test /api/translate rejects invalid requests"""
    response = client.post("/api/translate", json={})
    assert response.status_code == 422
