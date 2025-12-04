"""
Database connection and helpers for SQLite (aiosqlite)
Migrated from PostgreSQL/Neon due to auth issues.
"""
import os
import json
import aiosqlite
from typing import Optional, List, Dict, Any
from pathlib import Path

# Database file path - use :memory: for free hosting (no persistence)
# Set DATABASE_PATH env var for persistent storage
DB_PATH = os.getenv("DATABASE_PATH", ":memory:")

# For file-based DB, ensure directory exists
if DB_PATH != ":memory:":
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)


async def get_connection() -> aiosqlite.Connection:
    """Get database connection"""
    conn = await aiosqlite.connect(DB_PATH)
    conn.row_factory = aiosqlite.Row
    return conn


async def close_pool():
    """Compatibility function - SQLite doesn't need pool cleanup"""
    pass


async def execute(query: str, *args) -> str:
    """Execute a query (converts $1, $2 to ? placeholders)"""
    # Convert PostgreSQL-style params to SQLite
    sqlite_query = _convert_params(query)
    async with aiosqlite.connect(DB_PATH) as conn:
        await conn.execute(sqlite_query, args)
        await conn.commit()
        return "OK"


async def fetch_one(query: str, *args) -> Optional[Dict[str, Any]]:
    """Fetch single row"""
    sqlite_query = _convert_params(query)
    async with aiosqlite.connect(DB_PATH) as conn:
        conn.row_factory = aiosqlite.Row
        async with conn.execute(sqlite_query, args) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None


async def fetch_all(query: str, *args) -> List[Dict[str, Any]]:
    """Fetch all rows"""
    sqlite_query = _convert_params(query)
    async with aiosqlite.connect(DB_PATH) as conn:
        conn.row_factory = aiosqlite.Row
        async with conn.execute(sqlite_query, args) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]


def _convert_params(query: str) -> str:
    """Convert PostgreSQL $1, $2 params to SQLite ? params"""
    import re
    # Replace $1, $2, etc. with ?
    return re.sub(r'\$\d+', '?', query)


# SQL Schema for SQLite
SCHEMA = """
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    github_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User levels (from quiz)
CREATE TABLE IF NOT EXISTS user_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    level TEXT DEFAULT 'beginner',
    quiz_score INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat history
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sources TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz responses
CREATE TABLE IF NOT EXISTS quiz_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Urdu translation cache
CREATE TABLE IF NOT EXISTS urdu_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_slug TEXT UNIQUE NOT NULL,
    urdu_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personalized content cache
CREATE TABLE IF NOT EXISTS personalized_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_slug TEXT NOT NULL,
    user_level TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chapter_slug, user_level)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_urdu_cache_slug ON urdu_cache(chapter_slug);
"""


async def init_db():
    """Initialize database schema"""
    async with aiosqlite.connect(DB_PATH) as conn:
        await conn.executescript(SCHEMA)
        await conn.commit()
    print(f"✅ Database initialized at {DB_PATH}")
