# Mission 13: Protect correct state

Stage 3: Understand how the complete system works

Validated updates with a demonstrated duplicate and concurrency policy.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

Two staff members reserve the last appointment slot. A slow connection also makes one person press Save twice. Correct state must survive both situations.

## Understand the concepts

### Validation and transactions

Validation checks a value against rules. A transaction groups related storage changes so they commit together or roll back together. Checking availability and later writing without a suitable atomic rule can let two requests claim the same slot.

**Example:** Reserve the slot and create its visit together, or leave both unchanged.

**Common wrong idea:** A browser check prevents conflicting writes from other clients.

### Concurrency and idempotency

Concurrent operations overlap. Idempotency makes repeating the same intended operation avoid repeating its effect. A request key can identify a retry; it needs a policy for different data under the same key. Idempotency is not permission to skip validation or authorization.

**Example:** Retrying confirmation K17 returns its original result rather than creating a second visit.

**Common wrong idea:** Disabling the Save button is sufficient duplicate protection.

## Predict, change, observe

Two prepared requests compete for one available slot.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Separate check then write:** Both may observe availability and create conflicting reservations. The gap between checking and writing permits a race.
- **Atomic reservation rule:** One reservation succeeds; the conflicting request gets a clear refusal. A suitable transaction or constraint protects the shared invariant.
- **Retry same request key:** Return the original result without a second reservation. A valid retry should not multiply the business effect.

Flow: Validate request + identity (Server boundary) → Atomic storage rule (Database transaction / constraint) → Stable retry result (Server response)

## Worked example

**before:** Two requests both see one free slot and both save.

**action:** Ask AI to enforce the invariant at the storage boundary and supply a concurrent-request check.

**after:** One wins; the other receives a conflict. Repeating the winner's request preserves one reservation.

**lesson:** A sequential happy-path check cannot establish concurrency behaviour.

Authored example; your project requires its own observations.

## Project: One slot, one reservation

Protect the stored appointment workflow against invalid requests, repeated submissions and competing reservations.

1. Define the invariant and duplicate policy with concrete examples.
2. Delegate implementation to AI, including atomic changes, constraints and retry identity.
3. Run invalid, repeated and overlapping-request checks; inspect final stored state as well as responses.

## Outcome checks

- [ ] An invalid request leaves the required stored state unchanged.
- [ ] Repeating the same request produces one business effect.
- [ ] Overlapping requests cannot both reserve the same exclusive slot; actual observations are recorded.

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

- **explain:** Explain the invariant, transaction, race and retry policy.
- **locate:** Find where the shared-state rule is enforced in the actual system.
- **predict:** What if two valid requests arrive before either finishes?
- **compare:** Compare UI disabling, server validation and a storage constraint.
- **challenge:** AI says one successful reservation test proves concurrent safety. Design evidence that could expose a race.

## Reviewer guidance

Introduce a reused request key with changed data. Ask the learner to explain an appropriate response.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- A retry uses the same key but a different slot. Define the response.
- The second half of a two-part write fails. Explain required stored state.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 12](../../12_Day_Testing_Clean_Code/README.md)
- [Original workshop 24](../../24_Day_FastAPI_Databases/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
