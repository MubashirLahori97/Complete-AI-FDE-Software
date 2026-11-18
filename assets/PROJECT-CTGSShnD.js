const e=`# Lesson 11 project — Support-ticket domain model

<!-- beginner-path:begin -->
## Your first action

Draw the allowed ticket states and arrows between them. Decide what closing an already closed ticket should do.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`ticket.py\`. Run python ticket.py. dataclasses is part of the standard library.

This revisits the support queue from Day 3. You are now putting its rules around each ticket's state.

<!-- beginner-path:end -->

## The customer problem

A help desk needs tickets with stable IDs, readable titles, and controlled status changes. Build a small domain model with create, close, and optional reopen operations. Test invalid creation and repeated transitions. Compare your object-based design with a simpler alternative and explain which one you would use for this scope.

**Learning goal:** Identify an object's identity, state, and related behavior. Keep domain rules in a clear place rather than spreading them across callers. Compare a class with a simpler representation using actual change scenarios.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A ticket model and a written state-transition policy.
- Validation for required identity and title fields.
- Tests for normal, invalid, and repeated operations.
- A short class-versus-functions design comparison.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Model the rules

- Write the state-transition table and field constraints.
- Choose the policy for closing an already closed ticket.

**Stop and check:** The expected outcome is clear before methods are implemented.

### Milestone 2: Implement behavior

- Keep transition validation together with the relevant operation.
- Decide how public field updates interact with your validation boundaries.

**Stop and check:** The model's guarantees and limitations are stated accurately.

### Milestone 3: Test and compare

- Run the transition tests and inspect object identity.
- Compare the effort of adding one new rule in a simpler representation.

**Stop and check:** Your design choice is supported by a concrete change example.

## Acceptance checks

- [ ] Tickets have stable IDs and validated non-blank titles.
- [ ] Supported states and transitions are documented.
- [ ] Closing an open ticket preserves identity and changes state correctly.
- [ ] Repeated or invalid transitions follow an explicit policy.
- [ ] Tests and a simpler-design comparison support the chosen model.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Create and close an open ticket | Same ID, closed status |
| 2 | Create a blank title | Clear validation failure |
| 3 | Close the same ticket twice | Documented rejection or idempotent result |
| 4 | Attempt an unsupported transition | No silently invalid state |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`ticket.py\`, and its expected output. Run python ticket.py. dataclasses is part of the standard library.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add an append-only transition history with timestamps.
- Introduce reopen only after documenting who may use it and which states permit it.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which rule does the object own?
- What invariant can still be bypassed in your design?
- When would a dictionary and functions be clearer than this class?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: classes](https://docs.python.org/3/tutorial/classes.html)
- [Python: dataclasses](https://docs.python.org/3/library/dataclasses.html)

[Return to lesson 11](README.md)
`;export{e as default};
