// Production-Grade Python Coding Exams & "Toy vs Production" Reference
// Inspired by modern engineering workflows (uv, ruff, pydantic, pytest)
// Prepared for Day 1 production readiness -- zero client proprietary information.

export type ExamDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ToyVsProductionComparison {
  title: string;
  category: string;
  toyTitle: string;
  toyCode: string;
  toyPitfall: string;
  prodTitle: string;
  prodCode: string;
  prodAdvantage: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
}

export interface PythonExam {
  id: string;
  number: number;
  title: string;
  difficulty: ExamDifficulty;
  duration: string;
  category: string;
  realWorldContext: string;
  toyVsProd: {
    toyCode: string;
    prodCode: string;
    keyDifference: string;
  };
  specification: string[];
  starterCode: string;
  solutionCode: string;
  solutionExplanation: string;
  testSuiteCode: string;
  testCases: TestCase[];
}

export const TOY_VS_PROD_COMPARISONS: ToyVsProductionComparison[] = [
  {
    title: '1. Variables & Types: Loose Dicts vs Pydantic Models',
    category: 'Data Validation',
    toyTitle: 'Tutorial / Toy Code',
    toyCode: `# Toy approach: loose untyped dictionary
def create_user(data):
    # No schema, no validation. Will crash if 'age' is missing or "twenty"
    return {"id": 1, "name": data["name"], "age": data["age"]}`,
    toyPitfall: 'Crashes at runtime with KeyError, accepts corrupted data types, and provides zero IDE autocomplete.',
    prodTitle: 'Production Code',
    prodCode: `from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    age: int = Field(..., ge=18, le=120)

def create_user(payload: UserCreate) -> dict:
    # Guaranteed valid data types and range checks before function body runs
    return payload.model_dump()`,
    prodAdvantage: 'Strict compile/runtime schema validation, automatic JSON schema generation, and zero runtime KeyErrors.',
  },
  {
    title: '2. Debugging: print() vs Structured Logging',
    category: 'Observability',
    toyTitle: 'Tutorial / Toy Code',
    toyCode: `# Toy approach: raw print statements
def process_payment(amount, user_id):
    print("Processing payment...")
    print(f"User {user_id} paid {amount}")
    print("Done!")`,
    toyPitfall: 'Prints have no timestamps, log levels, trace IDs, or machine-readable JSON structure in Datadog/CloudWatch.',
    prodTitle: 'Production Code',
    prodCode: `import structlog

logger = structlog.get_logger(__name__)

def process_payment(amount: float, user_id: str, trace_id: str) -> None:
    logger.info("payment_initiated", user_id=user_id, amount=amount, trace_id=trace_id)
    try:
        # Business logic...
        logger.info("payment_success", user_id=user_id, amount=amount, trace_id=trace_id)
    except Exception as err:
        logger.error("payment_failed", user_id=user_id, error=str(err), trace_id=trace_id, exc_info=True)
        raise`,
    prodAdvantage: 'Emits structured JSON logs containing correlation IDs for distributed tracing and instant log querying.',
  },
  {
    title: '3. Secrets: Hardcoded Strings vs .env & Pydantic Settings',
    category: 'Configuration',
    toyTitle: 'Tutorial / Toy Code',
    toyCode: `# Toy approach: hardcoded credentials or unvalidated os.environ
API_KEY = "sk_live_123456789"
PORT = int(os.environ.get("PORT", "8000"))`,
    toyPitfall: 'Secrets get accidentally committed to GitHub, and missing environment variables crash services late in execution.',
    prodTitle: 'Production Code',
    prodCode: `from pydantic_settings import BaseSettings
from pydantic import SecretStr, Field

class Settings(BaseSettings):
    api_key: SecretStr = Field(..., alias="APP_API_KEY")
    port: int = Field(8000, ge=1024, le=65535)
    database_url: str

    class Config:
        env_file = ".env"

config = Settings() # Fails immediately at startup if variables are missing or invalid`,
    prodAdvantage: 'Fails fast at boot if variables are missing, validates port ranges, and hides secrets from string prints.',
  },
  {
    title: '4. Error Handling: Bare except vs Custom Domain Hierarchies',
    category: 'Resilience',
    toyTitle: 'Tutorial / Toy Code',
    toyCode: `# Toy approach: swallowing errors blindly
try:
    fetch_order_from_db(order_id)
except:
    pass # Silently eats KeyboardInterrupt, MemoryError, and bugs!`,
    toyPitfall: 'Masks critical system crashes, hides logic bugs, and prevents callers from handling specific error scenarios.',
    prodTitle: 'Production Code',
    prodCode: `class OrderDomainError(Exception):
    \"\"\"Base domain exception.\"\"\"

class OrderNotFoundError(OrderDomainError):
    def __init__(self, order_id: str):
        super().__init__(f"Order '{order_id}' was not found.")
        self.order_id = order_id

try:
    fetch_order_from_db(order_id)
except OrderNotFoundError as err:
    # Handle known 404 cleanly
    return {"status": 404, "detail": str(err)}`,
    prodAdvantage: 'Explicit error contracts allow APIs to return 404 vs 500 cleanly without swallowing fatal bugs.',
  },
  {
    title: '5. Testing: Manual Script Runs vs Pytest with Fixtures',
    category: 'Quality Engineering',
    toyTitle: 'Tutorial / Toy Code',
    toyCode: `# Toy approach: manual print checks at bottom of file
if __name__ == "__main__":
    result = calculate_tax(100)
    print("Tax result:", result) # Did it pass? Who knows without reading!`,
    toyPitfall: 'Requires manual human inspection, cannot run in CI/CD pipelines, and tests zero edge cases.',
    prodTitle: 'Production Code',
    prodCode: `import pytest

@pytest.fixture
def sample_invoice():
    return {"subtotal": 100.0, "tax_rate": 0.08}

@pytest.mark.parametrize("subtotal, expected", [
    (100.0, 108.0),
    (0.0, 0.0),
    (50.0, 54.0),
])
def test_calculate_tax_parametrized(subtotal, expected):
    assert calculate_total(subtotal, 0.08) == pytest.approx(expected, 0.01)`,
    prodAdvantage: 'Automated CI/CD test gates, clean mock fixtures, parameterization across dozens of edge cases.',
  },
  {
    title: '6. Tooling: Traditional pip/venv vs Modern uv & Ruff',
    category: 'Developer Workflow',
    toyTitle: 'Traditional Tooling',
    toyCode: `# Traditional legacy workflow:
python -m venv .venv
source .venv/bin/activate
pip install black flake8 isort
pip install -r requirements.txt # Takes 30-60 seconds`,
    toyPitfall: 'Multiple slow separate tools, fragmented config files, slow resolution, and non-deterministic dependency trees.',
    prodTitle: 'Modern Production Workflow (2025+)',
    prodCode: `# Modern production workflow (Datalumina / Astral stack):
uv venv                       # Instant Rust-powered venv
uv pip install -r pyproject.toml # 10-30x faster than pip
uv run ruff check --fix        # Replaces black, flake8, isort in 10ms
uv run ruff format            # Instant automatic formatting`,
    prodAdvantage: 'Single unified Rust-based toolchain (`uv` + `ruff`), sub-second execution, deterministic lockfiles.',
  },
];

export const PYTHON_EXAMS: PythonExam[] = [
  {
    id: 'exam-1',
    number: 1,
    title: 'Exam 1: Modern Configuration & Secret Masking',
    difficulty: 'beginner',
    duration: '30 min',
    category: 'Configuration & Validation',
    realWorldContext:
      'In production, microservices must never hardcode credentials or read untyped environment variables. You will implement a typed configuration loader that validates port ranges, parses integers, and masks sensitive secrets.',
    toyVsProd: {
      toyCode: `API_KEY = "my_secret"\nPORT = int(os.environ["PORT"])`,
      prodCode: `class AppConfig:\n    port: int (validated 1024-65535)\n    secret: str (masked in __repr__)`,
      keyDifference:
        'Production configuration fails immediately at boot if values are invalid and prevents secret leakage in logs.',
    },
    specification: [
      'Create an `AppConfig` class with fields: `app_name: str`, `port: int`, `api_key: str`, `debug: bool = False`.',
      'If `port` is outside the range 1024 to 65535, raise a `ValueError` with an informative error message.',
      'Implement `__repr__` such that `api_key` is masked as `"sk_***"` (never leak raw secrets in string representation).',
      'Implement a classmethod `from_env(env_dict: dict)` that parses values, using default port 8080 and default app_name "FDE-Service".',
    ],
    starterCode: `class AppConfig:
    """Production application settings loader with strict validation."""

    def __init__(self, app_name: str, port: int, api_key: str, debug: bool = False):
        # TODO: Validate that port is between 1024 and 65535 (inclusive)
        # TODO: Store attributes
        pass

    def __repr__(self) -> str:
        # TODO: Return string representation with api_key masked as "sk_***"
        pass

    @classmethod
    def from_env(cls, env: dict) -> "AppConfig":
        # TODO: Read from env dict, parse port to int, apply defaults if missing
        pass
`,
    solutionCode: `class AppConfig:
    """Production application settings loader with strict validation."""

    def __init__(self, app_name: str, port: int, api_key: str, debug: bool = False):
        if not (1024 <= port <= 65535):
            raise ValueError(f"Port must be between 1024 and 65535, got {port}")
        if not api_key:
            raise ValueError("api_key cannot be empty")
        self.app_name = str(app_name)
        self.port = int(port)
        self.api_key = str(api_key)
        self.debug = bool(debug)

    def __repr__(self) -> str:
        return f"AppConfig(app_name={self.app_name!r}, port={self.port}, api_key='sk_***', debug={self.debug})"

    @classmethod
    def from_env(cls, env: dict) -> "AppConfig":
        app_name = env.get("APP_NAME", "FDE-Service")
        port = int(env.get("PORT", 8080))
        api_key = env.get("API_KEY", "")
        debug = str(env.get("DEBUG", "false")).lower() in ("true", "1", "yes")
        return cls(app_name=app_name, port=port, api_key=api_key, debug=debug)
`,
    solutionExplanation:
      'The solution validates the port invariant on instantiation, guarantees that raw secrets never leak via __repr__ when logging config objects, and provides a clean from_env factory method that gracefully coerces data types.',
    testSuiteCode: `def test_suite():
    # Test 1: Valid instance creation
    c = AppConfig("api-service", 8080, "secret-token-999")
    assert c.port == 8080, "Port should be 8080"
    assert c.app_name == "api-service", "App name should match"
    print("PASS: test_valid_creation")

    # Test 2: Port range validation failure
    try:
        AppConfig("api-service", 80, "secret-token-999")
        assert False, "Should have raised ValueError for privileged port 80"
    except ValueError:
        print("PASS: test_port_validation_failure")

    # Test 3: Secret masking in repr
    rep = repr(c)
    assert "sk_***" in rep, "api_key must be masked as 'sk_***'"
    assert "secret-token-999" not in rep, "Raw secret must NEVER appear in repr!"
    print("PASS: test_secret_masking")

    # Test 4: from_env factory parsing
    env = {"PORT": "9000", "API_KEY": "prod-key-42", "DEBUG": "true"}
    loaded = AppConfig.from_env(env)
    assert loaded.port == 9000, "Should parse PORT string to integer"
    assert loaded.debug is True, "Should parse DEBUG string to boolean"
    print("PASS: test_from_env_factory")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Valid Config Creation', description: 'Initializes attributes correctly.' },
      { id: 't2', name: 'Port Boundary Guard', description: 'Rejects ports < 1024 or > 65535.' },
      { id: 't3', name: 'Secret Masking in Repr', description: 'Hides raw secret token in string output.' },
      { id: 't4', name: 'Environment Dict Factory', description: 'Parses string ports & booleans from env.' },
    ],
  },
  {
    id: 'exam-2',
    number: 2,
    title: 'Exam 2: API Webhook Payload Schema Validator',
    difficulty: 'beginner',
    duration: '35 min',
    category: 'Data Validation & Schemas',
    realWorldContext:
      'Real production web services receive unverified JSON payloads from external webhooks. If an invalid payload is processed, accounting or billing can break. You will write a robust validator that parses, validates, and computes financial totals.',
    toyVsProd: {
      toyCode: `total = sum(i["price"] * i["qty"] for i in data["items"])`,
      prodCode: `class OrderPayloadValidator:\n    validates required fields, price > 0, status enums`,
      keyDifference:
        'Production code never assumes dictionary keys exist or types are correct; it validates the schema first.',
    },
    specification: [
      'Define a custom exception `ValidationError(Exception)`.',
      'Create `OrderValidator` class that takes a raw `payload: dict`.',
      'Validate that `order_id` is a non-empty string.',
      'Validate that `status` is one of `{"PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"}`. Otherwise raise `ValidationError`.',
      'Validate that `items` is a non-empty list of dicts. Each item must have `price > 0` and `quantity >= 1`.',
      'Implement `calculate_total(discount_pct: float = 0.0) -> float` returning the final rounded price (2 decimal places).',
    ],
    starterCode: `class ValidationError(Exception):
    """Raised when incoming payload schema is invalid."""
    pass

class OrderValidator:
    """Validates and calculates production order webhook payloads."""

    VALID_STATUSES = {"PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"}

    def __init__(self, payload: dict):
        # TODO: Validate payload dictionary structure
        # TODO: Validate order_id, status, and items
        pass

    def calculate_total(self, discount_pct: float = 0.0) -> float:
        # TODO: Calculate subtotal = sum(price * qty)
        # TODO: Apply discount (e.g. 10.0 means 10% off)
        # TODO: Return round(total, 2)
        pass
`,
    solutionCode: `class ValidationError(Exception):
    """Raised when incoming payload schema is invalid."""
    pass

class OrderValidator:
    """Validates and calculates production order webhook payloads."""

    VALID_STATUSES = {"PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"}

    def __init__(self, payload: dict):
        if not isinstance(payload, dict):
            raise ValidationError("Payload must be a dictionary")

        order_id = payload.get("order_id")
        if not order_id or not isinstance(order_id, str):
            raise ValidationError("Missing or invalid order_id")

        status = payload.get("status")
        if status not in self.VALID_STATUSES:
            raise ValidationError(f"Invalid status '{status}'. Must be one of {self.VALID_STATUSES}")

        items = payload.get("items")
        if not isinstance(items, list) or len(items) == 0:
            raise ValidationError("Payload items must be a non-empty list")

        for idx, item in enumerate(items):
            if not isinstance(item, dict):
                raise ValidationError(f"Item #{idx} must be a dictionary")
            price = item.get("price")
            qty = item.get("quantity")
            if not isinstance(price, (int, float)) or price <= 0:
                raise ValidationError(f"Item #{idx} price must be > 0, got {price}")
            if not isinstance(qty, int) or qty < 1:
                raise ValidationError(f"Item #{idx} quantity must be an integer >= 1, got {qty}")

        self.order_id = order_id
        self.status = status
        self.items = items

    def calculate_total(self, discount_pct: float = 0.0) -> float:
        subtotal = sum(item["price"] * item["quantity"] for item in self.items)
        discount = subtotal * (discount_pct / 100.0)
        total = max(0.0, subtotal - discount)
        return round(total, 2)
`,
    solutionExplanation:
      'The validator systematically checks every incoming field before state assignment. If an attacker or third party sends corrupted formats, a clean domain ValidationError is raised instead of an uncontrolled crash.',
    testSuiteCode: `def test_suite():
    valid_payload = {
        "order_id": "ord_8841",
        "status": "CONFIRMED",
        "items": [
            {"name": "Server Unit", "price": 100.0, "quantity": 2},
            {"name": "SFP+ Cable", "price": 25.5, "quantity": 1}
        ]
    }
    # Test 1: Valid payload calculation
    val = OrderValidator(valid_payload)
    assert val.calculate_total() == 225.5, "Total should be (100*2) + 25.5 = 225.5"
    print("PASS: test_valid_payload")

    # Test 2: Discount calculation
    assert val.calculate_total(10.0) == 202.95, "10% off 225.5 should be 202.95"
    print("PASS: test_discount_calculation")

    # Test 3: Invalid status rejected
    bad_status = {**valid_payload, "status": "SHIPPED_OUT"}
    try:
        OrderValidator(bad_status)
        assert False, "Should raise ValidationError for bad status"
    except ValidationError:
        print("PASS: test_invalid_status_rejected")

    # Test 4: Negative price rejected
    bad_price = {
        "order_id": "ord_99",
        "status": "PENDING",
        "items": [{"name": "Bad", "price": -5.0, "quantity": 1}]
    }
    try:
        OrderValidator(bad_price)
        assert False, "Should raise ValidationError for negative price"
    except ValidationError:
        print("PASS: test_negative_price_rejected")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Valid Payload & Subtotal', description: 'Calculates correct item totals.' },
      { id: 't2', name: 'Discount Calculation', description: 'Applies percentage discount with 2-decimal rounding.' },
      { id: 't3', name: 'Enum Status Validation', description: 'Rejects unknown order statuses.' },
      { id: 't4', name: 'Price & Quantity Boundary', description: 'Rejects negative prices or zero quantities.' },
    ],
  },
  {
    id: 'exam-3',
    number: 3,
    title: 'Exam 3: Resilient Network Retry with Backoff',
    difficulty: 'intermediate',
    duration: '40 min',
    category: 'Resilience & Distributed Systems',
    realWorldContext:
      'Cloud networks and LLM APIs experience transient hiccups (HTTP 503, rate limits). Production services use exponential backoff retries rather than crashing immediately.',
    toyVsProd: {
      toyCode: `response = requests.get(url) # Crashes immediately on network blip`,
      prodCode: `execute_with_retry(fn, max_attempts=3, base_delay=0.1) # Recovers automatically`,
      keyDifference:
        'Production network operations handle transient errors gracefully and escalate to custom domain errors when retries exhaust.',
    },
    specification: [
      'Define a custom exception `ServiceUnavailableError(Exception)`.',
      'Implement `execute_with_retry(func, max_attempts=3, base_delay=0.1)` function.',
      'If `func()` succeeds, immediately return its result and record attempts taken.',
      'If `func()` raises an exception, wait `base_delay * (2 ** (attempt - 1))` and retry.',
      'If all `max_attempts` fail, raise `ServiceUnavailableError` containing the final error message and total attempts.',
    ],
    starterCode: `class ServiceUnavailableError(Exception):
    """Raised when an external service fails all retry attempts."""
    pass

def execute_with_retry(func, max_attempts: int = 3, base_delay: float = 0.05):
    """Executes a callable with exponential backoff retry logic."""
    # TODO: Implement retry loop
    # TODO: If attempts exhaust, raise ServiceUnavailableError
    pass
`,
    solutionCode: `import time

class ServiceUnavailableError(Exception):
    """Raised when an external service fails all retry attempts."""
    def __init__(self, message: str, attempts: int):
        super().__init__(f"Service failed after {attempts} attempts. Last error: {message}")
        self.attempts = attempts

def execute_with_retry(func, max_attempts: int = 3, base_delay: float = 0.05):
    """Executes a callable with exponential backoff retry logic."""
    last_exception = None
    for attempt in range(1, max_attempts + 1):
        try:
            return func()
        except Exception as exc:
            last_exception = exc
            if attempt == max_attempts:
                break
            # Backoff delay: base * 2^(attempt - 1)
            delay = base_delay * (2 ** (attempt - 1))
            time.sleep(delay)

    raise ServiceUnavailableError(str(last_exception), attempts=max_attempts)
`,
    solutionExplanation:
      'The retry loop catches exceptions, computes an exponential delay schedule, pauses execution, and if retries exhaust, wraps the root cause into a domain ServiceUnavailableError preserving the total attempts taken.',
    testSuiteCode: `def test_suite():
    # Test 1: Immediate success
    res = execute_with_retry(lambda: "OK", max_attempts=3)
    assert res == "OK", "Should return immediately on success"
    print("PASS: test_immediate_success")

    # Test 2: Flaky function recovering on attempt 2
    counter = {"calls": 0}
    def flaky():
        counter["calls"] += 1
        if counter["calls"] < 2:
            raise ConnectionResetError("Connection lost")
        return "RECOVERED"

    res = execute_with_retry(flaky, max_attempts=3, base_delay=0.01)
    assert res == "RECOVERED", "Should recover on attempt 2"
    assert counter["calls"] == 2, "Should have taken exactly 2 attempts"
    print("PASS: test_flaky_service_recovers")

    # Test 3: Persistent failure raises ServiceUnavailableError
    def always_fails():
        raise TimeoutError("Gateway timeout 504")

    try:
        execute_with_retry(always_fails, max_attempts=3, base_delay=0.01)
        assert False, "Should raise ServiceUnavailableError"
    except ServiceUnavailableError as err:
        assert err.attempts == 3, "Should record 3 attempts"
        print("PASS: test_persistent_failure_raises_error")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Immediate Success', description: 'Returns result on first call without delay.' },
      { id: 't2', name: 'Transient Recovery', description: 'Recovers after catching initial errors.' },
      { id: 't3', name: 'Exhausted Retry Error', description: 'Raises ServiceUnavailableError after max_attempts.' },
    ],
  },
  {
    id: 'exam-4',
    number: 4,
    title: 'Exam 4: Atomic Resource Transaction Context Manager',
    difficulty: 'intermediate',
    duration: '40 min',
    category: 'Resource Management & Transactions',
    realWorldContext:
      'In production databases or file systems, partial writes corrupt data. If a process crashes halfway through writing a customer invoice, the corrupted file cannot remain on disk. You will implement an atomic buffer transaction context manager.',
    toyVsProd: {
      toyCode: `with open("data.json", "w") as f:\n    f.write(chunk1)\n    crash()\n    f.write(chunk2) # Left half-written!`,
      prodCode: `with AtomicBuffer() as buf:\n    buf.write(...)\n    # Commits ONLY if zero exceptions occur`,
      keyDifference:
        'Atomic transactions guarantee all-or-nothing consistency (ACID principles).',
    },
    specification: [
      'Create an `AtomicBuffer` class implementing the context manager protocol (`__enter__` and `__exit__`).',
      'The class maintains an internal committed storage list `committed_store: list`.',
      'In `__enter__`, create a staging buffer list `staging: list`. Return a proxy object with a `write(data)` method.',
      'In `__exit__`, if no exception occurred (`exc_type is None`), append all items in `staging` to `committed_store`.',
      'If an exception occurred (`exc_type is not None`), discard `staging` entirely without modifying `committed_store`, and return `False` so the exception propagates.',
    ],
    starterCode: `class AtomicBuffer:
    """Atomic transaction buffer ensuring all-or-nothing writes."""

    def __init__(self):
        self.committed_store = []

    def __enter__(self):
        # TODO: Setup staging buffer and return proxy/self
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: If exc_type is None, commit staging to committed_store
        # TODO: If exception occurred, discard staging and let exception propagate (return False)
        pass
`,
    solutionCode: `class _BufferProxy:
    def __init__(self, staging: list):
        self._staging = staging

    def write(self, data: str):
        self._staging.append(str(data))

class AtomicBuffer:
    """Atomic transaction buffer ensuring all-or-nothing writes."""

    def __init__(self):
        self.committed_store = []
        self._staging = []

    def __enter__(self):
        self._staging = []
        return _BufferProxy(self._staging)

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            # Clean exit: commit staging to persistent store
            self.committed_store.extend(self._staging)
            self._staging = []
            return True
        else:
            # Crash: roll back and discard staging
            self._staging = []
            return False  # Propagate exception
`,
    solutionExplanation:
      'The context manager keeps writes isolated in a staging buffer. Only if __exit__ receives exc_type is None are changes committed to the persistent storage, ensuring zero corruption during unexpected errors.',
    testSuiteCode: `def test_suite():
    buf = AtomicBuffer()

    # Test 1: Successful atomic write
    with buf as tx:
        tx.write("entry_1")
        tx.write("entry_2")

    assert buf.committed_store == ["entry_1", "entry_2"], "Should commit entries on success"
    print("PASS: test_successful_commit")

    # Test 2: Rollback on exception
    try:
        with buf as tx:
            tx.write("entry_corrupted_3")
            raise RuntimeError("Disk full simulation")
    except RuntimeError:
        pass

    assert buf.committed_store == ["entry_1", "entry_2"], "Corrupted write must be rolled back!"
    print("PASS: test_rollback_on_error")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Clean Commit', description: 'Transfers staging buffer to committed store on success.' },
      { id: 't2', name: 'Rollback on Crash', description: 'Discards uncommitted buffer and preserves store integrity.' },
    ],
  },
  {
    id: 'exam-5',
    number: 5,
    title: 'Exam 5: Memory-Efficient Streaming Log Analyzer',
    difficulty: 'advanced',
    duration: '45 min',
    category: 'Memory Optimization & Generators',
    realWorldContext:
      'Production servers generate multi-gigabyte log files. If a junior engineer writes `open().readlines()`, the Python process consumes 12 GB of RAM and gets killed by the Linux OOM (Out Of Memory) killer. You will build a lazy generator stream pipeline that parses logs with O(1) memory.',
    toyVsProd: {
      toyCode: `lines = file.readlines() # Reads entire 10 GB file into memory!`,
      prodCode: `for line in stream_logs(file): yield parse(line) # O(1) constant RAM`,
      keyDifference:
        'Generators stream records on demand without exhausting server memory.',
    },
    specification: [
      'Implement `parse_log_stream(lines_iterable)` as a generator function that yields parsed dicts `{"timestamp": str, "level": str, "message": str}` from log lines in the format: `"YYYY-MM-DD HH:MM:SS [LEVEL] message"`.',
      'Implement `filter_severity(parsed_stream, min_level="ERROR")` as a generator yielding only entries matching the level.',
      'Implement `tally_anomalies(filtered_stream) -> dict` that counts occurrences of each error message.',
      'Ensure that all intermediate steps use `yield` rather than lists.',
    ],
    starterCode: `import re
from typing import Generator

def parse_log_stream(lines: list) -> Generator[dict, None, None]:
    """Yields parsed log dictionaries lazily line by line."""
    # TODO: Use regex or split to parse "2026-11-19 12:00:00 [ERROR] Connection reset"
    pass

def filter_severity(stream, target_level: str = "ERROR") -> Generator[dict, None, None]:
    """Yields only entries matching target_level."""
    # TODO: Yield entries where entry['level'] == target_level
    pass

def tally_anomalies(stream) -> dict:
    """Consumes generator and returns frequency map of messages."""
    # TODO: Return dict {message: count}
    pass
`,
    solutionCode: `import re
from typing import Generator

LOG_PATTERN = re.compile(r"^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}) \\[(\\w+)\\] (.*)$")

def parse_log_stream(lines) -> Generator[dict, None, None]:
    for line in lines:
        match = LOG_PATTERN.match(line.strip())
        if match:
            yield {
                "timestamp": match.group(1),
                "level": match.group(2),
                "message": match.group(3)
            }

def filter_severity(stream, target_level: str = "ERROR") -> Generator[dict, None, None]:
    for entry in stream:
        if entry["level"] == target_level:
            yield entry

def tally_anomalies(stream) -> dict:
    counts = {}
    for entry in stream:
        msg = entry["message"]
        counts[msg] = counts.get(msg, 0) + 1
    return counts
`,
    solutionExplanation:
      'The pipeline constructs lazy generator iterators using yield. Items are pulled through the pipeline one item at a time, consuming a tiny constant memory footprint regardless of whether the log file contains 10 lines or 10,000,000 lines.',
    testSuiteCode: `def test_suite():
    raw_logs = [
        "2026-11-19 10:00:01 [INFO] Service started",
        "2026-11-19 10:00:05 [ERROR] Database timeout",
        "2026-11-19 10:00:08 [WARN] High memory load",
        "2026-11-19 10:00:12 [ERROR] Database timeout",
        "2026-11-19 10:00:15 [ERROR] Redis cache miss"
    ]

    # Test 1: Lazy pipeline streaming
    stream = parse_log_stream(raw_logs)
    errors = filter_severity(stream, "ERROR")
    tallies = tally_anomalies(errors)

    assert tallies["Database timeout"] == 2, "Database timeout should appear 2 times"
    assert tallies["Redis cache miss"] == 1, "Redis cache miss should appear 1 time"
    assert "Service started" not in tallies, "INFO messages must be filtered out"
    print("PASS: test_streaming_log_pipeline")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'Lazy Streaming Pipeline', description: 'Parses, filters, and aggregates log counts lazily.' },
    ],
  },
  {
    id: 'exam-6',
    number: 6,
    title: 'Exam 6: Clean Architecture Domain Service with Pytest Fixtures',
    difficulty: 'advanced',
    duration: '50 min',
    category: 'Architecture & Testing',
    realWorldContext:
      'Senior engineers separate database persistence from core business logic using repositories and domain services. You will implement a cleanly separated UserAuthService and verify it against a production-style test suite.',
    toyVsProd: {
      toyCode: `# Mixing everything in one script\nsql = f"INSERT INTO users VALUES ('{email}')"`,
      prodCode: `class UserRepository(Protocol):\n    def save(user: User): ...\nclass AuthService:\n    def __init__(repo: UserRepository): ...`,
      keyDifference:
        'Dependency injection and interface segregation make production services unit-testable without live databases.',
    },
    specification: [
      'Define domain exceptions: `UserAlreadyExistsError(Exception)` and `InvalidCredentialsError(Exception)`.',
      'Create `InMemoryUserRepository` with methods `get_by_email(email: str) -> dict | None` and `save(user: dict) -> None`.',
      'Create `AuthService` which accepts `repository` in its constructor (Dependency Injection).',
      'Implement `register(email: str, password: str) -> dict`. If email exists in repository, raise `UserAlreadyExistsError`. Otherwise store user with hashed password simulation and return user dict.',
      'Implement `login(email: str, password: str) -> dict`. If email is not found or password does not match, raise `InvalidCredentialsError`.',
    ],
    starterCode: `class UserAlreadyExistsError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass

class InMemoryUserRepository:
    """Simulated in-memory database storage."""
    def __init__(self):
        self._users = {}

    def get_by_email(self, email: str) -> dict:
        # TODO: Return user dict or None
        pass

    def save(self, user: dict) -> None:
        # TODO: Store user by email
        pass

class AuthService:
    """Core domain business logic decoupled from storage."""
    def __init__(self, repo: InMemoryUserRepository):
        self.repo = repo

    def register(self, email: str, password: str) -> dict:
        # TODO: Check if user exists -> raise UserAlreadyExistsError
        # TODO: Save user and return user record
        pass

    def login(self, email: str, password: str) -> dict:
        # TODO: Authenticate user -> raise InvalidCredentialsError on failure
        pass
`,
    solutionCode: `class UserAlreadyExistsError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass

class InMemoryUserRepository:
    """Simulated in-memory database storage."""
    def __init__(self):
        self._users = {}

    def get_by_email(self, email: str) -> dict:
        return self._users.get(email.lower())

    def save(self, user: dict) -> None:
        self._users[user["email"].lower()] = user

class AuthService:
    """Core domain business logic decoupled from storage."""
    def __init__(self, repo: InMemoryUserRepository):
        self.repo = repo

    def register(self, email: str, password: str) -> dict:
        normalized_email = email.lower().strip()
        if self.repo.get_by_email(normalized_email):
            raise UserAlreadyExistsError(f"User '{normalized_email}' already exists.")

        user = {
            "email": normalized_email,
            "password_hash": f"hash_{password}",
            "is_active": True
        }
        self.repo.save(user)
        return user

    def login(self, email: str, password: str) -> dict:
        normalized_email = email.lower().strip()
        user = self.repo.get_by_email(normalized_email)
        if not user or user["password_hash"] != f"hash_{password}":
            raise InvalidCredentialsError("Invalid email or password.")
        return user
`,
    solutionExplanation:
      'This architecture separates state persistence from authentication business rules. Testing AuthService requires zero mock databases—you simply inject an in-memory repository.',
    testSuiteCode: `def test_suite():
    repo = InMemoryUserRepository()
    auth = AuthService(repo)

    # Test 1: User registration
    u = auth.register("test@example.com", "pass123")
    assert u["email"] == "test@example.com", "Should register email"
    print("PASS: test_registration_success")

    # Test 2: Duplicate registration rejected
    try:
        auth.register("test@example.com", "another_pass")
        assert False, "Should raise UserAlreadyExistsError"
    except UserAlreadyExistsError:
        print("PASS: test_duplicate_user_rejected")

    # Test 3: Successful login
    logged_in = auth.login("test@example.com", "pass123")
    assert logged_in["is_active"] is True, "Login should succeed"
    print("PASS: test_login_success")

    # Test 4: Bad password rejected
    try:
        auth.login("test@example.com", "wrong_password")
        assert False, "Should raise InvalidCredentialsError"
    except InvalidCredentialsError:
        print("PASS: test_bad_password_rejected")

test_suite()
`,
    testCases: [
      { id: 't1', name: 'User Registration', description: 'Creates and stores user record.' },
      { id: 't2', name: 'Duplicate User Guard', description: 'Rejects existing email with domain exception.' },
      { id: 't3', name: 'Valid Login', description: 'Authenticates matching credentials.' },
      { id: 't4', name: 'Invalid Password Guard', description: 'Raises InvalidCredentialsError on wrong credentials.' },
    ],
  },
];

export const EXAM_PROGRESS_STORAGE_KEY = 'fde-python-exam-progress-v1';
export const EXAM_DRAFTS_STORAGE_KEY = 'fde-python-exam-drafts-v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
}

export function loadExamProgress(): Record<string, boolean> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(EXAM_PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveExamPassed(examId: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadExamProgress();
    current[examId] = true;
    storage.setItem(EXAM_PROGRESS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}

export function loadExamDrafts(): Record<string, string> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(EXAM_DRAFTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveExamDraft(examId: string, code: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadExamDrafts();
    current[examId] = code;
    storage.setItem(EXAM_DRAFTS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}
