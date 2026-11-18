# AGENTS.md — Context Engineering & Guardrails

> Place this file in the root of your repository so every AI coding agent operates under the same architectural, security, and verification constraints.

---

## 1. Project Overview & Source of Truth
- **Purpose:** [One-sentence description of what this system does]
- **Active Specification:** Read `SPEC.md` before planning or modifying code. If a requirement is ambiguous, **ask before guessing**.
- **Architecture Decisions:** Respect existing decisions in `docs/adr/`.

---

## 2. Technology Stack & Boundaries
- **Frontend:** [e.g., React + TypeScript + Vite]
- **Backend:** [e.g., Python 3.12 + FastAPI + PostgreSQL]
- **Layer rules:**
  - UI components must never contain direct database logic or secret keys.
  - Route/controller handlers validate input and call service functions; business rules live in the service layer.
  - All database queries must use parameterized bindings (never string interpolation).

---

## 3. Required Verification Harness (Run Before Every Handoff)
An agent task is **NOT complete** until all commands below exit with code `0`:

```bash
# 1. Type check & lint
npm run build

# 2. Automated unit & integration tests
npm test
```

If you add a new behavior or fix a bug, **add a test that fails without your change and passes with it**.

---

## 4. Forbidden Shortcuts
AI agents operating in this repository must **NEVER**:
- Hardcode API keys, passwords, or tokens in source files or tests.
- Silence failing tests by weakening assertions or skipping test cases.
- Log sensitive user data (passwords, tokens, private messages, PII).
- Run destructive database drops or production migrations without explicit human approval.
- Expand scope beyond the current vertical slice in `SPEC.md`.

---

## 5. Handoff Format
When finishing a slice, report:
1. **What changed** (files + brief reason)
2. **Evidence** (exact test/build commands run and their results)
3. **Risks & Rollback** (how to revert safely if production metrics degrade)
