# Lesson 9 project — Weather-service adapter with offline fixtures

## The customer problem

A travel dashboard needs a city and clearly labelled temperature, but its provider can return incomplete data or fail. Build an adapter with a fixture transport for repeatable tests and an optional live transport based on a provider's current documentation. Keep the UI independent of the provider's payload shape and distinguish offline demonstration data from live results.

**Learning goal:** Describe the method, URL, headers, status, and body of an HTTP exchange. Parse and validate a JSON response before using its fields. Design explicit behavior for timeouts, missing data, and service errors.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A documented request/response and internal-result contract.
- Fixture cases for valid data, missing data, timeout, and service error.
- A validated adapter and a thin display layer.
- An explicit retry policy and optional live-provider setup notes.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Specify the boundary

- Write sample success and failure responses.
- Define the internal result fields and their units.

**Stop and check:** The application can use the internal shape without knowing every provider field.

### Milestone 2: Implement fixtures first

- Separate transport from parsing and mapping.
- Validate shape and return a clear result or error category.

**Stop and check:** All failure scenarios can be reproduced without network access.

### Milestone 3: Integrate responsibly

- Document timeout and bounded retry behavior.
- If adding a live transport, verify the current provider contract and label its data source.

**Stop and check:** A fixture cannot be mistaken for current weather.

## Acceptance checks

- [ ] The adapter exposes a documented internal shape with units.
- [ ] Fixture data is clearly labelled as offline demonstration data.
- [ ] Malformed, missing, and wrongly typed payloads are rejected clearly.
- [ ] Timeouts and service errors follow a bounded documented policy.
- [ ] Transport and parsing can be tested independently.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Valid fixture with numeric temperature | Correct city, temperature, and unit |
| 2 | Missing or text temperature | Explicit invalid-payload result |
| 3 | Malformed JSON or wrong outer shape | Clear parsing or schema error |
| 4 | Timeout or rate-limit fixture | Documented bounded recovery without false success |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `weather_adapter.py`, and its expected output. Run python weather_adapter.py. This fixture example does not perform a live HTTP request or claim current weather.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a live read-only transport after verifying the provider's current documentation.
- Record a source timestamp and reject stale data according to an explicit policy.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What is transport failure versus payload failure?
- Which provider details should the rest of the app not depend on?
- How does retrying a read differ from retrying an operation with side effects?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [Python: urllib.request](https://docs.python.org/3/library/urllib.request.html)

[Return to lesson 9](README.md)
