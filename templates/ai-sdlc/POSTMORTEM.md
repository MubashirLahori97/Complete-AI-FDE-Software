# Blameless Incident Postmortem: [YYYY-MM-DD] — [Short Title]

- **Severity:** SEV-1 | SEV-2 | SEV-3 | SEV-4
- **Duration:** [Start UTC] → [Mitigated UTC] ([Total minutes])
- **Incident Commander:** [Name]
- **Customer Impact:** [Exact % of users or workflows affected]

> **Blameless Rule:** Human error is never the root cause. Focus on missing guardrails, unclear specs, weak harness checks, or unsafe deployment steps.

---

## 1. Executive Summary (BLUF)
[2–3 sentences stating what broke, who was affected, how it was mitigated, and what permanent guardrail is being added.]

---

## 2. Timeline (UTC)
- **HH:MM** — Change deployed / trigger occurred.
- **HH:MM** — Alert fired or user reported issue (Detection).
- **HH:MM** — Severity assigned and response started (Triage).
- **HH:MM** — Rollback / feature flag disabled; user impact stopped (Mitigation).
- **HH:MM** — Metrics confirmed back to normal baseline (Resolution).

---

## 3. Root Cause Analysis (The 5 Whys)
1. **Why** did users see the failure?
2. **Why** did that component behave that way?
3. **Why** was that flaw introduced?
4. **Why** didn't our automated harness / CI catch it before release?
5. **Why** wasn't the gap caught during design or review?

---

## 4. What Went Well vs. What Needs Improvement
- **Went well:** [e.g., Fast rollback in 4 minutes, clear status updates]
- **Needs improvement:** [e.g., Staging had too little test data; no alert on queue lag]

---

## 5. Permanent Action Items (Feed Back Into Phase 1 & 5)
| Action | Type (Spec / Harness / Ops) | Owner | Due Date |
| :--- | :--- | :--- | :--- |
| Add regression test covering [exact edge case] | Harness | [Name] | YYYY-MM-DD |
| Update `AGENTS.md` to forbid [unsafe pattern] | Context | [Name] | YYYY-MM-DD |
| Add alert for [metric threshold] | Ops | [Name] | YYYY-MM-DD |
