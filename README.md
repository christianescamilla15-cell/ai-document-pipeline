# AI Document Intelligence Pipeline

Multi-agent document analysis system built with **CrewAI**, **MCP (Model Context Protocol)**, and **FastAPI**.

## Architecture

```
Document Upload → Text Extraction → Multi-Agent Analysis → Report Generation
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
              Researcher            Analyzer              Writer
              (MCP tools)      (Keywords/Sentiment)    (Summarization)
                    │                     │                     │
                    └─────────────────────┼─────────────────────┘
                                          │
                                      Reviewer
                                   (QA + Risk Flags)
```

### Key Components

- **CrewAI Orchestration** — 4 specialized agents (Researcher, Analyzer, Writer, Reviewer) collaborate sequentially
- **MCP Servers** — Filesystem and Database servers expose documents/data as resources for AI agents
- **NLP Tools** — Keyword extraction (TF-based), sentiment analysis, extractive summarization, risk detection
- **FastAPI** — REST API for document CRUD and analysis pipeline
- **Dual Mode** — Full AI analysis with Anthropic API key, or local NLP fallback without

## Quick Start

```bash
# Install
pip install -e ".[dev]"

# Configure (optional — works without API key in local mode)
cp .env.example .env
# Add ANTHROPIC_API_KEY for full CrewAI mode

# Run
uvicorn src.main:app --reload

# Test
pytest tests/ -v
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + feature list |
| POST | `/api/documents/` | Upload a document |
| GET | `/api/documents/` | List all documents |
| GET | `/api/documents/{id}` | Get document by ID |
| DELETE | `/api/documents/{id}` | Delete document |
| POST | `/api/analysis/analyze` | Upload + analyze in one step |
| POST | `/api/analysis/analyze/{id}` | Analyze existing document |

## Docker

```bash
docker-compose up --build
```

## Tech Stack

Python 3.11+ · FastAPI · CrewAI · MCP · Pydantic v2 · SQLite · pytest
