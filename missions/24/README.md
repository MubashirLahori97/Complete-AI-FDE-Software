# Mission 24: Manage growing use and cost

Stage 5: Establish quality and keep the product working

A measured bottleneck improvement with cost and correctness limits.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The system feels slow as appointments grow. Caching, indexing and queues solve different problems and introduce tradeoffs. Measure before choosing.

## Understand the concepts

### Latency, throughput and algorithmic cost

Latency is time per operation; throughput is completed work per time. A data structure organizes information and affects available operations. Algorithmic cost describes how work grows with input size. An index can speed a query while adding storage and write cost.

**Example:** Scanning every visit grows differently from a suitable indexed lookup.

**Common wrong idea:** A faster one-user response proves the system handles more simultaneous users.

### Caching, queues and consistency

A cache reuses a result and can become stale. A queue defers work and needs failure and retry rules. Consistency concerns when different observations agree. Choose freshness and delay according to the business task, not just a benchmark.

**Example:** A cached policy may tolerate a refresh delay; a last-slot reservation needs a protected current decision.

**Common wrong idea:** Caching every response preserves correct behaviour automatically.

## Predict, change, observe

Change the prepared design for repeated policy reads.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Always fetch current:** Freshness follows the source; each read pays the source latency and cost. This favours current information over reuse.
- **Cache for 10 minutes:** Repeated reads may be faster but can show a policy up to the freshness limit out of date. Invalidation and an accepted freshness policy are part of the design.
- **Queue the read:** Work is deferred; this alone does not make an interactive answer faster. Queues fit suitable background tasks, not every delay.

Flow: Representative workload (Controlled measurement) → Chosen intervention (Query / cache / queue boundary) → Measure result + tradeoff (Quality and cost report)

## Worked example

**before:** A broad scan gets slower as the visit table grows.

**action:** Measure representative queries, ask AI to propose an index, and compare the same workload afterwards.

**after:** Report read improvement, write/storage effects and limitations of the test load.

**lesson:** Synthetic measurements establish behaviour under the stated test conditions, not unlimited production capacity.

Authored example; your project requires its own observations.

## Project: One measured performance improvement

Identify one actual bottleneck in the growing workflow, compare an appropriate improvement and report correctness, cost and measurement limits.

1. Choose work that resembles real use. Decide how to measure waiting time and work completed, and state what must remain correct.
2. Ask AI to measure the current system and suggest one suitable change. Options might include faster data lookup, a saved copy called a cache, or a queue for work that can wait.
3. Repeat the same workload and user task. Record any improvement and resource cost, plus effects on old data or repeated requests.

## Outcome checks

- [ ] Before and after measurements use comparable data, workload and environment.
- [ ] The change improves the chosen measure or is honestly rejected from the results.
- [ ] Correctness, freshness or retry behaviour remains acceptable and added cost is recorded.

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

- **explain:** Explain latency, throughput, workload growth and the selected mechanism.
- **locate:** Find the measured bottleneck and actual boundary changed.
- **predict:** What changes as record count or concurrent demand increases?
- **compare:** Compare two plausible interventions with cost and consistency tradeoffs.
- **challenge:** AI says a 10-minute cache always gives current availability. Show the counterexample and a suitable policy.

## Reviewer guidance

Change load or freshness needs; ask the learner to revisit the design rather than recite a speed figure.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The cached data now determines the last available slot. Reconsider correctness.
- The queue receives work faster than it can finish. Predict backlog and recovery needs.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 5](../../05_Day_Lists_Dictionaries/README.md)
- [Original workshop 18](../../18_Day_Embeddings_Semantic_Search/README.md)
- [Original workshop 23](../../23_Day_Guardrails_Cost/README.md)
- [Original workshop 24](../../24_Day_FastAPI_Databases/README.md)
- [Original workshop 25](../../25_Day_Observability_Debugging/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
