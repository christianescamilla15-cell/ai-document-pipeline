import pytest
from src.services.pipeline import AnalysisPipeline
from src.models.document import Document, DocumentType

class TestAnalysisPipeline:
    @pytest.fixture
    def pipeline(self):
        return AnalysisPipeline()

    @pytest.mark.asyncio
    async def test_local_analysis(self, pipeline, sample_document):
        report = await pipeline.analyze(sample_document)
        assert report.document_id == sample_document.id
        assert len(report.keywords) > 0
        assert report.sentiment.overall in ["positive", "negative", "neutral"]
        assert len(report.key_findings) > 0
        assert report.processing_time_ms >= 0

    @pytest.mark.asyncio
    async def test_risk_detection(self, pipeline):
        doc = Document(
            title="Risky Contract",
            content="This agreement includes liability clauses and penalty for breach. Confidential information must be protected. Termination possible with notice.",
            doc_type=DocumentType.CONTRACT,
        )
        report = await pipeline.analyze(doc)
        assert len(report.risk_flags) > 0

    @pytest.mark.asyncio
    async def test_agents_used_local(self, pipeline, sample_document):
        report = await pipeline.analyze(sample_document)
        assert "LocalPipeline" in report.agents_used

    def test_detect_risks_static(self):
        flags = AnalysisPipeline._detect_risks("This contract has liability and penalty for breach")
        assert any("liability" in f.lower() for f in flags)
        assert any("breach" in f.lower() for f in flags)
        assert any("penalty" in f.lower() for f in flags)
