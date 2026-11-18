const e=`# Lesson 19 project — Source-grounded FAQ assistant

<!-- beginner-path:begin -->
## Your first action

Choose three public or fictional policy passages. Write one answerable question and one question they cannot answer, with expected outcomes.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`grounded_answer.py\`. Run python grounded_answer.py. This is an extractive source-checking demonstration, not a language-model generator.

Reuse Day 18's FAQ records and retrieval comparison. Add a source-supported answer contract rather than treating the top search result as automatically correct.

<!-- beginner-path:end -->

## The customer problem

A team wants answers from a small fictional policy collection. Build a retrieval-and-answer pipeline that preserves source IDs, displays supporting passages, and handles unanswered questions. Use a clearly labelled extractive or fixture baseline first; optionally connect a real model generator without weakening permission or citation checks.

**Learning goal:** Describe ingestion, retrieval, context construction, generation, and citation checking. Keep source identity and access policy attached to retrieved information. Evaluate supported answers and no-answer behavior separately.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A small source collection with IDs, locations, and freshness notes.
- A retrieval method with inspectable ranked results.
- An answer contract including citations and a no-answer state.
- A labelled question set covering support, conflict, and missing evidence.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Prepare sources

- Record source ownership, identity, and which users can read each document.
- Create answerable and unanswerable queries before evaluating output.

**Stop and check:** The evidence needed for each expected answer is known.

### Milestone 2: Connect retrieval and answers

- Retrieve only permitted evidence and preserve its IDs.
- Generate or extract an answer under a clearly labelled mode.

**Stop and check:** A reviewer can inspect which passages influenced the result.

### Milestone 3: Test grounding

- Check citation existence and claim support.
- Test missing, conflicting, and outdated evidence behavior.

**Stop and check:** The assistant does not turn unavailable evidence into confident claims.

## Acceptance checks

- [ ] Retrieved evidence retains source IDs and inspectable passages.
- [ ] Trusted document-access policy is applied before context construction.
- [ ] Answer citations refer to supplied evidence and support their claims.
- [ ] Missing evidence produces a clear abstention result.
- [ ] Retrieval and answer-quality failures are recorded separately.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Question answered by FAQ-01 | Supported answer and relevant source passage |
| 2 | Question outside the collection | Clear no-answer result with no invented citation |
| 3 | Conflicting source statements | Documented conflict policy rather than silent certainty |
| 4 | User forbidden from one source | That source is absent from retrieval and model context |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`grounded_answer.py\`, and its expected output. Run python grounded_answer.py. This is an extractive source-checking demonstration, not a language-model generator.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a real generator adapter and compare it with the extractive baseline.
- Evaluate two chunking strategies on the same held-out queries.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- At which pipeline stage did a observed failure begin?
- How did you verify citation support rather than format alone?
- What keeps a private source out of an unauthorized user's context?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Microsoft: retrieval-augmented generation overview](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)
- [OWASP: prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

[Return to lesson 19](README.md)
`;export{e as default};
