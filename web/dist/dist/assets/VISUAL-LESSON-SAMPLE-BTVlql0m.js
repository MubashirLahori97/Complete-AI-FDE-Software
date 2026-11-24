const e=`# Mission 1: a visual explanation learners can change

Following learner feedback on this control-panel format, a separate [narrated motion prototype](MOTION-DIRECTION.md) is available at \`#/sample/motion\`. Mission 1 links to it. The original sample below remains available while the learner evaluates the new direction.

This is a first-lesson teaching sample. Open \`#/sample/website\` for the focused version, or Mission 1's Explore step for the same experience inside the academy. Missions 2–30 retain their current learning experiences while this sample is evaluated.

The requested reference is [3Blue1Brown](https://www.3blue1brown.com/): visual explanations that develop an idea through cause and effect. This sample uses original diagrams and browser code; it does not copy videos, narration, characters or other channel assets.

## Four connected ideas

1. **Content:** change a heading instruction and watch the actual page display those words. A coloured connection joins the changed instruction to its result.
2. **Appearance:** keep the words and vary CSS colour and size. The actual rendered styles change; the learner can observe content and presentation separately.
3. **Behaviour:** press Contact in the real page preview, remove its click rule, then try again. The details appear only when the rule exists. The example does not send a message, contact a person or store a business record.
4. **Delivery:** follow a modelled request and file journey, pause it, or scrub its timeline. Switch hosting off. A tab that already has a copy keeps working, while a fresh visitor cannot obtain the files. Restoring hosting permits a new request. This distinguishes file availability from execution in an already-loaded browser.

Each scene teaches one idea through a visible change and a short explanation. Chapter navigation, back, restart and a text alternative remain available. Motion starts off when reduced motion is requested and can be stopped. There is no timer, score or compulsory answer form in the sample.

## Actual behaviour and teaching model

The page preview executes real HTML, CSS and JavaScript inside an opaque-origin iframe using \`sandbox="allow-scripts"\`. Heading input is escaped as text, styles use constrained values, and parent messages are checked against the expected iframe and channel. Preview height follows its actual content. Downloading the page exports the selected heading, appearance and click rule as a standalone HTML file that runs locally.

The hosting connection and file-transfer timeline are explicit teaching models. They do not change a real host's availability or make a production network request. The course app itself uses React, TypeScript and Vite; the exported example uses plain HTML, CSS and JavaScript. AI may build a learner's project using different technologies, which the learner must inspect and explain accurately.

Sample changes last for the current visit. Restart resets the playground. Exploring never awards completion or replaces the existing project evidence and understanding standards. The final action opens Mission 1's actual project; its text explanation, system explanation and review remain available.

## Evaluate before extending

Ask beginners to try the first action without coaching. Check whether they can predict a style change without expecting content to change, explain the missing click rule, and distinguish an open tab from a fresh visitor when hosting is unavailable. Observe confusion and later concept transfer separately from whether the screen looks appealing. App tests establish the behaviours exercised, not a retention or mastery improvement.

Source: \`web/src/VisualWebsiteLesson.tsx\`, \`visual-website.ts\` and \`visual-website.css\`. Browser tests execute the real page, downloaded HTML, hosting-model transitions, controls, project continuation, keyboard and phone layouts. Unit checks cover text escaping, constrained output and curve coordinates.
`;export{e as default};
