# 🏗️ Phase 3 — Build Real Things: Proof, Not Promises *(Days 61–90)*

Phase 2 gave you depth. **Phase 3 turns depth into proof.** Nobody hires potential; they hire evidence. By day 90 you will have things strangers can click, sign up for, and pay for.

---

## Week 1 — A real frontend *(Days 61–67)*

**Goal:** build interfaces that don't look like homework.

**Learn:** pick ONE path — (a) HTML/CSS/JavaScript, enough to be dangerous, or (b) React basics. Not both. Layout, forms, fetching data from your API, handling loading and errors gracefully.

**Specify → AI builds:** describe the screen like a designer would ("a login form with the error under the field, not a popup"). AI drafts it; you fix every ugly detail by hand.

**Evaluate:** show it to a non-technical person. Do they know what to do without you explaining? That's the whole test.

**💼 Business lens:** clients judge software in 10 seconds, by the screen. An ugly UI makes brilliant engineering invisible.

**The one link:** [The Modern JavaScript Tutorial](https://javascript.info/) — the real thing, free, complete.

**Done when:**
- [ ] One old project's UI rebuilt properly — no Streamlit, no defaults
- [ ] A stranger can use it with zero explanation

---

## Week 2 — Project 4: real users, real money *(Days 68–74)*

**Goal:** ship the closest thing to a real business you've ever built.

**Learn:** login that actually works (auth, sessions, password reset) · payments in test mode (Stripe) · sending real emails · file uploads · your own domain name.

**Specify → AI builds:** write the full spec first — user flows, edge cases, what happens when payment fails. AI builds to the spec. You test like a suspicious customer.

**Evaluate:** a stranger signs up, pays (test mode), and gets value — without you in the room. Record it happening.

**💼 Business lens:** this project IS a business prototype. Even if you never sell it, "I built auth + payments + deployment" is a sentence that opens doors.

**The one link:** [Stripe documentation](https://stripe.com/docs) — the best-written docs in the industry; learn from how they teach.

**Done when:**
- [ ] Live product: signup, login, payment (test mode), emails, custom domain
- [ ] One stranger completed the full flow unassisted

---

## Week 3 — Servers and setup *(Days 75–81)*

**Goal:** never deploy by hand again.

**Learn:** Docker — what it is, why it exists, how to use it, in plain words · CI/CD with GitHub Actions (every push auto-deploys) · environments (dev vs production) · backups · the "server died at 2am" checklist.

**Specify → AI builds:** AI writes the Dockerfile and the deploy workflow; you break the deploy on purpose and watch the automation catch it.

**Evaluate:** push a change. Does it reach production with zero manual steps? Then delete something in production (in a test app!) and restore it from backup.

**💼 Business lens:** manual deploys don't scale and look amateur. "Push to deploy with automated checks" is what professional means.

**The one link:** [Docker Get Started guide](https://docs.docker.com/get-started/) — hands-on, no prior knowledge needed.

**Done when:**
- [ ] One project dockerized, auto-deploying on every push
- [ ] You have a written "server died" checklist and a tested backup

---

## Week 4 — Read real code *(Days 82–90)*

**Goal:** learn the skill nobody teaches — reading other people's code.

**Learn:** how to enter a big codebase (start at the entry point, follow ONE feature end to end) · finding "good first issue" tickets · writing a pull request strangers will accept · reading a project's architecture in an afternoon.

**Specify → AI builds:** use AI as your guide — "explain this file like I'm new here" — but verify everything by reading the code yourself. AI summarizes; you confirm.

**Evaluate:** can you explain the project's architecture in 5 minutes, on a whiteboard, without notes?

**💼 Business lens:** most paid work is reading and fixing existing code, not building from zero. This week trains the actual job.

**The one link:** [First Contributions](https://github.com/firstcontributions/first-contributions) — your first open-source PR, step by step.

**Done when:**
- [ ] One PR merged in a real open-source project
- [ ] A written walkthrough of that project's architecture, in your words

---

## 🏁 Phase project

Project 4 (Week 2) IS the phase project — it just keeps growing. By day 90 it has: real auth, payments, emails, custom domain, Docker deploys, CI/CD, and tests from Phase 2. **This is the project you lead with in interviews.**

---

## ⚠️ Traps to avoid

- **The eternal todo app.** If your "portfolio" is 6 variations of the same tutorial project, you have one project, not six.
- **Docker rabbit holes.** Learn enough to ship. You are not becoming a DevOps engineer this week.
- **Dead open-source projects.** Pick something alive — recent commits, friendly maintainers, real users.

---

## 🧠 Phase check

<details>
<summary><b>Q1.</b> Why does this phase insist on real users instead of more tutorials?</summary>

Because tutorials test whether you can follow instructions. Real users test whether you can handle reality — confusion, edge cases, breakage. Employers pay for the second one.
</details>

<details>
<summary><b>Q2.</b> What's the point of the open-source PR?</summary>

Two things: proof you can read and work in a real codebase, and proof strangers trust your code enough to merge it. Both are exactly what hiring managers look for.
</details>

<details>
<summary><b>Q3.</b> Your deploy is manual and "only takes 5 minutes." Why is that a problem?</summary>

Because 5 minutes × every change × every project × forever = hours of boring, error-prone work. Automation isn't laziness; it's reliability.
</details>

---

## ✅ Phase done when

- [ ] All 4 weeks ticked, with running proof for each
- [ ] Project 4 live: auth, payments (test), emails, domain, Docker, CI/CD
- [ ] One merged open-source PR + architecture write-up
- [ ] A stranger used your product without your help

---

**Day 61:** "I can build things."
**Day 90:** "Strangers use and pay for things I built."

---

[← Phase 2](../31_Phase2_Go_Deep/) · [Phase 4 →](../33_Phase4_Think_Like_A_Computer/)
