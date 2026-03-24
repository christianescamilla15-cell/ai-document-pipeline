"""Rule-based sentiment analysis."""
from src.models.report import SentimentResult

POSITIVE_WORDS = frozenset({
    "good", "great", "excellent", "positive", "success", "benefit",
    "improve", "growth", "profit", "advantage", "favorable", "strong",
    "bueno", "excelente", "positivo", "beneficio", "mejora", "crecimiento",
})

NEGATIVE_WORDS = frozenset({
    "bad", "poor", "negative", "risk", "loss", "damage", "fail",
    "decline", "problem", "issue", "concern", "liability", "breach",
    "malo", "negativo", "riesgo", "p\u00e9rdida", "problema", "da\u00f1o",
})

def analyze_sentiment(text: str) -> SentimentResult:
    """Analyze document sentiment using word frequency."""
    words = set(text.lower().split())
    pos_count = len(words & POSITIVE_WORDS)
    neg_count = len(words & NEGATIVE_WORDS)
    total = pos_count + neg_count or 1

    if pos_count > neg_count:
        overall = "positive"
        confidence = pos_count / total
    elif neg_count > pos_count:
        overall = "negative"
        confidence = neg_count / total
    else:
        overall = "neutral"
        confidence = 0.5

    return SentimentResult(
        overall=overall,
        confidence=round(confidence, 2),
        details=f"Found {pos_count} positive and {neg_count} negative indicators",
    )
