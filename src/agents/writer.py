"""Report writer agent -- generates the analysis report."""
from crewai import Agent


def create_writer(tools: list, verbose: bool = True) -> Agent:
    """Create a Report Writer agent."""
    return Agent(
        role="Report Writer",
        goal="Create a comprehensive, clear analysis report with actionable insights",
        backstory=(
            "Expert technical writer who transforms raw analysis "
            "into polished, executive-ready reports."
        ),
        tools=tools,
        verbose=verbose,
        allow_delegation=False,
    )
