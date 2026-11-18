# ADR-0001: [Short Decision Title]

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded
- **Decider:** [Human owner]

---

## 1. Context
What concrete technical or business problem are we solving? What constraints (budget, latency, team skill, compliance, timeline) apply?

---

## 2. Options Considered

### Option A: [e.g., Use existing relational database for background jobs]
- **Pros:** Zero new infrastructure, transactional consistency with business writes.
- **Cons:** Throughput ceiling around a few thousand jobs/sec.

### Option B: [e.g., Introduce Redis + distributed broker]
- **Pros:** Higher raw throughput at massive scale.
- **Cons:** Extra service to operate, dual-write consistency risk, higher monthly cost.

---

## 3. Decision
We chose **Option [A/B]** because [clear one-paragraph justification tied to current constraints].

---

## 4. Consequences & Revisit Trigger
- **What becomes easier:** [...]
- **What becomes harder:** [...]
- **When we will revisit this decision:** [Concrete measurable trigger, e.g., "When sustained queue volume exceeds 500 jobs/sec or p95 wait time exceeds 2 seconds."]
