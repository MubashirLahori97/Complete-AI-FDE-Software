"""Domain models and data schemas for API requests and business operations."""

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
