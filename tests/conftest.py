import pytest
from src.models.document import Document, DocumentType

@pytest.fixture
def sample_document():
    return Document(
        title="Test Contract",
        content="This is a service agreement between Provider and Client. The provider shall deliver software development services. Late payments incur a penalty. Confidentiality must be maintained. Breach of terms results in liability.",
        doc_type=DocumentType.CONTRACT,
    )

@pytest.fixture
def sample_text():
    return "The company achieved strong growth with revenue increasing 23 percent. Operating margins improved driven by efficiency gains. Customer satisfaction reached an all-time high. Market competition is intensifying. Two competitors launched similar products."
