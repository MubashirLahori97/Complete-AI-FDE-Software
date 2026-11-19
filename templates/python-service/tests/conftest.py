"""Shared pytest fixtures and test configurations."""

import pytest
from fastapi.testclient import TestClient
from app.config import AppSettings, get_settings
from app.main import app
from app.service import InferenceService


@pytest.fixture
def test_settings() -> AppSettings:
    """Fixture returning explicit testing environment settings."""
    return AppSettings(
        app_name="fde-python-service-test",
        app_env="test",
        log_level="DEBUG",
        api_timeout_seconds=5.0,
    )


@pytest.fixture
def inference_service(test_settings: AppSettings) -> InferenceService:
    """Fixture returning an initialized service instance."""
    return InferenceService(settings=test_settings)


@pytest.fixture
def client(test_settings: AppSettings) -> TestClient:
    """FastAPI TestClient with overridden settings dependency."""
    app.dependency_overrides[get_settings] = lambda: test_settings
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
