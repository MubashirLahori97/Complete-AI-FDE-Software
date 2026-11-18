# Outcome and implementation: understand the page you just changed

Open **Mission 1 → Understand**. Both concepts keep a running page beside the explanation. Its inputs are the same saved Mission 1 experiment used in Explore. This is a fictional repair service, not a live business site.

## First idea: help a visitor find an answer

A visitor asks: “I’m in the North district. Can you visit me?”

1. Press **Hide the area line**. The actual page's dedicated service-area text is removed.
2. Press **Change only the colour**. Appearance changes while that line remains absent.
3. Press **Show the area line**. The supplied information returns without requiring a different colour.
4. Explain which change supplied information and which changed presentation.

An **outcome** is what someone can accomplish, such as finding where a service works. **Implementation** is the content, styles and action rules that make it possible. Appearance can help people use a page; changing colour alone does not restore a line that was removed.

This exercise tracks one explicit line. Your own heading might already contain an area. Read the whole page before deciding whether it answers the visitor's question. The academy does not semantically grade arbitrary writing or establish usability from field presence.

## Second idea: three roles, one page

| Role | What to try | What actually changes |
| --- | --- | --- |
| **Content / HTML** | Edit your heading or press **Try a different heading**. | The heading text. The source extract escapes your text just as the renderer does. |
| **Appearance / CSS** | Choose Teal, Coral or Violet. | The palette. Words, the dedicated area setting and the click rule stay fixed. |
| **Behaviour / JavaScript** | Turn the click rule off, then press Contact inside the page. Turn it on and try again. | The click either leaves the local details hidden or toggles them. Nothing is sent. |

A dashed outline connects the explanation to an actual element. Extracts show selected instructions used by this teaching page, not a complete application or a measured execution trace. AI may write every instruction; your task is to explain the roles and check the result.

The browser reads these local instructions. This does not establish hosting, a backend, a database or live AI in your own project. Inspect what your builder actually produced.

## Keep control of the experiment

Heading, area visibility, palette and click rule save with the Mission 1 experiment and travel in an academy progress backup. Older backups containing only a heading receive the original visible-area, teal and active-rule defaults. Unknown palette values and invalid field types are rejected by the input reconstruction.

**Undo lesson change** restores earlier page inputs during this explanation visit. Focused typing is grouped; history holds at most twenty input changes. **Reset lesson page** restores the default page and restarts its local Contact state. Notes are preserved, and reset input values can be undone. Reload restores saved inputs, not session undo history or previous clicks.

On tall smaller screens, explicit example/toggle/palette buttons bring the changed page beneath sticky controls. Free typing stays in place; short screens use normal scrolling. No score or inferred mastery gate is added. The next concept returns to its beginning; **Apply it to my project** opens the existing Mission 1 project.

A direct link to this explanation starts at its teaching area. The shared renderer loads and measures each document before enabling its Contact button after layout. The child page acknowledges readiness through a source/channel-checked message. Restoring earlier inputs still creates a fresh document channel, so an old readiness result cannot stand in for the current page.

Live preview areas opt out of browser scroll anchoring. A failed quick-click trace showed the homepage moving 50px after the click location was calculated. The regression now checks the real action and stable page position; no retry or sleep was added to make it pass. Explicit example buttons can reveal the page from above or below the current scroll position.

## Apply it to your own site

- Write the visitor's question in simple words.
- Ask AI to build a page that answers it, using fictional or authorized information.
- Locate the relevant content, style and action in the actual result.
- Change one thing. Predict what changes and what should stay the same.
- Open the page, try the action, and check at phone width and with a keyboard.
- Explain your choices and demonstrate a fresh relevant variation to a reviewer.

Using the teaching page does not provide evidence that your project works or that you understand it. Record your own observations in the project evidence and system explanation.

## Design reference and verification boundary

Reviewed 16 October 2026. [Bret Victor's Learnable Programming](https://worrydream.com/LearnableProgramming/) argues for making meaning, data and execution understandable in context. Our design interpretation connects a short explanation, current values and a directly manipulated page. A changing preview alone is insufficient teaching. The scenes, wording and code are original to the academy; no screenshots or animation assets were copied.

Implementation: `web/src/WebsiteUnderstanding.tsx`, `website-understanding.css`, the shared `LivePage.tsx`/`visual-website.ts` renderer, and Mission 1's controls in `mission-labs.json`. Checks exercise actual content/style/actions, escaped text, continuity, undo/reset, notes, mobile/keyboard access and the project handoff. They do not establish beginner enjoyment, independent comprehension, retention or comparative superiority. The broader quality goal remains active.

This guide is included as `PAGE-CONCEPTS.md` in Mission 1's repository folder and download. The optional `worked-example.html` is a separate static example; the connected explanation scenes run in the academy.
