"""Document management API endpoints."""
from fastapi import APIRouter, HTTPException
from src.models.document import Document, DocumentCreate, DocumentResponse
from src.services.document_store import DocumentStore

router = APIRouter(prefix="/api/documents", tags=["documents"])
store = DocumentStore()

@router.post("/", response_model=DocumentResponse, status_code=201)
async def create_document(data: DocumentCreate):
    doc = Document(**data.model_dump())
    store.add(doc)
    return doc

@router.get("/", response_model=list[DocumentResponse])
async def list_documents(limit: int = 50):
    return store.list_all(limit)

@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str):
    doc = store.get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.delete("/{doc_id}", status_code=204)
async def delete_document(doc_id: str):
    if not store.delete(doc_id):
        raise HTTPException(status_code=404, detail="Document not found")
