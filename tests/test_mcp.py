import pytest
import json
from pathlib import Path
from src.mcp.filesystem_server import FilesystemMCPServer
from src.mcp.database_server import DatabaseMCPServer

class TestFilesystemMCP:
    def test_list_resources(self, tmp_path):
        (tmp_path / "test.txt").write_text("Hello world")
        server = FilesystemMCPServer(base_path=tmp_path)
        resources = server.list_resources()
        assert len(resources) == 1
        assert resources[0]["name"] == "test.txt"

    def test_read_resource(self, tmp_path):
        (tmp_path / "test.txt").write_text("Hello world")
        server = FilesystemMCPServer(base_path=tmp_path)
        content = server.read_resource("file://test.txt")
        assert content == "Hello world"

    def test_read_nonexistent(self, tmp_path):
        server = FilesystemMCPServer(base_path=tmp_path)
        assert server.read_resource("file://missing.txt") is None

    def test_list_tools(self, tmp_path):
        server = FilesystemMCPServer(base_path=tmp_path)
        tools = server.list_tools()
        assert len(tools) == 2
        names = [t["name"] for t in tools]
        assert "read_document" in names
        assert "search_documents" in names

    def test_search_documents(self, tmp_path):
        (tmp_path / "a.txt").write_text("Python is great")
        (tmp_path / "b.txt").write_text("JavaScript rules")
        server = FilesystemMCPServer(base_path=tmp_path)
        result = json.loads(server.call_tool("search_documents", {"query": "python"}))
        assert len(result) == 1

class TestDatabaseMCP:
    def test_store_and_query(self, tmp_path):
        server = DatabaseMCPServer(db_path=str(tmp_path / "test.db"))
        server.call_tool("store_document", {
            "id": "doc-1", "title": "Test", "content": "Hello", "doc_type": "report", "word_count": 1
        })
        result = json.loads(server.call_tool("query_documents", {}))
        assert len(result) == 1
        assert result[0]["title"] == "Test"

    def test_get_document(self, tmp_path):
        server = DatabaseMCPServer(db_path=str(tmp_path / "test.db"))
        server.call_tool("store_document", {"id": "doc-2", "title": "Contract", "content": "Terms here"})
        result = json.loads(server.call_tool("get_document", {"id": "doc-2"}))
        assert result["title"] == "Contract"

    def test_store_analysis(self, tmp_path):
        server = DatabaseMCPServer(db_path=str(tmp_path / "test.db"))
        server.call_tool("store_document", {"id": "doc-3", "title": "Test", "content": "Data"})
        result = json.loads(server.call_tool("store_analysis", {
            "document_id": "doc-3", "summary": "Test summary", "sentiment": "positive",
            "keywords_json": "[]", "findings_json": "[]", "processing_time_ms": 100
        }))
        assert result["stored"] is True
