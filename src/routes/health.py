"""Health check endpoint."""
from fastapi import APIRouter
from src.routes.documents import store

router = APIRouter(tags=["health"])

@router.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "AI Document Pipeline",
        "version": "1.0.0",
        "documents_stored": store.count,
        "features": ["CrewAI orchestration", "MCP filesystem server", "MCP database server", "Keyword extraction", "Sentiment analysis", "Risk detection"],
    }
