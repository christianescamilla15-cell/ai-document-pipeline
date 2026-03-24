"""Extractive text summarization."""

def generate_summary(text: str, num_sentences: int = 3) -> str:
    """Generate an extractive summary by selecting key sentences."""
    import re
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if len(s.strip()) > 20]

    if not sentences:
        return text[:500]

    # Score sentences by: position + length + keyword density
    scored = []
    words_in_doc = set(text.lower().split())
    for i, sent in enumerate(sentences):
        position_score = 1.0 / (i + 1)  # Earlier = more important
        length_score = min(len(sent.split()) / 20, 1.0)  # Prefer medium-length
        word_set = set(sent.lower().split())
        keyword_score = len(word_set & words_in_doc) / len(word_set) if word_set else 0

        total_score = position_score * 0.3 + length_score * 0.3 + keyword_score * 0.4
        scored.append((total_score, i, sent))

    scored.sort(reverse=True)
    top = sorted(scored[:num_sentences], key=lambda x: x[1])  # Restore original order
    return " ".join(s[2] for s in top)
