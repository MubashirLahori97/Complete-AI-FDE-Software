# 🧮 Phase 4 — Think Like a Computer: The Interview-Proof Core *(Days 91–120)*

You've built real things. **Now learn to think the way interviews test and seniors reason.** This phase is computer science essentials — not a degree, just the parts that actually matter for getting hired and designing systems that survive reality.

---

## Week 1 — How cost grows + the core structures *(Days 91–97)*

**Goal:** know, before you run it, whether your code will survive real data.

**Learn:** Big-O in plain words — "how does the cost grow when the data grows?" · arrays, strings, hash maps — the three structures behind 70% of real code · the 5 patterns behind most interview questions (two pointers, sliding window, hash-map counting, and two more you'll discover).

**Specify → AI builds:** solve 3 problems a day. For each: YOU explain the approach first, AI checks your thinking, then you code it. Never read the solution before struggling for 20 minutes.

**Evaluate:** for every solution, say out loud WHY it's fast enough — in plain words, no jargon.

**💼 Business lens:** code that's fine for 100 users and dead at 100,000 is a business risk. This thinking is what "senior" starts to mean.

**The one link:** [NeetCode](https://neetcode.io/) — problems organized by pattern, not by trick.

**Done when:**
- [ ] 20+ problems solved, each with a plain-words explanation of its cost
- [ ] You can spot which of the 5 patterns a new problem needs

---

## Week 2 — Trees, graphs, recursion: just enough *(Days 98–104)*

**Goal:** stop fearing the words "tree" and "graph."

**Learn:** what trees and graphs actually are (family trees and road maps — that's it) · recursion as "trust the smaller case" · breadth-first vs depth-first, in plain words · when these appear in real work (hint: more often than you'd think).

**Specify → AI builds:** keep solving — 3 a day. Teach one pattern in a short public post; teaching exposes every gap in your understanding.

**Evaluate:** whiteboard one tree problem from memory. Ugly drawing, correct thinking — that's a pass.

**💼 Business lens:** you won't hand-build a red-black tree at work. You WILL use this thinking every time data has relationships — which is always.

**The one link:** [LeetCode](https://leetcode.com/) — the problem gym; start with "Top Interview 150," easy first.

**Done when:**
- [ ] 20 more problems solved (40 total across the phase so far)
- [ ] One public post teaching a pattern, in your own words

---

## Week 3 — How the internet really works *(Days 105–111)*

**Goal:** know the full journey of a single click.

**Learn:** DNS (how names become addresses) · TCP (how data travels reliably) · HTTP, deeply this time · TLS — the lock icon, explained in plain words · the complete journey from typing a URL to pixels on screen.

**Specify → AI builds:** draw the journey diagram for YOUR deployed app. Then find the slowest part of it. AI helps you measure; you do the understanding.

**Evaluate:** explain the URL journey to a non-technical friend. If they follow it, you own it.

**💼 Business lens:** debugging production IS knowing this journey cold. "The site is slow" becomes "DNS is fine, TLS is fine, the database query is the problem" — that's a professional sentence.

**The one link:** [What happens when you type google.com](https://github.com/alex/what-happens-when) — the legendary deep-dive, free.

**Done when:**
- [ ] Your app's full request journey drawn and understood
- [ ] You found and fixed (or documented) one slow part

---

## Week 4 — System design basics *(Days 112–120)*

**Goal:** design big systems on paper before building them.

**Learn:** load balancers, caching, queues — in plain words · splitting databases when one isn't enough · "design X" thinking: requirements first, then boxes and arrows, then trade-offs · how to defend a design out loud.

**Specify → AI builds:** AI plays the interviewer — it pushes back on your design ("what if this server dies?"). You defend or adapt. Ten rounds of this is worth a month of reading.

**Evaluate:** three design docs — a URL shortener, a chat app, your capstone at 1 million users. Each defended out loud for 10 minutes.

**💼 Business lens:** seniors are paid for judgment under uncertainty, not for typing. This week is practice for the highest-paid skill in software.

**The one link:** [The System Design Primer](https://github.com/donnemartin/system-design-primer) — the standard free resource.

**Done when:**
- [ ] 3 design docs written, each with trade-offs stated honestly
- [ ] You defended one design out loud without freezing

---

## 🏁 Phase project — "The Interview Pack"

One folder in your repo containing: 40 solved problems, each with a plain-words explanation of the approach and its cost + 3 system design docs + your URL-journey diagram. **This is what you study from in Phase 6.** Future you will thank present you.

---

## ⚠️ Traps to avoid

- **Grinding 300 problems.** Returns collapse after ~80. Patterns beat volume.
- **Memorizing solutions.** If you can't re-derive it, you don't know it — and interviews will expose that in 30 seconds.
- **Skipping "say it out loud."** Interviews are spoken. Silent solving doesn't transfer.

---

## 🧠 Phase check

<details>
<summary><b>Q1.</b> Why learn Big-O if AI can just write fast code?</summary>

Because AI writes code that *looks* right. Someone has to judge whether it survives real data — and that someone is you. "Looks fast" has caused real outages.
</details>

<details>
<summary><b>Q2.</b> What's the real skill system design interviews test?</summary>

Not the "right" architecture — there isn't one. They test whether you can reason about trade-offs out loud under uncertainty. That's a thinking skill, not a knowledge skill.
</details>

<details>
<summary><b>Q3.</b> You can solve problems silently but freeze when explaining. What went wrong?</summary>

You trained the wrong skill. Explaining IS the skill being tested — in interviews and in every senior role. Practice out loud from day one of this phase.
</details>

---

## ✅ Phase done when

- [ ] All 4 weeks ticked
- [ ] "The Interview Pack": 40 problems with explanations + 3 design docs + journey diagram
- [ ] You can think out loud about code without freezing

---

**Day 91:** "I build things that work."
**Day 120:** "I can prove they'll keep working at scale — and explain why."

---

[← Phase 3](../32_Phase3_Build_Real_Things/) · [Phase 5 →](../34_Phase5_Work_Like_A_Professional/)
