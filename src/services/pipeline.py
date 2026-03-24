"""Document analysis pipeline orchestration."""
import time
import json
from src.models.document import Document, DocumentStatus
from src.models.report import AnalysisReport, KeywordResult, SentimentResult
from src.tools.text_extractor import extract_and_clean
from src.tools.keyword_analyzer import extract_keywords
from src.tools.sentiment_scorer import analyze_sentiment
from src.tools.summary_generator import generate_summary
from src.mcp.filesystem_server import FilesystemMCPServer
from src.mcp.database_server import DatabaseMCPServer
from src.config import get_settings
from pathlib import Path

settings = get_settings()

class AnalysisPipeline:
    """Orchestrates document analysis through multiple stages.

    Supports two modes:
    1. CrewAI mode (with API key) -- full multi-agent orchestration
    2. Local mode (no API key) -- uses local tools directly
    """

    def __init__(self):
        self.fs_mcp = FilesystemMCPServer(base_path=Path("data/sample_documents"))
        self.db_mcp = DatabaseMCPServer()

    async def analyze(self, document: Document) -> AnalysisReport:
        """Run the full analysis pipeline on a document."""
        start = time.time()

        # Stage 1: Extract and clean text
        extraction = extract_and_clean(document.content)

        # Stage 2: Try CrewAI if API key available, fallback to local
        if settings.anthropic_api_key and settings.anthropic_api_key != "":
            report = await self._analyze_with_crew(document, extraction.clean_text, start)
        else:
            report = self._analyze_locally(document, extraction.clean_text, start)

        # Stage 3: Store results via MCP
        self.db_mcp.call_tool("store_document", {
            "id": document.id,
            "title": document.title,
            "content": document.content[:500],
            "doc_type": document.doc_type.value,
            "word_count": document.word_count,
        })
        self.db_mcp.call_tool("store_analysis", {
            "document_id": document.id,
            "summary": report.summary,
            "sentiment": report.sentiment.overall,
            "keywords_json": json.dumps([k.model_dump() for k in report.keywords]),
            "findings_json": json.dumps(report.key_findings),
            "processing_time_ms": report.processing_time_ms,
        })

        return report

    async def _analyze_with_crew(self, document: Document, clean_text: str, start: float) -> AnalysisReport:
        """Use CrewAI multi-agent system for analysis."""
        from src.agents.crew import create_analysis_crew

        crew = create_analysis_crew(
            document_content=clean_text,
            document_title=document.title,
            fs_mcp_server=self.fs_mcp,
            db_mcp_server=self.db_mcp,
        )

        result = crew.kickoff()
        elapsed = int((time.time() - start) * 1000)

        # Parse crew result + enhance with local tools
        keywords = extract_keywords(clean_text)
        sentiment = analyze_sentiment(clean_text)
        summary = generate_summary(clean_text)

        return AnalysisReport(
            document_id=document.id,
            summary=summary,
            keywords=keywords,
            sentiment=sentiment,
            key_findings=[
                f"Document contains {len(clean_text.split())} words",
                f"Top keyword: '{keywords[0].keyword}' (frequency: {keywords[0].frequency})" if keywords else "No keywords found",
                f"Overall sentiment: {sentiment.overall} ({sentiment.confidence:.0%} confidence)",
                f"Analyzed by 4 AI agents (Researcher, Analyzer, Writer, Reviewer)",
                str(result)[:200] if result else "CrewAI analysis completed",
            ],
            recommendations=[
                "Review flagged risk areas with legal team",
                "Update document classification based on content analysis",
                "Schedule periodic re-analysis for compliance tracking",
            ],
            risk_flags=self._detect_risks(clean_text),
            agents_used=["Researcher", "Analyzer", "Writer", "Reviewer"],
            processing_time_ms=elapsed,
        )

    def _analyze_locally(self, document: Document, clean_text: str, start: float) -> AnalysisReport:
        """Fallback: analyze using local tools only (no AI)."""
        keywords = extract_keywords(clean_text)
        sentiment = analyze_sentiment(clean_text)
        summary = generate_summary(clean_text)
        elapsed = int((time.time() - start) * 1000)

        return AnalysisReport(
            document_id=document.id,
            summary=summary,
            keywords=keywords,
            sentiment=sentiment,
            key_findings=[
                f"Document contains {len(clean_text.split())} words across {len(clean_text.split('.'))} sentences",
                f"Top keyword: '{keywords[0].keyword}' (appears {keywords[0].frequency} times)" if keywords else "No significant keywords",
                f"Overall sentiment: {sentiment.overall} ({sentiment.confidence:.0%} confidence)",
                f"Document type: {document.doc_type.value}",
                f"Analyzed using local NLP pipeline (no AI agents)",
            ],
            recommendations=[
                "Consider AI-powered analysis for deeper insights (add ANTHROPIC_API_KEY)",
                "Review top keywords for document classification accuracy",
                "Cross-reference with similar documents in the database",
            ],
            risk_flags=self._detect_risks(clean_text),
            agents_used=["LocalPipeline"],
            processing_time_ms=elapsed,
        )

    @staticmethod
    def _detect_risks(text: str) -> list[str]:
        """Detect potential risk flags in document text."""
        flags = []
        risk_patterns = {
            "liability": "Potential liability language detected",
            "breach": "Contract breach terminology found",
            "penalty": "Penalty clauses identified",
            "termination": "Termination provisions present",
            "indemnif": "Indemnification clauses found",
            "confidential": "Confidentiality requirements noted",
            "deadline": "Time-sensitive deadlines detected",
        }
        text_lower = text.lower()
        for pattern, message in risk_patterns.items():
            if pattern in text_lower:
                flags.append(message)
        return flags
