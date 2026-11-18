const e=`# The preserved workshop learning experience

The concepts + AI core now opens by default; see [MISSION-COURSE.md](MISSION-COURSE.md). The interactions described below are preserved in the optional original workshop collection at \`#/workshops\` and \`#/lesson/1\`–\`#/lesson/30\`. They do not define compulsory core coding requirements.

The curriculum, projects, source examples, portfolio, and existing progress remain in place. This pass changes the experience of starting, making a discovery, and returning.

The visual workspace now uses an ink-and-violet palette with warm accent colours, an illustrated shop that responds to the ticket challenge, and browser-like preview windows in every lesson. The homepage reveals the prediction after the first action; a correct prediction visibly resolves three tickets. Secondary statistics are collapsed until requested. Lesson experiments lead the reading flow and offer a direct next step into the worked example. Short character reactions accompany meaningful state changes, and reduced-motion preferences disable those animations. Optional quiet sound feedback starts off, requires an explicit opt-in, and can be switched off from either a lesson or the homepage. The preference is included in progress backups. These changes aim to make the experience clearer and more inviting; they do not establish a particular emotional response or improved learning outcomes.

- **Start by doing:** a homepage ticket-counter challenge changes visible state before asking for a prediction. Learners receive specific feedback and can retry.
- **Learn by changing something:** each of the 30 core lessons starts with a distinct one-minute experiment. Change a name, quantity, rule, response fixture, budget, permission, or workflow connection; the output and explanation update immediately. A small mission gives the learner a first action. The rule behind the result is available on demand, followed by the existing explanation, worked example, practice, and daily project.
- **Choose your session:** a quick spark returns to the saved lesson; project time opens the current project's guide. There is no countdown or penalty for a short session.
- **Explore a visible path:** the adventure map presents all 30 lessons as open missions, with project milestones distinguished by stars. A list view remains available.
- **Feel a response:** the native SVG companion changes expression, buttons respond to presses, and a short success animation accompanies a correct discovery. Reduced-motion preferences disable animations.
- **Collect understanding:** solving a lesson's small task adds its discovery card. XP comes from recorded achievements, not page views or repeated clicks. Levels are learning labels, not qualifications.
- **Recall before rereading:** returning learners can try a question from a lesson they have already practised. Review feedback is shown after a response, and the next visit rotates away from material reviewed that day.
- **Know a good stopping point:** a mission meter shows discovery, concept check, project checklist, and reflection. Completing a project lesson acknowledges the work and offers either a pause or the next lesson.

Experiment inputs save per lesson on this device and round-trip through the existing progress backup. Reset affects only that lesson's experiment. Exploring does not award XP or mark a project complete. Network, AI, Git, database, customer, and deployment examples explicitly describe their simulated or fixture-based scope; the real tasks remain in Practise and Project.

XP is derived from stored progress: 10 for the starter challenge, 15 per lesson discovery, 25 per concept check, 80 per completed project lesson, and 5 for the first review of a lesson. Repeated attempts do not multiply points. Existing quiz and completion records count, and version-1 backups remain supported. Project completion still records learner-reported evidence; the interface does not independently certify it.

These are design hypotheses to test with learners. A passed UI test does not establish that people are more motivated or that learning outcomes improved. A useful next study is to watch new learners start without help, return after a break, recall an earlier concept, and finish a small project.

Research used to inform the choices:

- [Sailer & Homner: The Gamification of Learning](https://link.springer.com/article/10.1007/s10648-019-09498-w) reviews learning, motivation, and behaviour outcomes and the limits of the available evidence. It does not establish that any particular combination of badges and points works for this academy.
- [Does retrieval practice enhance learning and transfer relative to restudy for term-definition facts?](https://pubmed.ncbi.nlm.nih.gov/28358548/) examines retrieval with feedback. The academy's short review challenge applies the recall-before-rereading pattern, with outcomes still to be tested in this setting.
`;export{e as default};
