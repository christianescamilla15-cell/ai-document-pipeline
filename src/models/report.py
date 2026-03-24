"""Analysis report models."""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class KeywordResult(BaseModel):
    keyword: str
    frequency: int
    relevance_score: float = Field(ge=0.0, le=1.0)

class SentimentResult(BaseModel):
    overall: str  # positive, negative, neutral
    confidence: float = Field(ge=0.0, le=1.0)
    details: str

class AnalysisReport(BaseModel):
    document_id: str
    summary: str
    keywords: list[KeywordResult]
    sentiment: SentimentResult
    key_findings: list[str]
    recommendations: list[str]
    risk_flags: list[str]
    agents_used: list[str]
    processing_time_ms: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
