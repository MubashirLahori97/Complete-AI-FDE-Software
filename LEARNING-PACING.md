# Small experiments with context

Every core lesson now starts with a short fictional situation explaining who needs something and why. Its existing first action and free controls remain available. An optional guided comparison connects one changed input with the actual visual consequence. The Understand step presents each worked example as four selectable moments rather than four paragraphs at once.

## Sixty authored comparisons

`web/src/lab-stories.json` supplies a context and two comparisons for each of the thirty core missions. Each comparison contains a starting case, exactly one changed control, something to inspect and a takeaway. Examples distinguish zero from missing input, a recurring fee from an initial cost, authority from budget, a valid cache lifetime from current information and a compatible field from a performed assertion.

The Before and Change buttons load complete teaching examples, filling unspecified controls from the lab's defaults. They write the same saved experiment values used by the regular controls. The existing rules calculate the result; the comparison does not choose a prepared success paragraph. Both the labelled example case and a learner's own variation remain inspectable. The authored takeaway appears as the changed-case explanation only while the actual values match that case. Free edits instead identify the state as the learner's own variation.

The comparison panel sits beside the visualization on wider screens and stacks on smaller screens. Its before/after controls sit with the live visual. On smaller screens those controls stay available while inspecting the result, and the regular input dock uses normal flow. Short viewports use normal flow for both. Opening a comparison or choosing its topic does not alter inputs; applying a case does. Learners can switch either way, inspect the system in 3D or an equivalent diagram, and continue to the concept, project and review steps.

## Reversible exploration

Undo restores input values during the current lesson visit. Typing or moving a slider in one focus session groups into one edit; separate actions and comparison examples remain distinct edits. Reset can also be undone. The session history holds at most twenty entries. It does not replace the browser's progress backup and does not persist after reload or leaving the studio. Current input values and notebook text still save normally. Undo changes the inputs, preserves current notes and leaves actual project evidence/review separate.

## One worked-example moment at a time

The thirty worked examples expose Before, Direction, Result and Takeaway independently. Learners can move forward, back, jump to any moment and replay. The text remains explicitly authored teaching material, rather than a claim that their real project produced that result. The next-concept action provides a sequential route through concept explanations, while existing concept choices and project navigation stay open. A return action leads back to the actual experiment.

This pass also aligns Mission 4's concept example with its experiment's explicit zero-to-twenty quantity rule. A rule permitting zero should not be contradicted by a nearby example that silently uses different bounds.

## Source and verification

- Content and canonical examples: `lab-stories.json`, `lab-stories.ts`.
- Reversible input history: `lab-history.ts`, `CausalStudio.tsx`.
- Presentation: `GuidedComparison.tsx`, `WorkedStory.tsx`, `lesson-pacing.css`, `MissionPages.tsx`.
- Packaging: `pack-missions.mjs` calls `validate-lab-stories.mjs` to check recognised controls, types, bounds, non-empty teaching text and one actual change. Starting values are checked independently of the values that replace them. All thirty repository LAB-GUIDE files and ZIP guides include both comparisons; each ZIP also includes `comparisons.json`.
- Model checks execute all sixty comparisons, verify boundary-case outcomes and exercise edit grouping and history bounds. Browser checks apply both cases, inspect saved values and ZIPs, traverse all thirty worked stories, preserve notes through undo/reset, identify free variations, and exercise keyboard, reduced motion and phone/desktop layouts.

These checks establish authored content coverage and application behaviour. They do not establish that beginners find the flow clear, enjoyable or memorable. Observe first actions, requests for help, explanations and transfer with real beginners, then revise the experience. Narration, deeper creative sequencing and the broader [experience standard](EXPERIENCE-QUALITY.md) remain active work.
