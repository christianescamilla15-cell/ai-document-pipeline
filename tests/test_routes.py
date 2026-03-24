import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

class TestHealthEndpoint:
    @pytest.mark.asyncio
    async def test_health(self, client):
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "CrewAI" in str(data["features"])

class TestDocumentEndpoints:
    @pytest.mark.asyncio
    async def test_create_document(self, client):
        response = await client.post("/api/documents/", json={
            "title": "Test Doc", "content": "This is a test document with enough content", "doc_type": "report"
        })
        assert response.status_code == 201
        assert response.json()["title"] == "Test Doc"

    @pytest.mark.asyncio
    async def test_list_documents(self, client):
        response = await client.get("/api/documents/")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_create_invalid(self, client):
        response = await client.post("/api/documents/", json={"title": "", "content": "Short"})
        assert response.status_code == 422

class TestAnalysisEndpoints:
    @pytest.mark.asyncio
    async def test_analyze_document(self, client):
        response = await client.post("/api/analysis/analyze", json={
            "title": "Financial Report",
            "content": "The company achieved strong growth with revenue increasing significantly. Market competition is intensifying with new competitors. Customer satisfaction improved substantially.",
            "doc_type": "report"
        })
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "keywords" in data
        assert "sentiment" in data
        assert len(data["key_findings"]) > 0
