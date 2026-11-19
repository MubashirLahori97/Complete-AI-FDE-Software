// Production FastAPI Backend Engineering Data & Labs
// Complete reference & hands-on project for building production backends with FastAPI and Python

export interface FastApiTestCase {
  id: string;
  name: string;
  description: string;
}

export interface FastApiLab {
  id: string;
  number: number;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  category: string;
  summary: string;
  whyItMattersInProduction: string;
  toyVsProd: {
    toyCode: string;
    prodCode: string;
    keyDifference: string;
  };
  specification: string[];
  starterCode: string;
  solutionCode: string;
  testSuiteCode: string;
  testCases: FastApiTestCase[];
  architectureNotes: string;
}

export const FASTAPI_OVERVIEW = {
  title: 'FastAPI Production Backend Architecture',
  summary:
    'FastAPI is a modern, high-performance web framework for building APIs with Python 3.10+ based on standard Python type hints, Starlette for web tooling, and Pydantic for data validation.',
  corePillars: [
    {
      title: 'ASGI Lifecycle & Lifespan Management',
      description:
        'FastAPI applications run on ASGI servers (like Uvicorn). Modern FastAPI uses `@asynccontextmanager` lifespan handlers to initialize database pools, pre-warm caches, and guarantee graceful resource teardown.',
    },
    {
      title: 'Pydantic v2 Validation Pipeline',
      description:
        'Every inbound request body is compiled and validated against strict Pydantic schemas in Rust (via pydantic-core). Mismatches fail fast with HTTP 422 before route handler code ever runs.',
    },
    {
      title: 'Dependency Injection (Depends)',
      description:
        'FastAPI features a hierarchical dependency injection container. Endpoints declare dependencies (database sessions, authentication, rate limiters) via `Depends()`, enabling clean testing via dependency overrides.',
    },
    {
      title: 'Structured Observability & Error Envelopes',
      description:
        'Production backends never return raw 500 HTML tracebacks. They enforce global exception handlers and correlation ID middleware (`x-request-id`) to trace requests across microservices.',
    },
  ],
};

export const FASTAPI_LABS: FastApiLab[] = [
  {
    id: 'fastapi-lab-1',
    number: 1,
    title: 'Lab 1: Lifespan Context Manager & Health Probes',
    difficulty: 'beginner',
    duration: '30 min',
    category: 'Architecture & Startup',
    summary:
      'Replace legacy `@app.on_event("startup")` with modern `@asynccontextmanager` lifespan management and implement production Kubernetes `/healthz` (liveness) and `/ready` (readiness) probes.',
    whyItMattersInProduction:
      'Kubernetes relies on liveness probes to restart crashed pods and readiness probes to avoid sending traffic before database connection pools are warmed up.',
    toyVsProd: {
      toyCode: `@app.on_event("startup")  # Deprecated in modern FastAPI!
def startup():
    print("App started")`,
      prodCode: `@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup connection pools & caches
    app.state.ready = True
    yield
    # Graceful teardown
    app.state.ready = False`,
      keyDifference:
        'Modern lifespan handlers provide deterministic startup/shutdown ordering and state binding without deprecated event decorators.',
    },
    specification: [
      'Define an `AppLifespanState` class tracking `is_ready: bool` and `startup_time: float`.',
      'Create an `@asynccontextmanager` named `lifespan(app: FastAPI)` that initializes state before yield and resets state after yield.',
      'Implement `GET /healthz` returning `{"status": "healthy"}` with HTTP 200.',
      'Implement `GET /ready` returning `{"status": "ready"}` when ready, or raising HTTP 503 if not ready.',
    ],
    starterCode: `from contextlib import asynccontextmanager
from typing import AsyncIterator

class AppState:
    def __init__(self):
        self.is_ready = False

state = AppState()

@asynccontextmanager
async def lifespan(app) -> AsyncIterator[None]:
    # TODO: Set state.is_ready = True on startup
    # TODO: yield control
    # TODO: Set state.is_ready = False on shutdown
    pass

def healthz_handler() -> dict:
    # TODO: Return liveness status
    pass

def ready_handler(app_state: AppState) -> tuple[int, dict]:
    # TODO: Return (200, {"status": "ready"}) if is_ready else (503, {"status": "not ready"})
    pass
`,
    solutionCode: `from contextlib import asynccontextmanager
from typing import AsyncIterator

class AppState:
    def __init__(self):
        self.is_ready = False

state = AppState()

@asynccontextmanager
async def lifespan(app) -> AsyncIterator[None]:
    state.is_ready = True
    try:
        yield
    finally:
        state.is_ready = False

def healthz_handler() -> dict:
    return {"status": "healthy"}

def ready_handler(app_state: AppState) -> tuple[int, dict]:
    if not app_state.is_ready:
        return 503, {"status": "not ready"}
    return 200, {"status": "ready"}
`,
    architectureNotes:
      'In production FastAPI, attach your database engines and Redis connection pools to `app.state` inside the lifespan context manager, then access them cleanly in dependency providers.',
    testSuiteCode: `def test_suite():
    import asyncio

    test_state = AppState()
    assert not test_state.is_ready, "Initial state must not be ready"

    # Test 1: Liveness handler
    res = healthz_handler()
    assert res == {"status": "healthy"}, "Healthz must return status healthy"
    print("PASS: test_healthz_probe")

    # Test 2: Readiness when not ready
    code, ready_res = ready_handler(test_state)
    assert code == 503, "Readiness before lifespan must be 503"
    print("PASS: test_readiness_not_ready")

    # Test 3: Lifespan lifecycle
    async def run_lifecycle():
        async with lifespan(None):
            assert state.is_ready is True, "State must be ready inside lifespan"
            code, ok_res = ready_handler(state)
            assert code == 200, "Readiness inside lifespan must be 200"
        assert state.is_ready is False, "State must reset after lifespan teardown"

    asyncio.run(run_lifecycle())
    print("PASS: test_lifespan_lifecycle")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Liveness Healthz', description: 'Returns 200 healthy probe.' },
      { id: 't2', name: 'Readiness Guard', description: 'Returns 503 until warmup completes.' },
      { id: 't3', name: 'Lifespan Cleanup', description: 'Guarantees state reset on shutdown.' },
    ],
  },
  {
    id: 'fastapi-lab-2',
    number: 2,
    title: 'Lab 2: Dependency Injection & Service Layer Pattern',
    difficulty: 'intermediate',
    duration: '40 min',
    category: 'Dependency Injection',
    summary:
      'Decouple route handlers from business logic and database sessions by implementing the Service Layer pattern using FastAPI Depends().',
    whyItMattersInProduction:
      'Writing database queries and business calculations directly inside route handlers leads to untestable spaghetti code. Production teams inject services via Depends().',
    toyVsProd: {
      toyCode: `@app.post("/items")
async def create_item(name: str):
    # Direct DB query and logic inside route
    db = get_database()
    return db.insert({"name": name})`,
      prodCode: `@app.post("/items", response_model=ItemResponse)
async def create_item(
    payload: ItemCreate,
    service: ItemService = Depends(get_item_service),
):
    return await service.create_item(payload)`,
      keyDifference:
        'Dependency injection makes the route a thin transport adapter, allowing 100% unit test coverage with mock services.',
    },
    specification: [
      'Create an `ItemRepository` protocol/interface with `add(name: str) -> dict` and `get(id: str) -> dict | None`.',
      'Implement an `InMemoryItemRepository` storing items in an internal dictionary.',
      'Implement an `ItemService` taking the repository in its `__init__`.',
      'Implement `get_item_service(repo: ItemRepository = None) -> ItemService` dependency provider.',
    ],
    starterCode: `class ItemRepository:
    def add(self, item_id: str, name: str) -> dict:
        raise NotImplementedError

    def get(self, item_id: str) -> dict | None:
        raise NotImplementedError

class InMemoryItemRepository(ItemRepository):
    def __init__(self):
        self._storage = {}

    def add(self, item_id: str, name: str) -> dict:
        # TODO: Store item and return dict
        pass

    def get(self, item_id: str) -> dict | None:
        # TODO: Retrieve item or None
        pass

class ItemService:
    def __init__(self, repo: ItemRepository):
        self.repo = repo

    def create_item(self, item_id: str, name: str) -> dict:
        # TODO: Validate name length >= 2, then delegate to repo.add
        pass

def get_item_service(repo: ItemRepository = None) -> ItemService:
    # TODO: Dependency injection factory
    pass
`,
    solutionCode: `class ItemRepository:
    def add(self, item_id: str, name: str) -> dict:
        raise NotImplementedError

    def get(self, item_id: str) -> dict | None:
        raise NotImplementedError

class InMemoryItemRepository(ItemRepository):
    def __init__(self):
        self._storage = {}

    def add(self, item_id: str, name: str) -> dict:
        record = {"id": item_id, "name": name}
        self._storage[item_id] = record
        return record

    def get(self, item_id: str) -> dict | None:
        return self._storage.get(item_id)

class ItemService:
    def __init__(self, repo: ItemRepository):
        self.repo = repo

    def create_item(self, item_id: str, name: str) -> dict:
        if len(name.strip()) < 2:
            raise ValueError("Item name must be at least 2 characters.")
        return self.repo.add(item_id, name.strip())

def get_item_service(repo: ItemRepository = None) -> ItemService:
    active_repo = repo if repo is not None else InMemoryItemRepository()
    return ItemService(repo=active_repo)
`,
    architectureNotes:
      'FastAPI resolution inspects function signatures and executes sub-dependencies recursively, allowing request-scoped database sessions to auto-close.',
    testSuiteCode: `def test_suite():
    # Test 1: Service factory
    service = get_item_service()
    assert isinstance(service, ItemService)
    print("PASS: test_service_injection")

    # Test 2: Create valid item
    item = service.create_item("item-101", "Vector Indexer")
    assert item["id"] == "item-101"
    assert item["name"] == "Vector Indexer"
    print("PASS: test_item_creation")

    # Test 3: Validation rejection
    try:
        service.create_item("item-102", "x")
        assert False, "Should raise ValueError for short name"
    except ValueError:
        print("PASS: test_validation_guard")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'DI Factory', description: 'Injects configured repository into service.' },
      { id: 't2', name: 'Domain Logic', description: 'Executes item creation through service layer.' },
      { id: 't3', name: 'Input Validation', description: 'Rejects invalid domain payloads.' },
    ],
  },
  {
    id: 'fastapi-lab-3',
    number: 3,
    title: 'Lab 3: Pydantic v2 Strict Validation & Response Filtering',
    difficulty: 'intermediate',
    duration: '35 min',
    category: 'Data Validation',
    summary:
      'Build strict Pydantic v2 schemas that enforce field constraints, email formatting, and ensure internal database secrets (like hashed passwords or internal flags) are never exposed.',
    whyItMattersInProduction:
      'Over-posting vulnerabilities and accidental database secret leaks happen when developers return raw dictionary models without strict response filtering.',
    toyVsProd: {
      toyCode: `@app.get("/user/{id}")
def get_user(id: int):
    # Dumps entire DB row including hashed_password!
    return db.query_raw_user(id)`,
      prodCode: `@app.get("/user/{id}", response_model=UserPublicResponse)
def get_user(id: int):
    # Pydantic schema strictly strips out sensitive fields
    return service.get_user(id)`,
      keyDifference:
        'Response models guarantee strict schema serialization boundaries, preventing accidental data breaches.',
    },
    specification: [
      'Define a `UserCreate` schema with `username: str` (min 3 chars), `email: str` (valid format), and `role: str` ("user" | "admin").',
      'Define a `UserInDB` schema containing all fields plus `password_hash: str` and `internal_score: float`.',
      'Define a `UserPublic` response schema that exposes ONLY `id`, `username`, and `email`.',
      'Implement `serialize_public_user(user_db_dict: dict) -> dict` returning only public fields.',
    ],
    starterCode: `import re

class UserValidator:
    """Validates user creation payloads and serializes public response contracts."""

    @staticmethod
    def validate_create_payload(payload: dict) -> dict:
        # TODO: Validate 'username' (str, len >= 3)
        # TODO: Validate 'email' (contains '@' and '.')
        # TODO: Validate 'role' in ('user', 'admin')
        pass

    @staticmethod
    def serialize_public_profile(internal_user_record: dict) -> dict:
        # TODO: Return dict with ONLY 'id', 'username', and 'email'
        # TODO: Ensure password_hash and internal_score are stripped out
        pass
`,
    solutionCode: `import re

class UserValidator:
    """Validates user creation payloads and serializes public response contracts."""

    @staticmethod
    def validate_create_payload(payload: dict) -> dict:
        username = payload.get("username")
        if not isinstance(username, str) or len(username.strip()) < 3:
            raise ValueError("Username must be at least 3 characters.")

        email = payload.get("email")
        if not isinstance(email, str) or "@" not in email or "." not in email:
            raise ValueError("Invalid email format.")

        role = payload.get("role", "user")
        if role not in ("user", "admin"):
            raise ValueError("Role must be 'user' or 'admin'.")

        return {
            "username": username.strip(),
            "email": email.strip().lower(),
            "role": role,
        }

    @staticmethod
    def serialize_public_profile(internal_user_record: dict) -> dict:
        return {
            "id": internal_user_record["id"],
            "username": internal_user_record["username"],
            "email": internal_user_record["email"],
        }
`,
    architectureNotes:
      'In FastAPI, Pydantic v2 `BaseModel` models use `model_config = ConfigDict(extra="forbid")` to reject unknown fields in request bodies.',
    testSuiteCode: `def test_suite():
    validator = UserValidator()

    # Test 1: Valid payload
    payload = {"username": "fde_engineer", "email": "engineer@enterprise.io", "role": "admin"}
    clean = validator.validate_create_payload(payload)
    assert clean["username"] == "fde_engineer"
    assert clean["role"] == "admin"
    print("PASS: test_valid_payload")

    # Test 2: Invalid email rejection
    try:
        validator.validate_create_payload({"username": "alex", "email": "bademail"})
        assert False, "Must reject invalid email"
    except ValueError:
        print("PASS: test_invalid_email_rejected")

    # Test 3: Secret stripping
    internal_record = {
        "id": "u-991",
        "username": "fde_engineer",
        "email": "engineer@enterprise.io",
        "password_hash": "$argon2id$v=19$m=65536,t=3,p=4$secret_hash",
        "internal_score": 98.4,
    }
    public_view = validator.serialize_public_profile(internal_record)
    assert "password_hash" not in public_view, "password_hash must never leak"
    assert "internal_score" not in public_view, "internal_score must never leak"
    assert set(public_view.keys()) == {"id", "username", "email"}
    print("PASS: test_secret_filtering")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Input Validation', description: 'Enforces length, email format, and roles.' },
      { id: 't2', name: 'Schema Rejection', description: 'Throws clear ValueError on invalid inputs.' },
      { id: 't3', name: 'Security Sanitization', description: 'Guarantees internal secrets are stripped.' },
    ],
  },
  {
    id: 'fastapi-lab-4',
    number: 4,
    title: 'Lab 4: Global Exception Envelopes & Error Handlers',
    difficulty: 'advanced',
    duration: '45 min',
    category: 'Error Architecture',
    summary:
      'Implement production-grade global exception handlers returning consistent RFC 7807 JSON error envelopes with correlation tracking IDs.',
    whyItMattersInProduction:
      'Inconsistent error responses break frontend client parsers. Uniform error envelopes (`error.code`, `error.message`, `trace_id`) ensure reliable API consumption.',
    toyVsProd: {
      toyCode: `@app.get("/order/{id}")
def get_order(id: int):
    # If error happens, client receives generic 500 HTML or unhandled traceback
    raise Exception("Database timeout")`,
      prodCode: `@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": str(exc), "trace_id": request.state.trace_id}}
    )`,
      keyDifference:
        'Standardized error envelopes allow clients to parse errors programmatically without fragile string matching.',
    },
    specification: [
      'Create an `ApiDomainError(Exception)` base class with `status_code: int`, `error_code: str`, and `message: str`.',
      'Create `ResourceNotFoundError` (HTTP 404, code="NOT_FOUND") and `RateLimitExceededError` (HTTP 429, code="RATE_LIMITED").',
      'Implement `format_error_envelope(exc: ApiDomainError, trace_id: str) -> tuple[int, dict]`.',
      'Ensure standard envelope shape: `{"error": {"code": ..., "message": ..., "trace_id": ...}}`.',
    ],
    starterCode: `class ApiDomainError(Exception):
    def __init__(self, message: str, status_code: int = 400, error_code: str = "BAD_REQUEST"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

class ResourceNotFoundError(ApiDomainError):
    # TODO: Initialize with status 404 and code "RESOURCE_NOT_FOUND"
    pass

class RateLimitExceededError(ApiDomainError):
    # TODO: Initialize with status 429 and code "RATE_LIMIT_EXCEEDED"
    pass

def format_error_envelope(exc: Exception, trace_id: str) -> tuple[int, dict]:
    # TODO: Return (status_code, envelope_dict)
    # TODO: If exc is ApiDomainError, use its status and code
    # TODO: If generic Exception, return status 500 and code "INTERNAL_SERVER_ERROR"
    pass
`,
    solutionCode: `class ApiDomainError(Exception):
    def __init__(self, message: str, status_code: int = 400, error_code: str = "BAD_REQUEST"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

class ResourceNotFoundError(ApiDomainError):
    def __init__(self, resource_name: str, resource_id: str):
        super().__init__(
            message=f"{resource_name} with id '{resource_id}' was not found.",
            status_code=404,
            error_code="RESOURCE_NOT_FOUND",
        )

class RateLimitExceededError(ApiDomainError):
    def __init__(self, retry_after_seconds: int = 60):
        super().__init__(
            message=f"Rate limit exceeded. Retry after {retry_after_seconds} seconds.",
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
        )

def format_error_envelope(exc: Exception, trace_id: str) -> tuple[int, dict]:
    if isinstance(exc, ApiDomainError):
        status_code = exc.status_code
        error_code = exc.error_code
        message = exc.message
    else:
        status_code = 500
        error_code = "INTERNAL_SERVER_ERROR"
        message = "An unexpected error occurred. Please contact engineering support."

    envelope = {
        "error": {
            "code": error_code,
            "message": message,
            "trace_id": trace_id,
        }
    }
    return status_code, envelope
`,
    architectureNotes:
      'FastAPI global exception handlers catch exceptions before they reach the ASGI server, converting unhandled exceptions into structured JSON payloads.',
    testSuiteCode: `def test_suite():
    # Test 1: 404 Resource Not Found
    err_404 = ResourceNotFoundError("Order", "ord-9821")
    status, payload = format_error_envelope(err_404, trace_id="req-abc-123")
    assert status == 404
    assert payload["error"]["code"] == "RESOURCE_NOT_FOUND"
    assert "ord-9821" in payload["error"]["message"]
    assert payload["error"]["trace_id"] == "req-abc-123"
    print("PASS: test_404_error_envelope")

    # Test 2: 429 Rate Limit
    err_429 = RateLimitExceededError(retry_after_seconds=30)
    status, payload = format_error_envelope(err_429, trace_id="req-xyz-789")
    assert status == 429
    assert payload["error"]["code"] == "RATE_LIMIT_EXCEEDED"
    print("PASS: test_429_error_envelope")

    # Test 3: Unhandled 500 error sanitization
    generic_err = RuntimeError("Disk IO failure")
    status, payload = format_error_envelope(generic_err, trace_id="req-500-test")
    assert status == 500
    assert payload["error"]["code"] == "INTERNAL_SERVER_ERROR"
    assert "Disk IO failure" not in payload["error"]["message"], "Never leak raw exception tracebacks"
    print("PASS: test_500_sanitization")

test_suite()
`,
    testCases: [
      { id: 't1', name: '404 Envelope', description: 'Standard NOT_FOUND envelope with ID.' },
      { id: 't2', name: '429 Envelope', description: 'Rate limit envelope with retry instructions.' },
      { id: 't3', name: '500 Sanitization', description: 'Hides internal crashes from external callers.' },
    ],
  },
];

export interface FastApiRoadmapTopic {
  id: string;
  title: string;
  summary: string;
  codeSnippet: string;
  productionBestPractice: string;
  commonPitfall: string;
}

export interface FastApiRoadmapStage {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
  topics: FastApiRoadmapTopic[];
}

export interface FastApiProjectFile {
  path: string;
  category: string;
  description: string;
  language: string;
  code: string;
}

export const FASTAPI_ROADMAP_STAGES: FastApiRoadmapStage[] = [
  {
    id: 'stage-1',
    number: 1,
    title: 'Stage 1: Core ASGI Architecture & Type-Driven Requests',
    tagline: 'Event-Driven Concurrency & Semantic HTTP Routing',
    description:
      'Understand the ASGI event loop, why async def differs from def, and how Python type annotations become runtime validation contracts and interactive OpenAPI specifications.',
    topics: [
      {
        id: 'topic-1-1',
        title: 'ASGI Concurrency Model vs Legacy WSGI',
        summary:
          'FastAPI runs on ASGI (Asynchronous Server Gateway Interface) servers like Uvicorn or Granian. Unlike WSGI which allocates a thread per request, ASGI executes thousands of concurrent I/O operations on a single event loop without thread overhead.',
        codeSnippet: `from fastapi import FastAPI
import asyncio

app = FastAPI()

# Non-blocking async route: yields to event loop during I/O
@app.get("/items/async")
async def get_items_async():
    await asyncio.sleep(0.05)  # Simulates async DB or external HTTP
    return {"message": "Non-blocking event loop execution"}

# Sync route: FastAPI automatically offloads this to an anyio worker threadpool
@app.get("/items/sync")
def get_items_sync():
    # CPU-bound or legacy blocking code should be plain 'def'
    return {"message": "Executed safely in worker thread"}`,
        productionBestPractice:
          'Use async def when using non-blocking async drivers (asyncpg, httpx, redis.asyncio). If you must call blocking synchronous libraries (e.g. legacy boto3 or requests), declare the handler as plain def so FastAPI automatically offloads it to a threadpool without freezing the ASGI event loop.',
        commonPitfall:
          'Calling time.sleep() or synchronous requests.get() inside an async def handler freezes the entire ASGI event loop for all concurrent users.',
      },
      {
        id: 'topic-1-2',
        title: 'Annotated Parameter Extraction & Constraints',
        summary:
          'FastAPI integrates PEP 593 typing.Annotated to attach metadata (Path, Query, Header, Cookie) directly to type hints, keeping route signatures type-safe and clean.',
        codeSnippet: `from typing import Annotated
from fastapi import FastAPI, Path, Query, status

app = FastAPI()

@app.get("/users/{user_id}/orders", status_code=status.HTTP_200_OK)
async def list_user_orders(
    user_id: Annotated[int, Path(title="User ID", ge=1, description="Positive integer identifier")],
    page: Annotated[int, Query(ge=1, le=100)] = 1,
    page_size: Annotated[int, Query(ge=10, le=100)] = 20,
    search: Annotated[str | None, Query(max_length=64)] = None,
):
    return {"user_id": user_id, "page": page, "page_size": page_size, "search": search}`,
        productionBestPractice:
          'Always use typing.Annotated with explicit bounds (ge, le, max_length) on Path and Query parameters to reject malicious or unbounded inputs at the gateway boundary.',
        commonPitfall:
          'Using unconstrained integer parameters allows attackers to trigger database errors or buffer overflows with extreme numbers.',
      },
      {
        id: 'topic-1-3',
        title: 'Strict REST Status Codes & Response Envelopes',
        summary:
          'Production APIs communicate intent through precise HTTP status codes: 201 Created with Location header, 204 No Content for deletions, and strict 4xx/5xx codes.',
        codeSnippet: `from fastapi import FastAPI, Response, status
from pydantic import BaseModel

app = FastAPI()

class TaskCreate(BaseModel):
    title: str

@app.post("/tasks", status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, response: Response):
    new_task_id = 42
    response.headers["Location"] = f"/tasks/{new_task_id}"
    return {"id": new_task_id, "title": payload.title}

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int):
    # Perform deletion logic
    return Response(status_code=status.HTTP_204_NO_CONTENT)`,
        productionBestPractice:
          'Never return HTTP 200 OK with {"error": "..."} in the JSON body. Always leverage standard HTTP semantic status codes so load balancers, proxies, and clients can correctly handle errors and retries.',
        commonPitfall:
          'Returning HTTP 200 for newly created resources or failed actions, breaking HTTP caching and retry semantics.',
      },
    ],
  },
  {
    id: 'stage-2',
    number: 2,
    title: 'Stage 2: Pydantic v2 Contracts & Rust-Speed Validation',
    tagline: 'Deterministic Inbound/Outbound Data Guarantees',
    description:
      'Master Pydantic v2 compiled in Rust (pydantic-core). Enforce strict separation between inbound request DTOs, database ORM entities, and outbound sanitized response models.',
    topics: [
      {
        id: 'topic-2-1',
        title: 'Pydantic v2 Core & Strict Configuration',
        summary:
          'Pydantic v2 executes validation logic in compiled Rust. By configuring ConfigDict(extra="forbid", strict=True), you protect endpoints against unknown field injection attacks.',
        codeSnippet: `from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserRegistrationDTO(BaseModel):
    model_config = ConfigDict(
        extra="forbid",         # Reject unexpected fields immediately (prevents payload poisoning)
        str_strip_whitespace=True, # Strip leading/trailing whitespaces automatically
    )
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=32, pattern=r"^[a-zA-Z0-9_]+$")
    age: int = Field(..., ge=18, le=120)`,
        productionBestPractice:
          'Always set extra="forbid" on mutation DTOs (POST, PUT, PATCH). This prevents attackers from injecting unintended properties (e.g. is_admin=True) into your database layers.',
        commonPitfall:
          'Allowing extra="allow" causes mass assignment vulnerabilities where client JSON overrides internal database columns.',
      },
      {
        id: 'topic-2-2',
        title: 'Outbound Response Models & Secret Sanitization',
        summary:
          'Never return raw database models directly. Outbound response models guarantee that sensitive attributes like hashed passwords, internal tenant keys, or audit flags are never exposed.',
        codeSnippet: `from pydantic import BaseModel, ConfigDict
from fastapi import FastAPI

app = FastAPI()

# Database model representation (internal)
class UserInternal:
    def __init__(self, id: int, email: str, hashed_password: str, internal_tier: str):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password
        self.internal_tier = internal_tier

# Outbound Public DTO
class UserPublicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True) # Supports ORM entity mapping
    id: int
    email: str

@app.get("/users/{user_id}", response_model=UserPublicResponse)
async def get_user(user_id: int):
    # Returns DB object containing hashed_password, but FastAPI filters it out!
    user = UserInternal(user_id, "eng@company.internal", "$argon2id$v=19$...", "tier_vip")
    return user`,
        productionBestPractice:
          'Always declare explicit response_model on route definitions. FastAPI uses this schema to prune any unlisted attributes, guaranteeing confidential fields never leak over the wire.',
        commonPitfall:
          'Returning SQLAlchemy models or raw dictionaries without response_model, accidentally exposing hashed passwords or internal metadata.',
      },
      {
        id: 'topic-2-3',
        title: 'Field Validators & Cross-Field Model Validators',
        summary:
          'Enforce complex domain validation rules using @field_validator and @model_validator(mode="after") before data reaches your service layer.',
        codeSnippet: `from datetime import date
from pydantic import BaseModel, field_validator, model_validator

class ReservationRequest(BaseModel):
    check_in: date
    check_out: date
    guest_count: int

    @field_validator("guest_count")
    @classmethod
    def validate_guests(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Guest count must be at least 1")
        if v > 10:
            raise ValueError("Groups larger than 10 require corporate booking")
        return v

    @model_validator(mode="after")
    def validate_date_range(self) -> "ReservationRequest":
        if self.check_out <= self.check_in:
            raise ValueError("Check-out date must be strictly after check-in date")
        return self`,
        productionBestPractice:
          'Keep domain invariants inside Pydantic schemas so that invalid requests fail immediately with clear HTTP 422 errors before any database queries execute.',
        commonPitfall:
          'Writing manual validation if-statements inside router functions, resulting in duplicated code and inconsistent error envelopes.',
      },
    ],
  },
  {
    id: 'stage-3',
    number: 3,
    title: 'Stage 3: Advanced Dependency Injection (`Depends`) & Security',
    tagline: 'Hierarchical Inversion of Control & Authentication',
    description:
      'Leverage FastAPI’s built-in dependency injection container for database sessions, JWT authentication, role-based access control (RBAC), and 100% hermetic unit testing.',
    topics: [
      {
        id: 'topic-3-1',
        title: 'Asynchronous Context Manager Dependencies (`yield`)',
        summary:
          'FastAPI supports dependencies with yield. Code before yield executes before the route handler; code after yield executes after the response is sent, guaranteeing resource cleanup even if exceptions occur.',
        codeSnippet: `from typing import AsyncGenerator
from fastapi import Depends, FastAPI

app = FastAPI()

class DatabaseSession:
    async def commit(self): pass
    async def rollback(self): pass
    async def close(self): pass

async def get_db_session() -> AsyncGenerator[DatabaseSession, None]:
    session = DatabaseSession()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close() # Guaranteed execution!

@app.post("/items")
async def create_item(session: DatabaseSession = Depends(get_db_session)):
    return {"status": "Item created with safe session lifecycle"}`,
        productionBestPractice:
          'Always use yield in database session dependencies to guarantee transaction rollback on error and proper connection return to the connection pool.',
        commonPitfall:
          'Opening database connections manually inside route functions without try/finally, causing connection pool exhaustion during traffic spikes.',
      },
      {
        id: 'topic-3-2',
        title: 'JWT Bearer Authentication & RBAC Authorization',
        summary:
          'Implement secure stateless authentication using OAuth2PasswordBearer, PyJWT, and parameterized role dependencies.',
        codeSnippet: `from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
SECRET_KEY = "enterprise-production-signing-key"

class CurrentUser:
    def __init__(self, user_id: int, roles: list[str]):
        self.user_id = user_id
        self.roles = roles

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> CurrentUser:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return CurrentUser(user_id=payload["sub"], roles=payload.get("roles", []))
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate bearer credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_role(required_role: str):
    def role_checker(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if required_role not in user.roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Missing '{required_role}' privilege",
            )
        return user
    return role_checker

@app.delete("/admin/users/{user_id}", dependencies=[Depends(require_role("admin"))])
async def delete_user(user_id: int):
    return {"message": f"User {user_id} deleted by verified admin"}`,
        productionBestPractice:
          'Structure authorization as reusable dependency factories (require_role("admin")). This keeps endpoint logic clean and auditable.',
        commonPitfall:
          'Writing manual token parsing in every route handler, leading to inconsistent security checks and forgotten authorization gates.',
      },
      {
        id: 'topic-3-3',
        title: 'Hermetic Testing with `app.dependency_overrides`',
        summary:
          'FastAPI provides app.dependency_overrides to swap real database sessions, external third-party APIs, or auth handlers with test mocks during pytest runs without monkeypatching.',
        codeSnippet: `from fastapi.testclient import TestClient
import pytest

# In your test suite:
def test_create_item_with_mocked_db():
    class MockDbSession:
        async def commit(self): pass

    async def override_get_db_session():
        yield MockDbSession()

    # Override real database dependency
    app.dependency_overrides[get_db_session] = override_get_db_session

    client = TestClient(app)
    response = client.post("/items", json={"name": "Test Item"})
    assert response.status_code == 200

    # Clean up overrides after test
    app.dependency_overrides.clear()`,
        productionBestPractice:
          'Use app.dependency_overrides in pytest fixtures with autouse=False to inject mock databases or mock user identities for fast, deterministic integration tests.',
        commonPitfall:
          'Modifying global application state or using fragile monkeypatching when dependency overrides provide a first-class supported mechanism.',
      },
    ],
  },
  {
    id: 'stage-4',
    number: 4,
    title: 'Stage 4: Asynchronous Database Persistence (SQLAlchemy 2.0 & Alembic)',
    tagline: 'High-Throughput Non-Blocking SQL Operations',
    description:
      'Integrate modern Async SQLAlchemy 2.0 with asyncpg for PostgreSQL, configure robust connection pooling with health pre-pings, and execute zero-downtime Alembic migrations.',
    topics: [
      {
        id: 'topic-4-1',
        title: 'SQLAlchemy 2.0 Async Engine & Pool Tuning',
        summary:
          'Configure create_async_engine with proper pool sizing, connection recycling, and pool_pre_ping=True to prevent stale connection errors after network drops or database failovers.',
        codeSnippet: `from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/production_db"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,                   # Set False in production to avoid logging sensitive query data
    pool_size=10,                 # Base persistent connection count
    max_overflow=20,              # Burst connection allowance during traffic spikes
    pool_recycle=1800,            # Reconnect every 30 min to avoid stale firewall cuts
    pool_pre_ping=True,           # Test connection liveness before checkout (prevents 500s on stale sockets)
    pool_timeout=30,              # Fail fast if pool is exhausted after 30 seconds
)

AsyncSessionFactory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,       # Prevents lazy-load errors when accessing attributes after commit
    autocommit=False,
    autoflush=False,
)`,
        productionBestPractice:
          'Always set pool_pre_ping=True and expire_on_commit=False in Async SQLAlchemy. pool_pre_ping prevents drops from idle connection disconnects, and expire_on_commit prevents unexpected greenlet errors.',
        commonPitfall:
          'Omitting pool_pre_ping=True, resulting in intermittent OperationalError: connection closed by remote host after periods of inactivity.',
      },
      {
        id: 'topic-4-2',
        title: 'Modern Declarative Mapped Models & Queries',
        summary:
          'Use SQLAlchemy 2.0 Mapped[] typing syntax and 2.0 style select() statements for fully type-checked database interactions.',
        codeSnippet: `from datetime import datetime, timezone
from sqlalchemy import String, DateTime, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class TaskModel(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

# Execution in repository/service layer
async def get_active_tasks(session: AsyncSession) -> list[TaskModel]:
    stmt = select(TaskModel).where(TaskModel.status == "pending").order_by(TaskModel.id.desc()).limit(50)
    result = await session.scalars(stmt)
    return list(result.all())`,
        productionBestPractice:
          'Always use scalars(stmt) instead of execute(stmt).scalars() in 2.0, and specify database indexes on columns frequently used in WHERE filters.',
        commonPitfall:
          'Using legacy 1.x session.query(TaskModel) which bypasses modern typing and async execution guarantees.',
      },
      {
        id: 'topic-4-3',
        title: 'Zero-Downtime Alembic Database Migrations',
        summary:
          'Manage schema evolution safely. Configure async env.py and ensure column additions are nullable or specify server defaults to prevent database table locks.',
        codeSnippet: `# alembic/env.py snippet for async migrations
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=Base.metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations():
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()`,
        productionBestPractice:
          'Never add a NOT NULL column without a default value in production. Always make new columns nullable or set a server_default, then backfill data before adding strict constraints.',
        commonPitfall:
          'Running synchronous alembic migrations directly on production without connection recycling or running migrations inside the web worker startup process.',
      },
    ],
  },
  {
    id: 'stage-5',
    number: 5,
    title: 'Stage 5: Enterprise Observability, RFC 7807 & Resilience',
    tagline: 'Distributed Tracing, Sanitized Errors & Fault Tolerance',
    description:
      'Build resilient microservices. Implement global RFC 7807 exception envelopes, distributed correlation ID tracking, structured JSON logging, and connection-pooled HTTP clients with exponential backoff.',
    topics: [
      {
        id: 'topic-5-1',
        title: 'Distributed Correlation ID (`x-request-id`) Middleware',
        summary:
          'Propagate a unique UUID request ID across your entire distributed microservice architecture. Receive or generate x-request-id, attach it to response headers and structured log contexts.',
        codeSnippet: `import uuid
import time
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id

        start_time = time.perf_counter()
        response = await call_next(request)
        duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        response.headers["x-request-id"] = correlation_id
        response.headers["x-response-time-ms"] = str(duration_ms)
        return response

app.add_middleware(CorrelationIdMiddleware)`,
        productionBestPractice:
          'Attach request.state.correlation_id to all outbound HTTP calls and database query comments so on-call engineers can trace a request end-to-end across services.',
        commonPitfall:
          'Using print() or unindexed logs that cannot be correlated during cross-service outages.',
      },
      {
        id: 'topic-5-2',
        title: 'Global RFC 7807 Problem Details Exception Handler',
        summary:
          'Never allow unhandled Python exceptions to leak raw stack traces or internal filenames to users. Catch all unhandled exceptions, log the real traceback privately, and return a clean RFC 7807 JSON envelope.',
        codeSnippet: `from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
import logging

app = FastAPI()
logger = logging.getLogger("enterprise.api")

@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception):
    correlation_id = getattr(request.state, "correlation_id", "unknown-id")
    # Log private details internally
    logger.error("Unhandled API exception", exc_info=exc, extra={"request_id": correlation_id})

    # Return clean, sanitized RFC 7807 contract to client
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "type": "https://errors.api.enterprise/internal-error",
            "title": "Internal Server Error",
            "status": 500,
            "detail": "An unexpected error occurred. Please quote the reference ID to engineering support.",
            "instance": request.url.path,
            "request_id": correlation_id,
        },
    )`,
        productionBestPractice:
          'Enforce RFC 7807 Problem Details across all 4xx and 5xx responses for API consistency across languages and frontends.',
        commonPitfall:
          'Allowing default FastAPI HTML 500 errors to leak database passwords, file paths, or third-party API keys in production.',
      },
      {
        id: 'topic-5-3',
        title: 'Resilient Outbound Calls (HTTPX Pooling & Exponential Backoff)',
        summary:
          'Microservices constantly interact with external APIs. Reusing an httpx.AsyncClient with connection pooling and implementing exponential backoff with full jitter prevents cascading service collapse.',
        codeSnippet: `import asyncio
import random
import httpx

class ExternalClient:
    def __init__(self):
        # Connection pooling and timeouts are mandatory
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(connect=2.0, read=5.0, write=5.0, pool=10.0),
            limits=httpx.Limits(max_keepalive_connections=20, max_connections=100),
        )

    async def fetch_with_retry(self, url: str, max_retries: int = 3) -> dict:
        for attempt in range(max_retries):
            try:
                response = await self.client.get(url)
                response.raise_for_status()
                return response.json()
            except (httpx.RequestError, httpx.HTTPStatusError) as exc:
                if attempt == max_retries - 1:
                    raise
                # Exponential backoff with full jitter
                base_delay = 0.5 * (2 ** attempt)
                jitter = random.uniform(0, base_delay)
                await asyncio.sleep(jitter)
        return {}`,
        productionBestPractice:
          'Instantiate a single shared httpx.AsyncClient during application lifespan instead of creating a new client on every request. Creating clients per-request causes socket exhaustion and destroys HTTP keep-alive connection pooling.',
        commonPitfall:
          'Calling async with httpx.AsyncClient() inside route handlers, causing TCP handshake latency on every request and rapid port starvation under load.',
      },
    ],
  },
  {
    id: 'stage-6',
    number: 6,
    title: 'Stage 6: Clean Layered Architecture, Docker & Kubernetes',
    tagline: 'Enterprise Repository Scaffolding & Containerized Shipping',
    description:
      'Structure your codebase using Clean Architecture principles (Routers -> Services -> Repositories -> Models), configure 12-factor settings, and ship using multi-stage non-root Docker builds.',
    topics: [
      {
        id: 'topic-6-1',
        title: 'Layered Clean Architecture (Thin Routers, Pure Services)',
        summary:
          'Keep your controllers (routers) thin. Route handlers should only validate inputs and format responses. Business logic belongs in services, and SQL queries belong in repositories.',
        codeSnippet: `# 1. Router (Thin HTTP boundary)
@router.post("/orders", response_model=OrderPublicResponse, status_code=201)
async def create_order(
    payload: OrderCreateDTO,
    service: Annotated[OrderService, Depends(get_order_service)]
):
    return await service.place_order(payload)

# 2. Service (Domain business logic)
class OrderService:
    def __init__(self, repo: OrderRepository, notifier: NotificationClient):
        self.repo = repo
        self.notifier = notifier

    async def place_order(self, payload: OrderCreateDTO) -> OrderModel:
        # Validate business rules, inventory, pricing
        order = await self.repo.create(payload)
        await self.notifier.send_confirmation(order.id)
        return order`,
        productionBestPractice:
          'Never execute raw database queries directly inside router functions. Isolating data access in repositories allows swapping database layers and testing business logic in isolation without any database.',
        commonPitfall:
          'Mixing database queries, third-party API calls, and email sending all inside a single 200-line route handler.',
      },
      {
        id: 'topic-6-2',
        title: 'Type-Safe 12-Factor Settings with Pydantic-Settings',
        summary:
          'Load environment variables into immutable, strictly typed Pydantic Settings models with automatic type casting, defaults, and validation.',
        codeSnippet: `from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, Field

class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    ENVIRONMENT: str = Field(default="production")
    DATABASE_URL: PostgresDsn = Field(
        default="postgresql+asyncpg://user:password@localhost:5432/app_db"
    )
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    JWT_SECRET_KEY: str = Field(..., min_length=32) # Must be provided!
    CORS_ORIGINS: list[str] = Field(default=["*"])

settings = AppSettings()`,
        productionBestPractice:
          'Validate all required configuration on application startup. If a required secret or database URL is missing, the application must fail fast immediately on boot rather than crashing during a user request later.',
        commonPitfall:
          'Scattering os.getenv("KEY") calls throughout the codebase with silent fallback to None, causing runtime AttributeError crashes in production.',
      },
      {
        id: 'topic-6-3',
        title: 'Multi-Stage Non-Root Dockerfile & Kubernetes Probes',
        summary:
          'Package the application into a secure, minimal container image using astral-sh/uv and execute under a non-root user with native /healthz (liveness) and /ready (readiness) probes.',
        codeSnippet: `# Stage 1: Fast Rust dependency builder using uv
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# Stage 2: Minimal runtime image
FROM python:3.12-slim-bookworm
WORKDIR /app

# Security: Non-root user
RUN addgroup --system --gid 1001 appgroup && \\
    adduser --system --uid 1001 --gid 1001 appuser

COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY ./app ./app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]`,
        productionBestPractice:
          'Always run containers as a non-root user (USER appuser) to prevent container escape privilege escalation vulnerabilities. Use Uvicorn with 2-4 worker processes in container clusters.',
        commonPitfall:
          'Running containers as root user with dev dependencies included, creating security vulnerabilities and ballooning image sizes over 1GB.',
      },
    ],
  },
];

export const FASTAPI_PRODUCTION_PROJECT_FILES: FastApiProjectFile[] = [
  {
    path: 'pyproject.toml',
    category: 'Tooling & Package Configuration',
    description: 'Modern Astral uv project definition with production dependencies and ruff linting config.',
    language: 'toml',
    code: `[project]
name = "enterprise-fastapi-service"
version = "0.1.0"
description = "Production-grade asynchronous microservice architecture"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.5.0",
    "sqlalchemy>=2.0.35",
    "asyncpg>=0.29.0",
    "alembic>=1.13.0",
    "httpx>=0.27.0",
    "structlog>=24.4.0",
    "pyjwt[crypto]>=2.9.0",
    "argon2-cffi>=23.1.0",
]

[dependency-groups]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "ruff>=0.6.8",
    "mypy>=1.11.0",
]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]`,
  },
  {
    path: 'app/core/config.py',
    category: 'Configuration',
    description: '12-factor immutable settings with strict validation and environment variable overrides.',
    language: 'python',
    code: `from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    # Service Information
    SERVICE_NAME: str = "enterprise-api"
    ENVIRONMENT: str = Field(default="production")
    DEBUG: bool = Field(default=False)

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/app_db"
    )
    DB_POOL_SIZE: int = Field(default=10)
    DB_MAX_OVERFLOW: int = Field(default=20)
    DB_POOL_TIMEOUT: int = Field(default=30)
    DB_POOL_RECYCLE: int = Field(default=1800)

    # Security
    SECRET_KEY: str = Field(default="changeme-in-production-use-a-strong-secret-key-32chars")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60)

    # CORS
    ALLOWED_ORIGINS: list[str] = Field(default=["*"])

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()`,
  },
  {
    path: 'app/core/database.py',
    category: 'Persistence',
    description: 'Async SQLAlchemy 2.0 engine, pool configuration, and session factory.',
    language: 'python',
    code: `from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

class Base(DeclarativeBase):
    pass

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_recycle=settings.DB_POOL_RECYCLE,
    pool_pre_ping=True, # Critical: tests connection liveness before checkout
)

AsyncSessionFactory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise`,
  },
  {
    path: 'app/core/exceptions.py',
    category: 'Observability & Error Handling',
    description: 'RFC 7807 Problem Details global exception handler and sanitized 500 error envelope.',
    language: 'python',
    code: `from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
import structlog

logger = structlog.get_logger("api.exceptions")

def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        correlation_id = getattr(request.state, "correlation_id", "untracked")
        logger.error(
            "unhandled_server_error",
            path=request.url.path,
            method=request.method,
            correlation_id=correlation_id,
            exc_info=exc,
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "type": "https://errors.enterprise.internal/500",
                "title": "Internal Server Error",
                "status": 500,
                "detail": "An internal error occurred. Please quote the reference ID to support.",
                "instance": request.url.path,
                "correlation_id": correlation_id,
            },
        )`,
  },
  {
    path: 'app/core/lifespan.py',
    category: 'Lifecycle Management',
    description: 'ASGI lifespan context manager with database pre-warming and graceful shutdown.',
    language: 'python',
    code: `from contextlib import asynccontextmanager
from typing import AsyncIterator
from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine
import structlog

logger = structlog.get_logger("api.lifespan")

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # 1. Startup phase
    logger.info("application_startup_begin")
    try:
        # Pre-warm connection pool & verify database reachability
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        app.state.is_ready = True
        logger.info("database_connection_pool_ready")
    except Exception as exc:
        logger.error("database_startup_failed", exc_info=exc)
        app.state.is_ready = False

    yield # Running application

    # 2. Shutdown phase
    logger.info("application_shutdown_begin")
    app.state.is_ready = False
    await engine.dispose()
    logger.info("database_pool_disposed_cleanly")`,
  },
  {
    path: 'app/routers/health.py',
    category: 'Routing',
    description: 'Kubernetes liveness (/healthz) and readiness (/ready) probe endpoints.',
    language: 'python',
    code: `from fastapi import APIRouter, Request, status, HTTPException
from sqlalchemy import text
from app.core.database import engine

router = APIRouter(tags=["Health & Probes"])

@router.get("/healthz", status_code=status.HTTP_200_OK)
async def liveness():
    """Liveness probe: verifies process is alive and responsive."""
    return {"status": "healthy"}

@router.get("/ready", status_code=status.HTTP_200_OK)
async def readiness(request: Request):
    """Readiness probe: verifies service dependencies (DB) are ready for traffic."""
    if not getattr(request.app.state, "is_ready", False):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service initializing dependencies",
        )
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connectivity check failed",
        )`,
  },
  {
    path: 'app/routers/tasks.py',
    category: 'Routing & CRUD',
    description: 'Production CRUD endpoints with Pydantic v2 validation and dependency injection.',
    language: 'python',
    code: `from typing import Annotated
from fastapi import APIRouter, Depends, status, HTTPException, Query
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Inbound validation schema
class TaskCreate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    title: str = Field(..., min_length=3, max_length=120)
    description: str | None = Field(default=None, max_length=1000)

# Outbound sanitized response schema
class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str | None
    status: str

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # In real app: model = TaskModel(**payload.model_dump()); db.add(model)
    return {
        "id": 101,
        "title": payload.title,
        "description": payload.description,
        "status": "pending",
    }

@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
):
    return [
        {"id": 101, "title": "Deploy Service", "description": "Ship to cluster", "status": "pending"}
    ]`,
  },
  {
    path: 'app/main.py',
    category: 'Application Factory',
    description: 'Master application setup, middleware registration, routers, and CORS configuration.',
    language: 'python',
    code: `import uuid
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.lifespan import lifespan
from app.core.exceptions import register_exception_handlers
from app.routers import health, tasks

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.SERVICE_NAME,
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
        redoc_url=None,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Correlation ID & Timing Middleware
    @app.middleware("http")
    async def add_correlation_and_timing(request: Request, call_next):
        correlation_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id
        start = time.perf_counter()

        response = await call_next(request)

        duration = round((time.perf_counter() - start) * 1000, 2)
        response.headers["x-request-id"] = correlation_id
        response.headers["x-response-time-ms"] = str(duration)
        return response

    # Exception Envelopes
    register_exception_handlers(app)

    # Routers
    app.include_router(health.router)
    app.include_router(tasks.router)

    return app

app = create_application()`,
  },
  {
    path: 'tests/test_api.py',
    category: 'Automated Testing',
    description: 'Async test suite testing route contracts, health probes, and validation using httpx.',
    language: 'python',
    code: `import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_healthz():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/healthz")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}
        assert "x-request-id" in response.headers

@pytest.mark.asyncio
async def test_create_task_validation_error():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Invalid payload: title too short (< 3 chars)
        response = await client.post("/tasks", json={"title": "ab"})
        assert response.status_code == 422 # Pydantic v2 rejects payload fast!`,
  },
  {
    path: 'Dockerfile',
    category: 'Container Deployment',
    description: 'Multi-stage non-root Dockerfile with uv package manager for minimal footprint.',
    language: 'dockerfile',
    code: `# Stage 1: Fast Rust dependency builder using uv
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
WORKDIR /app
COPY pyproject.toml ./
RUN uv venv /app/.venv && uv pip install -r pyproject.toml

# Stage 2: Minimal runtime image
FROM python:3.12-slim-bookworm
WORKDIR /app

# Security: Non-root user
RUN addgroup --system --gid 1001 appgroup && \\
    adduser --system --uid 1001 --gid 1001 appuser

COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY ./app ./app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]`,
  },
];

export const FASTAPI_STORAGE_KEY = 'fde-fastapi-progress-v1';
export const FASTAPI_DRAFTS_KEY = 'fde-fastapi-drafts-v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
}

export function loadFastApiProgress(): Record<string, boolean> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(FASTAPI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveFastApiCleared(labId: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadFastApiProgress();
    current[labId] = true;
    storage.setItem(FASTAPI_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}

export function loadFastApiDrafts(): Record<string, string> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(FASTAPI_DRAFTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveFastApiDraft(labId: string, code: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const drafts = loadFastApiDrafts();
    drafts[labId] = code;
    storage.setItem(FASTAPI_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // LocalStorage quota
  }
}
