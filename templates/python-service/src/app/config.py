"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    """Production application settings with strict validation and env overrides."""

    app_name: str = "fde-python-service"
    app_env: Literal["development", "staging", "production", "test"] = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    api_timeout_seconds: float = Field(default=10.0, ge=0.5, le=60.0)
    max_batch_size: int = Field(default=100, ge=1, le=1000)
    secret_key: str = Field(default="change-me-in-production", min_length=8)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    """Returns singleton cached instance of application settings."""
    return AppSettings()
