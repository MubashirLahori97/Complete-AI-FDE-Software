const e=`# Lesson 30 project — A customer-ready demo and handoff pack

<!-- beginner-path:begin -->
## Your first action

Write a short demo script for your capstone: problem, normal result, failure result, and source evidence. Then prepare setup and recovery instructions for a new reader.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`handoff-pack.md\`. Complete this delivery pack using your actual capstone artifacts. The starter is a handoff document rather than code.

Your capstone release, portfolio evidence, and incident notes now become one handoff pack. Finishing the core course gives you practice evidence; use the longer roadmap and real feedback to keep developing.

<!-- beginner-path:end -->

## The customer problem

Package your capstone as a scoped delivery. Record a concise demo, assemble acceptance and evaluation evidence, verify the operating instructions with another person, and write a retrospective. Produce a next-project plan tied to one demonstrated weakness. Do not publish private customer data or send promotional messages as part of this learning exercise.

**Learning goal:** Demonstrate an actual workflow and critical failure behavior against a brief. Hand over setup, data, configuration, support, and recovery responsibilities. Choose next learning work from evidence about current weaknesses.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A short demo script or recording tied to actual acceptance criteria.
- A versioned delivery pack with operating and recovery instructions.
- A handoff walkthrough observation and a corrected documentation gap.
- A retrospective and a concrete follow-up learning project.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Prepare the evidence

- Choose a normal task and a critical boundary demonstration.
- Link the released version to actual acceptance and eval results.

**Stop and check:** The demo's claims match the verified implementation mode and scope.

### Milestone 2: Transfer operating knowledge

- Assemble setup, roles, limits, and recovery material.
- Observe another person using the pack and fix a hidden assumption.

**Stop and check:** The delivery does not depend on your private instructions.

### Milestone 3: Reflect and continue

- Record useful lessons and one concrete mistake.
- Define a follow-up project with a measurable completion criterion.

**Stop and check:** The next plan follows from evidence about your current skills.

## Acceptance checks

- [ ] The demo shows a normal workflow and a meaningful failure boundary.
- [ ] Claims identify the actual release, data scope, and execution mode.
- [ ] Acceptance and evaluation evidence are linked in the handoff pack.
- [ ] Another person can follow operating instructions with documented roles and recovery.
- [ ] A retrospective and evidence-based next project are recorded.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | New viewer watches the demo | Problem, scope, evidence, and limits are clear |
| 2 | Operator follows setup from the pack | The intended version and workflow can be reproduced |
| 3 | Operator asks how to handle failure | Recovery and escalation steps are specific |
| 4 | Review the next learning plan | It targets an observed weakness with an observable completion criterion |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`handoff-pack.md\`, and its expected output. Complete this delivery pack using your actual capstone artifacts. The starter is a handoff document rather than code.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Repeat the capstone on a different fictional customer workflow and compare discovery assumptions.
- Deepen one component through the longer roadmap and update the case study with new evidence.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What useful task can someone perform after your handoff?
- What did your tests and user observations actually establish?
- Which next project will strengthen the weakest part of your current delivery?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [GitHub: repository READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Atlassian: the forward deployed engineer](https://www.atlassian.com/blog/how-we-build/meet-the-forward-deployed-engineer)

[Return to lesson 30](README.md)
`;export{e as default};
