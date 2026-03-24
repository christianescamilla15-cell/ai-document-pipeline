"""MCP Server for SQLite database access.

Exposes document metadata and analysis results as MCP resources,
allowing agents to query structured data alongside unstructured documents.
"""
import sqlite3
import json
from dataclasses import dataclass
from pathlib import Path

@dataclass
class DatabaseMCPServer:
    """MCP server exposing SQLite data as queryable resources.

    Agents can list tables, query documents, and retrieve analysis results
    through the MCP tool interface.
    """
    db_path: str = "data/documents.db"

    def __post_init__(self) -> None:
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        """Initialize database schema."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    doc_type TEXT DEFAULT 'other',
                    status TEXT DEFAULT 'uploaded',
                    word_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS analyses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id TEXT NOT NULL,
                    summary TEXT,
                    sentiment TEXT,
                    keywords_json TEXT,
                    findings_json TEXT,
                    processing_time_ms INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (document_id) REFERENCES documents(id)
                )
            """)

    def list_tools(self) -> list[dict]:
        """MCP: Available database tools."""
        return [
            {
                "name": "query_documents",
                "description": "Query documents by type or status",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "doc_type": {"type": "string", "enum": ["contract", "report", "legal_brief", "memo", "other"]},
                        "status": {"type": "string", "enum": ["uploaded", "processing", "analyzed", "error"]},
                        "limit": {"type": "integer", "default": 10}
                    }
                }
            },
            {
                "name": "get_document",
                "description": "Get a specific document by ID",
                "inputSchema": {
                    "type": "object",
                    "properties": {"id": {"type": "string"}},
                    "required": ["id"]
                }
            },
            {
                "name": "get_analysis",
                "description": "Get analysis results for a document",
                "inputSchema": {
                    "type": "object",
                    "properties": {"document_id": {"type": "string"}},
                    "required": ["document_id"]
                }
            },
            {
                "name": "store_document",
                "description": "Store a new document in the database",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "string"},
                        "title": {"type": "string"},
                        "content": {"type": "string"},
                        "doc_type": {"type": "string"},
                        "word_count": {"type": "integer"}
                    },
                    "required": ["id", "title", "content"]
                }
            },
            {
                "name": "store_analysis",
                "description": "Store analysis results",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "document_id": {"type": "string"},
                        "summary": {"type": "string"},
                        "sentiment": {"type": "string"},
                        "keywords_json": {"type": "string"},
                        "findings_json": {"type": "string"},
                        "processing_time_ms": {"type": "integer"}
                    },
                    "required": ["document_id"]
                }
            }
        ]

    def call_tool(self, name: str, arguments: dict) -> str:
        """MCP: Execute a database tool."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            if name == "query_documents":
                query = "SELECT id, title, doc_type, status, word_count, created_at FROM documents WHERE 1=1"
                params: list = []
                if arguments.get("doc_type"):
                    query += " AND doc_type = ?"
                    params.append(arguments["doc_type"])
                if arguments.get("status"):
                    query += " AND status = ?"
                    params.append(arguments["status"])
                query += f" ORDER BY created_at DESC LIMIT {arguments.get('limit', 10)}"
                rows = conn.execute(query, params).fetchall()
                return json.dumps([dict(r) for r in rows])

            elif name == "get_document":
                row = conn.execute("SELECT * FROM documents WHERE id = ?", (arguments["id"],)).fetchone()
                return json.dumps(dict(row)) if row else "Document not found"

            elif name == "get_analysis":
                row = conn.execute(
                    "SELECT * FROM analyses WHERE document_id = ? ORDER BY created_at DESC LIMIT 1",
                    (arguments["document_id"],)
                ).fetchone()
                return json.dumps(dict(row)) if row else "No analysis found"

            elif name == "store_document":
                conn.execute(
                    "INSERT OR REPLACE INTO documents (id, title, content, doc_type, word_count, status) VALUES (?, ?, ?, ?, ?, 'uploaded')",
                    (arguments["id"], arguments["title"], arguments["content"], arguments.get("doc_type", "other"), arguments.get("word_count", 0))
                )
                return json.dumps({"stored": True, "id": arguments["id"]})

            elif name == "store_analysis":
                conn.execute(
                    "INSERT INTO analyses (document_id, summary, sentiment, keywords_json, findings_json, processing_time_ms) VALUES (?, ?, ?, ?, ?, ?)",
                    (arguments["document_id"], arguments.get("summary"), arguments.get("sentiment"),
                     arguments.get("keywords_json"), arguments.get("findings_json"), arguments.get("processing_time_ms", 0))
                )
                return json.dumps({"stored": True, "document_id": arguments["document_id"]})

        return "Unknown tool"
