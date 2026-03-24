"""Analysis agent -- performs statistical and keyword analysis."""
from crewai import Agent


def create_analyzer(tools: list, verbose: bool = True) -> Agent:
    """Create a Data Analyzer agent."""
    return Agent(
        role="Data Analyzer",
        goal="Perform deep analysis including keyword extraction, sentiment analysis, and pattern detection",
        backstory=(
            "Statistical analyst specialized in text analytics. "
            "Identifies trends, anomalies, and key metrics."
        ),
        tools=tools,
        verbose=verbose,
        allow_delegation=False,
    )
