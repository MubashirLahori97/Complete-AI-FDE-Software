# Day 30 — Customer demo, handoff, and an evidence-based next plan

A delivery is complete when its intended user can understand, use, and operate the agreed result, and the team knows what remains. Today you will demonstrate the capstone against its acceptance criteria, package the operating handoff, and write a retrospective that turns experience into a practical next learning plan. Completing the course is a milestone, not proof of instant mastery.

**Your project:** [A customer-ready demo and handoff pack](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Demonstrate an actual workflow and critical failure behavior against a brief.
- Hand over setup, data, configuration, support, and recovery responsibilities.
- Choose next learning work from evidence about current weaknesses.

## Understand the concept

### A demo proves specific behavior

Lead with the user's problem and agreed scope. Show a normal task, inspect its evidence, then show a meaningful boundary such as insufficient sources or forbidden access. State which execution mode and version the audience is seeing. Avoid a rehearsed happy path that quietly depends on special fixtures while being described as real customer production behavior. A useful demo records both what worked and the limitations the customer should understand.

### Handoff transfers capability

A repository URL is only part of a handoff. Include startup and operating instructions, data/configuration ownership, backup and recovery steps, known limitations, and a support/escalation path. Verify that another person can use the material. If a customer needs training, make the task and expected result clear. The goal is to leave them able to operate the scoped system, not permanently dependent on the builder's private knowledge.

### Reflection should change the next decision

Use actual errors, test results, and user observations to identify weak skills. Explain where AI helped and where you accepted output too quickly. Choose a concrete next project or improvement with a observable completion condition. A learning roadmap should adapt to your available time and demonstrated understanding; a day number is not a guarantee of hiring, income, or expertise. Continue deepening frontend, backend, AI evaluation, and customer work through repeated delivery.

## A worked example, step by step

The demo and handoff refer to the same version and scope.

```markdown
# Delivery pack
Customer workflow and agreed scope:
Released version and verified URL or local setup:
Demo task 1: normal supported answer with evidence
Demo task 2: missing evidence or forbidden source
Acceptance results: link to actual checks and eval outputs
Operate: setup, configuration owner, data owner, and health checks
Recover: tested runbook and escalation roles
Known limitations and unfinished work:
Retrospective: three lessons, one failure, one improvement
Next project: a specific weakness and completion criterion
```

**Expected result**

```text
A reviewable delivery pack connects the demo, acceptance evidence, operating instructions, limitations, and next action.
Another person can identify the released version and how to use it.
```

The first lines establish context and release identity. The two demo tasks show both useful behavior and a meaningful boundary. Acceptance results point to actual artifacts rather than vague assurance. Operational roles and recovery steps transfer responsibility visibly. The retrospective chooses learning work from observed weaknesses, while the next project's completion criterion prevents the roadmap from becoming another list of topics to watch.

## Practise before building

### Exercise 1: Record a concise demo

Create a short walkthrough showing the problem, normal workflow, source evidence, and a failure boundary.

**Hint:** Use the actual released version and label fixtures or fictional data.

**Check your result:** A new viewer can connect the behavior to the agreed acceptance criteria.

### Exercise 2: Test a handoff

Give the operating pack to another learner and observe one task and one recovery question.

**Hint:** Record where they needed undocumented assistance.

**Check your result:** The revised pack removes at least one hidden assumption.

### Exercise 3: Plan from evidence

Choose one weak frontend, backend, evaluation, or discovery skill and define a follow-up project.

**Hint:** Name a concrete task and how you will know it improved.

**Check your result:** The next plan has an observable outcome rather than a promise of instant expertise.

## Common mistakes and how to debug them

- Describing a scripted happy path as a complete production verification.
- Treating a repository link as sufficient operating documentation.
- Choosing the next technology based only on popularity rather than a demonstrated skill gap.

## The FDE connection

The FDE outcome includes the customer's ability to use the solution and the team's ability to maintain it. A clear demonstration, honest evidence, and a usable handoff are engineering deliverables. The next cycle starts from what the delivery taught you.

## Build your lesson project

**A customer-ready demo and handoff pack**

Package your capstone as a scoped delivery. Record a concise demo, assemble acceptance and evaluation evidence, verify the operating instructions with another person, and write a retrospective. Produce a next-project plan tied to one demonstrated weakness. Do not publish private customer data or send promotional messages as part of this learning exercise.

- A short demo script or recording tied to actual acceptance criteria.
- A versioned delivery pack with operating and recovery instructions.
- A handoff walkthrough observation and a corrected documentation gap.
- A retrospective and a concrete follow-up learning project.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What useful task can someone perform after your handoff?
- What did your tests and user observations actually establish?
- Which next project will strengthen the weakest part of your current delivery?

## References and next steps

- [GitHub: repository READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Atlassian: the forward deployed engineer](https://www.atlassian.com/blog/how-we-build/meet-the-forward-deployed-engineer)

[← Lesson 29](../29_Day_Capstone_Part2/)[Continue into the longer roadmap](../ROADMAP.md)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**You made it.** Thirty days ago: zero. Today: three shipped projects, a client-grade capstone with a live URL, evals, guardrails, a cost model, a portfolio, and a business brief template. Today you **prove it, reflect on it, and plan what's next.**

---

## Part 1: The demo (60 min)

**Record a 5-minute demo video** of your capstone:

1. **The problem** (30s) — whose pain, how much it costs them.
2. **The product** (2 min) — live walkthrough, real questions, show the sources panel.
3. **The honesty** (1 min) — ask it something it can't know. Show the "I don't know." Show a blocked injection. *This is your differentiator.*
4. **The engineering** (1 min) — eval score, cost per 100 uses, architecture in one diagram.
5. **The offer** (30s) — "I build systems like this for businesses. Here's my contact."

Post it where your future clients are (LinkedIn, Twitter/X, local business groups). **The demo is your first marketing asset.**

## Part 2: The retrospective (30 min, written)

Answer honestly in `RETROSPECTIVE.md`:

- What are the 3 most important things you learned? (Concepts, not tools.)
- What was the hardest day, and why?
- Where did AI help most? Where did it mislead you?
- What's the weakest part of your capstone? What's the plan to fix it?
- What would you tell yourself on day 1?

## Part 3: The next 60 days — the roadmap (30 min, concrete)

Day 30 was the first finish line, not the last. The [roadmap](../ROADMAP.md) continues to day 90 — three phases, one story:

- **[Phase 2 — Build Like an Engineer (Days 31–50 · Weeks 5–7)](../31_Phase2_Build_Like_An_Engineer/)** — the depth behind everything you built: databases, APIs, testing, git like a team.
- **[Phase 3 — Ship Real Products (Days 51–70 · Weeks 8–10)](../32_Phase3_Ship_Real_Products/)** — one real product with real users, payments, pro deploys, hardened against attack.
- **[Phase 4 — Get Paid & Get Hired (Days 71–90 · Weeks 11–13)](../33_Phase4_Get_Paid_Get_Hired/)** — the interview core, a paid engagement with a contract, the job-hunt funnel.

```markdown
# Next 60 Days
Days 31-50: [Phase 2 — depth; "The Rebuild" of your weakest project]
Days 51-70: [Phase 3 — Product 4 live with real users]
Days 71-90: [Phase 4 — paid engagement + interviews in motion]
The one metric: [e.g., "undeniable" — proof the market responds to]
The one habit: [e.g., "3–5 hours a day; every week ships evidence"]
```

**What changes on day 31:** the pace. Days 1–30 ran on 60–90 minutes a day; days 31–90 need 3–5 hours. That's the honest price of three months, and the roadmap says it out loud. Same iron rule, though: *never ship output you can't explain or defend.*

---

## 🧠 Final check — the whole journey

<details>
<summary><b>Q1.</b> In one sentence each: what do weeks 1, 2, 3, 4 teach?</summary>

Week 1: think like a programmer (concepts). Week 2: think like an engineer (AI writes, you verify). Week 3: the AI engineering core (models, RAG, agents). Week 4: ship like an FDE (production + business).
</details>

<details>
<summary><b>Q2.</b> What's the iron rule of this entire repo?</summary>

Never ship AI output you can't explain or defend. Thirty days of everything else hangs on that sentence.
</details>

<details>
<summary><b>Q3.</b> A business owner asks "why should I trust your AI system?" — your 30-second answer?</summary>

"Here's the live system, here's my eval score on 20 test cases, here's what it costs per use, here's what it refuses to do, and here's what happens when someone attacks it — all logged. Try to break it."
</details>

---

## ✅ Done when

- [ ] 5-minute demo video recorded and posted
- [ ] RETROSPECTIVE.md written honestly
- [ ] Next-90-days plan written with one metric and one habit
- [ ] Final commit; the 30-day tracker fully ticked ✅

---

**Day 1:** "I've never written code."
**Day 30:** "I ship AI software — and I can prove it."
**Day 90:** "I'm a software engineer — and the market knows it."

*Go fix a real problem for a real business — that's what the 30 days were for. Then come back for Phase 2. The next 60 days make you undeniable.* 🚀

---

[← Day 29](../29_Day_Capstone_Part2/) · [Phase 2 →](../31_Phase2_Build_Like_An_Engineer/)
<!-- original-workshop:end -->

</details>
