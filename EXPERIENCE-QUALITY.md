# FDE Academy experience standard

## Ambition and proof

Build an original, exceptionally clear, beautiful, playful learning environment across the entire thirty-mission course. Treat the user's “best in the world” ambition as the quality target. Neither a developer's opinion nor passing app tests establishes a global ranking, worldwide novelty, enjoyment, or learning effectiveness. Those claims remain unproven until appropriate independent comparison and learner evidence exist.

The previous goal turn made verified progress: it shipped a narrated first-lesson motion prototype, its source and research, and a passing full CI run at source commit `854bcf7`. That establishes the behaviours tested, not completion of this broader goal. Most core missions still used prepared answer choices at the start of this audit.

## Release requirements

| Requirement | Evidence needed |
| --- | --- |
| Clear beginning | The first useful action is visible and labelled in plain English at phone and desktop sizes. Uncoached beginners can identify it. |
| Active learning in every mission | A relevant input changes an executed model or real browser behaviour. A different answer paragraph alone is insufficient. Every important result has an explanation, its assumptions, and a useful counterexample. |
| Understandable concepts | Start with a concrete problem, reveal one idea through an example, then ask for an achievable change. Introduce technical words with their role. Learners can explain and transfer the idea after using the experience. |
| Useful 3D | Spatial separation reveals system boundaries and connections. Camera movement, object selection and event traces are controllable. Equivalent labelled controls and a readable diagram work without WebGL or dragging. |
| Original art direction | A coherent visual language spans the home, path and lessons. Motion follows cause and effect. Illustration and sound are authored or appropriately licensed. References inform the work; worldwide uniqueness is not assumed. |
| Agency and play | Learners can explore, undo, reset, inspect and interrupt. They see consequences without punitive timers or arbitrary reward counters. Sound is optional and silent until requested. |
| A project for every mission | Each mission leads into its actual AI-directed project, acceptance observations and explanation. The learner can take a useful artifact or brief away. A lab result never pretends to be evidence from their real product. |
| Continuity | A learner can resume their experiment and notes, export and restore them, and recognise how the next mission relates to their product. Saved records do not silently certify mastery. |
| Accessible quality | Keyboard, touch, screen-reader descriptions, visible focus, readable text, reduced motion, zoom and graphics fallback are exercised. Interfaces do not depend on hovering or dragging alone. |
| Engineering quality | Model invariants, edge cases, real interactions and downloads are checked. Release assets match the tested build. GPU objects, event subscriptions and audio are cleaned up. Performance must be measured on representative devices. |
| Learning evidence | Observe first-use behaviour, requests for help, explanations, prediction and delayed transfer with real beginners. Compare against credible learning experiences using the same tasks. Record difficulties and revise the content. Green application tests do not satisfy this requirement. |

## How to judge a lesson

1. State the learner's question and one concrete action before designing a screen.
2. Identify what actually runs, what is modelled and what has been assumed. Make these distinctions visible when they affect interpretation.
3. Let the learner change a cause and inspect a consequence in the same context.
4. Explain why that consequence occurred. Show a boundary case or failure, not just a successful path.
5. Transfer the idea to the learner's own project with an observable task and a fresh question.
6. Check conceptual understanding separately from generated output. AI may help with every implementation step.

## Current completion audit

The thirty-mission concept foundation, projects and review workflow exist. All thirty missions now have input-driven local experiments, a shared inspectable 3D stage with equivalent diagrams, a saved notebook and packaged experiment guides. A narrated sample and earlier visual playground also exist. See [the implementation and research](INTERACTIVE-STUDIO.md). The full quality standard above is **not yet achieved**. A coherent creative pass across the home, path and lessons, richer lesson-specific visual metaphors, measured performance on representative devices, final voice production and independent beginner evaluations remain to be established. Keep the original scope and goal active as implementation and evidence improve.

Implementation evidence and remaining work belong in the relevant feature documentation and CI results. Update this audit when evidence changes; do not turn proposed thresholds or authored content into observed learner outcomes.
