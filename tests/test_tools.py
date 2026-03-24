from src.tools.text_extractor import extract_and_clean
from src.tools.keyword_analyzer import extract_keywords
from src.tools.sentiment_scorer import analyze_sentiment
from src.tools.summary_generator import generate_summary

class TestTextExtractor:
    def test_clean_whitespace(self):
        result = extract_and_clean("  Hello   world  \n\n  test  ")
        assert "  " not in result.clean_text

    def test_word_count(self):
        result = extract_and_clean("one two three four five")
        assert result.word_count == 5

    def test_sentence_count(self):
        result = extract_and_clean("First sentence. Second sentence. Third.")
        assert result.sentence_count >= 3

class TestKeywordAnalyzer:
    def test_extracts_keywords(self):
        text = "python python python javascript javascript ruby"
        results = extract_keywords(text, top_n=3)
        assert results[0].keyword == "python"
        assert results[0].frequency == 3

    def test_filters_stop_words(self):
        text = "the the the is is are are python"
        results = extract_keywords(text)
        keywords = [r.keyword for r in results]
        assert "the" not in keywords
        assert "python" in keywords

    def test_respects_top_n(self):
        text = "alpha beta gamma delta epsilon zeta eta theta"
        results = extract_keywords(text, top_n=3)
        assert len(results) <= 3

class TestSentimentScorer:
    def test_positive_sentiment(self):
        result = analyze_sentiment("excellent growth great success positive benefit")
        assert result.overall == "positive"

    def test_negative_sentiment(self):
        result = analyze_sentiment("bad risk loss damage fail problem negative")
        assert result.overall == "negative"

    def test_neutral_sentiment(self):
        result = analyze_sentiment("the document contains several paragraphs of text")
        assert result.overall == "neutral"

    def test_confidence_range(self):
        result = analyze_sentiment("good bad")
        assert 0.0 <= result.confidence <= 1.0

class TestSummaryGenerator:
    def test_generates_summary(self):
        text = "First important sentence here. Second key point discussed. Third notable finding presented. Fourth minor detail added. Fifth concluding remark."
        result = generate_summary(text, num_sentences=2)
        assert len(result) > 0
        assert len(result) < len(text)

    def test_handles_short_text(self):
        result = generate_summary("Short text.", num_sentences=3)
        assert len(result) > 0
