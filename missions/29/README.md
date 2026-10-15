# Mission 29: Transfer the work and adapt

Stage 6: Deliver value and demonstrate ownership

A usable handoff and a demonstrated transfer to an unfamiliar tool or changed constraint.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

Another person must operate the product without relying on your memory. The current AI tool or provider may also become unsuitable. Preserve the useful outcome while changing how it is delivered.

## Understand the concepts

### Handoff, ownership and runbooks

A handoff transfers the knowledge, access and responsibility needed to operate the result. A runbook describes observable symptoms and appropriate actions. Name ownership, escalation and maintenance decisions. Documentation must match the current product and avoid embedding secrets.

**Example:** A new operator can start the service, verify a visit and follow recovery instructions.

**Common wrong idea:** A long README proves another person can run the product.

### Portability and conceptual transfer

Portability concerns moving data and behaviour across tools, services or environments. Conceptual transfer means applying a mental model in an unfamiliar setting. An adapter can isolate provider-specific details, but formats, policy and operational differences still need checks.

**Example:** Replace an AI provider while preserving the output contract and rerunning the same evaluation.

**Common wrong idea:** Changing a model name guarantees equivalent behaviour and cost.

## Predict, change, observe

Choose what the prepared handoff includes.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Source files only:** Setup, configuration, ownership and recovery may remain unknown. Implementation alone does not transfer operational knowledge.
- **Guide + fresh operator trial:** Observed confusion can reveal missing instructions and assumptions. The handoff is evaluated by someone completing the task.
- **Provider swapped, no checks:** Compatibility and quality remain unverified. A stable interface does not guarantee equivalent semantics or economics.

Flow: Current product + explanation (Known stack) → New operator or tool (Fresh environment / replacement) → Same required outcome (Rechecked journey + evidence)

## Worked example

**before:** Only the original builder knows the hidden configuration.

**action:** Ask AI to draft a current setup/runbook and have another person or a fresh-context assistant follow it, labelling which was used.

**after:** Fix missing steps and rerun the journey with a replacement component or unfamiliar environment.

**lesson:** A fresh-context AI trial is useful evidence about instructions; it is not evidence that a human operator adopted the product.

Authored example; your project requires its own observations.

## Project: A handoff that survives change

Transfer the independent solution to another operator and adapt one tool, provider or environment while preserving required outcomes.

1. Prepare a current diagram, setup guide, configuration names, cost/ownership notes, data export and recovery runbook.
2. Observe a new operator or labelled fresh-context trial and repair instruction gaps.
3. Use an unfamiliar or replacement tool for a meaningful component; rerun relevant contract, quality and user-journey checks.

## Outcome checks

- [ ] The handoff trial reaches the useful outcome from documented starting conditions.
- [ ] Ownership, configuration, cost, data handling and recovery instructions match the actual product without secrets.
- [ ] A replacement or unfamiliar tool preserves required behaviour with observed checks and documented differences.

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

- **explain:** Explain the operational knowledge transferred and the concept reused across tools.
- **locate:** Find the provider-specific boundary and an actual instruction corrected by the trial.
- **predict:** What might change in quality, latency or permissions after replacement?
- **compare:** Compare an adapter change with a full rebuild for your portability need.
- **challenge:** AI says identical schemas make two providers interchangeable. Which behaviours and costs need comparison?

## Reviewer guidance

Ask the learner to explain an unfamiliar tool through the same concepts and demonstrate a relevant handoff task.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The operator cannot access the original AI account. Revise the handoff.
- The replacement service has a different data-retention policy. Reassess suitability.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 10](../../10_Day_Environments_Packages/README.md)
- [Original workshop 25](../../25_Day_Observability_Debugging/README.md)
- [Original workshop 27](../../27_Day_Portfolio_Getting_Hired/README.md)
- [Original workshop 29](../../29_Day_Capstone_Part2/README.md)
- [Original workshop 30](../../30_Day_Ship_It/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
