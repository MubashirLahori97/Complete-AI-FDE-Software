# Day 29 — Release hardening, recovery, and operational ownership

A capstone release needs more than a working happy path. Today you will verify the hosted environment, secret handling, access boundaries, bounded failures, and a practical recovery procedure. Your project is a release-readiness package that identifies what was checked and makes the system operable by someone other than you.

**Your project:** [A hardened capstone release package](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Connect deployment configuration to the actual released version.
- Verify critical permissions, failures, and resource policies after deployment.
- Document and rehearse recovery with compatible data and a known good version.

## Understand the concept

### Release checks target the environment

Inspect configuration, required services, asset paths, database access, and provider connectivity in the hosted environment. A successful local test does not establish that server secrets or production permissions are configured correctly. Record the actual source/artifact identity and the observed checks. Avoid reporting a service as healthy merely because its process exists or its home page loads; choose a small representative operational check that matches the system's core responsibilities.

### Recovery includes state compatibility

Redeploying a previous code version can help after a bad release, but database schema and stored data may have changed. Document whether the previous version can read the new data and what backup or migration action is required. Test recovery in an isolated environment before depending on it. Keep the operator's instructions explicit about what should be observed after each step and what must not be overwritten silently.

### Operational responsibility must be named

A customer needs to know who owns configuration, data access, alerts, provider spend, backup, and support escalation. Define useful service limits and a response when they are reached. A rate-limit control with no observed behavior or no owner is not a complete operating story. Record known limitations and unresolved checks so the release decision is based on evidence rather than pressure to finish a calendar milestone.

## A worked example, step by step

An unperformed check starts pending rather than being counted as passed.

```markdown
# Capstone release readiness
Release identity: actual commit and artifact version
Environment: actual host and documented configuration names
Access checks: pending until executed with allowed and forbidden identities
Failure checks: timeout, unavailable provider, and exhausted budget
Data checks: durable feedback, backup location, schema compatibility
Recovery target: a named previously verified version
Recovery rehearsal: date, procedure, observed outcome
Operator: owner of alerts, configuration, and support escalation
Known limits: unresolved checks and excluded capabilities
```

**Expected result**

```text
A completed release record names the version, environment, observed check results, recovery outcome, and operational owners.
Pending checks remain visible until evidence exists.
```

Release identity links operations back to reviewed source. Environment names where checks were performed. Permission and failure checks must be executed, not inferred from a prompt or a configuration file. Data compatibility connects code recovery to stored state. Naming an operator makes the alert and support process actionable. The final limits section prevents a handoff from implying capabilities or guarantees that were never verified.

## Practise before building

### Exercise 1: Choose a real health check

Define a low-impact check that verifies a representative capability and a failure signal.

**Hint:** A home-page response may not test retrieval or database access.

**Check your result:** The check's scope is explicitly stated.

### Exercise 2: Rehearse recovery

In an isolated copy, return to a known good release and verify its compatibility with sample data.

**Hint:** Preserve original data and understand schema assumptions before changing versions.

**Check your result:** The recovery result is observed and recorded.

### Exercise 3: Assign responsibility

Name who handles an alert, a broken provider credential, and a failed backup check.

**Hint:** Use role names for a fictional customer scenario.

**Check your result:** No operational issue is left with an unexplained someone will fix it.

## Common mistakes and how to debug them

- Equating a loaded home page with a complete hosted workflow check.
- Ignoring schema/data compatibility during rollback planning.
- Leaving alert, backup, and configuration ownership undefined.

## The FDE connection

An FDE's responsibility continues through the release decision and handoff. Operational evidence and clear ownership let the customer use the system safely and investigate problems after the builder is no longer in the room.

## Build your lesson project

**A hardened capstone release package**

Take the capstone through a documented release-readiness process. Verify its actual environment, permissions, bounded failures, stored feedback, and operating limits. Rehearse recovery in an isolated setup using fictional data. Produce a release decision with evidence and unresolved checks instead of claiming universal production readiness.

- A versioned hosted or reproducible release record.
- Permission, failure, resource, and data check evidence.
- A recovery runbook and isolated rehearsal result.
- An operational-owner map and explicit release limitations.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which check establishes the actual hosted behavior?
- What could make a previous code version incompatible with current data?
- Who acts when the first alert or customer failure occurs?

## References and next steps

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [OpenTelemetry: observability concepts](https://opentelemetry.io/docs/concepts/observability-primer/)

[← Lesson 28](../28_Day_Capstone_Part1/) · [Lesson 30 →](../30_Day_Ship_It/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** "Works on my machine" is day 0. **Deployed, monitored, and stranger-proof** is the product. Today your capstone goes live with everything production needs: hosting, secrets, monitoring, runbooks, and a final red-team pass. Tomorrow you demo it.

**Time:** 2–3 hours. **Done when a stranger can break it and it behaves.**

---

## The deployment checklist

### Ship it
- [ ] Deployed to a public URL (Render/Railway/Streamlit Cloud — your day-14 playbook)
- [ ] Secrets in platform env vars, never in code or logs
- [ ] Health endpoint (`GET /health` → `{"status": "ok"}`) so you know it's alive
- [ ] Works in incognito, on mobile, for a stranger

### Harden it
- [ ] Guardrails live and tested *on the deployed URL* (not just locally)
- [ ] Rate limits + daily budget cap configured; alert threshold set
- [ ] Structured logging on; you can trace any request end-to-end
- [ ] RUNBOOK.md deployed alongside (your future self at 2am says thanks)

### Prove it
- [ ] Final eval run on the deployed system — score: ___/20
- [ ] Red-team pass: 10 fresh attacks (injections, huge inputs, rapid-fire). Log results.
- [ ] One real human uses it while you watch silently. Write down every confusion.
- [ ] `/stats` shows real usage data; cost math verified against actual tokens

### Document it
- [ ] Project README: what it is, who it's for, live URL, architecture diagram, eval score, cost model, known limits, runbook link
- [ ] Add it to your portfolio (day 27) as the flagship piece

---

## The pre-demo audit (tonight, honestly)

Answer in writing:

1. What's the eval score, and what are the known failures?
2. What's the cost per 100 uses, measured (not estimated)?
3. What happens when it gets attacked? (Show the logs.)
4. What's explicitly OUT of scope?
5. If the demo gods strike tomorrow (API down, no internet), what's your backup? (Recorded video. Always have a recorded video.)

**A demo with honest limits beats a demo with hidden ones.** Every time.

---

## ✅ Done when

- [ ] Live URL, stranger-tested, mobile-checked
- [ ] Guardrails + budget cap verified on the deployed system
- [ ] Final eval score logged; red-team results logged
- [ ] Portfolio updated; recorded backup video exists
- [ ] Committed to GitHub

---

[← Day 28](../28_Day_Capstone_Part1/) · [Day 30 →](../30_Day_Ship_It/)
<!-- original-workshop:end -->

</details>
