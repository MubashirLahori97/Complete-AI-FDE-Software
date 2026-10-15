# Lesson 24 project — FastAPI feedback and question service

<!-- beginner-path:begin -->
## Your first action

Write the feedback endpoint contract: required fields, accepted values, success result, and invalid-input result. Choose a local database file path.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `feedback_store.py`. Run python feedback_store.py. It uses an in-memory SQLite database to demonstrate the storage operation; the project adds file persistence and HTTP endpoints.

Combine Day 6 persistence with Day 9 request/response contracts. Add durable feedback to the document assistant rather than relying on browser-only state.

<!-- beginner-path:end -->

## The customer problem

Build POST /feedback, GET /feedback/{id}, and POST /ask for the fictional assistant. Use validated request models, a documented SQLite file, parameterized queries, and a trusted-identity boundary or explicitly labelled local identity fixtures. Reuse your answer contract and make invalid, missing, and forbidden outcomes clear. Verify the current FastAPI installation command in the linked documentation.

**Learning goal:** Specify API methods, request fields, response fields, and failure categories. Store and retrieve records using parameterized SQL. Distinguish request validation, authentication, authorization, and database consistency.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- An API contract and runnable FastAPI service with documented setup.
- A durable feedback schema and parameterized storage layer.
- Request validation and explicitly scoped access checks.
- HTTP, restart, and invalid-input test results.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Agree on the API

- Write request/response examples for the three endpoints.
- Define domain rules and the identity/permission scope.

**Stop and check:** Invalid and forbidden cases have different documented outcomes.

### Milestone 2: Connect durable storage

- Implement parameterized writes and reads against a file database.
- Keep SQL and provider configuration out of frontend code.

**Stop and check:** A restart preserves feedback and a quote-containing note remains intact.

### Milestone 3: Test the integration

- Exercise real HTTP handlers with success and failure cases.
- Document startup, data location, backup, and prototype identity limits.

**Stop and check:** The service can be reproduced and its security claims match the implemented boundary.

## Acceptance checks

- [ ] The three endpoints follow documented request/response contracts.
- [ ] Invalid payloads and domain-rule failures are rejected clearly.
- [ ] Feedback survives a process restart in the documented database.
- [ ] Database values use parameterized SQL rather than command concatenation.
- [ ] Trusted identity or fixture limits and access checks are explicitly tested.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Valid feedback then lookup by ID | Stored record returned under the documented contract |
| 2 | Malformed or blank feedback input | Validation failure without a stored invalid record |
| 3 | Note containing quotes or SQL-looking text | Stored as data; schema remains intact |
| 4 | Restart or forbidden lookup | Persistence verified and unauthorized access rejected |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `feedback_store.py`, and its expected output. Run python feedback_store.py. It uses an in-memory SQLite database to demonstrate the storage operation; the project adds file persistence and HTTP endpoints.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a versioned schema migration and test upgrade from a sample older database.
- Introduce verified authentication and multi-user tests before claiming production account isolation.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which rules belong to schema validation versus authorization?
- What makes the SQL operation safe for arbitrary note text?
- What evidence proves the feedback is actually durable?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Python: sqlite3](https://docs.python.org/3/library/sqlite3.html)

[Return to lesson 24](README.md)
