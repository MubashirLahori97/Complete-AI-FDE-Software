const e=`# Engineering for the 2028–2030 Agentic Era

> **The New Law of Software:** When AI coding agents drive syntax generation cost toward zero, **unverified code becomes a liability**. The engineers who thrive in 2028–2030 are not faster typists—they are **System Architects, Verifiers, Data Auditors, and Forward Deployed Engineers**.

---

## 1. The 20 / 80 X-Ray Study Rule

How should you prepare yourself—and the next generation of engineers—when AI can write 95%+ of implementation code?

1. **Write 20% by hand — only the "Load-Bearing Physics":**
   - Build deep intuition for memory/mutability, SQL transactions & locking, HTTP contracts, async event loops, authentication trust boundaries, and property-based invariants.
   - You do not learn Python/FastAPI to out-type an AI agent; you learn them for **X-Ray Vision** so you can read any AI-generated diff and spot subtle race conditions or security flaws in 10 seconds.
2. **Spend 80% on the Full FDE Loop:**
   - **Discover** messy real-world workflows and data provenance (reject misleading headline metrics).
   - **Specify** unambiguous contracts (\`SPEC.md\`) and guardrails (\`AGENTS.md\`) *before* implementation.
   - **Direct & Audit** coding agents in small vertical bolts—especially catching green-CI sabotage (weakened tests, missing tenant filters, non-idempotent retries).
   - **Verify & Operate** with property-based invariants, compound reliability backbones (\`pass^k\`), FinOps routing, and tested rollbacks.

---

## 2. Knowledge Half-Life Taxonomy

Every module in FDE Academy distinguishes between enduring laws and replaceable adapters:

| Tier | Badge | Half-Life | Examples |
| :--- | :--- | :--- | :--- |
| **Tier 0** | \`🏛️ 20-Yr Law\` | 20+ years | ACID transactions, CAP/idempotency, auth trust boundaries, compound probability ($p^k$), base-rate statistics, causal inference |
| **Tier 1** | \`⚙️ 5-Yr Pattern\` | 5–10 years | Spec-Driven Development, Harness Engineering, property-based testing, RBAC, SSE streaming, held-out AI evals |
| **Tier 2** | \`🔧 2026 Tooling\` | 6–18 months | \`uv\`, Ruff, FastAPI, specific model names & SDK wrappers (swapped cleanly as ecosystems evolve) |

---

## 3. Four Core Skills Tested in the 2030 Agentic Lab (\`#/agentic-era\`)

1. **Auditing Sabotaged AI Pull Requests:** Catching reward-hacking test weakening, TOCTOU race conditions, BOLA/IDOR leaks, indirect prompt injection ("Lethal Trifecta"), non-idempotent webhooks, and async event-loop blocking even when CI reports 100% green.
2. **Compound Reliability (\`pass^k\`):** Understanding why a 95%-accurate step decays to $0.95^{15} \\approx 46.3\\%$ over a 15-step autonomous loop—and how deterministic state machines, schema validators, and human gates raise end-to-end reliability past 95%.
3. **Dirty Data Provenance:** Rejecting vendor/AI vanity metrics by auditing raw records for cancellations, access blockers, survivor bias, and duplicate retries before writing \`SPEC.md\`.
4. **Intelligence FinOps & Portability:** Routing traffic across deterministic code, semantic caches, fast models, and frontier escalations to hit \`>= 80%\` gross margin, \`p95 <= 900ms\`, \`>= 95%\` quality, and provider failover resilience.

---

## 4. The 2028–2030 "Proof-of-Judgment" Portfolio Standard

Anyone can prompt a clone app in 10 minutes. Stand out in 2028–2030 by shipping portfolios backed by:
1. **Baseline vs. Post-Deployment Metrics** (audited for data provenance),
2. **\`SPEC.md\` + \`ADR\` Trade-Offs** (explicitly stating what you chose *not* to build),
3. **Automated Invariant & Eval Harnesses** (precision/recall/cost/latency curves), and
4. **A Real Blameless Postmortem** showing a failure you caught, reproduced, and permanently prevented.
`;export{e as default};
