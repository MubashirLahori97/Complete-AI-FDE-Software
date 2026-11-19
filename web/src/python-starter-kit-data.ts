// Python Microservice Starter Kit Data for in-browser explorer
// Mirrors templates/python-service/ with full file contents and architectural annotations

export interface StarterKitFile {
  path: string;
  name: string;
  category: 'config' | 'docker' | 'source' | 'tests' | 'docs';
  description: string;
  language: 'toml' | 'dockerfile' | 'makefile' | 'shell' | 'python' | 'markdown';
  content: string;
}

export const STARTER_KIT_FILES: StarterKitFile[] = [
  {
    path: 'pyproject.toml',
    name: 'pyproject.toml',
    category: 'config',
    description: 'Modern Astral uv project definition with Ruff, Mypy, and Pytest configuration.',
    language: 'toml',
    content: `[project]
name = "fde-python-service"
version = "0.1.0"
description = "Production-grade Python microservice template engineered for AI-FDE systems"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "pydantic>=2.8.0",
    "pydantic-settings>=2.4.0",
    "structlog>=24.4.0",
    "httpx>=0.27.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=5.0.0",
    "ruff>=0.6.0",
    "mypy>=1.11.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear (common design gotchas)
    "UP",  # pyupgrade (modern Python 3.12+ syntax)
    "C4",  # flake8-comprehensions
    "SIM", # flake8-simplify
    "TCH", # flake8-type-checking
    "RUF", # Ruff-specific rules
]
ignore = ["B008"] # Allow FastAPI Depends in function defaults

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

[tool.mypy]
python_version = "3.12"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
no_implicit_optional = true

[tool.pytest.ini_options]
minversion = "8.0"
addopts = "-ra -q --strict-markers --cov=src/app --cov-report=term-missing"
testpaths = ["tests"]
asyncio_mode = "auto"
`,
  },
  {
    path: 'Dockerfile',
    name: 'Dockerfile',
    category: 'docker',
    description: 'Multi-stage production build using Astral uv and non-root execution.',
    language: 'dockerfile',
    content: `# Multi-stage production Dockerfile leveraging Astral uv for lightning-fast, cached builds
FROM ghcr.io/astral-sh/uv:0.4.15-python3.12-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \\
    UV_LINK_MODE=copy

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/uv \\
    --mount=type=bind,source=uv.lock,target=uv.lock \\
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \\
    uv sync --frozen --no-install-project --no-dev || uv pip install --system -r pyproject.toml

FROM python:3.12-slim-bookworm AS runtime

RUN groupadd -g 10001 appgroup && \\
    useradd -u 10001 -g appgroup -s /bin/false -m appuser

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PATH="/app/.venv/bin:$PATH" \\
    PYTHONPATH="/app/src"

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
COPY src/ /app/src/

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/healthz')" || exit 1

ENTRYPOINT ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
`,
  },
  {
    path: 'Makefile',
    name: 'Makefile',
    category: 'config',
    description: 'Developer ergonomics: test, lint, format, run, and docker-build.',
    language: 'makefile',
    content: `.PHONY: help install lint format test run docker-build docker-run clean

help:
\t@echo "Production Microservice Commands:"
\t@echo "  make install      Install all runtime & dev dependencies with uv"
\t@echo "  make lint         Check code with ruff and mypy"
\t@echo "  make format       Format code with ruff"
\t@echo "  make test         Execute pytest test suite with coverage"
\t@echo "  make run          Launch FastAPI development server with hot reload"
\t@echo "  make docker-build Build hardened production container image"
\t@echo "  make docker-run   Run microservice container locally on :8000"
\t@echo "  make clean        Remove cache and coverage artifacts"

install:
\tuv sync --all-extras

lint:
\tuv run ruff check .
\tuv run mypy src/

format:
\tuv run ruff format .
\tuv run ruff check --fix .

test:
\tuv run pytest

run:
\tuv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

docker-build:
\tdocker build -t fde-python-service:latest .

docker-run:
\tdocker run -p 8000:8000 --env-file .env.example --rm fde-python-service:latest

clean:
\trm -rf .ruff_cache .mypy_cache .pytest_cache .coverage htmlcov/ dist/ build/
\tfind . -type d -name "__pycache__" -exec rm -rf {} +
`,
  },
  {
    path: '.env.example',
    name: '.env.example',
    category: 'config',
    description: 'Reference environment variables for development and production.',
    language: 'shell',
    content: `# Service Environment Configuration
APP_ENV=development
APP_PORT=8000
APP_HOST=0.0.0.0
LOG_LEVEL=INFO
API_TIMEOUT_SECONDS=10.0
MAX_BATCH_SIZE=100
SECRET_KEY=change-me-in-production-use-strong-secret
`,
  },
  {
    path: 'src/app/main.py',
    name: 'main.py',
    category: 'source',
    description: 'FastAPI application with lifespan manager, healthz/ready probes, and structlog middleware.',
    language: 'python',
    content: `"""Production FastAPI application entry point with lifespan, middleware, and routes."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import time
import uuid
from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
import structlog

from app.config import AppSettings, get_settings
from app.domain import (
    HealthStatus,
    InferenceTaskRequest,
    InferenceTaskResponse,
    ServiceHealthResponse,
)
from app.service import InferenceService

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    logger.info("service_startup_init", app=settings.app_name, env=settings.app_env)
    yield
    logger.info("service_shutdown_complete")


app = FastAPI(
    title="FDE Production Python Service",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


@app.middleware("http")
async def correlation_id_and_timing_middleware(request: Request, call_next) -> Response:
    request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
    start_time = time.perf_counter()

    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(request_id=request_id, path=request.url.path)

    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
    response.headers["x-request-id"] = request_id
    response.headers["x-response-time-ms"] = str(duration_ms)

    logger.info(
        "http_request_finished",
        status_code=response.status_code,
        method=request.method,
        duration_ms=duration_ms,
    )
    return response


def get_inference_service(settings: AppSettings = Depends(get_settings)) -> InferenceService:
    return InferenceService(settings=settings)


@app.get("/healthz", response_model=ServiceHealthResponse, tags=["Health"])
async def health_check(settings: AppSettings = Depends(get_settings)) -> ServiceHealthResponse:
    return ServiceHealthResponse(
        status=HealthStatus.HEALTHY,
        service=settings.app_name,
        version="0.1.0",
        environment=settings.app_env,
    )


@app.get("/ready", tags=["Health"])
async def readiness_check(
    service: InferenceService = Depends(get_inference_service),
) -> dict[str, str]:
    if not service.is_ready():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service dependencies not yet ready",
        )
    return {"status": "ready"}


@app.post(
    "/api/v1/tasks",
    response_model=InferenceTaskResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Inference"],
)
async def submit_task(
    payload: InferenceTaskRequest,
    service: InferenceService = Depends(get_inference_service),
) -> InferenceTaskResponse:
    return await service.process_task(payload)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("unhandled_exception", error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact engineering support."},
    )
`,
  },
  {
    path: 'src/app/config.py',
    name: 'config.py',
    category: 'source',
    description: 'Pydantic Settings with fail-fast type casting and validation.',
    language: 'python',
    content: `"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
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
    return AppSettings()
`,
  },
  {
    path: 'src/app/domain.py',
    name: 'domain.py',
    category: 'source',
    description: 'Pydantic v2 schemas for requests, responses, and health models.',
    language: 'python',
    content: `"""Domain models and data schemas for API requests and business operations."""

from datetime import datetime, timezone
from enum import Enum
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class HealthStatus(str, Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"


class ServiceHealthResponse(BaseModel):
    status: HealthStatus = HealthStatus.HEALTHY
    service: str
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InferenceTaskPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"


class InferenceTaskRequest(BaseModel):
    task_id: str = Field(..., description="Unique client idempotency key or correlation ID")
    prompt: str = Field(..., min_length=1, max_length=10000, description="Input prompt payload")
    priority: InferenceTaskPriority = InferenceTaskPriority.NORMAL
    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "task_id": "req-98741",
                "prompt": "Synthesize key metrics from telemetry payload.",
                "priority": "normal",
                "metadata": {"origin": "api-gateway"},
            }
        }
    )


class InferenceTaskResponse(BaseModel):
    task_id: str
    output: str
    tokens_processed: int
    duration_ms: float
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
`,
  },
  {
    path: 'src/app/service.py',
    name: 'service.py',
    category: 'source',
    description: 'Domain service orchestration with structured logging context.',
    language: 'python',
    content: `"""Business logic and service orchestration layer."""

import time
import structlog
from app.config import AppSettings
from app.domain import InferenceTaskRequest, InferenceTaskResponse

logger = structlog.get_logger(__name__)


class InferenceService:
    def __init__(self, settings: AppSettings) -> None:
        self.settings = settings
        self._is_ready = True

    def is_ready(self) -> bool:
        return self._is_ready

    async def process_task(self, request: InferenceTaskRequest) -> InferenceTaskResponse:
        start_time = time.perf_counter()
        log = logger.bind(
            task_id=request.task_id,
            priority=request.priority.value,
            prompt_len=len(request.prompt),
        )

        log.info("task_processing_started")

        word_count = len(request.prompt.split())
        processed_output = f"Processed inference result for task {request.task_id} with {word_count} words."

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        log.info("task_processing_completed", duration_ms=elapsed_ms)

        return InferenceTaskResponse(
            task_id=request.task_id,
            output=processed_output,
            tokens_processed=word_count,
            duration_ms=elapsed_ms,
        )
`,
  },
  {
    path: 'tests/conftest.py',
    name: 'conftest.py',
    category: 'tests',
    description: 'Pytest fixtures providing test settings and TestClient instance.',
    language: 'python',
    content: `"""Shared pytest fixtures and test configurations."""

import pytest
from fastapi.testclient import TestClient
from app.config import AppSettings, get_settings
from app.main import app
from app.service import InferenceService


@pytest.fixture
def test_settings() -> AppSettings:
    return AppSettings(
        app_name="fde-python-service-test",
        app_env="test",
        log_level="DEBUG",
        api_timeout_seconds=5.0,
    )


@pytest.fixture
def inference_service(test_settings: AppSettings) -> InferenceService:
    return InferenceService(settings=test_settings)


@pytest.fixture
def client(test_settings: AppSettings) -> TestClient:
    app.dependency_overrides[get_settings] = lambda: test_settings
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
`,
  },
  {
    path: 'tests/test_api.py',
    name: 'test_api.py',
    category: 'tests',
    description: 'FastAPI integration tests for health endpoints and task execution.',
    language: 'python',
    content: `"""Integration tests for FastAPI endpoints."""

from fastapi.testclient import TestClient


def test_healthz_endpoint(client: TestClient) -> None:
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["environment"] == "test"
    assert "timestamp" in data
    assert "x-request-id" in response.headers
    assert "x-response-time-ms" in response.headers


def test_ready_endpoint(client: TestClient) -> None:
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_submit_task_success(client: TestClient) -> None:
    payload = {
        "task_id": "test-req-001",
        "prompt": "Evaluate agent reasoning traces",
        "priority": "normal",
        "metadata": {"test": True},
    }
    response = client.post("/api/v1/tasks", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["task_id"] == "test-req-001"
    assert data["tokens_processed"] == 4
    assert "output" in data
    assert "completed_at" in data


def test_submit_task_validation_error(client: TestClient) -> None:
    response = client.post("/api/v1/tasks", json={})
    assert response.status_code == 422
`,
  },
  {
    path: 'tests/test_service.py',
    name: 'test_service.py',
    category: 'tests',
    description: 'Isolated unit tests for InferenceService domain logic.',
    language: 'python',
    content: `"""Unit tests for InferenceService domain logic."""

import pytest
from app.domain import InferenceTaskPriority, InferenceTaskRequest
from app.service import InferenceService


@pytest.mark.asyncio
async def test_inference_service_process_task(inference_service: InferenceService) -> None:
    request = InferenceTaskRequest(
        task_id="task-1234",
        prompt="Analyze telemetry latency peaks across availability zones.",
        priority=InferenceTaskPriority.HIGH,
    )

    response = await inference_service.process_task(request)

    assert response.task_id == "task-1234"
    assert "Processed inference result" in response.output
    assert response.tokens_processed == 7
    assert response.duration_ms >= 0.0


def test_inference_service_readiness(inference_service: InferenceService) -> None:
    assert inference_service.is_ready() is True
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    description: 'Comprehensive architectural guide, quickstart commands, and production rationale.',
    language: 'markdown',
    content: `# Production-Grade Python Microservice Starter Kit

An enterprise-ready, high-throughput microservice template built with **FastAPI**, **Astral uv**, **Pydantic v2**, **Pydantic Settings**, and **Structlog**. Engineered to serve as the reference standard for AI-FDE (Forward Deployed Software Engineering) projects.

## Architecture Highlights
- **Astral uv**: 10-100x faster package installation and deterministic lockfile resolution via pyproject.toml.
- **Strict Static Typing**: mypy --strict configuration eliminating runtime errors.
- **Fast Linting & Formatting**: Single-binary ruff replacing black, flake8, and isort.
- **Fail-Fast Settings**: Pydantic Settings BaseSettings with environment overrides.
- **Structured JSON Logging**: Structlog with request correlation ID propagation.
- **Hardened Multi-Stage Dockerfile**: Non-root appuser with uv cache mounts and /healthz probe.
`,
  },
];
