"""In-memory document store with type-safe operations."""
from src.models.document import Document, DocumentStatus

class DocumentStore:
    """Thread-safe in-memory document storage."""

    def __init__(self):
        self._documents: dict[str, Document] = {}

    def add(self, doc: Document) -> Document:
        self._documents[doc.id] = doc
        return doc

    def get(self, doc_id: str) -> Document | None:
        return self._documents.get(doc_id)

    def list_all(self, limit: int = 50) -> list[Document]:
        docs = sorted(self._documents.values(), key=lambda d: d.created_at, reverse=True)
        return docs[:limit]

    def update_status(self, doc_id: str, status: DocumentStatus) -> bool:
        doc = self._documents.get(doc_id)
        if doc:
            doc.status = status
            return True
        return False

    def delete(self, doc_id: str) -> bool:
        return self._documents.pop(doc_id, None) is not None

    @property
    def count(self) -> int:
        return len(self._documents)
