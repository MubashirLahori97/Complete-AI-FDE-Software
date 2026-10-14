# Lesson 18 project — FAQ retrieval comparison workbench

## The customer problem

A team wants staff to find the right FAQ despite variations in wording. Build a small FAQ dataset, a keyword baseline, a vector-search implementation, and labelled query results. Begin with clearly labelled illustrative vectors if needed; optionally add a real embedding model. Compare the methods honestly and preserve a no-match outcome.

**Learning goal:** Explain vectors, dimensions, and cosine similarity in practical terms. Distinguish illustrative vectors from learned embedding-model output. Evaluate keyword and vector retrieval using expected relevant documents.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- At least 10 FAQ records with stable IDs and source text.
- Keyword and vector ranking functions with clear input contracts.
- At least six queries with expected relevant IDs.
- A comparison report naming the representation and its limits.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Prepare evidence

- Write the FAQ records and label representative query relevance.
- Include exact identifiers, paraphrases, and missing-answer cases.

**Stop and check:** Relevance labels exist before ranking results are inspected.

### Milestone 2: Implement comparable retrieval

- Build the keyword baseline and validated vector similarity.
- Record whether vectors are illustrative or from a specified model.

**Stop and check:** Both methods return ranked document IDs that can be inspected.

### Milestone 3: Evaluate and explain

- Compare useful hits and failure cases on the same queries.
- Document an explicit no-match policy and a potential improvement.

**Stop and check:** The report does not claim learned semantic performance from hand-authored vectors.

## Acceptance checks

- [ ] FAQ records and query relevance use stable IDs.
- [ ] Keyword and vector methods are evaluated on the same labelled queries.
- [ ] Vector dimensions and zero-length inputs are validated.
- [ ] The vector model or illustrative-fixture identity is recorded.
- [ ] No-answer queries and observed retrieval failures are reported.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Identical, perpendicular, and opposite example vectors | Expected 1, 0, and -1 similarities |
| 2 | Mismatched dimension or zero vector | Clear rejection |
| 3 | Exact product-code query | Baseline comparison records whether the relevant FAQ is retrieved |
| 4 | Question not answered by any FAQ | No useful match rather than forced success |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `vector_search.py`, and its expected output. Run python vector_search.py. These vectors are hand-authored mathematical illustrations, not learned semantic embeddings.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Use a documented embedding model and rerun the independent relevance cases.
- Compare a hybrid method while recording what changed and why.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What does a cosine score establish and what does it not establish?
- Why must index and query representations be compatible?
- Which query shows a meaningful difference between your retrieval methods?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Sentence Transformers: semantic search](https://www.sbert.net/examples/applications/semantic-search/README.html)
- [Python: mathematical functions](https://docs.python.org/3/library/math.html)

[Return to lesson 18](README.md)
