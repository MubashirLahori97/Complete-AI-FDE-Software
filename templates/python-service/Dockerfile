# Multi-stage production Dockerfile leveraging Astral uv for lightning-fast, cached builds
# Stage 1: Build virtual environment
FROM ghcr.io/astral-sh/uv:0.4.15-python3.12-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Install dependencies using lockfile/project file before copying code for maximum Docker layer caching
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev || uv pip install --system -r pyproject.toml

# Stage 2: Minimal hardened runtime image
FROM python:3.12-slim-bookworm AS runtime

# Security: Never run containers as root in production
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/false -m appuser

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src"

WORKDIR /app

# Copy virtualenv and application code
COPY --from=builder /app/.venv /app/.venv
COPY src/ /app/src/

# Change ownership to unprivileged user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

# Container health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/healthz')" || exit 1

ENTRYPOINT ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
