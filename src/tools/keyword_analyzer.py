"""Keyword extraction using TF-based analysis."""
import re
from collections import Counter
from src.models.report import KeywordResult

# Common stop words (English + Spanish)
STOP_WORDS = frozenset({
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "both",
    "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "because", "but", "and", "or", "if", "while", "that", "this", "it",
    "el", "la", "los", "las", "un", "una", "de", "en", "con", "por",
    "para", "del", "al", "es", "son", "que", "se", "no", "su", "como",
})

def extract_keywords(text: str, top_n: int = 15) -> list[KeywordResult]:
    """Extract top keywords using term frequency analysis."""
    words = re.findall(r'\b[a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00d1]{3,}\b', text.lower())
    filtered = [w for w in words if w not in STOP_WORDS]
    counts = Counter(filtered)
    total = len(filtered) or 1

    results = []
    for word, freq in counts.most_common(top_n):
        relevance = min(freq / total * 10, 1.0)  # Normalize to 0-1
        results.append(KeywordResult(
            keyword=word,
            frequency=freq,
            relevance_score=round(relevance, 3),
        ))
    return results
