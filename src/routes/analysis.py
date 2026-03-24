"""Analysis pipeline API endpoints."""
from fastapi import APIRouter, HTTPException
from src.models.document import Document, DocumentCreate, DocumentStatus
from src.models.report import AnalysisReport
from src.services.pipeline import AnalysisPipeline
from src.routes.documents import store

router = APIRouter(prefix="/api/analysis", tags=["analysis"])
pipeline = AnalysisPipeline()

@router.post("/analyze", response_model=AnalysisReport)
async def analyze_document(data: DocumentCreate):
    """Upload and analyze a document in one step."""
    doc = Document(**data.model_dump())
    store.add(doc)
    store.update_status(doc.id, DocumentStatus.PROCESSING)

    try:
        report = await pipeline.analyze(doc)
        store.update_status(doc.id, DocumentStatus.ANALYZED)
        return report
    except Exception as e:
        store.update_status(doc.id, DocumentStatus.ERROR)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/{doc_id}", response_model=AnalysisReport)
async def analyze_existing(doc_id: str):
    """Analyze an already uploaded document."""
    doc = store.get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    store.update_status(doc_id, DocumentStatus.PROCESSING)
    try:
        report = await pipeline.analyze(doc)
        store.update_status(doc_id, DocumentStatus.ANALYZED)
        return report
    except Exception as e:
        store.update_status(doc_id, DocumentStatus.ERROR)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
