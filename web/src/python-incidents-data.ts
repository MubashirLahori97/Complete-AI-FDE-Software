// Production Incident Response Simulator Data & Types
// Real-world P0/P1 outage post-mortems and regression test harnesses

export type IncidentSeverity = 'P0-CRITICAL' | 'P1-HIGH' | 'P2-MEDIUM';

export interface ProductionIncident {
  id: string;
  number: number;
  title: string;
  severity: IncidentSeverity;
  service: string;
  outageSummary: string;
  symptoms: string[];
  errorLogs: string[];
  rootCauseAnalysis: string;
  brokenCode: string;
  fixedCode: string;
  postMortem: string;
  hints: string[];
  testSuiteCode: string;
}

export const PRODUCTION_INCIDENTS: ProductionIncident[] = [
  {
    id: 'inc-1',
    number: 1,
    title: 'Incident #1: The Event Loop Lockup Outage',
    severity: 'P0-CRITICAL',
    service: 'auth-gateway-api',
    outageSummary:
      'The entire API gateway became completely unresponsive with 504 Gateway Timeouts under load, despite CPU utilization never exceeding 18%.',
    symptoms: [
      'All concurrent HTTP requests hung indefinitely.',
      'Kubernetes health checks failed, causing pods to enter CrashLoopBackOff.',
      'Worker CPU was idling while response queue depth surged from 0 to 45,000.',
    ],
    errorLogs: [
      '2026-11-19 02:14:02.112 [WARN] gateway.timeout: Upstream request exceeded 30000ms',
      '2026-11-19 02:14:05.894 [ERROR] uvicorn.error: Event loop stalled for 4982ms (threshold: 100ms)',
      '2026-11-19 02:14:10.001 [CRITICAL] kubelet: Liveness probe failed: HTTP probe failed with statuscode: 504',
    ],
    rootCauseAnalysis:
      'A junior engineer called blocking synchronous functions (`time.sleep()` and synchronous `requests.get()`) inside an `async def` FastAPI endpoint. Because Python asyncio runs on a SINGLE operating system thread, blocking calls stop the entire event loop, freezing all other concurrent connections.',
    hints: [
      'In an async def function, NEVER use time.sleep(). Use await asyncio.sleep().',
      'Replace synchronous blocking HTTP calls with await client.get() or offload to asyncio.to_thread().',
    ],
    brokenCode: `import time
# BROKEN CODE: Freezes the entire single-threaded event loop!

class AsyncGatewayHandler:
    """Handles API requests asynchronously."""

    async def handle_request(self, client_id: str, payload: dict) -> dict:
        # BUG: time.sleep is SYNCHRONOUS and BLOCKING!
        # It halts the event loop OS thread, freezing all concurrent users!
        time.sleep(0.5)

        return {"status": "SUCCESS", "client_id": client_id}
`,
    fixedCode: `import asyncio

class AsyncGatewayHandler:
    """Handles API requests asynchronously with non-blocking concurrency."""

    async def handle_request(self, client_id: str, payload: dict) -> dict:
        # PRODUCTION FIX: Use non-blocking await asyncio.sleep()
        # This yields control back to the event loop so other users can proceed!
        await asyncio.sleep(0.01)

        return {"status": "SUCCESS", "client_id": client_id}
`,
    postMortem:
      'Never call synchronous blocking I/O or sleep inside async def functions. Use non-blocking async primitives or wrap unavoidable blocking calls in asyncio.to_thread(func). Added ruff rule ASYNC101 to CI/CD pipeline to reject synchronous sleep in coroutines.',
    testSuiteCode: `import asyncio

async def test_suite():
    handler = AsyncGatewayHandler()

    # Test 1: Coroutine is awaitable and does not block
    task1 = handler.handle_request("client_1", {})
    task2 = handler.handle_request("client_2", {})

    # Concurrently gather tasks
    res1, res2 = await asyncio.gather(task1, task2)
    assert res1["status"] == "SUCCESS", "Task 1 should complete"
    assert res2["status"] == "SUCCESS", "Task 2 should complete"
    print("PASS: test_nonblocking_async_concurrency")

asyncio.run(test_suite())
`,
  },
  {
    id: 'inc-2',
    number: 2,
    title: 'Incident #2: The Multi-Tenant State Leak Security Breach',
    severity: 'P0-CRITICAL',
    service: 'chat-agent-orchestrator',
    outageSummary:
      'Customer B logged into their session and discovered confidential prompt history and API keys belonging to Customer A.',
    symptoms: [
      'Chat history arrays grew indefinitely across distinct user sessions.',
      'Customer privacy violation: session memory leaked cross-tenant in production.',
      'Unit tests passed because tests created only one user session at a time.',
    ],
    errorLogs: [
      '2026-11-19 04:30:11.450 [AUDIT] session_created: user_id="cust_8824" initial_history_len=42',
      '2026-11-19 04:30:11.451 [SECURITY_ALERT] Tenant mismatch: history contains messages from "cust_1109"',
    ],
    rootCauseAnalysis:
      'A developer used a mutable list as a default parameter: `def create_session(user_id, history=[])`. In Python, default parameter expressions evaluate ONCE at function definition time. The exact same list in heap memory was shared across every single customer request.',
    hints: [
      'Never use mutable default arguments like history=[] or metadata={}.',
      'Use None as the default value and instantiate a fresh list inside the function body.',
    ],
    brokenCode: `# BROKEN CODE: Mutable default parameter leaks memory across customers!

class SessionManager:
    # BUG: history=[] is evaluated ONCE when the class definition is executed!
    # Every customer without explicit history shares the EXACT SAME heap object!
    def create_session(self, user_id: str, history: list = []) -> dict:
        history.append(f"init_session_{user_id}")
        return {"user_id": user_id, "history": history}
`,
    fixedCode: `class SessionManager:
    """Production session manager with strict per-tenant memory isolation."""

    def create_session(self, user_id: str, history: list = None) -> dict:
        # PRODUCTION FIX: Use None sentinel and instantiate fresh list per invocation
        if history is None:
            history = []
        else:
            history = list(history)  # Defensive copy

        history.append(f"init_session_{user_id}")
        return {"user_id": user_id, "history": history}
`,
    postMortem:
      'Mutable default arguments are one of the most dangerous footguns in Python. Remediated with None sentinels and added Ruff rule B006 (mutable-argument-default) as a blocking error in pre-commit hooks.',
    testSuiteCode: `def test_suite():
    mgr = SessionManager()

    # Create session for User A
    sess_a = mgr.create_session("user_alpha")
    assert sess_a["history"] == ["init_session_user_alpha"], "User Alpha should have only their own history"

    # Create session for User B
    sess_b = mgr.create_session("user_beta")
    assert "init_session_user_alpha" not in sess_b["history"], "SECURITY LEAK: User Beta has User Alpha data!"
    assert sess_b["history"] == ["init_session_user_beta"], "User Beta must have clean isolated history"
    print("PASS: test_tenant_memory_isolation")

test_suite()
`,
  },
  {
    id: 'inc-3',
    number: 3,
    title: 'Incident #3: The Linux OOM Killer Database Dump Crash',
    severity: 'P1-HIGH',
    service: 'analytics-etl-worker',
    outageSummary:
      'The ETL worker container abruptly terminated with exit code 137 every morning at 03:00 UTC during daily log processing.',
    symptoms: [
      'Docker container terminated with OOMKilled: true.',
      'Memory usage skyrocketed from 150 MB to 4 GB in 12 seconds.',
      'Downstream analytics dashboards failed to update for 3 consecutive days.',
    ],
    errorLogs: [
      '2026-11-19 03:01:14 kernel: [ 4812.991201] Out of memory: Killed process 8192 (python)',
      '2026-11-19 03:01:14 kernel: [ 4812.991205] Memory cgroup out of memory: Kill process 8192 (python) score 1001',
      '2026-11-19 03:01:15 systemd: etl-worker.service: Main process exited, code=killed, status=9/KILL',
    ],
    rootCauseAnalysis:
      'The worker used `lines = file.readlines()` followed by a list comprehension `[parse(line) for line in lines]` to load a 14 GB audit file. Everything was read eagerly into memory at once, overwhelming the container RAM limits.',
    hints: [
      'Never read entire large files into memory with readlines() or list comprehensions.',
      'Use generator functions with `yield` to process records lazily one at a time with O(1) memory.',
    ],
    brokenCode: `# BROKEN CODE: Eager loading exhausts container memory

class LogAuditProcessor:
    def process_records(self, raw_lines: list) -> list:
        # BUG: Loads everything eagerly into memory as a giant list!
        parsed = [f"PARSED_{line.strip()}" for line in raw_lines]
        return parsed
`,
    fixedCode: `from typing import Generator, Iterable

class LogAuditProcessor:
    """Memory-efficient streaming processor with O(1) RAM footprint."""

    def process_records(self, raw_lines: Iterable[str]) -> Generator[str, None, None]:
        # PRODUCTION FIX: Use yield to stream records lazily on demand
        for line in raw_lines:
            yield f"PARSED_{line.strip()}"
`,
    postMortem:
      'Swapped eager collection parsing with generator pipelines. Memory footprint dropped from 4.2 GB to a flat 48 MB, and the process handles arbitrarily large log streams without OOM risk.',
    testSuiteCode: `import types

def test_suite():
    processor = LogAuditProcessor()
    sample = (f"log_entry_{i}" for i in range(100))

    result = processor.process_records(sample)
    assert isinstance(result, types.GeneratorType), "Must return a generator, NOT a materialized list!"

    # Consume first item
    first = next(result)
    assert first == "PARSED_log_entry_0", "First item parsed correctly"
    print("PASS: test_streaming_generator_pipeline")

test_suite()
`,
  },
  {
    id: 'inc-4',
    number: 4,
    title: 'Incident #4: The Thundering Herd & Cascading 429 Ban',
    severity: 'P1-HIGH',
    service: 'llm-inference-router',
    outageSummary:
      'A minor network glitch triggered 200 concurrent tasks to retry simultaneously at fixed intervals, swamping the LLM API and resulting in a 24-hour rate limit ban.',
    symptoms: [
      'Upstream returned HTTP 429 Too Many Requests.',
      'Retry attempts spiked in synchronized lockstep spikes every 1.0 second.',
      'All inference requests failed across the entire platform.',
    ],
    errorLogs: [
      '2026-11-19 08:22:01.002 [ERROR] llm_client: HTTP 429: Rate limit exceeded (200 requests/sec)',
      '2026-11-19 08:22:02.003 [ERROR] llm_client: HTTP 429: Rate limit exceeded (200 requests/sec)',
      '2026-11-19 08:22:03.004 [CRITICAL] llm_client: Account throttled: Temporarily suspended for high burst traffic',
    ],
    rootCauseAnalysis:
      'All retry loops were using a fixed `time.sleep(1.0)` with no backoff and zero jitter. When 200 requests failed at $T=0$, all 200 retried together at $T=1.0$, $T=2.0$, and $T=3.0$, creating a destructive thundering herd.',
    hints: [
      'Implement exponential backoff: delay = base_delay * (2 ** (attempt - 1)).',
      'Add randomized jitter (e.g. random.uniform(0.5, 1.5) * delay) to desynchronize concurrent retries.',
    ],
    brokenCode: `import time
# BROKEN CODE: Fixed delay creates synchronized thundering herd spikes!

class SyncRetryClient:
    def retry_call(self, fn, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                return fn()
            except Exception:
                # BUG: Fixed delay causes all workers to retry at the EXACT same millisecond!
                time.sleep(1.0)
        raise RuntimeError("Retries exhausted")
`,
    fixedCode: `import time
import random

class SyncRetryClient:
    """Resilient client with exponential backoff and randomized desynchronization jitter."""

    def compute_delay(self, attempt: int, base_delay: float = 0.1) -> float:
        # PRODUCTION FIX: Exponential backoff + Full Jitter
        backoff = base_delay * (2 ** (attempt - 1))
        jitter = random.uniform(0.8, 1.2)
        return backoff * jitter

    def retry_call(self, fn, max_retries: int = 3):
        for attempt in range(1, max_retries + 1):
            try:
                return fn()
            except Exception as err:
                if attempt == max_retries:
                    raise RuntimeError(f"Retries exhausted: {err}")
                delay = self.compute_delay(attempt)
                time.sleep(delay)
`,
    postMortem:
      'Added randomized jitter and exponential backoff to all retry loops. Traffic spikes smoothed into a flat Poisson distribution, preventing upstream rate limit triggers.',
    testSuiteCode: `def test_suite():
    client = SyncRetryClient()

    # Test delay calculation grows exponentially
    d1 = client.compute_delay(1, base_delay=0.1)
    d2 = client.compute_delay(2, base_delay=0.1)
    d3 = client.compute_delay(3, base_delay=0.1)

    assert 0.07 <= d1 <= 0.13, "Attempt 1 delay should be around 0.1s"
    assert 0.15 <= d2 <= 0.25, "Attempt 2 delay should be around 0.2s"
    assert 0.30 <= d3 <= 0.50, "Attempt 3 delay should be around 0.4s"
    print("PASS: test_exponential_backoff_with_jitter")

test_suite()
`,
  },
  {
    id: 'inc-5',
    number: 5,
    title: 'Incident #5: The Silent Transaction Drop Bug',
    severity: 'P1-HIGH',
    service: 'billing-ledger-service',
    outageSummary:
      'Customers reported being billed on Stripe, but their accounts remained on the Free tier and ledger balances were never updated.',
    symptoms: [
      'Credit cards charged successfully, but order database remained empty.',
      'Zero error alerts triggered on Datadog or Sentry.',
      'Customer support received 140 angry tickets within 2 hours.',
    ],
    errorLogs: [
      '2026-11-19 11:04:12 [INFO] stripe_webhook: Charge succeeded ch_9941a',
      '2026-11-19 11:04:12 [INFO] ledger: Workflow completed without errors.',
    ],
    rootCauseAnalysis:
      'A developer wrapped the database insert in a bare `except: pass` block to "prevent crashes". When the database pool ran out of connections, the exception was caught and completely silenced. The workflow returned "SUCCESS" and never alerted the engineering team.',
    hints: [
      'NEVER write bare except: pass. Always catch specific exception classes.',
      'Log exceptions with full context and re-raise or trigger rollback.',
    ],
    brokenCode: `# BROKEN CODE: Silent exception swallowing hides database drop!

class BillingLedger:
    def record_charge(self, db, order_id: str, amount: float) -> str:
        try:
            db.execute("INSERT INTO ledger (order_id, amount) VALUES (?, ?)", (order_id, amount))
        except:
            # BUG: Bare except catches and silences ALL exceptions!
            # The database error is invisible and the transaction is lost!
            pass

        return "SUCCESS"
`,
    fixedCode: `class DatabaseError(Exception):
    pass

class BillingLedger:
    """Production billing ledger with defensive error contracts."""

    def record_charge(self, db, order_id: str, amount: float) -> str:
        try:
            db.execute("INSERT INTO ledger (order_id, amount) VALUES (?, ?)", (order_id, amount))
            return "SUCCESS"
        except Exception as err:
            # PRODUCTION FIX: Log error with context and raise domain exception for rollback
            raise DatabaseError(f"Failed to record billing for order {order_id}: {err}") from err
`,
    postMortem:
      'Eliminated all bare except blocks across the repository using Ruff rule E722 (bare-except). Implemented database transaction rollbacks and automated dead-letter queues for payment webhooks.',
    testSuiteCode: `def test_suite():
    class FailingDB:
        def execute(self, *args):
            raise ConnectionError("Database pool exhausted")

    ledger = BillingLedger()
    try:
        ledger.record_charge(FailingDB(), "ord_999", 49.99)
        assert False, "Should raise DatabaseError when DB fails!"
    except DatabaseError:
        print("PASS: test_database_error_propagated_safely")

test_suite()
`,
  },
];

export const INCIDENT_PROGRESS_STORAGE_KEY = 'fde-python-incident-progress-v1';
export const INCIDENT_DRAFTS_STORAGE_KEY = 'fde-python-incident-drafts-v1';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return null;
}

export function loadIncidentProgress(): Record<string, boolean> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(INCIDENT_PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveIncidentResolved(incidentId: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadIncidentProgress();
    current[incidentId] = true;
    storage.setItem(INCIDENT_PROGRESS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}

export function loadIncidentDrafts(): Record<string, string> {
  try {
    const storage = getStorage();
    if (!storage) return {};
    const raw = storage.getItem(INCIDENT_DRAFTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveIncidentDraft(incidentId: string, code: string): void {
  try {
    const storage = getStorage();
    if (!storage) return;
    const current = loadIncidentDrafts();
    current[incidentId] = code;
    storage.setItem(INCIDENT_DRAFTS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage quota
  }
}
