# Mission 2: Turn preferences into clear direction

Stage 1: Build with AI and understand the result

An improved site with a small before-and-after record.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The site exists, but 'make it better' gives AI too little direction. A visitor cannot find the opening hours. Improve one observable task instead of changing everything at once.

## Understand the concepts

### Constraints and acceptance

A constraint limits a solution: available budget, screen size, language or permitted data. An acceptance criterion describes an observable result. Together they let an agent choose an implementation while preserving what matters.

**Example:** At phone width, opening hours appear under Services and the contact link remains usable.

**Common wrong idea:** Specific direction means prescribing every line of code. You can specify the result and let AI choose the details.

### Iteration and feedback

An iteration is a small change followed by observation. Name what confused the visitor, request a change, then repeat the same task. A visual preference is useful feedback, but it differs from evidence that a task became easier.

**Example:** Compare whether someone can find the hours before and after moving them.

**Common wrong idea:** More changes always mean more progress. A large rewrite can hide which change helped.

## Predict, change, observe

Choose the instruction you give the builder. These are prepared examples, not live AI responses.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Make it impressive:** Several visual changes; opening hours may still be hidden. No observable target or boundary was given.
- **Move hours below Services:** One targeted change with a clear place to check. The implementation can vary while the acceptance condition stays concrete.
- **Replace the whole site:** The original contact option may disappear along with the old layout. A broad change needs preservation criteria as well as a desired appearance.

Flow: Observe a task (Person + current site) → Give bounded direction (AI workspace) → Repeat the task (Actual site)

## Worked example

**before:** A user scrolls past the hours twice.

**action:** Ask AI to put Hours below Services on phones, preserve the contact destination, and show the changed result.

**after:** Repeat the same find-the-hours task and check the contact link.

**lesson:** Record observations, including when the change does not help. An AI report of success is a claim to check.

Authored example; your project requires its own observations.

## Project: One change a visitor can notice

Improve the mission-1 site using one observed confusion, two acceptance criteria and one preservation constraint.

1. Ask permission to watch someone try your page, or clearly label your own walkthrough as a practice scenario. Name one thing that confused the visitor.
2. Ask AI for one small change to address that confusion. Keep a working part of the page so you can compare before and after.
3. Repeat the same task and compare the two versions. Keep or revise the change based on what you observed.

## Outcome checks

- [ ] My request names an observable result and a constraint.
- [ ] The changed site satisfies both acceptance criteria I wrote before the change.
- [ ] The preserved behaviour still works and my before/after observations are recorded.

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

- **explain:** Explain a constraint and an acceptance criterion from your change.
- **locate:** Show the changed part and the behaviour you preserved.
- **predict:** If the site changes language and labels become longer, what might break?
- **compare:** Compare a targeted improvement with a redesign. When would each fit?
- **challenge:** AI says prettier colours prove visitors find the hours faster. What evidence is missing?

## Reviewer guidance

Change a constraint and ask the learner to revise their criteria, then inspect the result together.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The owner needs an Urdu version with longer labels. Revise your criteria.
- The proposed change looks better but hides the contact link. Decide what to do and explain why.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 16](../../16_Day_Prompt_Engineering/README.md)
- [Original workshop 26](../../26_Day_Client_Discovery_FDE/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
