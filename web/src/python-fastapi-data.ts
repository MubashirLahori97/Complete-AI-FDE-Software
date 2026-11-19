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
