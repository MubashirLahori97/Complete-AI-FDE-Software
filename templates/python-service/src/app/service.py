"""Business logic and service orchestration layer."""

import time
import structlog
from app.config import AppSettings
from app.domain import InferenceTaskRequest, InferenceTaskResponse

logger = structlog.get_logger(__name__)


class InferenceService:
    """Core domain service executing inference workflows with resilience and telemetry."""

    def __init__(self, settings: AppSettings) -> None:
        self.settings = settings
        self._is_ready = True

    def is_ready(self) -> bool:
        """Health readiness check inspecting internal dependencies."""
        return self._is_ready

    async def process_task(self, request: InferenceTaskRequest) -> InferenceTaskResponse:
        """Process an inference request with structured log context and timing."""
        start_time = time.perf_counter()
        log = logger.bind(
            task_id=request.task_id,
            priority=request.priority.value,
            prompt_len=len(request.prompt),
        )

        log.info("task_processing_started")

        # Business logic computation / simulation
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
