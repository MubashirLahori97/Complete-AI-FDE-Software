"""Integration tests for FastAPI endpoints."""

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
    # Missing required task_id and prompt
    response = client.post("/api/v1/tasks", json={})
    assert response.status_code == 422
