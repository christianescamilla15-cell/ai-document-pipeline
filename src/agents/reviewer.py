"""QA reviewer agent -- validates quality and flags risks."""
from crewai import Agent


def create_reviewer(verbose: bool = True) -> Agent:
    """Create a Quality Reviewer agent."""
    return Agent(
        role="Quality Reviewer",
        goal="Validate the analysis, check for risks, and ensure report quality",
        backstory=(
            "Senior reviewer with legal and compliance expertise. "
            "Flags risks, validates accuracy, and ensures completeness."
        ),
        tools=[],
        verbose=verbose,
        allow_delegation=False,
    )
