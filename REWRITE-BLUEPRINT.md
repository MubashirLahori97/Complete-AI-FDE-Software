# The Rewrite Blueprint — v3: "Zero to Software-House Junior"

**Decision (final):** one evolving app, not separate projects.
**Target (final):** a complete beginner finishes this and clears a junior hiring bar at any software house.
**Vehicle:** the FDE Academy app (sequence + dopamine). Markdown is the reference library underneath.

---

## Why one evolving app

1. **Architecture is learned through pain.** Every new layer arrives because the old one broke. The learner feels *why* each piece exists instead of memorizing diagrams.
2. **Depth beats breadth in interviews.** Defending one real system for 30 minutes beats six tutorial demos. "Walk me through your project" is the #1 junior interview question — this gives them a true story.
3. **It mirrors the actual job.** Juniors don't build six greenfield apps. They grow one codebase: tickets in, features out.

Two small side builds (portfolio site, one public-API integration) add breadth without breaking the spine.

---

## The spine: Dukaan — a shop management system

A small shop. Real shopkeepers, real stock, real customers. It starts as a command-line list and grows into a deployed full-stack system with AI features. Every learner knows from lesson 1 what they're building and who they become.

| Phase | Dukaan evolves into… | What breaks → what you learn | Hiring-bar check |
|---|---|---|---|
| **1 — Foundations** (Days 1–7) | CLI inventory tool | "I can't keep track of anything" → variables, types, loops, functions, files, errors | Write a working CLI program from scratch in 60 minutes |
| **2 — Team engineering** (Days 8–14) | + git history, tests, supplier API | "It broke and I don't know when" → version control, testing, HTTP/APIs | Open a PR on your own repo, review it, merge it |
| **3 — AI differentiator** (Days 15–21) | + stock chatbot, RAG over shop docs | "Customers ask the same questions every day" → LLMs, prompts, RAG, evals | Demo the chatbot, defend its test results |
| **4 — Backend** (Days 22–30) | + FastAPI backend, deployed | "The CLI can't serve a mobile app" → APIs, backends, guardrails, deployment | Your API serves a stranger's request, live URL |
| **5 — Data, deeply** (Days 31–50) | + Postgres, real schema, migrations | "Two people saved at once — data corrupted" → SQL depth, indexes, schema design | Design a schema on a whiteboard, explain an index |
| **6 — Full-stack + cloud** (Days 51–70) | + React frontend, login, AWS | "The owner wants to click, not type" → frontend, auth, Docker, CI/CD | Full-stack app live on AWS, real users |
| **7 — The job** (Days 71–90) | tickets → features, hardened | "Client wants discounts by Friday" → tickets, PRs, code review, on-call | 45-min live coding: add a feature to YOUR codebase |

**Side builds:** personal portfolio site (Phase 4), one public-API integration (Phase 2).

---

## How every lesson is written (the pattern)

1. **Project first.** The lesson opens with what you're building today and where it fits in Dukaan's story. No lesson without a visible step forward.
2. **One idea, simple words.** A 12-year-old reads it without a dictionary. New words are explained the first time, in plain English, with an example.
3. **The 5-minute win loop.** Learn one small thing → change one thing → see the result → dopamine. Every lesson has a runnable moment in the first 5 minutes.
4. **Predict before you run.** The learner guesses the output first. Wrong guess = the lesson working.
5. **Ticket-based from Phase 2 on.** "Here's the ticket. Implement it." — the job simulation.
6. **Hiring-bar checks** at every phase end. Not "did you finish" but "can you prove it to a stranger."

## Honest framing (non-negotiable)

- ~600–900 hours of real work. Full-time: 4–6 months. Two hours a day: about a year. The repo says this out loud.
- Finishing makes you **hirable as a junior** — able to pass screens, take tickets, and survive the first 3 months. Senior roles and big-tech FDE titles come with years, not courses.
- The iron rule survives all of it: *never ship what you can't explain or defend.*

## Execution

1. Rewrite `scripts/curriculum/*.json` phase by phase (the source of truth).
2. Run `node scripts/expand-curriculum.mjs` + `python scripts/check-starters.py` — every example must run.
3. Push in batches; CI validates.
4. The app regenerates from the same source — one rewrite feeds both.

*Status: Phase 1 (Days 1–7) in progress. Blueprint approved by Mubashir 2026-10-18.*
