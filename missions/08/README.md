# Mission 8: Design the user journey

Stage 2: Understand the problem and design the product

An accessible prototype with a tested normal path and a recoverable error path.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

A receptionist needs to confirm access on a phone while answering calls. A journey designed only for a large screen and a perfect submission will fail in ordinary use.

## Understand the concepts

### Journeys, errors and feedback

A journey is the sequence from a person's intent to a useful result. Include loading, empty, error and success states. Feedback should say what happened and what to do next; preserving entered information makes recovery easier.

**Example:** A failed confirmation keeps the appointment details and offers a retry.

**Common wrong idea:** A success message proves information reached its destination.

### Responsive and accessible interaction

Responsive layout adapts to available space. Accessibility lets people perceive and operate the interface through different input and assistive methods. Labels, focus order and meaningful errors are part of behaviour, not decoration.

**Example:** A keyboard user reaches the labelled confirmation control and understands its result.

**Common wrong idea:** Smaller fonts alone make a desktop form mobile-friendly.

## Predict, change, observe

Change the submission situation in this prototype model.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Normal submission:** Confirmation is shown for the correct appointment. The feedback identifies what changed, not just Done.
- **Missing required field:** A named field error appears and the other answers remain. The user needs a correction path without starting over.
- **Connection fails:** Show Not confirmed yet, keep the draft, and offer retry. A failed request must not produce a false success message.

Flow: Find appointment (Interface) → Confirm access (Form + validation) → Understand result (Success or recoverable error)

## Worked example

**before:** An error clears every field and says Something went wrong.

**action:** Ask AI to preserve input, identify the correction and manage focus to the error.

**after:** A person can recover without re-entering the appointment.

**lesson:** Watch a person attempt the task without coaching. If unavailable, label your own walkthrough and seek outside feedback later.

Authored example; your project requires its own observations.

## Project: A confirmation journey people can finish

Create a prototype for finding an appointment and confirming access, including errors and narrow-screen keyboard use.

1. Sketch the intent, steps and outcomes in plain language.
2. Let AI build or configure a prototype with normal and failure states.
3. Observe another person with permission, or label a scenario walkthrough. Improve one confusion and repeat the task.

## Outcome checks

- [ ] The normal journey reaches a clearly identified result.
- [ ] Missing input and a simulated connection failure preserve useful work and give a next action.
- [ ] Narrow-screen and keyboard observations are recorded, together with the source of user feedback.

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

- **explain:** Explain why error recovery is part of the journey.
- **locate:** Show the label, focus order and error message for one input.
- **predict:** What would a user believe if a failed request displayed Confirmed?
- **compare:** Compare a prototype with a working connected service. What does each establish?
- **challenge:** AI says its accessibility score proves every user can finish the task. What observations are still needed?

## Reviewer guidance

Ask the learner to complete the task by keyboard and explain a fresh error state before trying it.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The person uses a screen reader and cannot see a colour change. Improve the feedback.
- Long translated labels wrap on a small phone. Revise and check the journey.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 13](../../13_Day_First_Web_App/README.md)
- [Original workshop 26](../../26_Day_Client_Discovery_FDE/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
