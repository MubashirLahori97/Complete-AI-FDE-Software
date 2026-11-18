# Core mission implementation and reuse map

The six-stage core is implemented at `#/mission/1` through `#/mission/30`. Original workshops remain at `#/lesson/1` through `#/lesson/30`; Amina remains optional. Old completions do not complete new missions.

## Mapping and added teaching

| Mission | Shared foundation | Reused workshop material | Added concept / assessment depth |
| --- | --- | --- | --- |
| [1. Make a useful website](missions/01/README.md) | product, stack, execution, interfaces | 1, 13, 14 | Outcome and implementation; Browser and technology stack; five reasoning actions and two practice variations |
| [2. Turn preferences into clear direction](missions/02/README.md) | product, collaboration, quality | 16, 26 | Constraints and acceptance; Iteration and feedback; five reasoning actions and two practice variations |
| [3. Understand what a page does](missions/03/README.md) | interfaces, stack, execution | 13 | Structure, presentation and behaviour; Components and dependencies; five reasoning actions and two practice variations |
| [4. Make an interaction work](missions/04/README.md) | logic, interfaces, quality | 2, 3, 4 | Input, types and conditions; Functions and state; five reasoning actions and two practice variations |
| [5. Learn through experiments](missions/05/README.md) | logic, data, architecture | 3, 4, 5 | Collections and loops; Abstraction and numeric precision; five reasoning actions and two practice variations |
| [6. Investigate a workflow](missions/06/README.md) | product, evidence, collaboration | 26 | Discovery and domain knowledge; Observation and provenance; five reasoning actions and two practice variations |
| [7. Define a worthwhile result](missions/07/README.md) | product, evidence, collaboration | 7, 22, 26 | Outcomes, baselines and denominators; Scope and priorities; five reasoning actions and two practice variations |
| [8. Design the user journey](missions/08/README.md) | interfaces, product, quality | 13, 26 | Journeys, errors and feedback; Responsive and accessible interaction; five reasoning actions and two practice variations |
| [9. Compare proposed approaches](missions/09/README.md) | product, architecture, stack, evidence | 10, 26, 28 | Buy, configure, integrate or build; Boundaries and total cost; five reasoning actions and two practice variations |
| [10. Specify what counts as done](missions/10/README.md) | quality, logic, product | 12, 22 | Acceptance criteria and examples; Boundaries and negative cases; five reasoning actions and two practice variations |
| [11. Follow an action through the system](missions/11/README.md) | networks, execution, stack, architecture | 9, 10, 24 | Client, server and HTTP contract; Asynchronous work and failure; Files, processes and runtimes; five reasoning actions and two practice variations |
| [12. Keep meaningful information](missions/12/README.md) | data, evidence, execution | 5, 6, 24 | Persistence, identifiers and relationships; Queries, SQL and provenance; five reasoning actions and two practice variations |
| [13. Protect correct state](missions/13/README.md) | data, logic, architecture, quality | 12, 24 | Validation and transactions; Concurrency and idempotency; five reasoning actions and two practice variations |
| [14. Give people the right access](missions/14/README.md) | security, data, networks | 23, 24 | Authentication and sessions; Authorization and trust boundaries; five reasoning actions and two practice variations |
| [15. Connect another service](missions/15/README.md) | networks, security, stack, architecture | 9, 10, 17, 23 | Contracts, configuration and secrets; Dependencies and safe failure; five reasoning actions and two practice variations |
| [16. Give an agent a complete task](missions/16/README.md) | agents, collaboration, quality | 16, 20, 28 | Goals, context and decomposition; Authority, budgets and stopping; five reasoning actions and two practice variations |
| [17. Coordinate dependent work](missions/17/README.md) | agents, architecture, collaboration | 4, 8, 17, 28 | Interfaces, ownership and dependencies; Coordination cost and integration; five reasoning actions and two practice variations |
| [18. Add an AI product capability](missions/18/README.md) | ai, security, evaluation | 15, 16, 17, 23 | Training, inference, tokens and context; Uncertainty and structured output; five reasoning actions and two practice variations |
| [19. Connect AI to knowledge and actions](missions/19/README.md) | ai, agents, security, data | 17, 18, 19, 20, 21 | Embeddings, retrieval and grounding; Tools, permissions and untrusted content; five reasoning actions and two practice variations |
| [20. Compare and improve approaches](missions/20/README.md) | evaluation, evidence, ai, product | 15, 18, 22, 23 | Baselines, samples and held-out cases; Base rates, precision, recall and cost; five reasoning actions and two practice variations |
| [21. Ask AI to produce useful checks](missions/21/README.md) | quality, evidence, logic | 12, 22 | Unit, integration and end-to-end checks; Regression and coverage limits; five reasoning actions and two practice variations |
| [22. Release with a way back](missions/22/README.md) | operations, execution, stack, collaboration | 8, 10, 14, 29, 30 | Version history, builds and environments; CI/CD, rollback and state; five reasoning actions and two practice variations |
| [23. Diagnose from evidence](missions/23/README.md) | operations, evidence, architecture | 6, 25 | Logs, metrics and traces; Hypotheses and falsification; five reasoning actions and two practice variations |
| [24. Manage growing use and cost](missions/24/README.md) | architecture, data, evaluation, product | 5, 18, 23, 24, 25 | Latency, throughput and algorithmic cost; Caching, queues and consistency; five reasoning actions and two practice variations |
| [25. Change the system without losing trust](missions/25/README.md) | data, operations, security, stack | 6, 8, 10, 24, 29 | Migrations, backups and restoration; Compatibility, privacy and retention; five reasoning actions and two practice variations |
| [26. Start an independent domain project](missions/26/README.md) | product, evidence, collaboration, security | 26, 28 | Domain constraints and incentives; Success agreement and uncertainty; five reasoning actions and two practice variations |
| [27. Deliver through AI](missions/27/README.md) | agents, stack, architecture, quality, collaboration | 14, 21, 24, 28, 29 | Architecture as responsibilities and tradeoffs; Evidence-linked delivery; five reasoning actions and two practice variations |
| [28. Respond to reality](missions/28/README.md) | product, evidence, collaboration, operations | 7, 26, 29, 30 | Adoption, training and downstream effects; Feedback, maintenance and causal limits; five reasoning actions and two practice variations |
| [29. Transfer the work and adapt](missions/29/README.md) | collaboration, operations, stack, product | 10, 25, 27, 29, 30 | Handoff, ownership and runbooks; Portability and conceptual transfer; five reasoning actions and two practice variations |
| [30. Demonstrate professional capability](missions/30/README.md) | collaboration, evidence, product, agents, quality, stack | 26, 27, 28, 29, 30 | Demonstration and fresh-scenario reasoning; Capability, uncertainty and adaptation; five reasoning actions and two practice variations |

## Foundation coverage

- **agents:** missions 16, 17, 19, 27, 30
- **ai:** missions 18, 19, 20
- **architecture:** missions 5, 9, 11, 13, 15, 17, 23, 24, 27
- **collaboration:** missions 2, 6, 7, 16, 17, 22, 26, 27, 28, 29, 30
- **data:** missions 5, 12, 13, 14, 19, 24, 25
- **evaluation:** missions 18, 20, 24
- **evidence:** missions 6, 7, 9, 12, 20, 21, 23, 26, 28, 30
- **execution:** missions 1, 3, 11, 12, 22
- **interfaces:** missions 1, 3, 4, 8
- **logic:** missions 4, 5, 10, 13, 21
- **networks:** missions 11, 14, 15
- **operations:** missions 22, 23, 25, 28, 29
- **product:** missions 1, 2, 6, 7, 8, 9, 10, 20, 24, 26, 28, 29, 30
- **quality:** missions 2, 4, 8, 10, 13, 16, 21, 27, 30
- **security:** missions 14, 15, 18, 19, 25, 26
- **stack:** missions 1, 3, 9, 11, 15, 22, 25, 27, 29, 30

## Remaining work that cannot be claimed from authored content

The thirty mission experiences, project kits, system-explanation records and reviewer prompts are implemented. The first five kits include a runnable static worked example; later kits contain complete briefs, evidence sheets and optional source-workshop links. They are not prebuilt independent customer solutions. Learners and their available AI build and verify those projects.

Beginner pilots, delayed concept-transfer measurements, practitioner calibration with comparable tools, real business outcomes and future 2028/2029 tool compatibility remain unmeasured. No pacing estimate, employment equivalence or graduate outcome is established by implementation or passing app tests. Source research separates observations, forecasts and curriculum scenarios.

Generated from `web/src/missions.json` by `web/scripts/pack-missions.mjs`.
