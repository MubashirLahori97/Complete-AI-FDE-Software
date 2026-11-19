"""Production FastAPI application entry point with lifespan, middleware, and routes."""

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

# Configure structlog standard processors
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
    """Lifespan context manager handling startup pre-warming and graceful shutdown."""
    settings = get_settings()
    logger.info("service_startup_init", app=settings.app_name, env=settings.app_env)
    # Pre-warm resources, threadpools, database connections here
    yield
    # Graceful teardown
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
    """Injects or propagates correlation IDs and logs structured request latency."""
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
    """Dependency injection provider for InferenceService."""
    return InferenceService(settings=settings)


@app.get("/healthz", response_model=ServiceHealthResponse, tags=["Health"])
async def health_check(settings: AppSettings = Depends(get_settings)) -> ServiceHealthResponse:
    """Kubernetes liveness probe: returns 200 if the process is responsive."""
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
    """Kubernetes readiness probe: returns 200 only if all downstream systems are active."""
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
    """Submit a task for execution."""
    return await service.process_task(payload)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Uncaught exception handler preventing stack trace leak in production."""
    logger.error("unhandled_exception", error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact engineering support."},
    )
