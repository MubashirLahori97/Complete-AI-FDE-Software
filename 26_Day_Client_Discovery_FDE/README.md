# Day 26 — Customer discovery and measurable project briefs

A customer's request for AI is often a starting hypothesis, not a complete problem statement. Discovery turns a workflow, its constraints, and its cost into a reviewable project brief. Today you will practise asking concrete questions, distinguishing estimates from measurements, and choosing a useful pilot before promising an implementation.

**Your project:** [A discovery interview and customer brief](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Investigate a real or fictional workflow using specific recent examples.
- Identify users, data ownership, constraints, and operational responsibility.
- Write a scoped brief with a baseline, target, evaluation method, and explicit assumptions.

## Understand the concept

### Ask about behavior before pitching

Ask the customer to walk through the last time the problem occurred. Who performed each step, which system did they use, and where did they wait or repeat work? Concrete examples reveal constraints better than asking whether they like an imagined feature. Do not treat politeness or interest as proof that the workflow matters enough to change. Inspect what the team has already tried and why it did not solve the problem.

### Quantify with honest assumptions

A statement such as eight people spend twenty minutes a day can guide an initial estimate, but it is not automatically a measured baseline. Record the source and uncertainty of the number. Plan how to measure a sample of actual tasks and distinguish total elapsed time from active handling time. The target should also include quality and access guardrails, because a faster wrong answer may make the workflow worse.

### A brief creates a shared decision

Name the problem, users, in-scope tasks, excluded tasks, data access, acceptance criteria, timeline assumptions, operating owner, and risks. Compare a simple lookup or workflow fix with an AI-based option instead of assuming AI is required. The customer should understand the outcome and tradeoffs without knowing every framework. If a constraint changes, revisit the brief visibly rather than silently absorbing an unlimited new scope.

## A worked example, step by step

The retailer numbers below are fictional interview estimates that require validation.

```markdown
# Discovery notes: stock lookup pilot
Observed workflow: staff consult three spreadsheets for a stock question
Interview estimate: 8 staff x 20 minutes/day = 160 staff-minutes/day
Not yet measured: actual handling time, error rate, and query frequency
Constraint: one shop; read-only access; purchase prices restricted
Candidate pilot: timestamped stock lookup from an agreed source
Out of scope: automated purchasing, external messaging, multi-shop rollout
Next step: measure representative lookups and agree on acceptance criteria
```

**Expected result**

```text
A useful discovery note separates an observed workflow, an interview estimate, constraints, and the next evidence-gathering step.
It does not claim measured savings from a fictional scenario.
```

The current workflow is described before selecting technology. The arithmetic quantifies an interview estimate and labels its status. The constraints identify allowed data and actions. The pilot is narrow enough to evaluate, and the excluded list avoids a hidden expansion into purchasing. The next step specifies what evidence is still missing instead of treating the estimate as proof of ROI.

## Practise before building

### Exercise 1: Ask concrete questions

Write five questions about a recent workflow, time spent, existing attempts, affected users, and desired change.

**Hint:** Ask for an example instead of asking whether the customer wants AI.

**Check your result:** Each question can reveal a decision or constraint.

### Exercise 2: Separate estimates from observations

Label every number in a fictional interview as measured, estimated, or unknown.

**Hint:** Record who supplied the estimate and how it could be verified.

**Check your result:** Your brief cannot accidentally report assumed savings as proven impact.

### Exercise 3: Compare alternatives

Propose one simple non-model option and one AI-assisted option for the same workflow.

**Hint:** Compare user benefit, data requirements, operating cost, and failure modes.

**Check your result:** The chosen pilot is justified by the problem rather than the technology name.

## Common mistakes and how to debug them

- Pitching a model before understanding the actual workflow.
- Turning an interview estimate into a claimed measured baseline.
- Omitting data access, operating ownership, or excluded actions from the scope.

## The FDE connection

This is central FDE work: learn the context, make tradeoffs legible, agree on a measurable pilot, and leave the customer with a reviewable decision. Technical depth helps, but the first useful deliverable may be a better problem statement.

## Build your lesson project

**A discovery interview and customer brief**

Use the retailer scenario in the app or another clearly fictional business workflow. Conduct a structured roleplay, record evidence and assumptions, compare implementation alternatives, and produce a one-page brief. A real interview is optional and requires authorization from the people involved; the learning project can be completed entirely with fictional data.

- A discovery-question plan and notes from two roleplays or authorized interviews.
- A one-page problem, scope, constraints, and success brief.
- A baseline-measurement and evaluation plan.
- An alternatives comparison and a risk/owner list.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What did discovery change about your initial idea?
- Which important number is still an assumption?
- Why is the selected pilot preferable to the alternative for this scope?

## References and next steps

- [Palantir: forward deployed engineering approach](https://www.palantir.com/docs/foundry/architecture-center/)
- [Atlassian: the forward deployed engineer](https://www.atlassian.com/blog/how-we-build/meet-the-forward-deployed-engineer)

[← Lesson 25](../25_Day_Observability_Debugging/) · [Lesson 27 →](../27_Day_Portfolio_Getting_Hired/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** The FDE's superpower isn't code — it's **discovery**: walking into a business, finding the problem worth solving, and turning human complaints into a **scoped, priced, buildable spec**. Most "AI projects" fail here, before a line is written: wrong problem, vague scope, no buyer. Today you learn the conversation that prevents all three.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The discovery conversation (45 minutes, 5 questions)

You're not selling. You're diagnosing. Ask:

1. **"Walk me through your week. Where does time go?"** — Find the pain in *their* words. Listen for repetition: "every Monday I…", "we always have to…"
2. **"What does that cost you?"** — Time × people × frequency. "3 hours every day" = the budget for your solution. No cost = no project.
3. **"What have you tried?"** — Respects their effort; reveals constraints ("we tried software X, too complicated").
4. **"Who else feels this pain?"** — One person annoyed = favor. A team slowed = budget.
5. **"If this were fixed, what would change?"** — The success metric, in their words. This becomes your eval (day 22).

**Never pitch in the discovery meeting.** Diagnose, quantify, leave. The proposal comes later — and it's 10× stronger for it.

### The business brief (one page, your deliverable)

```markdown
# Business Brief: [Client] — [Problem]
Problem: [one paragraph, their words]
Cost of problem: [hours/week × people = $/month]
Proposed solution: [2-3 sentences, no jargon]
Scope: [what's IN — 3 bullets] / [what's OUT — 3 bullets]
Success metric: [measurable, their words from Q5]
Timeline: [e.g., 2 weeks]   Price: [fixed fee]
Risks: [what could go wrong, honestly]
```

The **OUT list** is the most important part — it's where scope creep goes to die.

### Pricing (the honest starter model)

- **Fixed fee for the build** (not hourly — hourly punishes your speed).
- Price = (your days × your day rate) + token/infra buffer + 30% margin.
- Your day rate on day 26: whatever the local market pays a junior developer, and raise it every project. The brief's "cost of problem" is your negotiation anchor: if the problem costs them $2,000/month, a $1,500 fix is obviously worth it.

---

## 2. Specify — direct the AI

> "Roleplay as a difficult small-business owner (a pharmacy owner drowning in inventory questions from staff). I will conduct a 15-minute discovery conversation. Rules: be vague at first, mention 3 different pains, only reveal the real cost when I ask directly, and at the end score my discovery: did I find the quantified pain? Did I avoid pitching? Give me 3 specific improvements."

Practicing on a simulated difficult client beats theorizing. Do it twice.

## 3. Evaluate — be the senior

- After the roleplay: did you leave with a **quantified** problem (hours × people × frequency)? If not, you chatted — you didn't discover.
- Write the full one-page business brief for the pharmacy scenario. Is the OUT list specific? Is the success metric measurable? Would *you* sign it?
- **The red-team test:** list 3 ways this project could go wrong (client won't give data access, problem was misdiagnosed, scope creep). Each needs a mitigation in the brief's Risks section.
- Ask the AI: "Quiz me — what are the 5 discovery questions and what does each reveal? Why never pitch in discovery? What's the most important part of the brief?"

## 4. Business lens 💼

**This is the whole game.** Code is abundant now; *correctly-scoped problems with willing buyers* are scarce. The FDE who can walk into any business and leave with a signed one-page brief will never lack for work — because they sell certainty, not code. Everything before today was building your capability; today is building your *livelihood*. Days 27–30 are packaging and proving it.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> The owner says "I need AI." What's your first response?</summary>

Not a solution — a question: "Walk me through your week." You don't sell AI; you diagnose problems. "I need AI" is a request for magic; your job is to find the real pain underneath.
</details>

<details>
<summary><b>Q2.</b> Why is the OUT list the most important part of the brief?</summary>

Because scope creep kills fixed-fee projects. The OUT list is the written agreement of what you're NOT building — it's what you point to when "just one more thing" appears.
</details>

<details>
<summary><b>Q3.</b> The problem costs the client $200/month. You want to charge $2,000. What do you do?</summary>

You don't take it — or you re-scope to something worth 10× less effort. Price must relate to problem cost; a $2,000 fix for a $200 problem is a story that ends with an unhappy client.
</details>

---

## ✅ Done when

- [ ] You can run the 5-question discovery from memory
- [ ] Two roleplays done; scores improved the second time
- [ ] A complete one-page brief exists with specific OUT list and measurable success metric
- [ ] Committed to GitHub

> 🔭 **Coming back to this:** [Phase 4, week 2](../33_Phase4_Get_Paid_Get_Hired/) turns discovery into money — scoping, contracts, pricing, and a real paid engagement. Today you learned the questions. There, you'll get paid for the answers.

## 📎 The one link

[The Mom Test — summary](https://www.momtest.com/) — the short book on asking questions that get honest answers instead of compliments. Read the summary; apply it forever.

---

[← Day 25](../25_Day_Observability_Debugging/) · [Day 27 →](../27_Day_Portfolio_Getting_Hired/)
<!-- original-workshop:end -->

</details>
