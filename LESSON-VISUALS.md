# Concept-specific visual coverage

All thirty core missions have executed interactive experiments and projects. Seventeen currently lead with a real page or a visual representation specific to their concept. This is implementation coverage, not evidence of learner understanding or completion of the whole experience standard.

| Mission | Primary representation | A useful change to try |
| --- | --- | --- |
| 1 | Real sandboxed page | Change its heading and use its contact button. |
| 2 | Highlighted instruction and three literal signals | Replace a vague request with a concrete part, action and observation. The checker is a bounded heuristic. |
| 3 | Real sandboxed page | Change content and presentation independently. |
| 4 | Itemised receipt | Compare three items, zero items and a blank quantity. |
| 5 | Generated record cards | Change the count, then repeat an identifier. |
| 7 | Count/rate comparison | Keep two missed visits fixed and change the denominator; blank means unknown. Tiles represent percentage points. |
| 8 | Draft and request steps | Disconnect the model and inspect the retained draft. |
| 10 | Before/after record updates | Correct the wrong-record defect and inspect both records. |
| 11 | Response/wait bars and request steps | Make the client stop waiting before the response. Final server state remains unknown. |
| 12 | Record lifetime and lookup | Restart process memory, switch to persistent storage, then find a stable ID. |
| 13 | Capacity and individual reservation operations | Compare retries, distinct operations and accepted/refused outcomes. |
| 14 | Identity, owner gate and returned record | Request another customer's fictional visit, then remove/reinstate the local trusted check. |
| 15 | Adapter, provider and receipt steps | Inspect provider acceptance without claiming verified delivery. |
| 18 | Source date, proposed JSON and three checks | Compare malformed JSON, invalid shape and an unsupported date. Only the date is fact-checked. |
| 20 | Individual labelled evaluation cases | Move the threshold and inspect each case's contribution to errors. |
| 21 | Before/after records and assertions | Diagnose which record the updater actually changed. |
| 25 | Restored records and verification | Compare apparent restoration, an explicit query and a missing snapshot. |

Missions **6, 9, 16, 17, 19, 22, 23, 24, 26, 27, 28, 29 and 30** still lead with shared system-role diagrams. Their controls execute their own rules; dedicated concept visuals remain work to do. Missions 10 and 21 deliberately share an updater in different teaching contexts.

## Research applied

Reviewed the primary explanations and documentation again on 16 October 2026:

- [3Blue1Brown's neural-network analysis](https://www.3blue1brown.com/lessons/neural-network-analysis/) connects editable input to live internal activations. Apply input → inspectable consequence, including confusing and failed cases.
- [Red Blob Games' diagram structure](https://www.redblobgames.com/making-of/diagram-structure/) separates inputs, algorithm, outputs and visualization. Keep executed rules authoritative and derive display data from them.
- [Manim's quickstart](https://docs.manim.community/en/stable/tutorials/quickstart.html) creates and renders programmatic animation scenes. Use authored animation where sequencing explains something; use live browser graphics for direct editing. This update introduces no Manim runtime dependency.

No source graphics, narration or identities were copied. These references support design choices, not claims about this course's learning effectiveness.

## Verification boundaries

Unit checks compare visual data with executed results, including invalid input, missing quantities, repeated identities, record lifetimes, permission leaks and separate structured-output checks. Browser checks exercise actual input changes and all thirteen new views at widths 320, 375, 768 and 1440, including long text and reduced motion. System-view fallback and project continuation remain covered. These checks establish application behaviour; uncoached beginner observation and delayed transfer are still required.
