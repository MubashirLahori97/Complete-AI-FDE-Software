# Lesson 21 project — A shareable document-assistant demo

<!-- beginner-path:begin -->
## Your first action

Sketch four screens for the same question journey: ready, loading, supported answer, and no evidence. Then connect the first complete path.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `answer_contract.py`. Run python answer_contract.py. The response is a fixture for a frontend contract, not a model call.

Bring together the frontend pattern from Day 13, retrieval from Day 18, and answer contract from Day 19. Reuse these components for the document-assistant demo.

<!-- beginner-path:end -->

## The customer problem

Create a usable interface for the grounded assistant from lesson 19. Include example questions, answer/source display, no-evidence and failure states, and an honest mode label. Publish a fictional-data demo or document a reproducible local version while a trusted backend is being prepared. A real-provider extension must keep credentials out of the frontend.

**Learning goal:** Compose retrieval, answer contracts, source display, and useful interface states. Test the complete user workflow rather than only individual functions. Publish a scoped demonstration with honest operating limits.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A usable interface connected to the validated answer contract.
- A fictional/public document collection and scope explanation.
- A verified demo URL or a reproducible local delivery record.
- A workflow test report and one observed usability improvement.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Connect contracts

- Agree on question, answer, source, status, and mode fields.
- Reuse the existing retrieval and evidence checks.

**Stop and check:** The interface receives enough information to display the correct state.

### Milestone 2: Build the whole task

- Add starting questions, loading feedback, and inspectable sources.
- Handle absent evidence and service errors differently.

**Stop and check:** A new user can tell what the assistant knows and how to inspect it.

### Milestone 3: Verify and share

- Test a clean context using only fictional/public data.
- Observe a new user and record the actual delivery mode and limits.

**Stop and check:** The demonstration's scope and verification evidence are clear.

## Acceptance checks

- [ ] The interface states its document scope and actual execution mode.
- [ ] Answered results display relevant supporting passages.
- [ ] No-evidence and service-failure states are distinguishable and useful.
- [ ] The demo contains no private documents or browser-exposed credentials.
- [ ] A new-user workflow and delivery verification are recorded.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Representative answerable question | Supported answer and relevant source display |
| 2 | Question outside scope | Useful no-evidence state |
| 3 | Failed response fixture | Recovery-oriented service error, not invented success |
| 4 | Clean browser or fresh local setup | The documented first-use workflow works |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `answer_contract.py`, and its expected output. Run python answer_contract.py. The response is a fixture for a frontend contract, not a model call.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Connect a trusted provider backend after lesson 24.
- Collect explicitly scoped feedback without storing unnecessary personal data.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What could a new user do without your coaching?
- How does the interface distinguish scope limits from service failure?
- Which part of the delivery still needs verification?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [MDN: learning web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)
- [Streamlit documentation](https://docs.streamlit.io/)

[Return to lesson 21](README.md)
