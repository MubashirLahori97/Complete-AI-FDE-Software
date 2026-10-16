# Mission 3: Understand what a page does

Stage 1: Build with AI and understand the result

An annotated page showing structure, appearance and behaviour in the actual stack.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The owner asks to change a label, a colour and what happens after a click. These changes affect different parts of the page. Learn the layers before asking AI to change them.

## Understand the concepts

### Structure, presentation and behaviour

HTML gives content meaning and structure. CSS controls presentation. JavaScript can change state and respond to events. Frameworks and libraries organize this work; they do not remove what the browser ultimately does.

**Example:** A labelled form field is structure; its width is presentation; showing an error on submit is behaviour.

**Common wrong idea:** A framework is a new browser language. It usually produces or coordinates familiar browser technologies.

### Components and dependencies

A component is a reusable interface part with a responsibility. A library supplies reusable capabilities; a framework sets broader patterns. Configuration and versions affect how these parts build and run. Inspect the project's actual manifest and files with AI.

**Example:** One ContactCard component can show the same contact details on two pages.

**Common wrong idea:** Every tool named in an AI explanation is installed. Check the actual project.

## Predict, change, observe

Change one layer of this prepared page model.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Change the heading:** Content changes from Welcome to Local repairs. Layout rules and click behaviour stay the same. This changes structure/content, not the contact action.
- **Increase text size:** The same content and action are displayed with larger text. A presentation change may alter wrapping and layout.
- **Reveal hours on click:** A click changes visible state to show opening hours. This is behaviour. A server is not required for a local reveal.

Flow: Structure (HTML / rendered markup) → Presentation (CSS in browser) → Behaviour (JavaScript in browser, if used)

## Worked example

**before:** Two pages show different contact hours.

**action:** Ask AI to locate the duplicated information and propose one shared source or component.

**after:** Changing the shared hours updates both places when rebuilt or rerendered as appropriate.

**lesson:** Abstraction reduces repeated decisions, but a shared dependency also means one mistake can affect several places.

Authored example; your project requires its own observations.

## Project: A map of your page

Annotate the real service site, identify its actual stack, and ask AI to make one content, one style and one behaviour change.

1. Ask AI to inspect your page's files and list the technologies it actually uses. Include any file that lists the project's libraries or packages.
2. Change the page's words, appearance and button action separately. Observe what changes and what stays the same each time.
3. Label a screenshot and draw a map showing which files or tools control each part. Include the instructions used to start or build your page.

## Outcome checks

- [ ] The map correctly identifies the actual structure, styling and behaviour technologies.
- [ ] Each of my three changes has a separate observed result.
- [ ] A shared element remains consistent across its uses; I explain what builds or runs it.

Record starting state, action, expected result, observed result, environment and evidence location. Leave unrun checks unticked.

## System explanation

1. Purpose and success
2. Actual technologies
3. How the parts fit
4. Choices and alternatives
5. Where it runs
6. One action, end to end
7. Information, access and AI
8. Changes and failures

Explain the actual project; mark absent components as absent. Use your own words and a diagram where useful. Update after meaningful changes.

## Understanding, separately from output

- **explain:** Explain HTML, CSS and browser behaviour using parts of your own page.
- **locate:** Find a component or repeated part, its dependency and the project's start instructions.
- **predict:** What changes if a shared contact component displays the wrong hours?
- **compare:** Compare plain HTML/CSS with the framework actually used, or a plausible framework alternative.
- **challenge:** AI says a CSS colour rule sends enquiries to the server. Trace the action to check this claim.

## Reviewer guidance

Ask for one requested change in an unfamiliar area of the page and a prediction of which layer is affected.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The same contact card is needed on a second page. Explain a suitable boundary.
- Styles load but the behaviour script fails. Predict which tasks still work.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 13](../../13_Day_First_Web_App/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
