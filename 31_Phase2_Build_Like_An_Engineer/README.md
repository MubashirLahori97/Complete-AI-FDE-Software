# 🔧 Phase 2 — Build Like an Engineer: From "It Works" to "I Know Exactly Why" *(Days 31–50)*

**Day 30 you could ship. Now go back and understand what you shipped.** Twenty dense days: the data layer, APIs done right, and trust (testing + team git). This is the engineering depth every interview and every production system assumes you have.

**⏱ This phase runs hotter: 3–5 hours a day.** Three months is a sprint — the plan is honest about what that takes.

---

## Week 1 — The data layer, deeply *(Days 31–37)*

**Goal:** stop treating the database as a magic box.

**Learn:** SQL joins (all of them, with pictures) · indexes — what they are and when they help · how a database actually stores your data · migrations (changing the database without breaking it) · Postgres on a free tier · the 5 deep-Python ideas you'll use everywhere (decorators, generators, context managers, pathlib, how Python runs your code) — learn them by applying, not by reading.

**Specify → AI builds:** AI writes the queries; you predict what each returns *before* running it. Wrong prediction = a concept you don't own yet.

**Evaluate:** take one slow query, read its plan, add an index, measure the difference. Numbers, not feelings.

**💼 Business lens:** bad database design is the #1 reason apps get slow and hosting bills explode. This week is worth real money.

**The one link:** [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) — work through it with a real database open.

**Done when:**
- [ ] One old project moved from files/SQLite to Postgres, with migrations
- [ ] You can explain what an index does to a non-technical person
- [ ] The 5 deep-Python ideas used in real code, not just read about

---

## Week 2 — APIs done right *(Days 38–44)*

**Goal:** build APIs other humans can actually use.

**Learn:** REST design that doesn't hurt · the 6 status codes that matter · auth: sessions vs tokens, in plain words · validation · consistent error shapes · rate limiting · docs people actually read.

**Specify → AI builds:** write the docs FIRST, then check the code matches the docs. AI drafts both; you verify. Docs-first is how professionals think.

**Evaluate:** hand your docs to someone technical. Can they use the API without asking you a single question? That's the bar.

**💼 Business lens:** your API is a product. Every confused user is a support ticket. Clean APIs are a freelance selling point.

**The one link:** [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines) — how a serious company designs APIs.

**Done when:**
- [ ] Your capstone backend rebuilt as a clean, documented API
- [ ] Auth works, errors are consistent, docs are complete

---

## Week 3 — Trust: testing + git like a team *(Days 45–50)*

**Goal:** work the way teams work, even when the team is you.

**Learn:** pytest essentials · what to test (and what not to) · debugging with a real debugger, not print statements · branches, pull requests, code review, merge conflicts · the GitHub flow teams actually use.

**Specify → AI builds:** AI writes the first tests; you break the code on purpose and check a test catches it. A test that can't fail is decoration.

**Evaluate:** open a PR on your own repo. Review it like a stranger who dislikes you. Merge only when the stranger is satisfied.

**💼 Business lens:** tests are insurance — boring until they save you. PRs are how teams stay sane. Employers check for both.

**The one link:** [pytest documentation](https://docs.pytest.org/) — the tutorial section, hands on.

**Done when:**
- [ ] One old project at 70%+ test coverage, with the report to prove it
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
<summary><b>Q1.</b> Why does depth in "boring" topics (databases, testing, git) beat learning a second framework?</summary>

Because every project you'll ever touch needs databases, tests, and git — almost none need two frameworks. Depth in the universal beats breadth in the fashionable.
</details>

<details>
<summary><b>Q2.</b> Your API returns `200 OK` with an error message inside. What's wrong?</summary>

The status code lies. Errors need error status codes (4xx/5xx) so programs — not just humans — react correctly. That's Week 2.
</details>

<details>
<summary><b>Q3.</b> When is a test useless?</summary>

When it can't fail — when it passes no matter what the code does. Break the code on purpose; if the test still passes, delete it and write a real one.
</details>

---

## ✅ Phase done when

- [ ] All 3 weeks ticked, with running proof for each
- [ ] "The Rebuild" shipped: Postgres + clean API + tests + docs + clean git history
- [ ] You can explain every line of the rebuild to a skeptic

---

**Day 31:** "It works and I don't know why."
**Day 50:** "It works, I know exactly why, and I can prove it."

---

[← Day 30](../30_Day_Ship_It/) · [Phase 3 →](../32_Phase3_Ship_Real_Products/)
