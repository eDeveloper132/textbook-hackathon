"""
Urdu translation module with caching
"""
import os
from typing import Dict, Any
from openai import AsyncOpenAI
from .db import fetch_one, execute

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class TranslationEngine:
    def __init__(self):
        self.openai = AsyncOpenAI(api_key=OPENAI_API_KEY)
    
    async def translate_to_urdu(self, content: str, chapter_slug: str) -> str:
        """Translate content to Urdu with technical term preservation"""
        
        # Check cache first
        cached = await fetch_one(
            "SELECT urdu_content FROM urdu_cache WHERE chapter_slug = $1",
            chapter_slug
        )
        
        if cached:
            return cached["urdu_content"]
        
        # Translate using GPT-4o-mini
        response = await self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert technical translator specializing in robotics and AI content.
Translate the following content to Urdu while:

1. PRESERVING exactly as-is:
   - All code blocks (```python, ```bash, etc.)
   - All Mermaid diagrams (```mermaid)
   - All URLs and links
   - Variable names and function names
   - File paths

2. TRANSLATING to Urdu:
   - All explanatory text
   - Headings and titles
   - Table headers and content
   - List items

3. KEEPING technical terms with Urdu transliteration:
   - ROS2 → ROS2 (آر او ایس ٹو)
   - Node → نوڈ
   - Topic → ٹاپک
   - Publisher → پبلشر
   - Subscriber → سبسکرائبر
   - Service → سروس
   - Action → ایکشن

Use clear, modern Urdu suitable for technical education."""
                },
                {
                    "role": "user",
                    "content": f"Translate this robotics textbook content to Urdu:\n\n{content}"
                }
            ],
            temperature=0.3,
            max_tokens=4000
        )
        
        urdu_content = response.choices[0].message.content
        
        # Cache the translation
        await execute(
            "INSERT INTO urdu_cache (chapter_slug, urdu_content) VALUES ($1, $2) "
            "ON CONFLICT (chapter_slug) DO UPDATE SET urdu_content = $2",
            chapter_slug, urdu_content
        )
        
        return urdu_content


async def get_urdu_translation(chapter_slug: str, content: str) -> Dict[str, Any]:
    """Get Urdu translation for a chapter"""
    engine = TranslationEngine()
    urdu_content = await engine.translate_to_urdu(content, chapter_slug)
    
    return {
        "urdu_content": urdu_content,
        "chapter_slug": chapter_slug
    }
