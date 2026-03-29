# AI Document Pipeline

Multi-agent document intelligence workflow for extraction, analysis, summarization, and review.

## Overview
AI Document Pipeline is a document analysis system that processes uploaded files through a multi-agent workflow using CrewAI, MCP, FastAPI, and local NLP fallbacks.

## Problem
Document-heavy workflows are slow when analysis, summarization, and QA depend on manual review. Teams need automated extraction and structured output.

## Solution
This project routes document content through specialized agents for:
- Research and context gathering
- Deep analysis and entity extraction
- Report writing and summarization
- Quality assurance and review

## System Architecture

```text
Document Upload
      ↓
Text Extraction
      ↓
Multi-Agent Analysis Pipeline
 ├ Researcher Agent
 ├ Analyzer Agent
 ├ Writer Agent
 └ Reviewer Agent
      ↓
MCP Servers (Filesystem + SQLite)
      ↓
Structured Report Output
```

## Key Components
- CrewAI orchestration for 4 specialized agents
- 2 MCP servers (Filesystem + SQLite)
- FastAPI backend
- NLP utilities for local processing
- Local fallback path when API unavailable
- Sample documents + test suite

## Engineering Decisions

### Why CrewAI?
To orchestrate multiple specialized agents with clear role definitions and task delegation.

### Why MCP servers?
To give agents tool access to the filesystem and database without tight coupling.

### Why local fallback?
To ensure the pipeline works even when external API providers are unavailable.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Orchestration | CrewAI |
| Tool Servers | MCP (Filesystem + SQLite) |
| Backend | Python, FastAPI |
| Frontend | React |
| Infra | Docker, Docker Compose |
| Testing | pytest (44 tests) |

## Repo Structure
```
src/              # Core pipeline logic
tests/            # 44 automated tests
frontend/         # React UI
data/sample_documents/  # Test documents
```

## Key Metrics
| Metric | Value |
|--------|-------|
| Specialized Agents | 4 |
| MCP Servers | 2 |
| Tests | 44 |
| Commits | 3 |

## How to Run
```bash
cp .env.example .env
docker compose up --build
```

## Roadmap
- [ ] Richer evaluation dataset
- [ ] Retrieval benchmarking
- [ ] Document type expansion
- [ ] Observability for analysis stages

---
Built by [Christian Hernandez](https://ch65-portfolio.vercel.app) · AI Engineer
