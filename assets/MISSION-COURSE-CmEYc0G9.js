const e=`# The concepts + AI core course

The academy's default experience is the accepted six-stage, thirty-mission path from [ROADMAP.md](ROADMAP.md). **Conceptual understanding is compulsory; AI can perform all implementation.** AI may also research, plan, coordinate, test, diagnose, deploy and review. No syntax test, manual coding quota or fixed hour estimate is a universal core graduation requirement.

## Where to start

Open FDE Academy and choose **Start mission 1**. The first project is a useful service website. Use any available AI builder or coding agent and ask it for opening instructions appropriate to its output. No particular AI subscription, provider or programming language defines the course. Record actual access, configuration, costs and limitations; a paid service is not assumed to be available.

The homepage's local message experiment demonstrates a small content change; it does not generate a site through a live model. Each mission's prepared simulation lets the learner inspect consequences before working on the actual project. Simulation results never stand in for real provider quality, stored business records, customer interviews or deployment evidence.

Mission 1 now has a [visual teaching sample](VISUAL-LESSON-SAMPLE.md) at \`#/sample/website\` and in its Explore step. It connects real content, styling and click-rule changes to a running page, then uses a labelled hosting model with a controlled timeline. The remaining missions have not been converted to that sample format. The original text explanation and project requirements remain available.

## The mission loop

1. **Explore:** read the concrete problem, make a prediction and change a situation. The result and flow diagram update immediately.
2. **Understand:** choose one concept at a time, study a plain-English explanation, an example, a misconception and a worked change.
3. **Build with AI:** use the ready-to-use brief and three milestones. Ask AI to do implementation and appropriate checks. Record actual outcomes, failures and evidence locations; leave unrun checks unticked.
4. **Explain your system:** answer one question at a time, with your place saved. Write or transcribe the eight required system areas in your own words. Apply the concepts through explain, locate, predict, compare and challenge prompts. AI can help inspect and teach; copying its output is insufficient if the learner cannot use the ideas.
5. **Review:** keep product evidence separate from understanding. Practise a changed condition, then ask a reviewer for an unseen relevant variation with AI available. Record who or what reviewed, the observed reasoning and results, gaps and further practice.

All steps are available for exploration. Moving between screens does not award completion. Saving a practice record requires outcome checks, an artifact, an observation, all system areas and all five reasoning responses. The minimum text lengths check completeness only; they cannot establish conceptual correctness. A reviewer-reported demonstration remains a learner-owned local record, not an authenticated qualification. Editing project or explanation evidence invalidates the saved practice status and clears the previous understanding review.

## Every project's system explanation

Explain purpose and success; actual technologies; each technology's role and relationships; choices and alternatives; where components run; an action's full path; information storage, permissions and AI participation; and a changed requirement or failed component. Include a diagram where useful and update the explanation after meaningful changes.

Identify technologies from the working product and configuration with AI assistance. A static site may have HTML, CSS, browser behaviour and hosting, with no backend, database, accounts or live AI. As those components appear, the explanation must add the corresponding depth. Invented components in a generated diagram do not satisfy the standard.

## Projects and source material

Each mission has a downloadable ZIP with its full teaching guide, AI brief, system explanation sheet, evidence sheet and current-tool record. Missions 1–5 also include a runnable static worked example: open \`worked-example.html\` in a browser. It demonstrates actual local HTML/CSS/JavaScript, a collection and a validated estimator. It has no server or database. Learners still build or direct their own project; receiving a kit does not complete it.

Later missions ask the learner and their available AI to build connected systems, evaluate real or explicitly labelled fixture adapters, release, recover and deliver an independent product. Their kits are complete work briefs and evidence templates, not prebuilt customer solutions or claims that a live provider has been tested.

[MISSION-MAP.md](MISSION-MAP.md) maps every core mission to concepts and reusable original workshops. Original workshop routes \`#/lesson/1\`–\`#/lesson/30\`, their code and projects remain available through \`#/workshops\` and \`#/workshop-path\`. Amina remains optional at \`#/guided\` and \`#/sample/amina\`. Older compulsory coding or line-by-line rules apply only to those optional exercises, not to core graduation.

## Saved work and compatibility

Core records live in the existing \`fde-academy-v1\` backup under \`missions\`, separate from original workshop completions and the optional guided-course store. Old evidence is retained and never converted into completed new missions. Mission inputs, explanations, review records and current step survive reload and round-trip through Settings backup export/import. There is no account, authenticated reviewer identity or cross-device sync. Avoid private customer details and secrets; export a backup before clearing browser storage.

## What remains to establish

Authored content and functioning UI are different from measured learning outcomes. Beginner pilots, delayed transfer checks, realistic pacing, practitioner calibration using comparable AI tools, real adoption and benefit, and future tool compatibility remain to be measured. Thirty missions are a sequence, not thirty days or four to five years of employment. The [research](RESEARCH-2030.md) distinguishes observations, forecasts and course scenarios.

Before each cohort, replay the projects from clean starting states with currently available tools. Record versions, prices, supported capabilities and verification dates in the kit's tool sheet. Revisit quarterly and before 2028/2029 intakes. Let stronger AI do newly automatable work; assess a broader useful outcome rather than preserve old manual steps.

## Maintenance and checks

Author core content in \`web/src/missions.json\`. \`node web/scripts/pack-missions.mjs\` validates the sequence and required content, updates \`missions/01\`–\`missions/30\`, regenerates the reuse map and packages all thirty kits. The regular development/build preparation runs it automatically.

Use \`cd web\`, \`npm test\`, \`npm run build\` and \`npm run test:e2e\` for unit, build and browser checks. Test the core and preserved optional paths separately. Passing app checks establishes the behaviours exercised; it does not establish learner mastery or job readiness.
`;export{e as default};
