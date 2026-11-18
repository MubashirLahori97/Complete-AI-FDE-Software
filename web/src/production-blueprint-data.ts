export type ConceptCategory =
  | 'all'
  | 'apis'
  | 'databases'
  | 'security'
  | 'ai-systems'
  | 'testing'
  | 'operations';

export interface ProductionSprint {
  id: string;
  number: number;
  title: string;
  layer: string;
  duration: string;
  conceptTitle: string;
  analogy: string;
  whyItMatters: string;
  filesCreated: string[];
  aiPrompt: string;
  humanVerifyChecklist: string[];
  commonAiMistake: string;
  relatedMissionIds: number[];
}

export interface ConceptCard {
  id: string;
  category: Exclude<ConceptCategory, 'all'>;
  title: string;
  oneLiner: string;
  analogy: string;
  productionRule: string;
}

export interface OmittedTradeoff {
  temptation: string;
  pragmaticChoice: string;
  whyWait: string;
  upgradeTrigger: string;
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  stack: string;
  role: string;
  keyPatterns: string[];
  sprintNumbers: number[];
}

export const BLUEPRINT_STORAGE_KEY = 'fde-production-blueprint-v1';

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'frontend',
    name: '1. Frontend Client',
    stack: 'React 19 · TypeScript · Vite',
    role: 'Fast, resilient interface with dual-mode support (Mock mode vs. Live API mode). Never trusted for security.',
    keyPatterns: ['Error Boundaries', 'Optimistic UI', 'Code Splitting', 'SSE Stream Reader'],
    sprintNumbers: [7],
  },
  {
    id: 'api',
    name: '2. Backend API Layer',
    stack: 'Python 3.12 · FastAPI · Pydantic v2',
    role: 'Validates inputs, enforces auth/permissions, streams AI replies via SSE, and returns consistent JSON contracts.',
    keyPatterns: ['Layered Modules', 'REST + SSE', 'Idempotency-Key', 'Rate Limiting'],
    sprintNumbers: [1, 2, 6],
  },
  {
    id: 'security',
    name: '3. Security & Governance',
    stack: 'Argon2id · SHA-256 Sessions · RBAC',
    role: 'Protects passwords, prevents timing attacks, enables instant session revocation, and keeps secrets out of logs.',
    keyPatterns: ['Timing Shield', 'Stateful Sessions', 'Cache-Control: no-store', 'Audit Trail'],
    sprintNumbers: [4, 5],
  },
  {
    id: 'data',
    name: '4. Database & Async Jobs',
    stack: 'PostgreSQL · SQLAlchemy 2.0 · Alembic',
    role: 'Durable source of truth with ACID transactions, schema migrations, and transactional background job queues.',
    keyPatterns: ['UUID Keys', 'FOR UPDATE SKIP LOCKED', 'Exponential Backoff', 'Savepoint Tests'],
    sprintNumbers: [3, 5],
  },
  {
    id: 'ai',
    name: '5. AI Engine & Evals',
    stack: 'Structured Outputs · RAG · Guardrails',
    role: 'Grounds AI responses in verified data, blocks prompt injection, enforces cost limits, and measures quality on eval sets.',
    keyPatterns: ['SPEC.md + AGENTS.md', 'Safety Classifier', 'Deterministic Test Fakes', 'Held-out Evals'],
    sprintNumbers: [1, 6],
  },
  {
    id: 'ops',
    name: '6. Harness, CI/CD & Ops',
    stack: 'Pytest · Playwright · GitHub Actions · Docker',
    role: 'Automates quality gates, ships progressively behind flags, tracks logs/metrics/traces, and guarantees fast rollbacks.',
    keyPatterns: ['Testing Pyramid', 'Feature Flags', 'SEV-1 Runbooks', 'Blameless Postmortems'],
    sprintNumbers: [3, 8],
  },
];

export const PRODUCTION_SPRINTS: ProductionSprint[] = [
  {
    id: 'sprint-1',
    number: 1,
    title: 'Spec, Guardrails & Repo Skeleton',
    layer: 'Foundation & Context',
    duration: '20 min',
    conceptTitle: 'Spec-Driven Development + Typed Config',
    analogy:
      'Think of SPEC.md and AGENTS.md like a builder’s blueprint plus building-code inspection rules: you hand both to the crew before anyone pours concrete.',
    whyItMatters:
      'Prompting an AI without a spec or guardrail file produces scattered files, hardcoded secrets, and conflicting conventions across sessions.',
    filesCreated: [
      'SPEC.md',
      'AGENTS.md',
      'backend/pyproject.toml',
      'backend/app/core/config.py',
      '.env.example',
      '.github/workflows/ci.yml',
    ],
    aiPrompt: `Read SPEC.md and AGENTS.md first.
Build Sprint 1 for OpsDesk AI (a multi-user support & operations platform):
1. Initialize a Python 3.12 FastAPI project in backend/ using uv (pyproject.toml).
2. Create app/core/config.py using pydantic-settings that loads DATABASE_URL, APP_ENV, ALLOWED_ORIGINS, and AI_API_KEY and fails fast on missing required secrets in production.
3. Add .env.example (no real secrets) and a GitHub Actions CI workflow running pytest and type checks.
Do NOT build auth or business routes yet. Report files changed and exact verification command output.`,
    humanVerifyChecklist: [
      'Confirm .env is in .gitignore and .env.example contains placeholder values only.',
      'Test startup with a missing required env var and verify it fails immediately with a clear message.',
      'Check that AGENTS.md explicitly lists the test command every future sprint must pass.',
    ],
    commonAiMistake:
      'AI often hardcodes a default fallback secret like "dev-secret-123" that accidentally survives into production.',
    relatedMissionIds: [1, 2, 10],
  },
  {
    id: 'sprint-2',
    number: 2,
    title: 'Layered API Core, Health Check & Error Envelope',
    layer: 'Backend API',
    duration: '25 min',
    conceptTitle: 'Layered Architecture, Middleware & Error Contracts',
    analogy:
      'An API is a restaurant kitchen with a strict order slip (router), bouncer at the door (middleware), head chef (service), and pantry (models).',
    whyItMatters:
      'When every error returns a predictable JSON envelope and sensitive responses carry Cache-Control: no-store, frontends never crash on surprise HTML 500 pages.',
    filesCreated: [
      'backend/app/main.py',
      'backend/app/core/errors.py',
      'backend/tests/test_health.py',
      'backend/tests/test_errors.py',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 2 (API Core):
1. Create app/core/errors.py with a typed AppError exception and global handlers so 404, 422, AppError, and unexpected 500 errors all return {"error": {"code": "...", "message": "..."}} without leaking stack traces.
2. Create app/main.py with CORSMiddleware (strict origins from config), a NoStoreMiddleware adding Cache-Control: no-store to API responses, and GET /api/v1/health returning 200 OK (or 503 if DB check fails).
3. Write pytest tests using FastAPI TestClient covering health OK, DB-down 503, 404, 422, and Cache-Control header. Run pytest and show full output.`,
    humanVerifyChecklist: [
      'Inspect CORS config: ensure allow_origins is NOT ["*"] when allow_credentials=True.',
      'Trigger an unhandled exception in a test and verify no stack trace or internal SQL leaks in the JSON body.',
      'Confirm Cache-Control: no-store is present on API responses.',
    ],
    commonAiMistake:
      'AI frequently sets allow_origins=["*"] with credentials enabled or forgets to standardize FastAPI’s default 422 validation payload.',
    relatedMissionIds: [11, 15],
  },
  {
    id: 'sprint-3',
    number: 3,
    title: 'Database, ORM, Migrations & Fast Savepoint Tests',
    layer: 'Data & Harness',
    duration: '30 min',
    conceptTitle: 'Relational Modeling, Migrations & Transaction Rollback Tests',
    analogy:
      'Alembic is Git version control for your database filing cabinet; savepoint rollbacks let every test use the cabinet and magically undo all changes in 5 milliseconds.',
    whyItMatters:
      'Without migrations you risk corrupting live customer data; without fast isolated tests you stop running your safety harness.',
    filesCreated: [
      'backend/app/core/database.py',
      'backend/alembic/env.py',
      'backend/tests/conftest.py',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 3 (Database & Test Harness):
1. Create app/core/database.py using SQLAlchemy 2.0 DeclarativeBase with UUID primary keys, timezone-aware UTC timestamps, and hide_parameters=True on the engine so query values never leak into logs.
2. Provide a get_db dependency (DbSession) with clean session lifecycle management.
3. Configure Alembic for schema migrations.
4. Create tests/conftest.py with a fast test database fixture using nested savepoints + transaction.rollback() and app.dependency_overrides[get_db] so tests stay isolated and run in under 1 second. Verify with pytest.`,
    humanVerifyChecklist: [
      'Verify hide_parameters=True is configured on the SQLAlchemy engine.',
      'Confirm tests run fast and leave zero leftover rows between test functions.',
      'Confirm primary keys use non-sequential UUIDs instead of guessable integers (1, 2, 3).',
    ],
    commonAiMistake:
      'AI often drops and recreates all tables on every test (making suites painfully slow) or skips timezone-aware UTC timestamps.',
    relatedMissionIds: [12, 13, 21],
  },
  {
    id: 'sprint-4',
    number: 4,
    title: 'Production Auth, Sessions & Security Boundaries',
    layer: 'Security & Access',
    duration: '35 min',
    conceptTitle: 'Argon2id, Timing-Attack Shield & Stateful Hashed Sessions',
    analogy:
      'A stateful hashed session is like a hotel keycard the front desk can deactivate in one second if lost—unlike a printed paper pass (stateless JWT) that stays valid until midnight.',
    whyItMatters:
      'Authentication bugs are the #1 cause of real-world breaches. Understanding why you hash tokens, shield timing, and enforce permissions on the server separates real engineers from demo builders.',
    filesCreated: [
      'backend/app/auth/security.py',
      'backend/app/auth/models.py',
      'backend/app/auth/service.py',
      'backend/app/auth/router.py',
      'backend/tests/test_security.py',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 4 (Production Auth):
1. In app/auth/security.py, hash passwords with Argon2id (not SHA-256/MD5). Include a precomputed _DUMMY_HASH check when an email is not found so login timing is constant (preventing user enumeration).
2. Issue random 32-byte URL-safe session tokens, storing ONLY their SHA-256 hash in a sessions table so access can be revoked immediately on sign-out or password change.
3. Add a CurrentUser FastAPI dependency and per-IP rate limiting on login attempts.
4. Write unit & integration tests covering signup, login, wrong password, unknown email timing path, revoked session rejection, and 401/403 separation. Run pytest.`,
    humanVerifyChecklist: [
      'Verify raw session tokens are NEVER stored in the database (only their SHA-256 hash).',
      'Confirm unknown email and wrong password return the exact same error message and run Argon2id.',
      'Verify protected routes enforce ownership/role checks server-side (never trusting a user_id sent in the JSON body).',
    ],
    commonAiMistake:
      'AI frequently returns "Email not found" vs. "Wrong password" (leaking registered accounts) or trusts a client-supplied role/user_id field.',
    relatedMissionIds: [14, 25],
  },
  {
    id: 'sprint-5',
    number: 5,
    title: 'Background Job Queue & Immutable Audit Log',
    layer: 'Reliability & Governance',
    duration: '30 min',
    conceptTitle: 'PostgreSQL SKIP LOCKED Queues & Append-Only Audit Trails',
    analogy:
      'Instead of making a customer stand at the counter while an email or PDF generates, drop a ticket on the kitchen rail (jobs table) inside the same transaction so a background cook picks it up safely.',
    whyItMatters:
      'You get atomic background processing with zero Redis/Celery infrastructure overhead—and an immutable audit trail that survives user deletions.',
    filesCreated: [
      'backend/app/core/jobs.py',
      'backend/app/worker.py',
      'backend/app/core/audit.py',
      'backend/tests/test_jobs.py',
      'backend/tests/test_audit.py',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 5 (Jobs & Audit Trail):
1. Create a jobs table and enqueue/claim helpers in app/core/jobs.py using SELECT ... FOR UPDATE SKIP LOCKED (with safe SQLite fallback in unit tests), exponential backoff retries (max 5 attempts), and sanitized error logging (record only exception class name, never private payloads).
2. Create app/worker.py to poll and execute queued jobs cleanly.
3. Create app/core/audit.py with an append-only audit_events table using plain UUID actor/resource IDs (no CASCADE foreign keys so logs survive account deletion).
4. Write pytest tests for enqueue, claim, retry backoff, dead-letter exhaustion, and audit persistence. Run pytest.`,
    humanVerifyChecklist: [
      'Verify enqueueing a job shares the caller’s database session (rolls back automatically if the main request fails).',
      'Confirm failed job error strings never dump raw payloads or secrets.',
      'Verify audit_events has no UPDATE/DELETE service helpers and survives user record removal.',
    ],
    commonAiMistake:
      'AI often commits inside enqueue_job() prematurely (breaking atomic rollback) or logs full exception messages containing user secrets.',
    relatedMissionIds: [13, 24, 25],
  },
  {
    id: 'sprint-6',
    number: 6,
    title: 'Real-Time AI Streaming (SSE), Guardrails & Evals',
    layer: 'AI Engine & Quality',
    duration: '35 min',
    conceptTitle: 'Server-Sent Events (SSE), Guardrails & Held-Out Evals',
    analogy:
      'SSE is a one-way live news ticker over normal HTTP—it streams AI words as they arrive without the firewall headaches of WebSockets, while a bouncer checks every input and output.',
    whyItMatters:
      'AI features are non-deterministic. Separating the AI provider behind a clean interface lets tests run in milliseconds with deterministic fakes while held-out evals measure real accuracy and safety.',
    filesCreated: [
      'backend/app/ai/protocol.py',
      'backend/app/ai/guardrails.py',
      'backend/app/ai/router.py',
      'backend/tests/test_ai_evals.py',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 6 (AI Streaming & Guardrails):
1. Define an AIProvider Protocol in app/ai/protocol.py with a real provider adapter and a deterministic FakeAIProvider for tests.
2. Add app/ai/guardrails.py enforcing max input length, prompt-injection & restricted-action checks, structured output validation, and per-user token/cost budgets.
3. Create POST /api/v1/assistant/stream returning text/event-stream (SSE) token events + final done event, storing the completed turn in the database.
4. Build tests/test_ai_evals.py with dependency_overrides testing normal streaming, blocked adversarial inputs, timeout fallback, and structured-output schema checks. Run pytest.`,
    humanVerifyChecklist: [
      'Confirm unit tests NEVER hit a paid live LLM endpoint (swap provider via dependency_overrides).',
      'Verify guardrail checks run BEFORE streaming begins and BEFORE any privileged tool executes.',
      'Check that held-out evaluation cases include adversarial / refusal scenarios, not just easy happy paths.',
    ],
    commonAiMistake:
      'AI often couples route handlers directly to one vendor SDK (making testing impossible) and forgets max-token / timeout limits.',
    relatedMissionIds: [17, 18, 19, 20],
  },
  {
    id: 'sprint-7',
    number: 7,
    title: 'Dual-Mode React Frontend & E2E Flow',
    layer: 'Frontend & Integration',
    duration: '35 min',
    conceptTitle: 'Mock-Mode vs. Live-API Architecture & Resilience',
    analogy:
      'Building a dual-mode frontend is like testing a car dashboard on a simulator before bolting it into the engine—you verify every button, error banner, and loading state fast, then flip one switch to go live.',
    whyItMatters:
      'Frontend and backend teams can move in parallel, Error Boundaries stop white-screen crashes, and Playwright proves the real end-to-end user journey works.',
    filesCreated: [
      'frontend/src/api/client.ts',
      'frontend/src/components/ErrorBoundary.tsx',
      'frontend/src/features/assistant/AssistantView.tsx',
      'frontend/tests/e2e.spec.ts',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 7 (Dual-Mode React Frontend):
1. Create a typed API client in frontend/src/api/client.ts supporting VITE_API_MODE=mock (local fixtures) and VITE_API_MODE=api (live FastAPI backend) with an SSE stream reader and clean error parsing matching our backend error envelope.
2. Wrap routes in a React ErrorBoundary so a broken widget never white-screens the whole app; lazy-load secondary views with React.lazy.
3. Build the core AssistantView supporting streaming replies, loading/error states, and debounced search.
4. Add a Playwright E2E test verifying sign-in, sending a prompt, receiving a streamed reply, and graceful handling of a 503 outage. Run build and tests.`,
    humanVerifyChecklist: [
      'Flip between mock mode and live API mode via one environment variable with zero component rewrites.',
      'Simulate a 500/503 API error and confirm the UI shows a helpful, recoverable message instead of crashing.',
      'Verify no API secrets are prefixed with VITE_ (anything in VITE_* ships publicly to every user’s browser).',
    ],
    commonAiMistake:
      'AI often exposes private keys in VITE_ environment variables or forgets to clean up SSE/fetch AbortControllers on component unmount.',
    relatedMissionIds: [3, 8, 21, 27],
  },
  {
    id: 'sprint-8',
    number: 8,
    title: 'Deploy, Monitor, Scale & Incident Readiness',
    layer: 'Production Operations',
    duration: '30 min',
    conceptTitle: 'CI/CD, Progressive Rollouts, Observability & Blameless Postmortems',
    analogy:
      'Shipping without monitoring and a rollback plan is flying a plane with painted-over cockpit gauges and no emergency exit.',
    whyItMatters:
      'Production is where real engineering begins. Knowing how to roll back in 2 minutes, trace slow queries, avoid cache stampedes, and run a blameless postmortem makes you production-ready.',
    filesCreated: [
      'backend/Dockerfile',
      'compose.yaml',
      'docs/adr/0001-modular-monolith-and-skip-locked.md',
      'docs/runbooks/rollback.md',
      'docs/runbooks/incident-sev1.md',
    ],
    aiPrompt: `Following AGENTS.md, implement Sprint 8 (Production Ops & Readiness):
1. Create a minimal multi-stage non-root Dockerfile for backend/ and a compose.yaml running API, background worker, and PostgreSQL locally.
2. Add structured JSON request logging (request_id, path, status, duration_ms — strictly excluding auth headers and request bodies).
3. Write docs/adr/0001-modular-monolith-and-skip-locked.md documenting why we start with PostgreSQL + modular monolith and the exact scaling triggers for Read Replicas and Redis.
4. Write docs/runbooks/rollback.md with exact rollback steps, feature-flag kill switches, and a SEV-1 incident checklist.`,
    humanVerifyChecklist: [
      'Confirm Docker container runs as a non-root user and healthcheck hits /api/v1/health.',
      'Inspect structured logs to verify zero passwords, Bearer tokens, or private fields appear.',
      'Walk through the 8-part system explanation out loud: could you explain every arrow on a whiteboard without looking at the code?',
    ],
    commonAiMistake:
      'AI often generates root-user Dockerfiles, logs full HTTP headers (leaking Bearer tokens), or over-engineers Kubernetes YAML on Day 1.',
    relatedMissionIds: [22, 23, 24, 28, 29, 30],
  },
];

export const CONCEPT_CARDS: ConceptCard[] = [
  {
    id: 'rest-vs-sse',
    category: 'apis',
    title: 'REST vs. SSE vs. WebSockets vs. GraphQL vs. gRPC',
    oneLiner: 'Pick the simplest protocol that fits your data direction.',
    analogy:
      'REST is sending a letter and getting a reply; SSE is a one-way live ticker; WebSockets is an open two-way phone call; gRPC is a compressed binary fiber tunnel between internal servers.',
    productionRule:
      'Use REST for 90% of CRUD endpoints and SSE for AI token streaming. Only pay WebSocket or GraphQL complexity when truly required.',
  },
  {
    id: 'idempotency-pagination',
    category: 'apis',
    title: 'Idempotency-Key & Keyset Pagination',
    oneLiner: 'Protect retries from double-charging and keep page 10,000 instant.',
    analogy:
      'An Idempotency-Key is a unique receipt number on a check so depositing it twice never charges twice; Keyset pagination is using a bookmark instead of recounting from page 1.',
    productionRule:
      'Always require Idempotency-Key on payments/mutations, and use cursor/keyset pagination (WHERE id < cursor) instead of OFFSET at scale.',
  },
  {
    id: 'framework-choice',
    category: 'apis',
    title: 'FastAPI (Python) vs. Rust vs. Go vs. Node.js',
    oneLiner: 'Optimize for ecosystem fit and delivery speed before raw microsecond benchmarks.',
    analogy:
      'Don’t build a hospital shuttle out of a Formula 1 engine if every medical sensor only plugs into a standard van.',
    productionRule:
      'For AI-heavy products, Python + FastAPI wins on native AI/ML tooling, Pydantic type contracts, and development speed.',
  },
  {
    id: 'six-db-types',
    category: 'databases',
    title: 'The 6 Database Types & Why PostgreSQL Covers 90%',
    oneLiner: 'Relational, In-Memory (Redis), Document, Vector (pgvector), Graph, and Time-Series.',
    analogy:
      'PostgreSQL is a Swiss Army workshop: strict relational filing cabinets, JSONB drawers, and pgvector semantic search in one battle-tested engine.',
    productionRule:
      'Start with PostgreSQL (plus pgvector if you need embeddings). Add Redis or specialized stores only after metrics prove PostgreSQL is the bottleneck.',
  },
  {
    id: 'orm-transactions',
    category: 'databases',
    title: 'ORMs, ACID Transactions & Row Locking',
    oneLiner: 'Protect multi-step state updates from crashes and simultaneous race conditions.',
    analogy:
      'A transaction is a bank transfer envelope (deduct A + credit B happen together or neither happens); FOR UPDATE locks the drawer while you count the cash.',
    productionRule:
      'Use SQLAlchemy 2.0 + Alembic migrations for schema safety, and SELECT ... FOR UPDATE SKIP LOCKED for safe concurrent job claiming.',
  },
  {
    id: 'argon2-sessions',
    category: 'security',
    title: 'Argon2id, Timing Shields & Stateful Sessions',
    oneLiner: 'Make brute-force impractical, hide user existence, and revoke stolen tokens instantly.',
    analogy:
      'Argon2id is a heavy vault wheel that takes 100ms per turn; _DUMMY_HASH ensures empty vaults take 100ms too so thieves can’t tell which ones hold gold.',
    productionRule:
      'Never use SHA-256/MD5 for passwords. Store only SHA-256 hashes of random session tokens so revoking a row cuts off access immediately.',
  },
  {
    id: 'never-trust-frontend',
    category: 'security',
    title: 'Trust Boundaries: Never Trust the Frontend',
    oneLiner: 'Any user can open DevTools and forge any browser request.',
    analogy:
      'Hiding an "Admin" button in the browser is like taping paper over a door handle without locking the door.',
    productionRule:
      'Enforce authentication, role checks, plan limits, rate limits, and input validation on the backend API—every single time.',
  },
  {
    id: 'context-harness',
    category: 'ai-systems',
    title: 'Context Engineering & Harness Engineering',
    oneLiner: 'Treat SPEC.md, AGENTS.md, and automated CI checks as your real AI control plane.',
    analogy:
      'A brilliant intern with a clear spec and automated checklists outperforms a genius guessing in the dark.',
    productionRule:
      'Never let an AI agent ship unverified code. Encode architecture rules in AGENTS.md and enforce them mechanically in CI.',
  },
  {
    id: 'evals-guardrails',
    category: 'ai-systems',
    title: 'Held-Out AI Evals & Defense-in-Depth Guardrails',
    oneLiner: 'Prompts are hypotheses; held-out evaluation suites are proof.',
    analogy:
      'Grading a student only on the practice questions they already saw proves memorization, not real competence.',
    productionRule:
      'Maintain a versioned held-out eval set (normal, boundary, and prompt-injection cases) and run it whenever prompts or models change.',
  },
  {
    id: 'testing-pyramid',
    category: 'testing',
    title: 'The Testing Pyramid (80 / 15 / 5) & Savepoints',
    oneLiner: 'Fast unit tests catch logic bugs in milliseconds; integration and E2E verify wiring.',
    analogy:
      'Check each Lego brick individually (unit), check sub-assemblies (integration), then test-drive the finished car (E2E).',
    productionRule:
      'Avoid the inverted "ice cream cone" of slow flaky UI tests. Use savepoint rollbacks and dependency overrides so backend suites run in < 1s.',
  },
  {
    id: 'cap-caching',
    category: 'operations',
    title: 'CAP Theorem, 8 Fallacies & Cache Stampedes',
    oneLiner: 'Networks always fail eventually—design for timeouts, retries, and thundering herds.',
    analogy:
      'A cache stampede is 1,000 shoppers rushing the single stockroom clerk the second a popular display shelf goes empty.',
    productionRule:
      'Assume every network call can time out. Protect hot cached keys with mutex locks or background refresh so database pools never saturate.',
  },
  {
    id: 'incident-postmortem',
    category: 'operations',
    title: 'SEV-1 Incident Lifecycle & Blameless Postmortems',
    oneLiner: 'Mitigate first (roll back!), investigate second, then turn root causes into tests.',
    analogy:
      'When a pipe bursts, shut off the main valve first—don’t stand in ankle-deep water debating how the pipe corroded.',
    productionRule:
      'Follow Detect → Triage → Mitigate → Communicate → Resolve → Learn (5 Whys). Every outage must leave behind a permanent harness check.',
  },
];

export const OMITTED_TRADEOFFS: OmittedTradeoff[] = [
  {
    temptation: 'Microservices on Day 1',
    pragmaticChoice: 'Modular Monolith (strict domain folders)',
    whyWait: 'Microservices add network latency, distributed transactions, and deployment overhead before you have team scale.',
    upgradeTrigger: 'Multiple independent engineering teams blocked on shared release cycles.',
  },
  {
    temptation: 'Redis + Celery / Kafka immediately',
    pragmaticChoice: 'PostgreSQL FOR UPDATE SKIP LOCKED queue',
    whyWait: 'Enqueuing inside the same SQL transaction prevents dual-write bugs and saves an entire cluster to operate.',
    upgradeTrigger: 'Sustained background throughput exceeds ~1,000 jobs/second.',
  },
  {
    temptation: 'WebSockets for AI Chat',
    pragmaticChoice: 'Server-Sent Events (SSE) over HTTP/2',
    whyWait: 'AI streaming is server-to-client; SSE works cleanly through corporate firewalls and reconnects natively.',
    upgradeTrigger: 'True low-latency bidirectional sync (multiplayer cursors, live voice/video).',
  },
  {
    temptation: 'Custom Kubernetes Cluster',
    pragmaticChoice: 'Managed Containers (Cloud Run / ECS / Fly.io)',
    whyWait: 'Managing K8s control planes steals weeks from building user value and verification harnesses.',
    upgradeTrigger: 'Dedicated SRE team needing custom multi-region scheduling or strict VPC compliance.',
  },
  {
    temptation: 'Stateless JWT-Only Auth',
    pragmaticChoice: 'Stateful Hashed Sessions in DB',
    whyWait: 'You cannot instantly revoke a leaked JWT without building a revocation store anyway.',
    upgradeTrigger: 'Extreme global edge fan-out where DB session reads become a measured latency bottleneck.',
  },
];

export function loadCompletedSprints(): string[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(BLUEPRINT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set(PRODUCTION_SPRINTS.map((sprint) => sprint.id));
    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  } catch {
    return [];
  }
}

export function saveCompletedSprints(ids: string[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BLUEPRINT_STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    /* ignore storage quota failures */
  }
}

export function filterConcepts(category: ConceptCategory): ConceptCard[] {
  if (category === 'all') return CONCEPT_CARDS;
  return CONCEPT_CARDS.filter((card) => card.category === category);
}
