# Production-Grade Python Microservice Starter Kit

An enterprise-ready, high-throughput microservice template built with **FastAPI**, **Astral uv**, **Pydantic v2**, **Pydantic Settings**, and **Structlog**. Engineered to serve as the reference standard for AI-FDE (Forward Deployed Software Engineering) projects.

---

## 🎯 Architecture Philosophy

Traditional tutorials teach Python with raw `pip`, hardcoded global variables, unversioned requirements, and no observability. In production, this leads to dependency conflicts, silent crashes under load, and untraceable outages.

This template enforces **Production Day 1 Standards**:
1. **Astral `uv` Toolchain**: 10-100x faster package installation and deterministic lockfile resolution via `pyproject.toml`.
2. **Strict Static Type Checking**: Pre-configured `mypy --strict` eliminating runtime `TypeError` and `AttributeError`.
3. **High-Speed Linting & Formatting**: Single-binary `ruff` replacing Black, Flake8, isort, and Bandit in under 50ms.
4. **Typed Environment Configuration**: Immutable, fail-fast configuration via `pydantic-settings`. The app will refuse to boot if required secrets or numeric ranges are invalid.
5. **JSON Structured Observability**: `structlog` with correlation IDs (`x-request-id`) and request latency instrumentation across every call.
6. **Hardened Multi-Stage Dockerfile**: Multi-stage build with unprivileged non-root user (`appuser`), Docker cache mounting for uv, and automated health checks (`/healthz`).
7. **Production Test Suite**: Comprehensive `pytest` with fixtures, async support, and test coverage thresholds.

---

## 📁 Repository Structure

```
templates/python-service/
├── .dockerignore              # Prevents cache and secret leakage into image builds
├── .env.example               # Reference environment variables for deployment
├── Dockerfile                 # Hardened multi-stage OCI container definition
├── Makefile                   # High-leverage operational developer commands
├── pyproject.toml             # Unified tool configuration (uv, ruff, mypy, pytest)
├── README.md                  # Comprehensive architectural and operational guide
├── src/
│   └── app/
│       ├── __init__.py        # Package root & semantic version
│       ├── config.py          # Pydantic Settings with strict schema validation
│       ├── domain.py          # Pydantic v2 request/response schemas & domain types
│       ├── main.py            # FastAPI entry point, lifespan manager, middleware
│       └── service.py         # Domain business logic with structured logging
└── tests/
    ├── __init__.py
    ├── conftest.py            # Pytest fixtures and TestClient injection
    ├── test_api.py            # Integration tests for healthz, ready, and API routes
    └── test_service.py        # Isolated unit tests for service business logic
```

---

## 🚀 Quickstart

### Prerequisites
- Python 3.12+
- [Astral uv](https://docs.astral.sh/uv/) (Install: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Docker (optional, for container runs)

### 1. Environment Setup
```bash
# Clone or copy template into your project directory
cp .env.example .env

# Install all dependencies (runtime + dev tools) in seconds
make install
```

### 2. Run Linting and Type Checking
```bash
# Run Ruff linting and Mypy strict type checks
make lint

# Automatically format code
make format
```

### 3. Run Test Suite
```bash
# Execute pytest with coverage report
make test
```

### 4. Start Local Development Server
```bash
make run
# Application running at: http://127.0.0.1:8000
# Interactive OpenAPI documentation: http://127.0.0.1:8000/docs
```

---

## 🐳 Docker Deployment

The provided `Dockerfile` creates a production-hardened container:
- Unprivileged user execution (UID `10001`, `appuser`).
- Layer caching using BuildKit cache mounts for Astral uv.
- Integrated `/healthz` health check probe.

```bash
# Build the production image
make docker-build

# Run container locally
make docker-run
```

---

## 🔍 API Endpoints

| Method | Endpoint | Description | Production Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/healthz` | Process liveness probe | Kubernetes liveness probe (restarts zombie pods) |
| `GET` | `/ready` | Downstream readiness probe | Kubernetes readiness probe (routes traffic only when warm) |
| `POST` | `/api/v1/tasks` | Process inference task | Core business workload execution |
| `GET` | `/docs` | Swagger UI documentation | API debugging and client contract verification |
