# SPEC: [Feature or System Name]

- **Owner:** [Your Name]
- **Status:** Draft | Approved | Shipped
- **Last Updated:** YYYY-MM-DD

---

## 1. Problem & Baseline (Phase 1)
- **Who is affected:** [Specific user role]
- **Current workflow & bottleneck:** [What happens today and why it hurts]
- **Current baseline metric:** [e.g., 18 minutes average triage time, 12% misrouted tickets]
- **Target outcome:** [Measurable improvement, e.g., < 3 minutes triage time, < 3% misroutes]

---

## 2. Non-Goals (Explicitly Out of Scope)
List what the AI agent must **NOT** build in this iteration:
- [ ] Not building multi-tenant billing yet
- [ ] Not replacing the existing login system
- [ ] Not automating final irreversible actions without human confirmation

---

## 3. User Journey & Acceptance Criteria (Pass / Fail)

### Happy Path
1. **Given** [starting state], **When** [user action], **Then** [observable result].
2. **Given** [starting state], **When** [user action], **Then** [observable result].

### Edge Cases & Negative Cases (Mandatory!)
- **Blank or malformed input:** [Exact validation error and HTTP status / UI message]
- **Unauthorized user:** [Exact denial behavior — never leak whether a record exists]
- **Duplicate submission / network retry:** [Idempotency behavior — must not double-create or double-charge]
- **External dependency / AI model timeout:** [Graceful fallback message, no silent crash]

---

## 4. Data & Contract Boundaries
- **Inputs accepted:** [Fields, types, min/max limits]
- **Outputs returned:** [Exact schema / JSON shape]
- **Persistent state changed:** [Which table/record is created or updated, and what must remain immutable]
- **Sensitive data handling:** [Fields that must never appear in logs or browser cache]

---

## 5. Vertical Slice Plan (Bolts)
Break work into small, independently verifiable slices:
- [ ] **Slice 1:** Data contract + core validation + unit tests
- [ ] **Slice 2:** Main happy-path flow + integration test
- [ ] **Slice 3:** Error handling, permissions, and observability logs
- [ ] **Slice 4:** UI integration + end-to-end verification + rollback check
