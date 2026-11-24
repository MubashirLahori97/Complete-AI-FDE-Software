const e=`# Lesson 14 project — A verified public expense dashboard

<!-- beginner-path:begin -->
## Your first action

Write the version and target URL for the Day 13 dashboard. List three smoke checks before starting the release.

The download is a worked example to extend, not the finished project. Follow one milestone at a time, test the behaviour, and use the five acceptance checks as your done checklist. Those checks record your observations; ticking them does not run tests.

**Use the kit:** extract the ZIP into its own folder, open that folder in your editor, and read the example file \`release-checklist.md\`. Use this as a release record in your own project. Start a local static preview with python -m http.server 8000 --bind 127.0.0.1 from the directory containing index.html; a local preview is not a public deployment.

Publish the expense interface you already built. Today's project produces a verified release record rather than another unrelated app.

<!-- beginner-path:end -->

## The customer problem

Publish the dashboard from lesson 13 in your own learner project repository or chosen static host. Verify the deployed site in a clean browser, test a narrow viewport and reload, and record the release identity. Keep setup and recovery instructions alongside the project. Do not change the academy's hosting configuration as part of your learner exercise.

**Learning goal:** Distinguish development source, a deployable artifact, and a running hosted version. Verify assets, routes, and core behavior on the real deployment. Document release identity, configuration ownership, and recovery.

**Scope:** build the core version first. The starter is a worked example, not a finished solution to the full project. Use fictional or public sample data.

## What to deliver

- A verified public URL and the source commit that produced it.
- Build or publishing instructions for the chosen host.
- A completed hosted verification checklist.
- A release note, known limits, and recovery steps.

Include a short README with the purpose, setup steps, example use, known limitations, and the evidence from your test cases. A reviewer should be able to tell which parts you implemented and which parts are demonstrations or mocks.

## Build it in milestones

### Milestone 1: Prepare the artifact

- Inspect the files the host should serve and the asset path assumptions.
- Publish from your own project with documented configuration.

**Stop and check:** The artifact corresponds to a specific reviewed source version.

### Milestone 2: Verify the real URL

- Open the actual hosted result in a clean context.
- Exercise the form, remove action, reload, and small viewport.

**Stop and check:** The visible workflow and required assets work outside your development session.

### Milestone 3: Record operations

- Write release identity, observed checks, and limits.
- Explain how a previous known good artifact could be restored.

**Stop and check:** The delivery record is useful to a future operator.

## Acceptance checks

- [ ] A public URL serves the intended application version.
- [ ] Required assets load under the actual hosting path.
- [ ] Core form and expense workflows pass in a clean browser.
- [ ] Direct loading, reload, and a narrow viewport are checked.
- [ ] Release identity and recovery instructions are recorded.

These are the same checks shown in the app. Record the actual result and relevant evidence, rather than checking a box because the code looks plausible.

## Test matrix

| Case | Action or input | Expected behavior |
| --- | --- | --- |
| 1 | Open the verified public URL in a clean context | Usable first-use and empty states |
| 2 | Complete add/remove workflow | Correct records, totals, and validation |
| 3 | Load under the project's hosting subpath | Assets resolve without missing-file errors |
| 4 | Inspect a previous release and recovery instructions | A specific known good version and verification steps are identified |

Run the normal path and the failure paths. Keep a failed result visible in your notes until you understand and fix it. Re-run earlier passing cases after a change to catch regressions.

## Starter and how to use it

The download contains this brief, a small worked example named \`release-checklist.md\`, and its expected output. Use this as a release record in your own project. Start a local static preview with python -m http.server 8000 --bind 127.0.0.1 from the directory containing index.html; a local preview is not a public deployment.

Read the example before extending it. Keep your own project in a separate working directory or repository. Do not store secrets, real customer information, or private documents in a public learning repository.

## Stretch challenges

- Automate build and publish checks for future changes.
- Add a simple release-health check without collecting private user data.

Choose an extension only after the acceptance checks pass. Describe what the extension changes in the data model, user flow, tests, or operating cost.

## Review rubric and reflection

- Which artifact is actually hosted?
- What differed from your local environment?
- What information would an operator need if the latest release failed?

Score yourself on four areas: correctness against the brief, clarity of the implementation, useful failure handling, and strength of the evidence. For each area, record one thing that works and one thing you would improve. A polished screenshot alone does not establish that the project works.

Finish with a short case study: **Problem → Approach → Tests → Results → Limitations → Next step.** Distinguish measured results from estimates. Record your evidence in the app's Record your build tab and keep a link to the project.

## References

- [GitHub Pages: publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [MDN: publishing your website](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website)

[Return to lesson 14](README.md)
`;export{e as default};
