.PHONY: help install lint format test run docker-build docker-run clean

help:
	@echo "Production Microservice Commands:"
	@echo "  make install      Install all runtime & dev dependencies with uv"
	@echo "  make lint         Check code with ruff and mypy"
	@echo "  make format       Format code with ruff"
	@echo "  make test         Execute pytest test suite with coverage"
	@echo "  make run          Launch FastAPI development server with hot reload"
	@echo "  make docker-build Build hardened production container image"
	@echo "  make docker-run   Run microservice container locally on :8000"
	@echo "  make clean        Remove cache and coverage artifacts"

install:
	uv sync --all-extras

lint:
	uv run ruff check .
	uv run mypy src/

format:
	uv run ruff format .
	uv run ruff check --fix .

test:
	uv run pytest

run:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

docker-build:
	docker build -t fde-python-service:latest .

docker-run:
	docker run -p 8000:8000 --env-file .env.example --rm fde-python-service:latest

clean:
	rm -rf .ruff_cache .mypy_cache .pytest_cache .coverage htmlcov/ dist/ build/
	find . -type d -name "__pycache__" -exec rm -rf {} +
