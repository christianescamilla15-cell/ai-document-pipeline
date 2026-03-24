"""Text extraction and preprocessing tool."""
import re
from dataclasses import dataclass

@dataclass
class ExtractionResult:
    clean_text: str
    word_count: int
    sentence_count: int
    paragraph_count: int

def extract_and_clean(raw_text: str) -> ExtractionResult:
    """Extract and clean text from raw document content."""
    # Remove excessive whitespace
    clean = re.sub(r'\s+', ' ', raw_text).strip()
    # Count metrics
    sentences = re.split(r'[.!?]+', clean)
    paragraphs = raw_text.strip().split('\n\n')
    words = clean.split()

    return ExtractionResult(
        clean_text=clean,
        word_count=len(words),
        sentence_count=len([s for s in sentences if s.strip()]),
        paragraph_count=len([p for p in paragraphs if p.strip()]),
    )
