# Mission 20: Compare and improve approaches

Stage 4: Direct AI work at greater scale

A reproducible comparison with failures, uncertainty and a justified choice.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

One impressive summary is not a measurement. Compare two approaches on the same representative cases, with quality, cost and delay visible.

## Understand the concepts

### Baselines, samples and held-out cases

A baseline is a reference approach, possibly a simple rule or current process. Representative cases reflect real use. Held-out cases are kept out of tuning to probe transfer. Small or selected samples can give misleading estimates; report counts and uncertainty.

**Example:** Compare both assistants on the same notes, including missing and contradictory information.

**Common wrong idea:** Improving the examples used to tune a prompt proves improvement on new cases.

### Base rates, precision, recall and cost

Precision asks how many flagged cases really belong; recall asks how many relevant cases were found. Base rate is how common the condition is. A rare condition can yield many false alarms even with a seemingly accurate classifier. Measure latency and cost alongside errors.

**Example:** 10 true alerts and 90 false alerts give 10% precision, not 90%.

**Common wrong idea:** One accuracy percentage tells you every consequence of errors.

## Predict, change, observe

Prepared alert results: 10 true positives, 90 false positives and 10 missed positives. Choose a metric.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Precision:** 10 / (10 + 90) = 10%. Only one in ten raised alerts is a true positive.
- **Recall:** 10 / (10 + 10) = 50%. Half the actual positives were found.
- **Claim reliable overall:** Unsupported without use-case thresholds, negative cases, sample quality and costs. A persuasive label cannot replace relevant evidence.

Flow: Fixed cases + expected outcomes (Versioned evaluation set) → Run both approaches (Actual adapters or labelled fixtures) → Errors + cost + latency (Comparison report)

## Worked example

**before:** A new prompt succeeds on the five notes used to write it.

**action:** Freeze expectations, add representative held-out cases and run both versions under the same conditions.

**after:** Report counts by error type, measured delay and cost, including regressions.

**lesson:** A small experiment supports a bounded observation, not a universal model ranking or future guarantee.

Authored example; your project requires its own observations.

## Project: A fair assistant comparison

Compare two implementations or configurations of the AI feature against a non-AI or existing-process baseline where meaningful. Keep tuning and held-out cases distinct.

1. Define expected outcomes and error costs before running; include normal, missing and adversarial cases.
2. Ask AI to run the same cases for each approach with actual settings, usage and timing recorded.
3. Investigate failures, calculate relevant rates and choose an approach with explicit limitations.

## Outcome checks

- [ ] The comparison uses the same versioned cases and separates held-out cases from tuning.
- [ ] The report includes counts, error types, latency and actual or clearly hypothetical cost.
- [ ] The conclusion explains sample limitations, base rates and what evidence does not establish.

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

- **explain:** Explain baseline, held-out case, base rate, precision and recall with your results.
- **locate:** Find raw observations supporting a number in the report.
- **predict:** What might happen to precision if the target condition becomes much rarer?
- **compare:** Compare a faster cheaper option with a better-scoring option using the cost of errors.
- **challenge:** AI says a correlation between using the tool and fewer missed visits proves causation. What else could explain it?

## Reviewer guidance

Change the case distribution or error cost; check the learner can revise the interpretation and decision.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The evaluation excluded non-English notes but users need them. Reassess the claim.
- The new approach has better recall and many more costly false alarms. Choose a threshold or workflow.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 15](../../15_Day_LLMs_How_They_Work/README.md)
- [Original workshop 18](../../18_Day_Embeddings_Semantic_Search/README.md)
- [Original workshop 22](../../22_Day_Evals/README.md)
- [Original workshop 23](../../23_Day_Guardrails_Cost/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
