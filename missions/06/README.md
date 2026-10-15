# Mission 6: Investigate a workflow

Stage 2: Understand the problem and design the product

An evidence-labelled workflow map and one unresolved question.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The service owner asks for an AI booking app. Before agreeing, discover how requests actually become appointments. The missing step may be checking equipment or contacting a customer, not generating a new screen.

## Understand the concepts

### Discovery and domain knowledge

Discovery investigates what people do, why, and under which constraints. Domain knowledge is understanding the actual work: a technician may need equipment, access permission or travel time. A requested feature is a possible solution, not a complete statement of the problem.

**Example:** Watch how a request moves from a phone call to a technician's schedule.

**Common wrong idea:** An AI-generated interview is evidence that a customer said something.

### Observation and provenance

Provenance records where information came from. Separate direct observations, reported experiences, assumptions and fictional scenarios. Missing information should become a question instead of an invented fact.

**Example:** 'Owner reported three missed visits' differs from a checked count in appointment records.

**Common wrong idea:** A confident summary makes uncertain source information certain.

## Predict, change, observe

Choose the source behind the claim 'appointments are often missed'.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **AI invented example:** Useful practice scenario; no evidence about this business. Generated plausibility is not an observation.
- **Owner's recollection:** Reported experience; ask for dates and examples. A recollection is valuable context with possible selection and memory limits.
- **Checked visit records:** Observed records, subject to missing entries and definitions. Inspect what missed means and how the records were produced.

Flow: Incoming request (Customer / existing channel) → Eligibility and scheduling (Staff workflow) → Visit and follow-up (Technician + customer)

## Worked example

**before:** The brief says Build an AI scheduler.

**action:** Ask how yesterday's appointment was arranged, where it stalled, and what staff did next.

**after:** The map shows that site-access confirmation is missing before dispatch.

**lesson:** AI can prepare, conduct or analyse research when appropriately authorized. Label who or what supplied the evidence.

Authored example; your project requires its own observations.

## Project: The workflow before the app

Investigate an authorized repair or maintenance workflow, or use a clearly labelled fictional scenario. Map current steps, people, information, delays and incentives.

1. Choose a domain and an evidence source. Ask AI to help prepare questions about recent behaviour.
2. Collect or label the scenario evidence. Draw the current workflow and identify a missing requirement.
3. Check the interpretation with a participant if available; otherwise record what remains an assumption.

## Outcome checks

- [ ] Each important claim has an identifiable source or is labelled as an assumption/scenario.
- [ ] The map includes an actual constraint and a handoff between people or systems.
- [ ] The brief records a missing requirement, an unresolved question and how to investigate it.

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

- **explain:** Explain why the requested feature may differ from the underlying problem.
- **locate:** Find a handoff and the source supporting it in your map.
- **predict:** What happens if access approval arrives after a technician is dispatched?
- **compare:** Compare observing a recent task with asking whether someone likes a proposed app.
- **challenge:** AI claims five fictional interviews prove demand. Explain what they establish and what evidence is still needed.

## Reviewer guidance

Ask which map details are observed, reported or assumed. Introduce a domain constraint and check the learner can revise the map.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- Technicians can only accept jobs for equipment they are trained on. Revise the workflow.
- The owner and receptionist disagree about the biggest delay. Plan an investigation.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 26](../../26_Day_Client_Discovery_FDE/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
