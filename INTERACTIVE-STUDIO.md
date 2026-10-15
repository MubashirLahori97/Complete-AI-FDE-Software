# Learn by changing the system

All thirty core missions now start with an editable experiment. The controls feed executable browser-side rules rather than choosing one of three prepared result paragraphs. A learner can change one value, inspect the resulting state, explore another situation and continue into the existing concept, project and review flow.

## Research and design choices

- [3Blue1Brown: analysing a neural network](https://www.3blue1brown.com/lessons/neural-network-analysis/) lets readers change the input and inspect changing internal activations. Apply the connection between cause, intermediate state and output, with consistent labels and colours.
- [Red Blob Games: diagram structure](https://www.redblobgames.com/making-of/diagram-structure/) describes controls feeding inputs, an algorithm, outputs and a visualisation. Apply that architecture directly: authored controls → sanitised inputs → a deterministic model → visible state, comparisons and records.
- [Nicky Case: explorable explanations](https://blog.ncase.me/explorable-explanations/) combines doing, showing and telling, using interactivity where it explains processes or systems. Apply an approachable first action, optional deeper controls and a short explanation beside the experiment.
- The [Manim output documentation](https://docs.manim.community/en/stable/tutorials/output_and_config.html) describes rendered videos and images. Manim can supply authored explanatory sequences. A movie does not by itself recalculate a lesson when a learner changes an input. This studio therefore uses native page code and Three.js for live inspection; the separate narrated sample uses SVG, GSAP and audio. See [the motion direction](MOTION-DIRECTION.md).

These sources inform design decisions. They do not prove that this course improves retention or matches the creative quality of its references. No source graphics, recordings or voices were copied into the studio.

## What learners can do

Every mission has a question, one prominent first action, editable inputs, an immediate result, an explanation, another situation to try and a clearly stated model boundary. Additional controls open on demand. The first and third missions run actual HTML/CSS/JavaScript pages in an opaque sandbox. The other experiments execute local teaching models with fictional inputs. They do not contact AI providers or customer systems.

Examples include quantity validation, generated record identity, evidence provenance, denominators, cost arithmetic, a real wrong-record updater and assertion, response timeouts, record lifetimes, concurrency and retry identity, permission rules, bounded execution, interface contracts, JSON parsing and schema checks, retrieval constraints, threshold evaluation, release compatibility, trace spans, cache freshness, restore queries, operational prerequisites and net benefit arithmetic. The two testing missions intentionally share the same updater while developing different curriculum contexts.

The 3D view has selectable components, keyboard-accessible labels, rotation, optional pointer inspection, spatial separation and a finite event trace. These three objects illustrate system roles; they are not physical server hardware. Camera changes alter the view, while lesson controls alter the model. A trace stops at the model's processing boundary. The flat diagram exposes the same component states and inspection controls, including when WebGL is unavailable. Motion responds to changes in the operating-system preference. Sound is optional and starts muted. There is no permanent render loop.

The experiment notebook preserves controls, prediction and observation in browser progress. Backup/import sanitises recognised fields and values. An experiment JSON export records its inputs, result and boundary. None of these actions creates project evidence, awards completion or certifies understanding. Each mission retains its AI project brief, acceptance observations, system explanation and separate review. Each repository mission folder and downloadable kit also contains a LAB-GUIDE.md.

## Implementation and verification

Definitions: `web/src/mission-labs.json`. Executed rules: `mission-labs.ts`. Interface: `CausalStudio.tsx`, `LabWorld.tsx`, `LabDiagram.tsx`, `causal-studio.css`. Progress parsing: `state.ts`. Packaging validates all thirty definitions and includes their guides.

Unit checks cover numeric bounds, missing versus zero, atomic capacity, retry identity, trusted ownership checks, the wrong-record defect, malformed JSON, impossible dates, schema versus factual support, threshold monotonicity, persistent/volatile storage, restore identity, stale caches and safe progress reconstruction. Browser checks exercise the thirty project continuations, actual WebGL drawing, camera controls, flat/failure fallback, safe live page behaviour, save/reload/export, keyboard focus, phone widths and changing reduced-motion preferences.

These are application checks. Independent beginner observation, delayed transfer, measured performance on representative lower-powered devices, refined lesson-specific visual metaphors, final voice production and a coherent creative pass across the rest of the academy remain work under the [whole-project quality criteria](EXPERIENCE-QUALITY.md). The full goal remains active.
