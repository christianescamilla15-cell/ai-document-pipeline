"""MCP Server for filesystem document access.

Implements the Model Context Protocol to expose document files
as resources that AI agents can discover and read.
"""
from typing import Protocol, runtime_checkable
from pathlib import Path
from dataclasses import dataclass, field
import json

@runtime_checkable
class MCPResource(Protocol):
    """MCP Resource protocol -- defines how data is exposed to agents."""
    uri: str
    name: str
    mime_type: str

@dataclass
class FileResource:
    uri: str
    name: str
    mime_type: str
    content: str = ""

@dataclass
class FilesystemMCPServer:
    """MCP server that exposes local files as resources for AI agents.

    Implements resource listing and reading per MCP specification.
    Agents can discover available documents and read their contents
    without direct filesystem access.
    """
    base_path: Path
    _resources: dict[str, FileResource] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.base_path = Path(self.base_path)
        self._scan_files()

    def _scan_files(self) -> None:
        """Scan base path for supported document files."""
        extensions = {'.txt': 'text/plain', '.md': 'text/markdown', '.json': 'application/json'}
        if not self.base_path.exists():
            return
        for filepath in self.base_path.rglob('*'):
            if filepath.suffix in extensions and filepath.is_file():
                uri = f"file://{filepath.relative_to(self.base_path)}"
                self._resources[uri] = FileResource(
                    uri=uri,
                    name=filepath.name,
                    mime_type=extensions[filepath.suffix],
                )

    def list_resources(self) -> list[dict]:
        """MCP: List available resources."""
        return [
            {"uri": r.uri, "name": r.name, "mimeType": r.mime_type}
            for r in self._resources.values()
        ]

    def read_resource(self, uri: str) -> str | None:
        """MCP: Read a resource by URI."""
        resource = self._resources.get(uri)
        if not resource:
            return None
        filepath = self.base_path / uri.replace("file://", "")
        if filepath.exists() and filepath.is_file():
            return filepath.read_text(encoding="utf-8")
        return None

    def list_tools(self) -> list[dict]:
        """MCP: List available tools for agents."""
        return [
            {
                "name": "read_document",
                "description": "Read the contents of a document file",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "uri": {"type": "string", "description": "File URI from list_resources"}
                    },
                    "required": ["uri"]
                }
            },
            {
                "name": "search_documents",
                "description": "Search documents containing a keyword",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Search keyword"}
                    },
                    "required": ["query"]
                }
            }
        ]

    def call_tool(self, name: str, arguments: dict) -> str:
        """MCP: Execute a tool call."""
        if name == "read_document":
            content = self.read_resource(arguments["uri"])
            return content or "Document not found"
        elif name == "search_documents":
            query = arguments["query"].lower()
            results = []
            for uri, resource in self._resources.items():
                content = self.read_resource(uri)
                if content and query in content.lower():
                    results.append({"uri": uri, "name": resource.name})
            return json.dumps(results)
        return "Unknown tool"
