"""Application configuration using Pydantic Settings v2."""
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "AI Document Pipeline"
    debug: bool = False
    anthropic_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./data/documents.db"
    max_document_size_mb: int = 10
    crew_verbose: bool = True

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

@lru_cache
def get_settings() -> Settings:
    return Settings()
