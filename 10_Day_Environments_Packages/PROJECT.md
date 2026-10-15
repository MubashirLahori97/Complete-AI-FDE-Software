# Lesson 10 project — A reproducible release kit

<!-- beginner-path:begin -->
## Your first action

Open your tracker README as if you had never seen the project. List every missing setup step before trying a fresh local environment.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file `environment_check.py`. Run python environment_check.py in your normal interpreter and in a virtual environment. The specific Python version may differ.

Your Git repository keeps source history. Now make that source runnable by another person. Browser runtime diagnostics describe the browser environment, not your laptop.

<!-- beginner-path:end -->

## The customer problem

A teammate needs to run your expense tracker on a clean machine or environment. Package the interpreter requirement, dependency installation, configuration examples, data-path policy, and smoke test into a release kit. Keep the original working project intact while you test the clean setup in a separate directory.

**Learning goal:** Explain which resources a Python virtual environment isolates. Document dependency and configuration assumptions. Verify a project using a clean setup and repeatable smoke test.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A setup guide with platform-appropriate commands.
- A dependency declaration or an explicit standard-library-only statement.
- A non-secret configuration example and data-path explanation.
- A smoke test plus evidence from a clean setup.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Inventory assumptions

- List the interpreter, packages, files, and settings the tool needs.
- Mark which settings are optional and which have private values.

**Stop and check:** No dependency is included only because it happened to be installed locally.

### Milestone 2: Write the setup contract

- Create a venv and use its interpreter for installation and execution.
- Document the startup command and expected smoke-test behavior.

**Stop and check:** The guide is unambiguous about which interpreter runs the project.

### Milestone 3: Test from clean state

- Follow the guide in a separate clean directory.
- Record and fix any missing step without modifying the original environment to hide it.

**Stop and check:** The same written process produces a usable tool again.

## Acceptance checks

- [ ] The interpreter requirement and run command are documented.
- [ ] Dependencies are explicitly declared or identified as standard-library only.
- [ ] Required configuration is documented with no real secrets.
- [ ] The data path and working-directory assumptions are clear.
- [ ] A clean-environment smoke test succeeds using only the written guide.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Fresh environment with no project packages | Documented installation produces a runnable tool |
| 2 | Missing optional setting | Documented default behavior |
| 3 | Missing required setting | Helpful startup failure without exposing secrets |
| 4 | Run from a different directory | Documented path policy behaves predictably |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named `environment_check.py`, and its expected output. Run python environment_check.py in your normal interpreter and in a virtual environment. The specific Python version may differ.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Add a small automated setup smoke check in CI.
- Record a supported-version matrix after actually testing more than one interpreter.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- What does a venv isolate and what does it not reproduce?
- Which hidden assumption did the clean setup reveal?
- How would an operator know that startup succeeded?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [Python: virtual environments](https://docs.python.org/3/tutorial/venv.html)
- [Python Packaging User Guide](https://packaging.python.org/en/latest/tutorials/installing-packages/)

[Return to lesson 10](README.md)
