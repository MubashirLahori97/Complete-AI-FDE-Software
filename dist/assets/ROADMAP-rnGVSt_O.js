const e=`# Concept Mastery and AI Delivery for Learners Starting in 2028 or 2029

FDE Academy should develop someone who understands software and AI deeply enough to direct capable AI systems and deliver useful results. AI can produce all implementation code. The learner's required foundation is conceptual understanding: what a system does, how its parts interact, why a choice fits the problem, and how to establish that the result works.

The course starts with useful building from the first lesson. Concepts develop through that work, with a complete shared foundation across software, AI, delivery, and business. A learner can graduate without writing code manually when they demonstrate the concepts and successfully direct, evaluate, and improve the resulting product.

**Implementation status:** the application now implements the accepted six-stage, thirty-mission sequence, concept teaching, interactive scenarios, AI-directed projects, system explanations and separate understanding-review records. See [the mission course](MISSION-COURSE.md) and [reuse map](MISSION-MAP.md). Beginner pilots, delayed transfer measurements, pacing and practitioner calibration remain unmeasured. Authored assessments and passing UI checks do not establish learner mastery.

The [2030 research and scenario analysis](RESEARCH-2030.md), reviewed on 15 October 2026, extends this direction beyond software generation. It examines strong automation, uneven adoption, learning, employment, infrastructure, and trust, and maps the evidence to course requirements.

## The future we are designing for

Use a strong-AI scenario for 2028–2029: assume agents can generate applications, suggest architecture, write tests, diagnose failures, and perform much of deployment and maintenance. Let them do that work. Teach learners to use improvements as they arrive, including improvements in planning and verification.

Do not define the human role by a permanent list of things AI cannot do. Develop the ability to establish a worthwhile outcome, supply relevant context, set constraints and authority, obtain evidence, coordinate with people, and take responsibility for delivery. AI can assist with all these activities too.

Current evidence supports taking extensive delegation seriously. Anthropic's 2025 study of coding interactions found substantial task automation, while explicitly noting that its interaction data did not establish final code quality or productivity. See [AI's impact on software development](https://www.anthropic.com/research/impact-software-development).

METR measures agents' success on software tasks of different human completion durations, with task and reliability limitations. These measurements do not establish exactly what a 2028 system will do. See [task-completion time horizons](https://metr.org/time-horizons/). Stronger AI is the design scenario here, rather than a guaranteed forecast.

## The learning contract

Three capabilities belong together throughout the course:

1. **Understand the concepts.** Build a mental model of what is happening and why. Explain it, predict behaviour, and reason about a changed situation.
2. **Direct capable AI.** Give it the outcome, context, constraints, and freedom appropriate to the task. Use it for research, design, implementation, testing, diagnosis, and improvement.
3. **Deliver useful results.** Demonstrate the relevant user journey, establish appropriate quality, respond to feedback, and operate or hand over the result.

Manual code production, memorized syntax, line-by-line explanations, and interviews conducted without AI are not core graduation requirements. Optional implementation exercises can deepen understanding or prepare someone for a particular employer. The compulsory standard is conceptual mastery demonstrated through successful work.

Using AI does not excuse a missing mental model. Repeating an AI explanation is insufficient if the learner cannot apply it when a condition changes.

## Required understanding of every project

Every learner must understand what they are going to build, what they are currently building, which technologies it uses, and how it works. This understanding is required at every stage and at graduation, even when AI produces all implementation.

Each project includes a short **system explanation**, written or spoken in the learner's own words, with a diagram where useful:

1. **Purpose and behaviour:** who the product serves, the problem it solves, its main features, and what success means.
2. **Actual technology stack:** the tools, languages, runtimes, frameworks, libraries, data stores, AI services, and hosting used in this project; what each does and how they fit together. Identify these from the working project and its configuration, with AI assistance where useful.
3. **Where and how it runs:** which work happens in the browser, on a server, on the learner's device, or in an external service; how the product starts, builds, and reaches users; and which configuration and dependencies it needs.
4. **How information moves:** trace a relevant user action through the actual components to its result. Explain the logic, data, temporary state, persistent storage, permissions, and AI involvement along that path.
5. **Why the technologies were chosen:** explain their relevant capabilities, a reasonable alternative, and the consequences for the project's usability, cost, reliability, security, and ability to change.
6. **What changes and failures mean:** predict the effect of a requested change or a failed component, explain how to investigate it with AI, and identify evidence that the required behaviour works.

Match the explanation to the system that actually exists. A simple static site needs an accurate account of its page, assets, browser behaviour, and hosting. A later application adds the relevant backend, database, permissions, integrations, and AI concepts. Increase depth as those components appear, and update the explanation after meaningful changes.

Reviewers check this understanding using a walkthrough and fresh follow-up questions. A working product and a generated explanation alone do not establish a pass. The learner must apply the concepts to their own system and reason about a changed situation. Gaps require further teaching and another demonstration before the stage is complete. Manual code writing remains optional.

## The shared concept foundation

Every learner encounters the following concepts. Each is introduced with a plain-language explanation, diagram or interactive experiment, concrete example, misconception, and an opportunity to apply it. Specialist depth grows from the target role and project.

| Concept area | Required understanding | Evidence of understanding |
| --- | --- | --- |
| Computation and program logic | Instructions, data types, variables, conditions, loops, functions, abstraction, modules, state, numeric precision | Predict behaviour in a small running example; explain why changing a rule changes the result |
| Technology stack and ecosystem | Tools, languages, runtimes, frameworks, libraries, services, configuration, versions, compatibility, hosting, and the role of each | Identify the project's actual technologies, explain how they work together, and justify the important choices |
| How software runs | Files, memory, processes, interpreters and compilers, dependencies, environments, configuration, sequential and concurrent execution | Explain why a working local product might fail elsewhere and direct an appropriate investigation |
| Data and persistence | Models, relationships, identifiers, constraints, SQL and queries, transactions, indexes, migrations, backups | Describe where an order is stored, how duplicates are prevented, and how data survives a change |
| Networks and integration | Clients and servers, DNS, HTTP, TLS, requests, responses, APIs, contracts, asynchronous work, timeouts | Trace an action across services and predict what happens when a dependency fails |
| Interfaces and interaction | HTML structure, CSS presentation, JavaScript behaviour, components, browser state, forms, responsive layout, accessibility | Explain a user journey and direct improvements that a user can demonstrate |
| Identity and protection | Authentication, authorization, permissions, trust boundaries, secrets, encryption, validation, injection, privacy | Explain who can do what; demonstrate that one user cannot access another user's private information |
| Quality and evidence | Acceptance criteria, unit and integration tests, end-to-end tests, regression, test data, coverage limits, independent observations | Define the expected behaviour before a test runs and explain what a passing result does and does not establish |
| Delivery and operations | Version history, changes, review, builds, deployment, environments, CI/CD, logs, metrics, traces, rollback, restoration | Explain a release and direct recovery from a failed change using observable evidence |
| Architecture and efficiency | Boundaries, dependencies, coupling, modularity, data structures, algorithmic cost, latency, throughput, caching, queues, retries, idempotency, consistency | Compare plausible designs and predict a consequence when workload or constraints change |
| AI foundations | Training and inference, tokens, prediction, uncertainty, context, knowledge limits, embeddings, retrieval, grounding, structured output, fine-tuning | Explain why a confident model answer can be wrong and choose an appropriate source or mechanism |
| Agents and AI coordination | Tools, permissions, task decomposition, context and memory, dependencies, delegation, stopping, budgets, review | Give an agent a bounded job, explain its authority, and detect a result outside the requested scope |
| AI evaluation | Baselines, datasets, representative cases, held-out cases, error types, success rates, precision and recall where relevant, latency and cost | Compare alternatives on the same task and interpret failures rather than rely on a persuasive demo |
| Evidence and quantitative judgement | Data provenance, missing information, probability, base rates, sampling, uncertainty, correlation and causation | Identify a misleading result and explain what an observation does and does not establish |
| Product and business | Domain knowledge, users, workflows, incentives, discovery, requirements, scope, outcomes, costs, pricing, adoption, distribution, maintenance | Compare buying, configuring, integrating, and building; explain why people use the chosen solution and how benefit is measured |
| Collaboration and adaptation | Communication, ownership, review, handoffs, tradeoffs, documentation, changing tools and requirements | Explain a decision to another person, incorporate feedback, and transfer the concept to an unfamiliar tool |

Teach the concepts at increasing depth. For example, introduce a database as persistent shared information; later use orders to explain relationships and transactions, and a failed release to explain migrations and restoration. The learner revisits the same mental model under more demanding conditions.

Code can be shown, generated, run, visualized, and explored whenever it makes a concept clearer. Reading or editing it is one learning method, rather than the universal proof of understanding.

## Six stages with thirty missions

Keep the familiar thirty-mission structure, with several study sessions available per mission. Use a coherent product that grows from a website into a useful business workflow. Each mission assesses concepts as well as an observable result.

### Stage 1 Build with AI and understand the result

| Mission | Concepts | Learner outcome |
| --- | --- | --- |
| 1. Make a useful website | Outcome, instructions, implementation, browser, chosen tools | Direct AI to produce a site and explain its purpose, actual technologies, and major parts |
| 2. Turn preferences into clear direction | Constraints, examples, iteration, acceptance | Improve the site using specific feedback and observable criteria |
| 3. Understand what a page does | Structure, presentation, behaviour, components, languages and frameworks | Explain the layers and technologies used, their roles, and the effect of a requested change |
| 4. Make an interaction work | Input, types, conditions, functions, state | Direct a form or calculator and predict normal and invalid-input behaviour |
| 5. Learn through experiments | Loops, collections, abstraction, cause and effect | Use generated experiments to explain a repeated task and a reusable rule |

**Stage evidence:** a useful site plus concept demonstrations. AI may produce every line.

### Stage 2 Understand the problem and design the product

| Mission | Concepts | Learner outcome |
| --- | --- | --- |
| 6. Investigate a workflow | Users, discovery, existing process | Establish the problem using observations or a clearly labelled scenario |
| 7. Define a worthwhile result | Outcomes, baselines, scope, priorities | Write a short brief with a measurable success condition |
| 8. Design the user journey | Flows, errors, accessibility, responsive design | Test a prototype with another person and improve a confusing step |
| 9. Compare proposed approaches | Existing products, configuration, integration, boundaries, tradeoffs, cost | Compare alternatives with AI and defend what to buy, configure, integrate, or build |
| 10. Specify what counts as done | Acceptance criteria, examples, edge cases | Define observable checks before further implementation |

**Stage evidence:** a product brief and prototype the learner can explain and revise when a requirement changes.

### Stage 3 Understand how the complete system works

| Mission | Concepts | Learner outcome |
| --- | --- | --- |
| 11. Follow an action through the system | Client, server, HTTP, APIs, asynchronous work, data flow | Trace a user action through the actual components, explain where each runs, and investigate a failed response with AI |
| 12. Keep meaningful information | Data provenance, missing information, models, identifiers, persistence, relationships | Direct a stored workflow, explain how records connect, and investigate questionable source data |
| 13. Protect correct state | Validation, transactions, duplicates, concurrency | Demonstrate what happens when a request is invalid or repeated |
| 14. Give people the right access | Identity, sessions, authorization, trust boundaries | Demonstrate permitted and forbidden actions using separate users |
| 15. Connect another service | Contracts, dependencies, configuration, secrets, failure | Direct an integration and show what happens when its dependency is unavailable |

**Stage evidence:** a working application, an accurate system diagram, and explanations of its data, permissions, and relevant failures.

### Stage 4 Direct AI work at greater scale

| Mission | Concepts | Learner outcome |
| --- | --- | --- |
| 16. Give an agent a complete task | Context, constraints, authority, task decomposition | Delegate a meaningful change without prescribing every implementation step |
| 17. Coordinate dependent work | Interfaces, ownership, sequencing, coordination cost | Manage several workstreams when useful, or explain why one agent is sufficient |
| 18. Add an AI product capability | Inference, context, uncertainty, structured outputs | Direct an AI feature and explain its possible failure modes |
| 19. Connect AI to knowledge and actions | Retrieval, embeddings, grounding, tools, permissions | Choose suitable access to information or tools for the product |
| 20. Compare and improve approaches | Baselines, representative cases, probability, base rates, false positives, quality, latency, cost | Compare alternatives, investigate failures, and explain what the measurements support |

**Stage evidence:** successful delegation, a justified AI feature, and a comparison based on results. Agent count and prompt length do not earn credit.

### Stage 5 Establish quality and keep the product working

| Mission | Concepts | Learner outcome |
| --- | --- | --- |
| 21. Ask AI to produce useful checks | Unit, integration, end-to-end and regression tests | Explain expected outcomes and demonstrate that checks expose a real defect |
| 22. Release with a way back | Version history, environments, builds, CI/CD, rollback | Direct a release and demonstrate recovery from an unsuccessful change |
| 23. Diagnose from evidence | Logs, metrics, traces, hypotheses, diagnosis | Direct an investigation and verify that the relevant user flow works afterwards |
| 24. Manage growing use and cost | Latency, throughput, indexing, algorithmic cost, caching, queues | Explain a bottleneck and compare measured improvement with its cost |
| 25. Change the system without losing trust | Migrations, backups, restoration, dependencies, privacy | Direct a data or dependency change and verify preservation of required behaviour |

**Stage evidence:** a released product, relevant test and operational evidence, and successful handling of a changed condition. AI can perform the technical work.

### Stage 6 Deliver value and demonstrate ownership

| Mission | Concepts | Learner outcome |
| --- | --- | --- |
| 26. Start an independent domain project | Domain knowledge, workflow constraints, incentives, discovery, scope, success measures | Investigate an actual process, discover a missing requirement, and agree on what success means |
| 27. Deliver through AI | Delegation, technology choices, tradeoffs, quality, constraints | Produce a working solution and maintain an accurate system explanation covering the stack, data flow, and important decisions |
| 28. Respond to reality | Feedback, adoption, training, defects, maintenance, effects on other work | Improve the product after use and a changed requirement; investigate whether the workflow actually benefits |
| 29. Transfer the work and adapt | Documentation, handoff, portability, local context, cost, learning | Help another person operate it and preserve its useful outcome with an unfamiliar or replacement tool |
| 30. Demonstrate professional capability | Communication, system understanding, evidence, business value, responsibility | Walk through the purpose, actual technologies, operation, and decisions; respond to a new scenario and explain costs and remaining limits |

**Stage evidence:** a useful product, a credible record of decisions and outcomes, and successful response to fresh requirements with AI available.

## How concept mastery is assessed

For every important concept, the learner should be able to:

1. Explain it in plain language with an example.
2. Locate it in their product or an appropriate running demonstration.
3. Predict what happens when a condition changes or a component fails.
4. Compare reasonable choices and explain a relevant tradeoff.
5. Challenge an incorrect AI explanation and use an experiment or other evidence to resolve it.

AI remains available as a tutor and working tool. Assess the learner's own reasoning through follow-up scenarios, predictions before results, diagrams, decisions, and explanations of observations. If the learner cannot apply the concept, provide further teaching and a fresh variation.

The core foundation is compulsory. A portfolio that looks impressive does not compensate for missing concepts. Equally, a learner who understands the concepts and reliably delivers through AI does not need to prove that they typed the implementation.

## What a finished product must prove

Choose evidence proportionate to the product. A presentation site needs appropriate content, usable navigation, and the relevant browser and accessibility checks. A lead-capture site also needs evidence that a submitted enquiry reaches its destination. A product with private accounts requires evidence about permissions. A payment workflow needs relevant transaction and recovery checks.

The learner can ask AI to design and run these checks. They must understand the expected outcome and distinguish an actual observation from an unverified claim. A second AI reviewing the first can add a perspective, but a shared mistaken assumption can survive both reviews; connect checks to requirements and independently observable behaviour.

The final assessment combines concept demonstrations, the required system explanation, a useful product, and an unseen change or failure scenario. The learner must demonstrate understanding of the technologies and how their own product works. AI is available throughout. Record personal decisions, AI work, review, costs, feedback, and outcomes honestly.

## Competing with experienced engineers

Judge both the learner and an experienced participant with the same available AI tools, time, and task constraints when calibrating the course. Compare useful outcomes, conceptual reasoning, time to an accepted change, reliability, cost, communication, and response to changed requirements.

This is a proposed calibration exercise, rather than a claim that graduates have already matched experienced engineers. Publish the actual results when measured. Assess the responsibilities of the target role; job titles and screening requirements may vary by employer.

There is no fixed hour budget until pilots establish the effort needed for concept mastery and successful delivery. Thirty missions describe a sequence, not thirty days of guaranteed readiness. Maintenance practice should include real feedback and changed conditions over repeated sessions.

## Keeping the course relevant as AI improves

Use the three [2030 scenario tests](RESEARCH-2030.md): powerful tools with uneven adoption, widespread autonomous delivery, and broad cognitive automation. Include the possibility that AI automates planning, coordination, and evaluation too. Conceptual understanding and effective delivery remain the educational goals; career claims must follow observed opportunities in the target market.

Exercise evidence judgement, domain understanding, adoption, and authority within the existing missions. A misleading dataset, changed customer goal, unsuitable provider, or unverified request can supply a fresh assessment scenario. Include local language, access, and cost constraints where relevant to the product.

Each mission separates its stable concept and outcome from its current tool instructions. Record supported versions, capabilities, costs, tested examples, and the last verification date.

Before each cohort, rerun the missions from clean starting states. Quarterly, test new capabilities and ask which manual steps can now be delegated. Refresh the labs and assessments accordingly. Reassess the whole path before 2028 and 2029 intakes.

As AI improves at planning, testing, review, diagnosis, or deployment, let it perform more of those activities. Increase the sophistication of the problem and the expected evidence. Keep concept mastery and responsibility for outcomes central rather than preserve outdated labour.

Keep optional implementation and specialist tracks for learners pursuing roles that need them. Preserve progress and old project evidence when the core course changes.

## Implementation sequence

1. Align the vision and introductory documents with concept mastery and AI-led implementation.
2. Map existing lessons and projects to the shared concept foundation; reuse good explanations and exercises without requiring a manual coding sequence.
3. Pilot missions 1–5 with beginners, including learners who type no code. Check concept transfer as well as the quality of the site.
4. Build the complete workflow and AI feature missions, supplying examples, visual explanations, misconceptions, changed scenarios, and observable checks.
5. Add deployment, diagnosis, maintenance, independent delivery, and reviewer guidance. Calibrate assessments with working practitioners using the same AI access.
6. Revise pacing and career claims from observed learner outcomes. Keep lesson content and app screens clear about which redesign elements have shipped.

The [existing engineering outline](31_Phase2_Build_Like_An_Engineer/), [product outline](32_Phase3_Ship_Real_Products/), and [hiring outline](33_Phase4_Get_Paid_Get_Hired/) are reusable source material. Their original schedules and any compulsory manual coding expectations are superseded by this proposed direction.
`;export{e as default};
