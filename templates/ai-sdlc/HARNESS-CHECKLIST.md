# Harness & Governance Pre-Ship Checklist (Phases 5 & 6)

Complete this checklist before merging an AI-implemented vertical slice into production.

---

## A. Automated Harness Gates (Must Run Automatically in CI)
- [ ] **Build & Types:** TypeScript / static type checker passes with zero errors.
- [ ] **Unit Tests:** Happy path, boundary values, and invalid inputs all have automated assertions.
- [ ] **Integration Tests:** Persistence, API contracts, and auth boundaries tested end-to-end.
- [ ] **AI Evals (if using an LLM):** Held-out evaluation set passes accuracy, refusal, and latency/cost thresholds.
- [ ] **Security Scan (SAST / Secrets):** No hardcoded secrets, no SQL/HTML injection, dependencies audited.

---

## B. Human Governance & Intent Review (Do Not Delegate to AI)
- [ ] **Spec Alignment:** Actual behavior matches `SPEC.md` acceptance criteria and respects all Non-Goals.
- [ ] **Trust Boundaries:** Server (not client) enforces authentication, authorization, and rate limits.
- [ ] **Privacy & Logs:** No sensitive fields or raw user secrets written to logs or browser caches.
- [ ] **Diff Discipline:** Changes are scoped to one vertical slice; no unrelated "drive-by" refactors.
- [ ] **8-Part System Check:** Reviewer can explain what changed, how a user action flows end-to-end, and how it fails safely.

---

## C. Release & Rollback Readiness (Phase 7)
- [ ] **Safe Rollout:** Feature flag or staged rollout plan defined for high-risk changes.
- [ ] **Reversible Migration:** Database schema changes are backward-compatible during rollout.
- [ ] **Tested Rollback:** Exact command/step to revert to the previous known-good release is documented.
- [ ] **Telemetry Active:** Error rate, latency, and key business outcome metrics are visible after deploy.
