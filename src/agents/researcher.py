"""Research agent -- discovers and extracts document data via MCP."""
from crewai import Agent


def create_researcher(tools: list, verbose: bool = True) -> Agent:
    """Create a Document Researcher agent."""
    return Agent(
        role="Document Researcher",
        goal="Extract and organize all relevant information from the document",
        backstory=(
            "Expert at reading documents, identifying key sections, and "
            "extracting structured data. Uses MCP to access document sources."
        ),
        tools=tools,
        verbose=verbose,
        allow_delegation=False,
    )
