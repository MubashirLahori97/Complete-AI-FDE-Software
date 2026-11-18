# The Rewrite Blueprint — v4: "Zero to Software-House Junior"

**Decision (final):** one evolving app — **Dukaan**, a shop management system.
**Target (final):** a complete beginner finishes and clears a junior hiring bar at any software house.
**Vehicle:** the FDE Academy app (sequence + dopamine). Markdown is the reference library underneath.
**Method (new):** research-first. Two research passes complete — best programs + open-source material. This blueprint is built on both.

---

## What the best programs teach us (steal list)

- **100xDevs:** learners rebuild clones of *real products they already know*. → Every Dukaan phase is framed as "what a real shop system does." Learners already understand shops — all brainpower goes to engineering.
- **boot.dev:** RPG layer (XP, levels, streaks, badges) turned learning into $10M revenue. → First-class in the academy app. Highest-ROI steal.
- **Launch School:** mastery gates — advance by *proving*, not reading. → Phase gates like "add a feature to Dukaan in 45 minutes, no notes," with rubrics.
- **The Odin Project:** "Getting Hired" built INTO the path, not bolted on. → Our Phase 7 stays structural.
- **Chip Huyen (AI Engineering):** evals-first as religion; "kill vibes-based development." → Every AI feature ships with its test set.
- **Scrimba:** zero-friction interactivity — runnable in the first 5 minutes, every lesson. (Our Pyodide runner enables this.)
- **Full Stack Open:** university-grade free quality — the bar for lesson correctness.

**Why learners quit (we design against all of it):** tutorial hell, fake timelines, no feedback on code quality, choice overload, loneliness, invisible progress, front-loaded theory, certificates over proof.

## Reusable open-source material (license-verified)

| Material | License | We take | Feeds |
|---|---|---|---|
| exercism/python exercises + tests | MIT ✅ | 15–20 beginner exercises as the practice bank; keep their test-file pattern | Phase 1 (Days 1–7) |
| realworld API spec | MIT ✅ | Model Dukaan's endpoint design on it; teaches spec-reading | Phase 4 (FastAPI) |
| fastapi/full-stack-fastapi-template | MIT ✅ | Distill Docker Compose + JWT + Postgres into deployment lessons | Phase 6 |
| yangshun/tech-interview-handbook | MIT ✅ | Behavioral bank + resume guide → mock interviews | Phase 7 |
| microsoft/AI-For-Beginners | MIT ✅ | Concept → quiz → assignment lesson rhythm | Phase 3 (AI track) |
| trekhleb/javascript-algorithms | MIT ✅ | 5–8 screening-level topics, rewritten in Python | Phase 7 |
| karan/Projects (project ideas) | MIT ✅ | 10–15 ideas for side-builds and extensions | All phases |
| donnemartin/system-design-primer | CC BY 4.0 ✅ | 3–4 simplified diagrams, with credit | Phases 5–6 |

**Rules:** MIT/CC0/CC-BY → reuse with credit, fine under our MIT repo. CC BY-SA → only in clearly-marked files (avoid; prefer MIT sources). **CC BY-NC or no license → NEVER copy** (Odin, Full Stack Open, Automate the Boring Stuff, Asabeneh 30-Days — study structure, link as reference, don't touch the words).

## The spine: Dukaan's evolution

| Phase | Dukaan becomes… | What breaks → what you learn | Hiring-bar check |
|---|---|---|---|
| **1 — Foundations** (Days 1–7) | CLI inventory tool | "I can't keep track of anything" → variables, types, loops, functions, files, errors | Write a working CLI program from scratch in 60 min |
| **2 — Team engineering** (Days 8–14) | + git history, tests, supplier API | "It broke and I don't know when" → version control, testing, HTTP/APIs | Open a PR on your own repo, review it, merge it |
| **3 — AI differentiator** (Days 15–21) | + stock chatbot, RAG over shop docs | "Customers ask the same questions daily" → LLMs, prompts, RAG, evals | Demo the chatbot, defend its test results |
| **4 — Backend** (Days 22–30) | + FastAPI backend, deployed | "The CLI can't serve a mobile app" → APIs, backends, guardrails, deployment | Your API serves a stranger's request, live URL |
| **5 — Data, deeply** (Days 31–50) | + Postgres, real schema, migrations | "Two people saved at once — data corrupted" → SQL depth, indexes, schema design | Design a schema on a whiteboard, explain an index |
| **6 — Full-stack + cloud** (Days 51–70) | + React frontend, login, AWS | "The owner wants to click, not type" → frontend, auth, Docker, CI/CD | Full-stack app live on AWS, real users |
| **7 — The job** (Days 71–90) | tickets → features, hardened | "Client wants discounts by Friday" → tickets, PRs, code review, on-call | 45-min live coding: add a feature to YOUR codebase |

**Side builds:** portfolio site (Phase 4), one public-API integration (Phase 2).

## How every lesson is written (the pattern)

1. **Project first.** Opens with what you're building today and where it fits in Dukaan's story.
2. **The shop's problem, never a definition.** Every lesson starts with something breaking or needed.
3. **One idea, simple words.** A 12-year-old reads it without a dictionary. New words explained once, plainly, with an example.
4. **Runnable in 5 minutes.** Predict → change → run → see. Dopamine first, theory second.
5. **Predict before you run.** Wrong guess = the lesson working.
6. **Ticket-based from Phase 2.** "Here's the ticket. Implement it." — the job simulation.
7. **Mastery gates, not checkboxes.** Advance by proving to a rubric.
8. **Build in public.** Every phase ends with: deploy it, post the link. Proof is the job-search engine.

## Honest framing (non-negotiable)

- ~600–900 hours of real work. Full-time: 4–6 months. Two hours a day: about a year. Said out loud, up front.
- Finishing makes you **hirable as a junior** — you can pass screens, take tickets, survive the first 3 months. Senior and big-tech titles come with years, not courses.
- The iron rule survives everything: *never ship what you can't explain or defend.*

## Execution status

- [x] Program research (report: curriculum-research.md in workspace)
- [x] Open-source material research, license-verified (report: open-source-learning-repos.md in workspace)
- [x] Day 1 rewritten as pattern proof (Dukaan v0.1) — pushed
- [ ] Days 2–7 (Phase 1) — next: Exercism-pattern exercises with tests
- [ ] Days 8–30 — phase by phase
- [ ] Days 31–90 — phase guides rewritten around Dukaan
- [ ] Academy app: RPG layer (XP/streaks/badges), mastery gates
