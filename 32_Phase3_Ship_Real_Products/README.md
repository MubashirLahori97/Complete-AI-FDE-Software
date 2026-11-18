# 🏗️ Phase 3 — Ship Real Products: Proof, Not Promises *(Days 51–70 · Weeks 8–10)*

Phase 2 gave you depth. **Phase 3 turns depth into proof.** Twenty days, one real product with real users, deployed like a professional, hardened against the obvious attacks. Nobody hires potential; they hire evidence.

**⏱ 3–5 hours a day.** You're building a business-grade product in 20 days — that's the pace.

## 🔭 This builds on

- **Days 13–14** — your first web app → now: a real frontend, no training wheels
- **Day 23** — guardrails → now: a full security review of your own work
- **Day 27** — your first portfolio → now: Product 4, the project you'll lead interviews with

Same pattern as Phase 2: nothing new, everything leveled up.

---

## Week 1 — A real frontend + Product 4 begins *(Days 51–57)*

**Goal:** interfaces that don't look like homework, on a product that matters.

**Learn:** pick ONE path — (a) HTML/CSS/JavaScript, enough to be dangerous, or (b) React basics. Not both. Layout, forms, fetching from your API, loading and error states · then start Product 4: real login (auth, sessions, password reset), core features, your own domain.

**Specify → AI builds:** describe screens like a designer ("the error goes under the field, not in a popup"). AI drafts; you fix every ugly detail by hand. For the product: spec the full user flow first, edge cases included.

**Evaluate:** a non-technical person uses the UI with zero explanation from you. That's the whole test.

**💼 Business lens:** clients judge software in 10 seconds by the screen. An ugly UI makes brilliant engineering invisible.

**The one link:** [The Modern JavaScript Tutorial](https://javascript.info/) — the real thing, free, complete.

**Done when:**
- [ ] Product 4 started: real auth working, core features live, custom domain pointed
- [ ] A stranger can use it with zero explanation

---

## Week 2 — Money in, armor on *(Days 58–64)*

**Goal:** take payment and survive contact with the real world.

**Learn:** payments in test mode (Stripe) · sending real emails · file uploads · security basics on YOUR app: the OWASP Top 10 risks in plain words, secrets management (never hardcode, ever), the 3 most likely attacks on your app and your defense for each.

**Specify → AI builds:** AI attacks your app on paper — "here are 5 ways I'd break in." You fix each one, then verify the fix. For payments: AI drafts the flow; you test it like a suspicious customer trying to get things for free.

**Evaluate:** a stranger signs up, pays (test mode), and gets value — without you in the room. Plus: your written security review, everything found fixed.

**💼 Business lens:** this is the closest thing to a real business you'll build here. And one breach ends a freelancer's reputation — "I security-reviewed my own work" is a sentence clients pay extra for.

**The one link:** [Stripe documentation](https://stripe.com/docs) — the best-written docs in the industry; learn from how they teach. (Security reference: [OWASP Top 10](https://owasp.org/www-project-top-ten/).)

**Done when:**
- [ ] Product 4 takes test payments, sends real emails, handles uploads
- [ ] Security review written and all findings fixed; no secrets in any repo

---

## Week 3 — Deploy like a pro + read real code *(Days 65–70)*

**Goal:** never deploy by hand again — and learn to read code you didn't write.

**Learn:** Docker — what it is, why it exists, how to use it, in plain words · CI/CD with GitHub Actions (every push auto-deploys) · backups + the "server died at 2am" checklist · reading big codebases: start at the entry point, follow ONE feature end to end.

**Specify → AI builds:** AI writes the Dockerfile and deploy workflow; you break the deploy on purpose and watch automation catch it. For code reading: AI is your guide ("explain this file like I'm new"), but you verify by reading the code yourself.

**Evaluate:** push a change — does it reach production with zero manual steps? Then start your first open-source PR (a "good first issue"). If the merge spills into Phase 4, that's fine — starting is what counts this week.

**💼 Business lens:** manual deploys look amateur; "push to deploy with automated checks" is what professional means. And most paid work is reading existing code, not greenfield building — this week trains the actual job.

**The one link:** [Docker Get Started guide](https://docs.docker.com/get-started/) — hands-on, no prior knowledge needed. (First PR walkthrough: [First Contributions](https://github.com/firstcontributions/first-contributions).)

**Done when:**
- [ ] Product 4 dockerized, auto-deploying on every push, backup tested
- [ ] "Server died" checklist written
- [ ] One open-source PR opened (merged is the dream; opened is the requirement)

---

## 🏁 Phase project — Product 4

By day 70 it has: real auth, test payments, emails, custom domain, Docker deploys, CI/CD, tests, and a security review. **This is the project you lead with in interviews.** One product done properly beats five done halfway.

---

## ⚠️ Traps to avoid

- **The eternal todo app.** Six variations of the same tutorial project = one project, not six.
- **Docker rabbit holes.** Learn enough to ship. You are not becoming a DevOps engineer this week.
- **Skipping the stranger test.** "My friend understood it" doesn't count. Strangers only.

---

## 🧠 Phase check

<details>
<summary><b>Q1.</b> Why insist on real users instead of more tutorials?</summary>

Tutorials test whether you follow instructions. Real users test whether you handle reality — confusion, edge cases, breakage. Employers pay for the second one.
</details>

<details>
<summary><b>Q2.</b> Your deploy is manual and "only takes 5 minutes." Why is that a problem?</summary>

Five minutes × every change × every project × forever = hours of boring, error-prone work. Automation isn't laziness; it's reliability.
</details>

<details>
<summary><b>Q3.</b> What's the cheapest security win in this phase?</summary>

Getting secrets out of your code and repos. Most "hacks" of small projects are just someone reading a leaked API key.
</details>

---

## ✅ Phase done when

- [ ] All 3 weeks ticked, with running proof for each
- [ ] Product 4 live: auth, payments (test), emails, domain, Docker, CI/CD, security reviewed
- [ ] A stranger completed the full flow unassisted
- [ ] One open-source PR opened

---

**Day 51:** "I can build things."
**Day 70:** "Strangers use and pay for things I built — deployed like a pro."

---

[← Phase 2](../31_Phase2_Build_Like_An_Engineer/) · [Phase 4 →](../33_Phase4_Get_Paid_Get_Hired/)
