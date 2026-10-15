# Mission 7: Define a worthwhile result

Stage 2: Understand the problem and design the product

A short product brief with a baseline, success measure and explicit scope.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

A new system could make the appointment screen faster while increasing missed visits. Decide which result matters before building more features.

## Understand the concepts

### Outcomes, baselines and denominators

A baseline is the starting observation. An outcome measures the change people need. A rate needs a denominator: two missed visits out of ten differs from two out of a hundred. Define exclusions consistently before comparing periods.

**Example:** Count preventable missed visits per 100 eligible appointments, not just app logins.

**Common wrong idea:** A larger usage count proves the business outcome improved.

### Scope and priorities

Scope names what is included and excluded. Priorities express which result should win when time or cost is limited. A small complete workflow is often easier to evaluate than many partly connected features.

**Example:** Confirm access before dispatch; postpone route optimization until the first change is measured.

**Common wrong idea:** Anything useful belongs in the first release.

## Predict, change, observe

Prepared counts: 2 missed visits. Change the denominator.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **10 eligible visits:** Missed-visit rate: 20%. 2 ÷ 10 = 0.20. Small samples also produce uncertain estimates.
- **100 eligible visits:** Missed-visit rate: 2%. The same count can represent a very different rate.
- **Denominator unknown:** The rate cannot be calculated honestly. Missing information cannot be replaced with an impressive percentage.

Flow: Define eligible visits (Business definition) → Measure current result (Evidence / records) → Set a bounded target (Product brief)

## Worked example

**before:** Success means people use the dashboard.

**action:** Define eligible visits, measure a starting rate, choose a target period and record other changes affecting it.

**after:** The brief targets fewer preventable missed visits, with staff workload as a guardrail.

**lesson:** Before/after change alone does not establish causation. Record uncertainty and plausible alternative explanations.

Authored example; your project requires its own observations.

## Project: A one-page outcome brief

Turn the workflow investigation into a measurable, bounded improvement with a baseline or a labelled plan to obtain one.

1. State the user, current process and costly problem with its evidence.
2. Define the outcome, denominator, target and guardrail; do not invent a measured baseline.
3. Use AI to challenge scope and exclusions. Agree or label the scenario assumptions.

## Outcome checks

- [ ] The brief defines the outcome, eligible cases and source of its baseline or measurement plan.
- [ ] In-scope and out-of-scope work are explicit, with one priority tradeoff.
- [ ] A guardrail and alternative explanations prevent a misleading success claim.

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

- **explain:** Explain the baseline, denominator and guardrail in your brief.
- **locate:** Show the decision that limits the first release.
- **predict:** If visits double but missed visits stay constant, what happens to the rate?
- **compare:** Compare logins, completed confirmations and missed visits as success measures.
- **challenge:** AI says the app caused improvement because results improved after release. What else would you investigate?

## Reviewer guidance

Change the denominator or remove a source and ask the learner to revise the claim without inventing data.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The target improves but staff spend an extra hour per day. Reassess success.
- The baseline included cancellations; the new count excludes them. Repair the comparison.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 7](../../07_Day_Project1_CLI_App/README.md)
- [Original workshop 22](../../22_Day_Evals/README.md)
- [Original workshop 26](../../26_Day_Client_Discovery_FDE/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
