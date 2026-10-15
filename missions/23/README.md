# Mission 23: Diagnose from evidence

Stage 5: Establish quality and keep the product working

An incident investigation with a tested hypothesis and verified recovery.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

Some confirmations are slow and others fail. Instead of asking AI to randomly rewrite the feature, collect evidence that distinguishes possible causes.

## Understand the concepts

### Logs, metrics and traces

Logs record events, metrics summarize measurements, and traces connect steps of a request. Correlation identifiers help follow one action across components. Instrumentation should avoid secrets and unnecessary personal information.

**Example:** A request ID connects the browser error, API event and slow provider call.

**Common wrong idea:** More raw logging automatically makes diagnosis easier or safer.

### Hypotheses and falsification

A hypothesis is a possible explanation with a predicted observation. Choose evidence that can distinguish it from another explanation. AI can investigate and propose fixes; verify the actual user flow after change rather than treating a convincing diagnosis as the result.

**Example:** If the provider is slow, its span should dominate latency while local validation remains fast.

**Common wrong idea:** The first plausible explanation is the established cause.

## Predict, change, observe

Prepared trace: total 2,000 ms; validation 20 ms; database 80 ms; provider 1,900 ms. Choose an investigation.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Rewrite CSS:** No evidence links styling to the measured server delay. Choose a hypothesis connected to the observed boundary.
- **Inspect provider span:** A relevant next step: check its timing, errors and comparison requests. The trace identifies a candidate; it does not yet explain why the provider is slow.
- **Declare cause solved:** Premature: no corrective change or recovered journey observed. Diagnosis and verified recovery are different outcomes.

Flow: User symptom + request ID (Browser / support report) → Compare hypotheses (Logs + metrics + traces) → Fix + verify journey (Test and running service)

## Worked example

**before:** A user reports slow saves; AI suggests a database rewrite.

**action:** Collect a correlated trace and compare a provider-delay hypothesis with a database-delay hypothesis.

**after:** Evidence directs a bounded change, followed by a timed user journey.

**lesson:** Record contradictory evidence and remaining uncertainty. Do not expose private notes in diagnostic artifacts.

Authored example; your project requires its own observations.

## Project: An evidence-led incident record

Instrument and investigate one real or deliberately injected test failure using AI, with privacy-aware observations and a verified fix.

1. Define the symptom, environment and two plausible hypotheses.
2. Ask AI to collect appropriately redacted logs, metrics or traces that distinguish them.
3. Apply a bounded fix, rerun the relevant flow and record cause, evidence, recovery and remaining risks.

## Outcome checks

- [ ] The incident record separates symptom, hypothesis and observed evidence.
- [ ] A correlated observation supports or refutes a hypothesis without leaking credentials or private data.
- [ ] The relevant user journey works after the fix and its observed result is recorded.

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

- **explain:** Explain a log, metric, trace and hypothesis through this incident.
- **locate:** Find the observation that changed the investigation's direction.
- **predict:** What would you expect to see if the database were the bottleneck instead?
- **compare:** Compare collecting all payloads with targeted privacy-aware instrumentation.
- **challenge:** AI says the last changed file must be the cause. Propose a distinguishing investigation.

## Reviewer guidance

Provide contradictory evidence and see whether the learner revises the explanation rather than defending the first guess.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- Only one region experiences failures. Refine the hypotheses.
- Logs contain a credential. Explain the immediate handling and instrumentation change.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 6](../../06_Day_Files_Errors_Debugging/README.md)
- [Original workshop 25](../../25_Day_Observability_Debugging/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
