# Production Blueprint — Build a Production-Grade AI System Hands-On With AI

> **Fast learning without syntax memorization:** Follow this 8-sprint blueprint to direct AI coding agents to build a complete, production-grade full-stack AI platform (**OpsDesk AI** — an example multi-user operations & support platform) while mastering every engineering concept behind it.

---

## Why This Section Exists

Most tutorials stop at single-file scripts or toy demos. Real production systems fail when you skip **layered architecture, database transactions, real authentication, background jobs, streaming guardrails, automated test harnesses, and rollback plans**.

In the AI era, you do **not** need to hand-type every line of boilerplate—**but you must understand every architectural layer** so you can:
1. Give AI agents crisp, unambiguous specs (`SPEC.md`) and guardrails (`AGENTS.md`).
2. Inspect the AI's pull requests and spot hidden security, scaling, or data bugs immediately.
3. Prove the system works with an automated verification harness.

---

## The 7 Layers of a Production-Grade AI App

```
[ React + TypeScript Frontend ]  ──(REST JSON + SSE Stream)──▶  [ FastAPI Backend API ]
  • Dual-mode (Mock vs. Live)                                      • router → dependencies → service → models
  • Error boundaries & lazy routes                                 • CORS, NoStore, Rate Limiting, AppError
  • Never trusted for security                                     • Argon2id + Hashed Sessions + RBAC
                                                                             │
                     ┌───────────────────────────────────────────────────────┼───────────────────────┐
                     ▼                                                       ▼                       ▼
           [ PostgreSQL + ORM ]                                  [ Background Worker ]     [ AI Provider + Evals ]
           • UUID primary keys                                   • FOR UPDATE SKIP LOCKED  • Structured outputs
           • ACID transactions                                   • Exponential backoff     • Input/output guardrails
           • Alembic migrations                                  • Safe error logging      • Held-out eval suite
           • Append-only audit log
```

---

## The 8 Hands-On AI Build Sprints

Follow these 8 vertical slices in order. In each sprint, **understand the 60-second concept**, **hand the structured prompt to your AI coding agent**, and **verify the human gate before moving on**.

### Sprint 1: Spec, Guardrails & Repo Skeleton
- **Concepts:** Spec-Driven Development (`SPEC.md`), Context Engineering (`AGENTS.md`), reproducible environments (`uv` / lockfiles), typed configuration (Pydantic Settings).
- **Files created:** `SPEC.md`, `AGENTS.md`, `backend/pyproject.toml`, `backend/app/core/config.py`, `.env.example`, `.github/workflows/ci.yml`.
- **Human Gate:** Missing required environment variables fail fast on startup; zero secrets committed to Git.

### Sprint 2: Layered API Core, Health Check & Error Envelope
- **Concepts:** Layered architecture (`router.py` → `dependencies.py` → `service.py` → `models.py` → `schemas.py`), REST vs. SSE vs. WebSockets vs. GraphQL vs. gRPC, framework trade-offs (FastAPI vs. Rust vs. Go vs. Node), CORS, `Cache-Control: no-store`, consistent error envelopes.
- **Files created:** `backend/app/main.py`, `backend/app/core/errors.py`, `backend/tests/test_health.py`, `backend/tests/test_errors.py`.
- **Human Gate:** Every 404, 422, and 500 returns one clean JSON error shape; raw stack traces never leak to clients.

### Sprint 3: Database, ORM, Migrations & Fast Test Harness
- **Concepts:** Relational vs. NoSQL (the 6 database types), UUID primary keys vs. guessable integers, SQLAlchemy 2.0 ORM, ACID transactions, Alembic migrations, savepoint-rollback `pytest` fixtures + `dependency_overrides`.
- **Files created:** `backend/app/core/database.py`, `backend/alembic/`, `backend/tests/conftest.py`.
- **Human Gate:** Test suite runs in milliseconds using isolated transaction rollbacks; SQL query parameters are redacted in logs (`hide_parameters=True`).

### Sprint 4: Production Auth, Sessions & Security Boundaries
- **Concepts:** Hashing vs. encryption, Argon2id (memory-hard) vs. SHA-256, timing-attack prevention (`_DUMMY_HASH`), stateful hashed sessions (instant revocation) vs. stateless JWTs, server-side RBAC, rate limiting (Token Bucket / Sliding Window).
- **Files created:** `backend/app/auth/security.py`, `backend/app/auth/models.py`, `backend/app/auth/service.py`, `backend/app/auth/router.py`, `backend/tests/test_security.py`.
- **Human Gate:** Login latency is constant for existing vs. non-existing emails; revoking a session invalidates access immediately.

### Sprint 5: Background Jobs & Immutable Audit Trail
- **Concepts:** Keeping HTTP requests under 200ms by offloading slow work, PostgreSQL transactional job queues (`SELECT ... FOR UPDATE SKIP LOCKED`), exponential backoff retries, append-only audit logs with no cascading deletes.
- **Files created:** `backend/app/core/jobs.py`, `backend/app/worker.py`, `backend/app/core/audit.py`, `backend/tests/test_jobs.py`, `backend/tests/test_audit.py`.
- **Human Gate:** Enqueuing a job happens inside the same database transaction as the business write; failed jobs log only exception class names (never private payloads).

### Sprint 6: Real-Time AI Streaming (SSE), Guardrails & Evals
- **Concepts:** Server-Sent Events (SSE) over HTTP/2, structured JSON tool outputs, input/output safety guardrails, token/cost ceilings, held-out AI evaluation datasets (precision, recall, refusal rate).
- **Files created:** `backend/app/ai/service.py`, `backend/app/ai/guardrails.py`, `backend/app/ai/router.py`, `backend/tests/test_ai_evals.py`.
- **Human Gate:** Tests swap the real LLM for a deterministic fake via `dependency_overrides`; adversarial prompt-injection cases are blocked automatically.

### Sprint 7: Dual-Mode React Frontend & End-to-End Integration
- **Concepts:** Component architecture, dual-mode client (Mock/Prototype mode vs. Live API mode), consuming SSE streams cleanly, optimistic UI updates, debouncing, Error Boundaries, `React.lazy` code splitting, Playwright E2E.
- **Files created:** `frontend/src/api/client.ts`, `frontend/src/features/`, `frontend/tests/e2e.spec.ts`.
- **Human Gate:** Frontend works cleanly against both mock fixtures and the live FastAPI server; sensitive authorization is still enforced strictly on the server.

### Sprint 8: Deploy, Monitor, Scale & Incident Readiness
- **Concepts:** CI/CD pipelines, progressive rollouts (feature flags, canary, blue-green), CAP theorem, Caching strategies & Cache Stampede mitigation, Logs/Metrics/Traces, SEV-1 to SEV-4 Incident Response, Blameless Postmortems, and scaling from 1,000 to 1,000,000 users.
- **Files created:** `Dockerfile`, `compose.yaml`, `docs/adr/`, `docs/runbooks/rollback.md`, `templates/ai-sdlc/POSTMORTEM.md`.
- **Human Gate:** You can deploy, trigger a simulated failure, roll back in minutes, and explain the entire system end-to-end.

---

## Senior Engineering Trade-Offs: What NOT to Build on Day 1

A senior engineer is judged as much by what they **deliberately leave out** as by what they build:

| Temptation to Skip Early | Pragmatic Production Choice | When to Upgrade (Measurable Trigger) |
| :--- | :--- | :--- |
| **Microservices** | Clean **Modular Monolith** (strict package boundaries) | Multiple independent teams blocked on shared deploy cycles |
| **Redis + Celery / Kafka** | **PostgreSQL `FOR UPDATE SKIP LOCKED`** job table | Sustained background volume exceeds ~1,000 jobs/sec |
| **GraphQL** | **REST (JSON) + SSE** for AI streaming | Many diverse mobile/partner clients needing ad-hoc nested graphs |
| **WebSockets for AI Chat** | **Server-Sent Events (SSE)** over standard HTTP | True bidirectional low-latency multiplayer/cursor sync required |
| **Custom Kubernetes Cluster** | **Managed Containers** (ECS / Cloud Run / Fly.io) | Dedicated platform team & multi-region custom orchestration need |
| **Stateless JWT-Only Auth** | **Stateful Hashed Sessions** in DB (instant revocation) | Ultra-high edge fan-out where DB session lookup becomes bottleneck (add short-lived cache first) |

Explore this entire blueprint interactively—including **copy-paste AI prompts**, **60-second concept cards**, and your **live 8-sprint progress tracker**—at **`#/production` (Production Blueprint)**.
