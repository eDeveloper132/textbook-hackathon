"""
Personalization engine for adaptive content
"""
import os
from typing import Optional, Dict, Any
from openai import AsyncOpenAI
from .db import fetch_one, execute

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Level definitions for content adaptation
LEVEL_PROMPTS = {
    "beginner": """Rewrite this content for a complete beginner:
- Use simple, everyday language
- Explain all technical terms
- Add more basic examples
- Break down complex concepts into smaller steps
- Avoid jargon or define it clearly""",
    
    "intermediate": """Adapt this content for an intermediate learner:
- Keep technical terms but briefly explain less common ones
- Provide practical examples
- Include some advanced tips
- Reference related concepts they might know""",
    
    "advanced": """Enhance this content for an advanced learner:
- Use precise technical terminology
- Include edge cases and advanced patterns
- Add performance considerations
- Reference academic papers or advanced resources
- Include challenging exercises"""
}


class PersonalizationEngine:
    def __init__(self):
        self.openai = AsyncOpenAI(api_key=OPENAI_API_KEY)
    
    async def personalize_content(
        self, 
        content: str, 
        user_level: str,
        chapter_slug: str
    ) -> str:
        """Personalize content based on user level"""
        
        # Check cache first
        cached = await fetch_one(
            "SELECT content FROM personalized_cache "
            "WHERE chapter_slug = $1 AND user_level = $2",
            chapter_slug, user_level
        )
        
        if cached:
            return cached["content"]
        
        # Generate personalized content
        level_prompt = LEVEL_PROMPTS.get(user_level, LEVEL_PROMPTS["intermediate"])
        
        response = await self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are an expert robotics educator. {level_prompt}
                    
Preserve:
- All code blocks (don't modify code syntax)
- Mermaid diagrams
- Links and references
- Overall structure

Only adapt the explanatory text."""
                },
                {
                    "role": "user",
                    "content": f"Adapt this robotics textbook content:\n\n{content}"
                }
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        personalized = response.choices[0].message.content
        
        # Cache the result
        await execute(
            "INSERT INTO personalized_cache (chapter_slug, user_level, content) "
            "VALUES ($1, $2, $3) "
            "ON CONFLICT (chapter_slug, user_level) DO UPDATE SET content = $3",
            chapter_slug, user_level, personalized
        )
        
        return personalized


async def get_personalized_content(
    chapter_slug: str, 
    user_id: int,
    original_content: str
) -> Dict[str, Any]:
    """Get personalized content for a user"""
    
    # Get user level
    user_level = await fetch_one(
        "SELECT level FROM user_levels WHERE user_id = $1",
        user_id
    )
    
    level = user_level.get("level", "intermediate") if user_level else "intermediate"
    
    engine = PersonalizationEngine()
    personalized = await engine.personalize_content(
        original_content, 
        level,
        chapter_slug
    )
    
    return {
        "content": personalized,
        "level": level,
        "chapter_slug": chapter_slug
    }
