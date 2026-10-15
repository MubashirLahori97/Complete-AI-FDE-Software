# Mission 21: Ask AI to produce useful checks

Stage 5: Establish quality and keep the product working

A test strategy connected to requirements, including a demonstrated defect.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

AI has generated a green test suite, but a deliberately broken confirmation still passes. A check is useful when it can expose a relevant incorrect result.

## Understand the concepts

### Unit, integration and end-to-end checks

A unit check isolates a small rule. An integration check covers an agreement between parts. An end-to-end check follows a user journey across relevant components. These provide different evidence and different diagnosis costs.

**Example:** Check a quote rule, an API/database write, then a browser confirmation journey.

**Common wrong idea:** More end-to-end checks automatically make all smaller checks unnecessary.

### Regression and coverage limits

A regression is previously required behaviour becoming incorrect after change. A regression check preserves that expectation. Coverage reports where execution went, not whether every important case and expectation was correct. Test data must represent relevant situations.

**Example:** The duplicate-submit check should fail when duplicate protection is deliberately removed in a test environment.

**Common wrong idea:** A green suite establishes requirements it never checked.

## Predict, change, observe

A deliberate defect writes the wrong visit but returns a success toast. Choose a check.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Assert toast only:** Passes while the relevant defect survives. The assertion misses record identity and stored state.
- **Assert selected record:** Fails when the wrong visit changes. The check observes the actual requirement.
- **Count test cases:** No conclusion about this defect. Quantity is not the same as a meaningful expectation.

Flow: Required behaviour (Acceptance matrix) → Appropriate checks (Unit / integration / journey) → Defect exposed + fixed (Test environment)

## Worked example

**before:** Tests assert the same broken calculation used by the app.

**action:** Write an expected example from the business rule and deliberately introduce a defect in a disposable test change.

**after:** The check fails, AI fixes the cause, and the original expectation passes.

**lesson:** Do not weaken the expectation just to make the suite green. AI can generate and run every check; explain why it is relevant.

Authored example; your project requires its own observations.

## Project: Checks that can prove you wrong

Ask AI to create appropriate unit, integration and journey checks from the acceptance matrix. Demonstrate one real defect and keep its regression check.

1. Map important requirements to checks and expected observations.
2. Introduce or use a known defect in a test environment and show the relevant failure.
3. Let AI diagnose and fix it; rerun the focused check and affected journey, recording remaining limits.

## Outcome checks

- [ ] Each important check has a requirement-derived expectation and suitable test data.
- [ ] A deliberate or observed defect produces a meaningful failing check.
- [ ] The fix passes the original expectation and relevant regression checks without hiding the failure.

Record starting state, action, expected result, observed result, environment and evidence location. Leave unrun checks unticked.

## System explanation

1. Purpose and success
2. Actual technologies
3. How the parts fit
4. Choices and alternatives
5. Where it runs
6. One action, end to end
7. Information, access and AI
8. Changes and failures

Explain the actual project; mark absent components as absent. Use your own words and a diagram where useful. Update after meaningful changes.

## Understanding, separately from output

- **explain:** Explain the different evidence from unit, integration and journey checks.
- **locate:** Show the expectation that exposed your defect and its source requirement.
- **predict:** What would still pass if the wrong visit changed but the toast looked correct?
- **compare:** Compare a faster isolated check with a broader journey check.
- **challenge:** AI says all green means there are no bugs. Name an untested behaviour and how to investigate it.

## Reviewer guidance

Supply an uncovered edge case and ask the learner to choose evidence before running it.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The test uses only one customer, hiding an authorization bug. Improve the data.
- A mocked provider passes while its real schema changed. Choose an additional boundary check.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 12](../../12_Day_Testing_Clean_Code/README.md)
- [Original workshop 22](../../22_Day_Evals/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
