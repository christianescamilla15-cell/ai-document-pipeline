"""CrewAI multi-agent orchestration for document analysis.

Defines 4 specialized agents that collaborate to analyze documents:
1. Researcher -- discovers and extracts document data via MCP
2. Analyzer -- performs statistical and keyword analysis
3. Writer -- generates the analysis report
4. Reviewer -- validates quality and flags risks
"""
from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from typing import Any
from src.config import get_settings

settings = get_settings()


class MCPReadTool(BaseTool):
    """CrewAI tool that reads documents via MCP filesystem server."""
    name: str = "read_document"
    description: str = "Read a document's content from the filesystem via MCP"
    mcp_server: Any = None

    def _run(self, uri: str = "", **kwargs) -> str:
        if self.mcp_server:
            return self.mcp_server.call_tool("read_document", {"uri": uri})
        return "MCP server not configured"


class MCPQueryTool(BaseTool):
    """CrewAI tool that queries the database via MCP."""
    name: str = "query_database"
    description: str = "Query the document database for metadata and previous analyses"
    mcp_server: Any = None

    def _run(self, tool_name: str = "query_documents", **kwargs) -> str:
        if self.mcp_server:
            return self.mcp_server.call_tool(tool_name, kwargs)
        return "MCP server not configured"


class KeywordTool(BaseTool):
    """CrewAI tool for keyword extraction."""
    name: str = "extract_keywords"
    description: str = "Extract top keywords from text with frequency and relevance scores"

    def _run(self, text: str = "", top_n: int = 15, **kwargs) -> str:
        from src.tools.keyword_analyzer import extract_keywords
        import json
        results = extract_keywords(text, top_n)
        return json.dumps([r.model_dump() for r in results])


class SentimentTool(BaseTool):
    """CrewAI tool for sentiment analysis."""
    name: str = "analyze_sentiment"
    description: str = "Analyze the sentiment of text (positive/negative/neutral)"

    def _run(self, text: str = "", **kwargs) -> str:
        from src.tools.sentiment_scorer import analyze_sentiment
        result = analyze_sentiment(text)
        return result.model_dump_json()


class SummaryTool(BaseTool):
    """CrewAI tool for text summarization."""
    name: str = "generate_summary"
    description: str = "Generate an extractive summary of text"

    def _run(self, text: str = "", num_sentences: int = 3, **kwargs) -> str:
        from src.tools.summary_generator import generate_summary
        return generate_summary(text, num_sentences)


def create_analysis_crew(
    document_content: str,
    document_title: str,
    fs_mcp_server=None,
    db_mcp_server=None,
) -> Crew:
    """Create a CrewAI crew for document analysis.

    Args:
        document_content: The text content to analyze
        document_title: Title of the document
        fs_mcp_server: Filesystem MCP server instance
        db_mcp_server: Database MCP server instance

    Returns:
        Configured Crew ready to execute
    """
    # Tools
    mcp_read = MCPReadTool(mcp_server=fs_mcp_server)
    mcp_query = MCPQueryTool(mcp_server=db_mcp_server)
    keyword_tool = KeywordTool()
    sentiment_tool = SentimentTool()
    summary_tool = SummaryTool()

    # Agents
    researcher = Agent(
        role="Document Researcher",
        goal="Extract and organize all relevant information from the document",
        backstory="Expert at reading documents, identifying key sections, and extracting structured data. Uses MCP to access document sources.",
        tools=[mcp_read, mcp_query],
        verbose=settings.crew_verbose,
        allow_delegation=False,
    )

    analyzer = Agent(
        role="Data Analyzer",
        goal="Perform deep analysis including keyword extraction, sentiment analysis, and pattern detection",
        backstory="Statistical analyst specialized in text analytics. Identifies trends, anomalies, and key metrics.",
        tools=[keyword_tool, sentiment_tool],
        verbose=settings.crew_verbose,
        allow_delegation=False,
    )

    writer = Agent(
        role="Report Writer",
        goal="Create a comprehensive, clear analysis report with actionable insights",
        backstory="Expert technical writer who transforms raw analysis into polished, executive-ready reports.",
        tools=[summary_tool],
        verbose=settings.crew_verbose,
        allow_delegation=False,
    )

    reviewer = Agent(
        role="Quality Reviewer",
        goal="Validate the analysis, check for risks, and ensure report quality",
        backstory="Senior reviewer with legal and compliance expertise. Flags risks, validates accuracy, and ensures completeness.",
        tools=[],
        verbose=settings.crew_verbose,
        allow_delegation=False,
    )

    # Tasks
    research_task = Task(
        description=f"Research and extract key information from the document titled '{document_title}'. Content:\n\n{document_content[:3000]}",
        expected_output="Structured extraction: document type, key sections, entities, dates, amounts, and obligations found.",
        agent=researcher,
    )

    analysis_task = Task(
        description=f"Analyze the document content. Extract keywords with relevance scores, determine overall sentiment, and identify patterns.\n\nContent:\n{document_content[:3000]}",
        expected_output="JSON with: keywords (top 15 with scores), sentiment (positive/negative/neutral + confidence), and 3-5 key patterns identified.",
        agent=analyzer,
    )

    writing_task = Task(
        description="Based on the research and analysis, write a comprehensive report. Include: executive summary (3 sentences), key findings (5 bullet points), and 3 actionable recommendations.",
        expected_output="Formatted report with: summary, findings list, recommendations list, and risk assessment.",
        agent=writer,
        context=[research_task, analysis_task],
    )

    review_task = Task(
        description="Review the analysis report for accuracy, completeness, and risk flags. Check if any legal or compliance concerns were missed. Rate the report quality 1-10.",
        expected_output="Review with: quality score (1-10), risk flags (if any), missing areas (if any), and final approved report.",
        agent=reviewer,
        context=[writing_task],
    )

    return Crew(
        agents=[researcher, analyzer, writer, reviewer],
        tasks=[research_task, analysis_task, writing_task, review_task],
        process=Process.sequential,
        verbose=settings.crew_verbose,
    )
