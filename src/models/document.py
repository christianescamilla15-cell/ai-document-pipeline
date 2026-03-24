"""Document models with Pydantic v2 validation."""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from enum import Enum
from typing import Optional
import uuid

class DocumentType(str, Enum):
    CONTRACT = "contract"
    REPORT = "report"
    LEGAL_BRIEF = "legal_brief"
    MEMO = "memo"
    OTHER = "other"

class DocumentStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    ANALYZED = "analyzed"
    ERROR = "error"

class DocumentCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=10)
    doc_type: DocumentType = DocumentType.OTHER

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be blank")
        return v.strip()

class Document(DocumentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: DocumentStatus = DocumentStatus.UPLOADED
    created_at: datetime = Field(default_factory=datetime.utcnow)
    word_count: int = 0

    def model_post_init(self, __context) -> None:
        self.word_count = len(self.content.split())

class DocumentResponse(BaseModel):
    id: str
    title: str
    doc_type: DocumentType
    status: DocumentStatus
    word_count: int
    created_at: datetime
