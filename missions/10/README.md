# Mission 10: Specify what counts as done

Stage 2: Understand the problem and design the product

A small acceptance matrix covering normal, boundary and failure cases.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The confirmation prototype looks finished. Before connecting real data, define the observable results so tests do not merely repeat whatever the implementation happens to do.

## Understand the concepts

### Acceptance criteria and examples

An acceptance criterion names a required behaviour. A concrete example gives a starting state, action and expected observation. Write the expectation before implementation so it can reveal the wrong behaviour.

**Example:** Given an unconfirmed visit, saving confirmed access changes only that visit and displays its identifier.

**Common wrong idea:** A test passes, therefore the requirement must be correct.

### Boundaries and negative cases

Boundary cases sit at the edge of a rule. Negative cases try an action that should be refused or fail. Include what must remain unchanged after failure, not just which error appears.

**Example:** Submitting an empty appointment ID must not update any record.

**Common wrong idea:** One successful example covers every meaningful situation.

## Predict, change, observe

Choose the evidence proposed for 'only the chosen visit changes'.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Success toast:** Insufficient: a message does not establish which records changed. Check the saved record and another record that must remain unchanged.
- **Before/after records:** Relevant evidence if identity and environment are correct. The observation directly concerns the required state change.
- **AI says all good:** A claim awaiting reproducible evidence. Ask what was run, on which data, and what was observed.

Flow: Requirement (Agreed brief) → Given / action / expected (Acceptance matrix) → Observed evidence (Actual product)

## Worked example

**before:** Done means the Confirm button works.

**action:** Specify valid, missing-ID and duplicate-submit cases with expected stored state.

**after:** The checks can expose a success message attached to the wrong record.

**lesson:** A useful check can fail for a real defect. A suite unable to fail may be testing a convenient story.

Authored example; your project requires its own observations.

## Project: The definition-of-done matrix

Write and trial acceptance cases for the planned stored confirmation workflow before implementing it further.

1. Choose three important behaviours from the brief and define starting states and actions.
2. Write normal, boundary and failure expectations with unchanged-state requirements.
3. Ask AI to challenge missing cases and trial them against the prototype, labelling unavailable backend checks as not yet run.

## Outcome checks

- [ ] The matrix distinguishes expected results from observations and unrun checks.
- [ ] It includes a normal, boundary and failure case with specific record identities.
- [ ] At least one deliberate prototype defect or missing behaviour is identified by a check.

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

- **explain:** Explain why expectations should come from requirements.
- **locate:** Show one check that concerns state and one that concerns the interface.
- **predict:** What would your matrix show if the wrong visit were updated?
- **compare:** Compare a screen assertion with checking stored state; what can each miss?
- **challenge:** AI says 100% test coverage proves there are no defects. Explain the limit and propose a missing scenario.

## Reviewer guidance

Supply a defect that preserves the toast but changes the wrong record. Ask which evidence would expose it.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- A confirmation arrives twice. Add the expected behaviour.
- The write fails after the form says Done. Revise the success condition.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 12](../../12_Day_Testing_Clean_Code/README.md)
- [Original workshop 22](../../22_Day_Evals/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
