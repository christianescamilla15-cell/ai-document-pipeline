import pytest
from src.models.document import Document, DocumentCreate, DocumentType, DocumentStatus
from src.models.report import KeywordResult, SentimentResult, AnalysisReport
from pydantic import ValidationError

class TestDocumentCreate:
    def test_valid_creation(self):
        doc = DocumentCreate(title="Test", content="Some content here for testing")
        assert doc.title == "Test"

    def test_empty_title_fails(self):
        with pytest.raises(ValidationError):
            DocumentCreate(title="", content="Some content")

    def test_short_content_fails(self):
        with pytest.raises(ValidationError):
            DocumentCreate(title="Test", content="Short")

    def test_title_strip_whitespace(self):
        doc = DocumentCreate(title="  Test  ", content="Some content here for testing")
        assert doc.title == "Test"

class TestDocument:
    def test_auto_id_generation(self):
        doc = Document(title="Test", content="Some content here for testing")
        assert doc.id is not None
        assert len(doc.id) == 36  # UUID format

    def test_word_count_calculated(self):
        doc = Document(title="Test", content="one two three four five")
        assert doc.word_count == 5

    def test_default_status(self):
        doc = Document(title="Test", content="Some content here for testing")
        assert doc.status == DocumentStatus.UPLOADED

class TestKeywordResult:
    def test_valid_keyword(self):
        kw = KeywordResult(keyword="test", frequency=5, relevance_score=0.8)
        assert kw.relevance_score == 0.8

    def test_score_out_of_range(self):
        with pytest.raises(ValidationError):
            KeywordResult(keyword="test", frequency=5, relevance_score=1.5)

class TestSentimentResult:
    def test_valid_sentiment(self):
        s = SentimentResult(overall="positive", confidence=0.85, details="test")
        assert s.overall == "positive"
