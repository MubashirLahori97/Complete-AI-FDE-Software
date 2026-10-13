# 🔧 Phase 2 — Go Deep: From "It Works" to "I Understand Why" *(Days 31–60)*

**Day 30 you could ship. Day 31 you go back and understand what you shipped.** That is the entire difference between a 30-day builder and a real engineer: depth in the boring parts nobody posts about.

Same rules as the first 30 days: concepts 100% or it doesn't count, AI is your junior developer, a week isn't done until something runs.

---

## Week 1 — Python, deeply *(Days 31–37)*

**Goal:** know the language under your fingers, not just under your eyes.

**Learn:** how Python actually runs your code (in plain words) · decorators · generators · context managers (`with`) · the standard-library gems everyone skips (`collections`, `itertools`, `pathlib`) · virtual environments, properly this time.

**Specify → AI builds:** ask AI to explain each new idea with one tiny example. Then close the chat and rewrite the example from memory, in your own words. If you can't, you don't own it yet.

**Evaluate:** explain decorators to a friend without notes. If they get it, you get it.

**💼 Business lens:** shallow language skill = subtle bugs = 2am firefighting = expensive. Depth here pays for itself the first time something breaks in production.

**The one link:** [The official Python tutorial](https://docs.python.org/3/tutorial/) — read it end to end; it's shorter than you think.

**Done when:**
- [ ] You can explain 5 deep-Python ideas in plain words, no notes
- [ ] Your Day-7 CLI app rewritten using them, committed

---

## Week 2 — Databases, deeply *(Days 38–44)*

**Goal:** stop treating the database as a magic box.

**Learn:** SQL joins (all of them, with pictures) · indexes — what they are and when they help · how a database actually stores data · migrations (changing the database without breaking it) · Postgres basics on a free tier.

**Specify → AI builds:** AI writes the queries; you predict what each one returns *before* running it. Wrong prediction = a concept you don't own yet.

**Evaluate:** take one slow query, look at its plan, add an index, measure the difference. Numbers, not feelings.

**💼 Business lens:** bad database design is the #1 reason apps get slow and hosting bills explode. This week is worth real money.

**The one link:** [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) — work through it with a real database open.

**Done when:**
- [ ] One old project moved from files/SQLite to Postgres, with migrations
- [ ] You can explain what an index does to a non-technical person

---

## Week 3 — APIs done right *(Days 45–51)*

**Goal:** build APIs other humans can actually use.

**Learn:** REST design that doesn't hurt · status codes (the 6 that matter) · auth: sessions vs tokens, in plain words · validation · consistent error shapes · rate limiting · writing docs people read.

**Specify → AI builds:** AI drafts the API; you write the docs first, then check the code matches the docs. Docs-first is how professionals think.

**Evaluate:** hand your docs to someone technical. Can they use the API without asking you a single question? That's the bar.

**💼 Business lens:** your API is a product. Every confused user is a support ticket. Clean APIs are a selling point in freelance work.

**The one link:** [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines) — how a serious company designs APIs.

**Done when:**
- [ ] Your capstone backend rebuilt as a clean, documented API
- [ ] Auth works, errors are consistent, docs are complete

---

## Week 4 — Testing + git like a team *(Days 52–60)*

**Goal:** work the way teams work, even when the team is you.

**Learn:** pytest, deeply · what to test (and what not to) · test doubles in plain words (fakes and mocks) · debugging with a real debugger, not print statements · branches, pull requests, code review, merge conflicts.

**Specify → AI builds:** AI writes the first tests; you deliberately break the code and check a test catches it. A test that can't fail is decoration.

**Evaluate:** open a PR on your own repo. Review it like a stranger who dislikes you. Merge only when the stranger is satisfied.

**💼 Business lens:** tests are insurance — boring until they save you. PRs are how teams stay sane. Both are things employers check for.

**The one link:** [pytest documentation](https://docs.pytest.org/) — the tutorial section, hands on.

**Done when:**
- [ ] One old project at 80%+ test coverage, with the report to prove it
- [ ] You opened, reviewed, and merged your own PR

---

## 🏁 Phase project — "The Rebuild"

Pick your weakest Day 1–30 project. Rebuild it with everything from this phase: Postgres with migrations, a clean documented API, real tests, proper git history. **This becomes your new portfolio centerpiece** — the before/after story alone is worth showing.

---

## ⚠️ Traps to avoid

- **Tutorial hell, part 2.** Watching advanced courses without building is the same trap with fancier wallpaper.
- **Three databases, zero depth.** One database understood deeply beats three touched lightly.
- **"It works, so tests are optional."** That's Day-12 thinking. You're past that now.

---

## 🧠 Phase check

<details>
<summary><b>Q1.</b> Why does depth in "boring" topics (databases, testing, git) matter more than learning a second framework?</summary>

Because every project you'll ever touch needs databases, tests, and git — but almost none need two frameworks. Depth in the universal beats breadth in the fashionable.
</details>

<details>
<summary><b>Q2.</b> Your API returns `200 OK` with an error message inside. What's wrong?</summary>

The status code lies. Errors should use error status codes (4xx/5xx) so programs — not just humans — can react correctly. That's Week 3.
</details>

<details>
<summary><b>Q3.</b> When is a test useless?</summary>

When it can't fail — when it passes no matter what the code does. Break the code on purpose; if the test still passes, delete it and write a real one.
</details>

---

## ✅ Phase done when

- [ ] All 4 weeks ticked, with running proof for each
- [ ] "The Rebuild" shipped: Postgres + clean API + tests + docs + clean git history
- [ ] You can explain every line of the rebuild to a skeptic

---

**Day 31:** "It works and I don't know why."
**Day 60:** "It works, I know exactly why, and I can prove it."

---

[← Day 30](../30_Day_Ship_It/) · [Phase 3 →](../32_Phase3_Build_Real_Things/)
