"""Unit tests for InferenceService domain logic."""

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
