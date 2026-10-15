# Mission 17: Coordinate dependent work

Stage 4: Direct AI work at greater scale

A coordinated change with a clear interface contract and integration evidence.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

A UI change and an API change can be worked on separately, but incompatible assumptions will break the whole journey. More agents also create coordination cost.

## Understand the concepts

### Interfaces, ownership and dependencies

An interface is an agreement between parts. Ownership identifies who changes and accepts each part. A dependency determines what must be ready first. Parallel work helps when responsibilities are separable and contracts are clear.

**Example:** The API returns accessStatus; the UI must agree on its name and allowed values.

**Common wrong idea:** Two completed tasks automatically make one working feature.

### Coordination cost and integration

Coordination includes sharing context, resolving conflicts, reviewing assumptions and checking the assembled result. AI can manage this work too. Choose one agent or several according to the task, not to make the process look advanced.

**Example:** One agent is simpler for a small label change; separate UI and API work may fit a larger bounded feature.

**Common wrong idea:** Agent count is evidence of delivery skill.

## Predict, change, observe

Change the field agreement between two prepared workstreams.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Both use accessStatus:** The parts can exchange the expected field; integration still needs checking. Agreement is necessary but not sufficient for a working feature.
- **UI expects status:** The UI receives a different field and cannot reliably display access. Both parts can pass isolated checks while the contract is broken.
- **One small task, one agent:** No cross-agent handoff needed; check the complete result directly. Avoid coordination work that adds no useful separation.

Flow: Shared contract (Task / interface record) → Owned workstreams (One or several AI workers) → Integrated journey (Assembled product)

## Worked example

**before:** Two agents implement different meanings of confirmed.

**action:** Agree on the field, allowed values, ownership and a shared example before parallel work.

**after:** Run the same example through the assembled UI and API.

**lesson:** A coordinating agent can help, but a shared mistaken requirement can survive every agent's review.

Authored example; your project requires its own observations.

## Project: A change whose parts agree

Deliver a change touching the interface and service. Use one or multiple agents as useful, with an explicit contract and an end-to-end observation.

1. Draw the dependencies and choose a coordination approach with a reason.
2. Define the interface using one normal and one failure example; delegate owned work.
3. Integrate, investigate disagreement and rerun the actual journey rather than only isolated tests.

## Outcome checks

- [ ] The interface contract names fields, allowed values and error meaning.
- [ ] Ownership and sequencing are clear, including the decision about agent count.
- [ ] A real integration observation covers both the normal path and a contract failure.

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

- **explain:** Explain a dependency, interface and coordination cost in your change.
- **locate:** Find where each component produces or consumes the shared contract.
- **predict:** What if the API adds a new status the UI does not recognize?
- **compare:** Compare one worker with parallel workstreams for this task.
- **challenge:** AI says all unit tests passing proves integration works. Identify a gap and a check.

## Reviewer guidance

Introduce a conflicting field or meaning and ask the learner to trace the consequence across parts.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- A response field is renamed in one component only. Diagnose the boundary.
- The change becomes tiny after discovery. Reconsider parallel work.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 4](../../04_Day_Functions/README.md)
- [Original workshop 8](../../08_Day_Git_GitHub/README.md)
- [Original workshop 17](../../17_Day_Structured_Outputs_Tools/README.md)
- [Original workshop 28](../../28_Day_Capstone_Part1/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
