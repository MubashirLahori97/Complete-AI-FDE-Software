# Day 27 — Portfolio evidence and clear technical communication

A portfolio should help a reader understand a problem you solved and assess the evidence behind your contribution. Screenshots and technology lists do not establish impact by themselves. Today you will build a case study that connects user needs, decisions, tests, results, and limitations without inventing performance or customer claims.

**Your project:** [An evidence-based portfolio case study](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain a project's problem and your contribution to a new reader.
- Support outcome claims with traceable evidence or clearly labelled estimates.
- Package a reproducible demo, repository, and case study.

## Understand the concept

### Lead with the problem and resulting behavior

Describe who had the problem, what the original workflow was, and what changed. Then explain the decisions that matter to understanding the result. A list of frameworks tells the reader what tools were present, but not whether the solution addressed a useful task. A concrete before/after example often communicates more than broad claims such as production-ready or enterprise-grade.

### Evidence needs provenance

A test report, deployment record, user observation, or evaluation result should identify what was checked and under which conditions. Separate your own contribution from generated, copied, or teammate work. Distinguish measured outcomes from expected benefits and estimates. If the project uses fictional data or mocked providers, say so. Honesty about limitations makes the case study useful to an engineer assessing whether they could extend or operate the project.

### A reader needs a path to inspect the work

Provide a working demo when available, a repository, setup instructions, and a short explanation of the core workflow. A public project should not include private customer data or secrets. Keep links current and record when you last checked them. A concise architecture diagram can show boundaries and tradeoffs, but it should reflect the actual implementation rather than the system you hope to build later.

## A worked example, step by step

A case-study structure creates a place for both evidence and limits.

```markdown
# Case study: support document assistant
Problem: who needed help and what task was difficult?
Scope: what was built and deliberately excluded?
My contribution: what decisions and implementation work did I own?
Approach: retrieval, source checking, interface, and failure handling
Evidence: name the dataset, tests, deployment checks, and observed results
Result: distinguish measured changes from estimates
Limitations: fictional data, fixture mode, or remaining unverified paths
Inspect: verified demo URL and repository
Next step: one improvement supported by the evidence
```

**Expected result**

```text
A completed case study connects a real project record to inspectable evidence.
It contains no invented customer, salary, accuracy, or savings claim.
```

The structure leads with the user's task instead of implementation vocabulary. Scope prevents the reader from assuming unsupported capabilities. My contribution makes ownership visible. Evidence names the check conditions and result, while limitations distinguish a prototype from a verified production service. The next step should follow from a failure or constraint rather than merely adding another fashionable tool.

## Practise before building

### Exercise 1: Rewrite a vague claim

Replace I built a powerful AI app with a specific problem, behavior, and evidence sentence.

**Hint:** Name who used it, what it did, and what you actually checked.

**Check your result:** The sentence can be assessed rather than merely admired.

### Exercise 2: Audit claims

Label every metric in your draft as measured, estimated, or unsupported.

**Hint:** Include the denominator and dataset for a score.

**Check your result:** Unsupported figures are removed or clearly revised.

### Exercise 3: Check the inspection path

Ask a new reader to open the demo and follow the README.

**Hint:** Verify that the linked version matches the described implementation.

**Check your result:** The reader can inspect your core claim without private instructions.

## Common mistakes and how to debug them

- Presenting framework names as evidence of user value.
- Inventing percentages or customer impact to make a portfolio look stronger.
- Describing planned components as if they are already implemented.

## The FDE connection

An FDE regularly explains decisions to engineers, customers, and operators. A good case study practises the same skill: make the outcome, evidence, tradeoffs, and next action clear to people who did not participate in the build.

## Build your lesson project

**An evidence-based portfolio case study**

Choose one completed learning project and package it for a reader who has no context. Write a concise case study, verify the repository and demo links, include a representative test report, and explain your own contribution. Use the app's portfolio tracker to keep the artifacts together and export a readable copy.

- A problem-first case study with scope and contribution.
- Verified project links or a clearly documented local demo.
- A representative test/evaluation record and actual result.
- A small implementation diagram and explicit limits.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which claim is best supported by your evidence?
- What should the reader not assume about this project?
- What concrete feedback improved your explanation?

## References and next steps

- [GitHub: repository READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [MDN: learning web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)

[← Lesson 26](../26_Day_Client_Discovery_FDE/) · [Lesson 28 →](../28_Day_Capstone_Part1/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Skill without proof is invisible. A **portfolio** is proof organized for a buyer: live URLs, the problem each project solved, the spec you wrote, the evals you ran, the cost model. And **getting paid** is a separate skill: where to find work, how to propose, how to price. Today you package 26 days of work into something that earns.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The portfolio that wins work (one page per project)

Each of your 3 projects gets a page with:
1. **Live URL** — clickable, working, stranger-tested.
2. **The problem** — one paragraph, business words not tech words.
3. **What I built** — architecture in one diagram + 3 bullets.
4. **Proof** — eval scores, the honesty test, uptime. Numbers beat adjectives.
5. **Cost model** — "costs $X per 100 uses" — shows you think like an owner.

Build it as a simple site (Streamlit, GitHub Pages, or even a great README). **The portfolio itself is project #4** — it shows everything.

### Where the work is (realistic, day-27 edition)

- **Your network first.** Message 10 people: "I build AI tools for small businesses — here's what I shipped [link]. Know anyone drowning in repetitive questions/paperwork?" Warm intros beat cold applications 10:1.
- **Freelance platforms** (Upwork, local equivalents): start with small fixed-fee AI tasks; your portfolio + evals differentiate you from prompt-jockeys.
- **Local businesses** (day 26's discovery): walk in with the brief template, not a pitch deck.
- **Content**: write up one thing you learned each week (LinkedIn, blog). Teaching in public is a slow-burn client magnet.

### The proposal (keep it to one page)

Problem (their words) → your solution (3 bullets) → scope IN/OUT → timeline → fixed price → proof (your portfolio links). End with **one clear next step**: "Reply yes and I'll send the brief for signature." Friction kills deals.

---

## 2. Specify — direct the AI

> "Help me draft: 1) my portfolio homepage copy — headline, one-line bio, and 3 project summaries in business language (problem → solution → proof), 2) a one-page proposal template I can reuse, with placeholders for problem, scope IN/OUT, timeline, price, and next step, 3) 3 outreach message drafts (network contact, Upwork bid, local business walk-in) — each under 100 words, each ending with one clear next step. Critique each draft for vagueness before finalizing."

## 3. Evaluate — be the senior

- Read your portfolio as a skeptical business owner. Would *you* trust this person with $1,500? What's missing? Fix it.
- **The 10-second test:** show the portfolio to someone for 10 seconds. What do they remember? If it's not "builds AI tools that work," redesign the headline.
- Check every link. Every URL live? Every screenshot current? A dead link in a portfolio is an anti-credential.
- Price yourself on paper: your day rate, your first fixed-fee offer, your walk-away number. Write them down — deciding under pressure is how you undercharge.
- Ask the AI: "Quiz me — what are the 5 parts of a project page? Where does work come from, in priority order? What ends a proposal?"

## 4. Business lens 💼

**This whole day IS the business lens.** The uncomfortable truth: the best engineer doesn't win — the best *packaged* engineer wins. Your 26 days of real skill are the product; today is the packaging, the pricing, and the distribution. Do this day properly and day 30 isn't a hope — it's a pipeline.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> What's the difference between a project and a portfolio piece?</summary>

A project is the thing you built; a portfolio piece is the thing *translated for a buyer* — problem in business words, proof in numbers, live URL, cost model. Translation is the work.
</details>

<details>
<summary><b>Q2.</b> Why fixed fee over hourly for your first clients?</summary>

Hourly punishes speed and rewards slowness — and as an AI-assisted builder you're fast. Fixed fee aligns you with the client's interest (outcome, not hours) and your speed advantage.
</details>

<details>
<summary><b>Q3.</b> Your portfolio link is dead when a client clicks it. How bad is this?</summary>

Catastrophic for trust — it's the one thing that was supposed to prove reliability. Check every link before every outreach. Automate it if you can (a test that pings your URLs).
</details>

---

## ✅ Done when

- [ ] Portfolio exists with 3 project pages (problem → solution → proof → cost model)
- [ ] It passes the 10-second test with a real human; all links live
- [ ] Proposal template + 3 outreach drafts written and de-vagued
- [ ] Your rates written down; committed to GitHub

> 🔭 **Coming back to this:** [Phase 4, week 3](../33_Phase4_Get_Paid_Get_Hired/) rebuilds this portfolio as case studies and runs the full job-hunt funnel. Today you packaged your work. There, you'll sell it.

## 📎 The one link

[Patrick McKenzie — "Selling Software to Businesses"](https://www.kalzumeus.com/2011/10/28/dont-call-yourself-a-programmer/) — the classic essay on positioning yourself as a problem-solver, not a coder. Read it twice.

---

[← Day 26](../26_Day_Client_Discovery_FDE/) · [Day 28 →](../28_Day_Capstone_Part1/)
<!-- original-workshop:end -->

</details>
