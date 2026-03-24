"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import documents, analysis, health

app = FastAPI(
    title="AI Document Intelligence Pipeline",
    description="Multi-agent document analysis with CrewAI + MCP",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(documents.router)
app.include_router(analysis.router)
