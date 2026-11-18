# Concept-specific visual coverage

All thirty core missions lead with a real page or a visual representation specific to their concept, with executed experiments and a project for each mission. This is implementation coverage, not evidence of learner understanding or completion of the whole experience standard. The shared 3D system view remains available on demand.

| Mission | Primary representation | A useful change to try |
| --- | --- | --- |
| 1 | Real sandboxed page | Change its heading and use its contact button. |
| 2 | Highlighted instruction and three literal signals | Replace a vague request with a concrete part, action and observation. The checker is a bounded heuristic. |
| 3 | Real sandboxed page | Change content and presentation independently. |
| 4 | Itemised receipt | Compare three items, zero items and a blank quantity. |
| 5 | Generated record cards | Change the count, then repeat an identifier. |
| 6 | Evidence source and visit-count dots | Switch an invented example to checked fictional records, then make the counts conflict. |
| 7 | Count/rate comparison | Keep two missed visits fixed and change the denominator; blank means unknown. Tiles represent percentage points. |
| 8 | Draft and request steps | Disconnect the model and inspect the retained draft. |
| 9 | Accumulating monthly cost lines | Compare one month with two years, then require an unsupported export capability. |
| 10 | Before/after record updates | Correct the wrong-record defect and inspect both records. |
| 11 | Response/wait bars and request steps | Make the client stop waiting before the response. Final server state remains unknown. |
| 12 | Record lifetime and lookup | Restart process memory, switch to persistent storage, then find a stable ID. |
| 13 | Capacity and individual reservation operations | Compare retries, distinct operations and accepted/refused outcomes. |
| 14 | Identity, owner gate and returned record | Request another customer's fictional visit, then remove/reinstate the local trusted check. |
| 15 | Adapter, provider and receipt steps | Inspect provider acceptance without claiming verified delivery. |
| 16 | Separate authority gate, budget units and operations | Increase the budget, then request an action outside the granted authority. |
| 17 | Expected field/payload agreement and worker lanes | Match the fields, then vary task and worker counts. Idle capacity and coordination remain visible. |
| 18 | Source date, proposed JSON and three checks | Compare malformed JSON, invalid shape and an unsupported date. Only the date is fact-checked. |
| 19 | Question, source document and separate checks | Put an instruction inside the document; require separate authority before acting. |
| 20 | Individual labelled evaluation cases | Move the threshold and inspect each case's contribution to errors. |
| 21 | Before/after records and assertions | Diagnose which record the updater actually changed. |
| 22 | Code/data version pair and compatibility matrix | Migrate the data, then roll back only the code. |
| 23 | Inspectable sequential trace | Select any measured span, change its duration, and inspect ties or a zero-time trace. |
| 24 | Source/cache copies and each read's route | Compare cache expiry, valid-but-stale copies, zero lifetime and queued work. |
| 25 | Restored records and verification | Compare apparent restoration, an explicit query and a missing snapshot. |
| 26 | Site access gate and dispatch ticket | Reduce dispatch time while approval is missing, then resolve or remove the prerequisite. |
| 27 | Required versus selected capabilities | Require private records, then include suitable connected services. |
| 28 | Adoption figures and saving/correction bars | Set adoption to zero or compare a local saving with larger correction work. |
| 29 | Operator prerequisites and replacement payload | Run or skip the field assertion, then correct the replacement's key. |
| 30 | Composable journey capabilities | Change the requirement and add the missing connected, permission or source capability. |

Missions 10 and 21 deliberately share an updater in different teaching contexts. Missions 17/29 share an interface representation, with distinct scheduling and handoff evidence. Missions 27/30 share a capability view for different decisions. Coverage does not mean every lesson has reached its final creative depth or pacing.

## Research applied

Reviewed the primary explanations and documentation again on 16 October 2026:

- [3Blue1Brown's neural-network analysis](https://www.3blue1brown.com/lessons/neural-network-analysis/) connects editable input to live internal activations. Apply input → inspectable consequence, including confusing and failed cases.
- [Red Blob Games' diagram structure](https://www.redblobgames.com/making-of/diagram-structure/) separates inputs, algorithm, outputs and visualization. Keep executed rules authoritative and derive display data from them.
- [Manim's quickstart](https://docs.manim.community/en/stable/tutorials/quickstart.html) creates and renders programmatic animation scenes. Use authored animation where sequencing explains something; use live browser graphics for direct editing. This update introduces no Manim runtime dependency.

No source graphics, narration or identities were copied. These references support design choices, not claims about this course's learning effectiveness.

## Verification boundaries

Unit checks compare visual data with executed results, including invalid input, missing quantities, repeated identities, record lifetimes, permission leaks, separate structured-output checks, source/cache/queue route counts, authority/budget boundaries, trace ties, negative net time and unrun assertions. Browser checks exercise actual inputs and every visual family at widths 320, 375, 768 and 1440, including long text and reduced motion. Diagram actions feed the same saved model controls; no separate successful state is invented by the renderer. System-view fallback and project continuation remain covered. These checks establish application behaviour; uncoached beginner observation and delayed transfer are still required.
