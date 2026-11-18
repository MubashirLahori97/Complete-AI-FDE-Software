# The AI-Native FDE Software Development Life Cycle (SDLC)

> **Built for the AI era:** When AI agents generate implementation code, memorizing syntax is no longer the bottleneck. Your job as a Forward Deployed Engineer (FDE) is to own **specification, context, architecture, verification harnesses, governance, and real-world outcomes**.

---

## 1. Why the Traditional SDLC Breaks in the AI Era

In the traditional software lifecycle, **writing code was the slowest, most expensive step**. Teams spent weeks turning requirements into pull requests, so bugs and misunderstandings surfaced slowly.

In the AI era, coding agents can generate thousands of lines of code in minutes. That flips the bottleneck completely:

* **Vibe coding fails in production.** Prompting an AI loosely (*"build me a dispatch app"*) creates hidden assumptions, architectural drift, security holes, and unmaintainable code.
* **Speed without guardrails multiplies rework.** If your requirements are vague or your automated checks are weak, AI just builds the wrong thing 10× faster.
* **The new engineering rule:** **"The AI drives. The human decides and verifies."**

---

## 2. The Four Pillars of AI-Native Engineering

Modern AI-first engineering teams converge on four core disciplines that replace manual syntax writing:

| Pillar | What It Replaces | How It Works |
| :--- | :--- | :--- |
| **1. Spec-Driven Development (SDD)** | Vague tickets & rotting Word docs | A structured, version-controlled `SPEC.md` is the **source of truth**—not the code. Loop: *Specify → Plan → Slice → AI Implement → Validate*. |
| **2. AI-DLC (Iterative Bolts)** | Slow multi-week handoffs | Work runs in short, focused vertical slices (*bolts*) across Inception, Construction, and Operations, gated by **explicit human approval checkpoints**. |
| **3. Context Engineering** | One-off prompt tricks | Instead of clever prompts, you engineer the agent's workspace (`AGENTS.md`, architecture rules, data contracts, live logs) so AI reasons over real constraints. |
| **4. Harness Engineering** | Manual QA & line-by-line debugging | You design the automated safety net—unit/integration/E2E tests, linters, type checks, security scanners (SAST), AI evals, feature flags, and rollbacks—that catches AI mistakes before users do. |

---

## 3. The 7 Phases of the AI-Native FDE SDLC

Every real product—whether built manually or 100% by AI agents—moves through **seven connected phases**. Skipping any phase creates a predictable failure downstream.

```
[1. Discover] ──▶ [2. Specify] ──▶ [3. Architect & Context] ──▶ [4. Build (Bolts)]
      ▲                                                                 │
      │                                                                 ▼
[7. Release & Operate] ◀── [6. Review & Govern] ◀─────────── [5. Verify & Harness]
```

### Phase 1: Discover & Frame
* **Goal:** Understand the real human workflow, constraints, baseline metrics, and whether software should even be built (vs. bought or configured).
* **Human leads:** Interviews users, maps bottlenecks, defines business value and hard constraints.
* **AI assists:** Synthesizes notes, benchmarks alternatives, drafts workflow maps.
* **Key artifact:** Problem Brief & Workflow Map.
* **Gate to pass:** Clear baseline metric, real user bottleneck, and explicit non-goals.
* **If you skip it:** You ship a polished system that solves a problem nobody actually has.

### Phase 2: Specify (Spec-Driven Development)
* **Goal:** Turn user needs into an unambiguous, testable specification before any coding agent starts.
* **Human decides:** Approves exact acceptance criteria, edge cases, failure rules, and out-of-scope boundaries.
* **AI assists:** Drafts `SPEC.md`, asks clarifying questions to expose ambiguity, generates negative test cases.
* **Key artifact:** `SPEC.md` (see [`templates/ai-sdlc/SPEC.md`](templates/ai-sdlc/SPEC.md)).
* **Gate to pass:** Every requirement has a verifiable pass/fail condition and explicit error behavior.
* **If you skip it:** **Vibe-coding drift**—agents guess edge cases differently across files and contradict each other.

### Phase 3: Architect & Context-Engineer
* **Goal:** Define system boundaries, data ownership, security trust boundaries, and agent guardrails.
* **Human decides:** Owns structural trade-offs (stack, database model, access control, build vs. buy) and records them in ADRs.
* **AI assists:** Stress-tests design options, checks dependency impact, scaffolds interface contracts.
* **Key artifacts:** `AGENTS.md` + Architecture Decision Records (`ADR`) (see [`templates/ai-sdlc/AGENTS.md`](templates/ai-sdlc/AGENTS.md) and [`templates/ai-sdlc/ADR-TEMPLATE.md`](templates/ai-sdlc/ADR-TEMPLATE.md)).
* **Gate to pass:** Data model, API contracts, permissions, and forbidden shortcuts are written down where agents can read them.
* **If you skip it:** **Spaghetti scaling**—agents invent conflicting patterns, leak private data across layers, or pick costly infrastructure.

### Phase 4: Build (Agentic Bolts)
* **Goal:** Slice the plan into small, vertical, verifiable tasks and direct AI agents to implement them.
* **Human supervises:** Controls task scope, token/cost budget, tool permissions, and vertical-slice order.
* **AI drives:** Plans subtasks, writes code, refactors, runs local checks, and opens small focused diffs.
* **Key artifact:** Small, traceable vertical-slice pull requests linked directly to `SPEC.md`.
* **Gate to pass:** Each slice compiles, matches the spec contract, and touches only the scoped boundary.
* **If you skip it (by prompting everything at once):** Giant, unreviewable diffs where one bug hides ten others.

### Phase 5: Verify & Harness
* **Goal:** Prove behavior automatically using deterministic tests, security scans, and AI evaluation suites.
* **Human audits:** Designs the test strategy (happy path, edge cases, abuse cases, eval datasets) and checks for false-positive tests.
* **AI executes:** Generates unit/integration/E2E tests, runs the CI harness, diagnoses failing assertions.
* **Key artifact:** Automated Harness + Eval Report (see [`templates/ai-sdlc/HARNESS-CHECKLIST.md`](templates/ai-sdlc/HARNESS-CHECKLIST.md)).
* **Gate to pass:** All automated checks (types, lint, unit, integration, security scan, AI eval thresholds) pass in CI.
* **If you skip it:** **Silent regressions & vulnerabilities**—AI-generated code passes a quick demo click but breaks on real inputs or leaks data.

### Phase 6: Review & Govern
* **Goal:** Apply human engineering judgment to verify intent, security boundaries, maintainability, and compliance.
* **Human decides:** Performs intent review (does this actually match `SPEC.md`?), inspects permissions/secrets/migrations, and approves merge.
* **AI assists:** Pre-screens style, summarizes diff risk, flags potential security or performance regressions.
* **Key artifact:** Approved Pull Request + 8-Part System Explanation.
* **Gate to pass:** Human reviewer can trace how a user action flows end-to-end and what happens on failure.
* **If you skip it:** **Ownership vacuum**—nobody understands the deployed system, making future changes terrifying.

### Phase 7: Release & Operate (Closed-Loop)
* **Goal:** Ship safely with a tested way back, monitor real usage, respond to incidents, and feed evidence back to Phase 1.
* **Human authorizes:** Approves production rollouts, database migrations, and rollback triggers; leads blameless postmortems.
* **AI assists:** Runs progressive deploys (feature flags/canary), monitors logs/metrics/traces, triages anomalies, drafts root-cause hypotheses.
* **Key artifacts:** Release Runbook, Observability Dashboard, Blameless Postmortem (see [`templates/ai-sdlc/POSTMORTEM.md`](templates/ai-sdlc/POSTMORTEM.md)).
* **Gate to pass:** Verified rollback path, live telemetry active, and real user outcomes measured against Phase 1 baseline.
* **If you skip it:** **Unrecoverable outages**—a broken release turns into hours of downtime and repeated mistakes.

---

## 4. Traditional SDLC vs. AI-Native FDE SDLC

| Dimension | Traditional SDLC | AI-Native FDE SDLC |
| :--- | :--- | :--- |
| **Primary Source of Truth** | Source code | Versioned `SPEC.md` + `AGENTS.md` + automated tests |
| **Primary Bottleneck** | Writing code manually | Clarity of specs, verification quality, and review judgment |
| **Human's Core Skill** | Memorizing syntax & APIs | Systems thinking, scoping, context design, verification, governance |
| **Testing Strategy** | Often written after code (or manual QA) | **Harness-first**: automated checks gate every agentic slice |
| **Unit of Delivery** | 2-week sprint tickets | Small vertical **bolts** with immediate evidence |
| **Learning Loop** | Quarterly retrospectives | Closed-loop telemetry feeding directly back into Phase 1 |

---

## 5. How All 30 FDE Academy Missions Map to the AI-Native SDLC

Every mission in FDE Academy trains a concrete slice of this lifecycle:

| SDLC Phase | Core Missions | What You Master |
| :--- | :--- | :--- |
| **1. Discover & Frame** | [M1](missions/01/README.md), [M2](missions/02/README.md), [M6](missions/06/README.md), [M7](missions/07/README.md), [M26](missions/26/README.md) | User needs, workflow investigation, baselines, constraints, domain incentives |
| **2. Specify (SDD)** | [M8](missions/08/README.md), [M10](missions/10/README.md) | User journeys, error states, acceptance criteria, boundary & negative cases |
| **3. Architect & Context** | [M3](missions/03/README.md), [M4](missions/04/README.md), [M5](missions/05/README.md), [M9](missions/09/README.md), [M11](missions/11/README.md), [M12](missions/12/README.md), [M13](missions/13/README.md), [M14](missions/14/README.md), [M15](missions/15/README.md) | Stack layers, logic, data models, buy vs. build, HTTP contracts, persistence, transactions, access control, external integrations |
| **4. Build (Agentic Bolts)** | [M16](missions/16/README.md), [M17](missions/17/README.md), [M18](missions/18/README.md), [M19](missions/19/README.md), [M27](missions/27/README.md) | Agent delegation, task decomposition, AI capabilities, RAG & tools, evidence-linked delivery |
| **5. Verify & Harness** | [M20](missions/20/README.md), [M21](missions/21/README.md) | Held-out AI evals, precision/recall/cost trade-offs, unit/integration/E2E checks |
| **6. Review & Govern** | [M25](missions/25/README.md), [M29](missions/29/README.md), [M30](missions/30/README.md) | Safe migrations, privacy/retention, handoff runbooks, fresh-scenario defense |
| **7. Release & Operate** | [M22](missions/22/README.md), [M23](missions/23/README.md), [M24](missions/24/README.md), [M28](missions/28/README.md) | CI/CD & rollbacks, logs/metrics/traces debugging, scaling & cost, real-world adoption |

---

## 6. Use the Starter Kit on Your Next Project

Copy the [`templates/ai-sdlc/`](templates/ai-sdlc/README.md) folder into any project before prompting an AI coding agent:

1. Fill in **`SPEC.md`** first (10–15 minutes saves hours of rework).
2. Set your guardrails in **`AGENTS.md`** so every agent follows the same rules.
3. Log key architectural trade-offs in **`ADR-TEMPLATE.md`**.
4. Run **`HARNESS-CHECKLIST.md`** before every release.
5. Capture any production issue in **`POSTMORTEM.md`** and turn the fix into a permanent test.

Explore this lifecycle interactively in the app under **`#/sdlc` (AI-Native SDLC Studio)**.
