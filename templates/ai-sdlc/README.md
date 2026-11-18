# AI-Native SDLC Starter Kit

Copy these templates into any project **before** directing an AI coding agent to write code.

| File | SDLC Phase | Purpose |
| :--- | :--- | :--- |
| [`SPEC.md`](SPEC.md) | Phase 2 — Specify (SDD) | Single source of truth for user behavior, acceptance criteria, edge cases, and non-goals. |
| [`AGENTS.md`](AGENTS.md) | Phase 3 — Context Engineering | Persistent rules, stack boundaries, verification commands, and forbidden shortcuts for AI agents. |
| [`ADR-TEMPLATE.md`](ADR-TEMPLATE.md) | Phase 3 — Architecture | Short record explaining *why* a structural choice was made over alternatives. |
| [`HARNESS-CHECKLIST.md`](HARNESS-CHECKLIST.md) | Phase 5 & 6 — Verify & Govern | Pre-merge automated harness, security, and human intent-review checklist. |
| [`POSTMORTEM.md`](POSTMORTEM.md) | Phase 7 — Release & Operate | Blameless incident analysis that turns production failures into permanent harness checks. |

## Quick workflow (15-minute setup)

1. Write `SPEC.md` with at least 3 concrete examples and 3 failure/negative cases.
2. Customize `AGENTS.md` with your stack and exact test/build commands.
3. Ask your AI agent to propose a **vertical-slice plan** referencing `SPEC.md` before writing any code.
4. Require every slice to pass `HARNESS-CHECKLIST.md` before merging.
