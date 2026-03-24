"""Agent integration tests -- tests CrewAI tool wrappers without LLM calls."""
import json
import pytest
from src.agents.crew import KeywordTool, SentimentTool, SummaryTool, MCPReadTool, MCPQueryTool


class TestKeywordTool:
    def test_run_extracts_keywords(self):
        tool = KeywordTool()
        result = tool._run(text="python python python ruby ruby javascript")
        parsed = json.loads(result)
        assert len(parsed) > 0
        assert parsed[0]["keyword"] == "python"


class TestSentimentTool:
    def test_run_returns_sentiment(self):
        tool = SentimentTool()
        result = tool._run(text="excellent growth positive success")
        parsed = json.loads(result)
        assert parsed["overall"] == "positive"


class TestSummaryTool:
    def test_run_returns_summary(self):
        tool = SummaryTool()
        result = tool._run(text="This is a long document with multiple sentences. It covers many important topics. The analysis reveals key findings.")
        assert len(result) > 0


class TestMCPReadTool:
    def test_no_server_configured(self):
        tool = MCPReadTool()
        result = tool._run(uri="file://test.txt")
        assert "not configured" in result


class TestMCPQueryTool:
    def test_no_server_configured(self):
        tool = MCPQueryTool()
        result = tool._run(tool_name="query_documents")
        assert "not configured" in result
