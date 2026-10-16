# Get the repair visit moving

Open **Mission 26 → Explore**. This is an illustrated, local maintenance workflow. A repair van is waiting at its workshop; the customer site requires approval before dispatch. The user described the previous gate lesson as **“boring”**. This scene is a concrete design response, not evidence that the new version is enjoyable or teaches better.

## Try it

1. Try one-minute preparation. The preparation input changes, but permission is still missing.
2. Press **Try the visit** in the scene. The sequence stops before dispatch, with the van still at the workshop.
3. Choose **Record approval**. This changes the same saved input as the lesson's approval control. The illustrated barrier opens, but a new sequence has not yet run.
4. Try the visit again. It checks the prerequisite, illustrates preparation, then moves the van to represent permitted dispatch.
5. Remove approval, or change the assumed requirement. Explain which is a changed fact and which is a different scenario.

The evaluator remains `evaluateLab(26, values)` in `web/src/mission-labs.ts`: eligibility is `!needsAccess || approval`. Preparation duration does not grant authority. The scene consumes that exact typed result. It does not infer approval from an animation or start any real visit.

## Motion and control

The original isometric vector scene depicts a workshop, van, barrier and customer site. A finite sequence introduces one consequence at a time. Pause, continue, replay and restart are explicit controls. Changes to model inputs remount the scene, cancel any active frame and return the van to its starting position. The previous sequence cannot continue using an earlier approval decision.

One illustrated moment lasts 750 milliseconds. These are storytelling beats, not measured preparation or travel durations. The current preparation value is labelled in **model minutes**. The evaluator establishes eligibility only: travel, arrival and completion have not been measured. The moving van represents permission to proceed rather than observed transport.

Reduced motion shows the final permitted/refused state immediately after the learner's action, with no moving van or barrier transition. A live preference change stops the current sequence. No animation starts on entry or repeats forever. The existing studio sound preference controls a quiet interaction tone; sound is silent until requested and is not needed to understand the result.

Text explains all outcomes. Native buttons support keyboard and touch. On wide screens, the preparation input and scene sit beside one another. The first speed example reveals the scene beneath the input dock on tall smaller screens; free slider changes and short screens keep normal scrolling. Workshop/customer labels remain readable as HTML outside the illustration.

## Saved work and project

The existing quantity of preparation, recorded-approval flag, requirement flag and notes remain in the academy's local saved experiment and backup. Undo/reset continue to work. Playback position is temporary, and neither playing a sequence nor changing its inputs records mastery. Both guided comparisons, the optional system/3D inspection and the original domain-project brief remain available.

No real approval is granted here. Removing a prerequisite changes the fictional scenario; it does not authorize bypassing a real business rule. In your own domain project, investigate who grants access, how it is recorded, and whether that condition actually comes before dispatch. Show your evidence and update your system explanation.

Implementation: `web/src/AccessJourney.tsx`, `access-journey.css`, `SystemConceptScene.tsx` and the shared studio. This guide is included as `ACCESS-SCENE.md` in Mission 26's repository folder and download. Checks cover model continuity, speed versus authority, pause/resume/replay, stale-frame cancellation, reduced motion, keyboard operation, notes/undo, phone layout and the guide download. Independent first-use enjoyment and conceptual transfer remain unmeasured; the full experience goal remains active.
