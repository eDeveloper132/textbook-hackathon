"""
RAG (Retrieval-Augmented Generation) Engine with Qdrant
"""
import os
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = "textbook_chunks"
EMBEDDING_DIM = 1536  # text-embedding-3-small


class RAGEngine:
    def __init__(self):
        self.openai = AsyncOpenAI(api_key=OPENAI_API_KEY)
        self.qdrant = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY if QDRANT_API_KEY else None
        )
        self._ensure_collection()
    
    def _ensure_collection(self):
        """Create collection if it doesn't exist"""
        try:
            collections = self.qdrant.get_collections().collections
            if not any(c.name == COLLECTION_NAME for c in collections):
                self.qdrant.create_collection(
                    collection_name=COLLECTION_NAME,
                    vectors_config=VectorParams(
                        size=EMBEDDING_DIM,
                        distance=Distance.COSINE
                    )
                )
        except Exception:
            pass  # Collection might already exist or Qdrant not available
    
    async def embed_query(self, text: str) -> List[float]:
        """Generate embedding for query text"""
        response = await self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    
    async def search_vectors(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search Qdrant for similar chunks"""
        try:
            query_vector = await self.embed_query(query)
            results = self.qdrant.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_vector,
                limit=top_k
            )
            return [
                {
                    "text": hit.payload.get("text", ""),
                    "chapter": hit.payload.get("chapter", "Unknown"),
                    "score": hit.score
                }
                for hit in results
            ]
        except Exception:
            return []
    
    def build_prompt(self, question: str, context_chunks: List[Dict]) -> str:
        """Build prompt with retrieved context"""
        if context_chunks:
            context = "\n\n".join([
                f"[{c.get('chapter', 'Unknown')}]: {c.get('text', '')}" 
                for c in context_chunks
            ])
            return f"""You are a helpful teaching assistant for a Physical AI and Robotics course.
Answer the student's question based on the following textbook content.
If the answer isn't in the context, say so and provide general guidance.

TEXTBOOK CONTEXT:
{context}

STUDENT QUESTION: {question}

Provide a clear, educational answer with examples where helpful."""
        else:
            return f"""You are a helpful teaching assistant for a Physical AI and Robotics course.
Answer this question about ROS2, Gazebo, Isaac Sim, or VLA models:

QUESTION: {question}

Provide a clear, educational answer with examples where helpful."""

    async def generate_answer(self, prompt: str) -> str:
        """Generate answer using GPT-4o-mini"""
        response = await self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a robotics education assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        return response.choices[0].message.content
    
    async def ask(self, question: str) -> Dict[str, Any]:
        """Full RAG pipeline: embed → search → generate"""
        # Search for relevant chunks
        chunks = await self.search_vectors(question, top_k=5)
        
        # Build prompt with context
        prompt = self.build_prompt(question, chunks)
        
        # Generate answer
        answer = await self.generate_answer(prompt)
        
        # Build sources
        sources = [
            {"chapter": c["chapter"], "score": round(c["score"], 3)}
            for c in chunks if c.get("score", 0) > 0.7
        ]
        
        return {
            "answer": answer,
            "sources": sources
        }
    
    async def ask_selection(self, question: str, selection: str) -> Dict[str, Any]:
        """Answer question about selected text (no RAG)"""
        prompt = f"""The student has selected the following text from the textbook:

SELECTED TEXT:
{selection}

STUDENT QUESTION: {question}

Explain this text and answer the student's question clearly."""

        answer = await self.generate_answer(prompt)
        return {"answer": answer}
    
    async def index_chunk(self, chunk_id: str, text: str, chapter: str):
        """Index a single chunk into Qdrant"""
        embedding = await self.embed_query(text)
        self.qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                PointStruct(
                    id=hash(chunk_id) % (2**63),
                    vector=embedding,
                    payload={"text": text, "chapter": chapter, "chunk_id": chunk_id}
                )
            ]
        )
