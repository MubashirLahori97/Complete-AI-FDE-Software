const e=`# Lesson 29 project — A hardened capstone release package

<!-- beginner-path:begin -->
## Your first action

Name a known-good capstone version. Write how you would restore it, then test the procedure in your practice environment and record the result.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`release-readiness.md\`. Complete this record using the actual capstone release and an isolated recovery rehearsal. It is an operating document, not an executable script.

Apply Day 14 release checks, Day 23 permissions, and Day 25 incident investigation to the complete Day 28 capstone.

<!-- beginner-path:end -->

## The customer problem

Take the capstone through a documented release-readiness process. Verify its actual environment, permissions, bounded failures, stored feedback, and operating limits. Rehearse recovery in an isolated setup using fictional data. Produce a release decision with evidence and unresolved checks instead of claiming universal production readiness.

**Learning goal:** Connect deployment configuration to the actual released version. Verify critical permissions, failures, and resource policies after deployment. Document and rehearse recovery with compatible data and a known good version.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A versioned hosted or reproducible release record.
- Permission, failure, resource, and data check evidence.
- A recovery runbook and isolated rehearsal result.
- An operational-owner map and explicit release limitations.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Inspect configuration

- Verify the deployed version and required configuration without printing secret values.
- Check startup and a representative workflow in the actual environment.

**Stop and check:** The operating record identifies which version and environment were tested.

### Milestone 2: Exercise boundaries

- Test allowed/forbidden access and bounded service failures.
- Verify feedback durability, backup policy, and resource-limit behavior.

**Stop and check:** Failures have observable, useful outcomes rather than silent success.

### Milestone 3: Rehearse and hand over

- Test recovery using a known good version and compatible sample data.
- Assign operational roles and list unresolved release checks.

**Stop and check:** An operator can follow the recovery and escalation story.

## Acceptance checks

- [ ] The tested release and environment are explicitly identified.
- [ ] Allowed and forbidden access paths are verified after deployment.
- [ ] Timeout, provider failure, and budget exhaustion are bounded and visible.
- [ ] Data durability and recovery compatibility are checked in an isolated rehearsal.
- [ ] Configuration, alerts, backup, and escalation have documented owners.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Allowed and forbidden identities | Intended access only, with clear forbidden outcomes |
| 2 | Unavailable provider or timed-out retrieval | Bounded failure and useful product feedback |
| 3 | Restart and recovery with sample feedback | Durable records and documented version compatibility |
| 4 | Operator follows recovery/escalation instructions | Expected results and responsible roles are clear |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`release-readiness.md\`, and its expected output. Complete this record using the actual capstone release and an isolated recovery rehearsal. It is an operating document, not an executable script.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a staged rollout and a concrete stop/rollback threshold.
- Automate one meaningful release check without replacing the full operator review.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which check establishes the actual hosted behavior?
- What could make a previous code version incompatible with current data?
- Who acts when the first alert or customer failure occurs?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [OpenTelemetry: observability concepts](https://opentelemetry.io/docs/concepts/observability-primer/)

[Return to lesson 29](README.md)
`;export{e as default};
