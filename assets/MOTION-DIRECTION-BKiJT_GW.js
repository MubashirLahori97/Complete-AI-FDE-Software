const e=`# A visual story the learner can take apart

The earlier four-card sample did not meet the requested visual direction. This is a separate motion prototype at \`#/sample/motion\`. The academy's existing missions and assessment records are preserved while the learner evaluates this direction.

## References researched

The research included a Google search for 3Blue1Brown, Manim and explorable explanations, then the following primary sources. These are design references, not evidence that this prototype improves retention or learning.

- [3Blue1Brown's explanation of its production process](https://www.3blue1brown.com/about/): Manim creates individual animation clips. Sanderson also describes the importance of editing and cautions against unnecessarily moving text and equations. Apply deliberate staging and visual continuity rather than decorative motion. The [Manim demonstration](https://www.3blue1brown.com/lessons/manim-demo/) and [original engine](https://github.com/3b1b/manim) document the tool and workflow.
- [Manim Community output documentation](https://docs.manim.community/en/stable/tutorials/output_and_config.html): normal outputs include rendered video and images. Manim remains an option for authored explanatory clips, particularly precise diagrams and mathematical scenes. An exported movie alone does not make a learner's changed inputs alter its rendered content.
- [Nicky Case's account of creating explorable explanations](https://blog.ncase.me/how-i-make-an-explorable-explanation/): begin with a concrete experience and a question, develop the idea in connected steps, and end with space for the learner's own exploration. Apply a single familiar page, a short explanation, then layer-removal experiments.
- [Red Blob Games' introduction to A*](https://www.redblobgames.com/pathfinding/a-star/introduction.html): readers move inputs and inspect the resulting paths. Apply immediate changes to an actual page rather than answer choices that only change a written result.
- [Bartosz Ciechanowski's Bicycle](https://ciechanow.ski/bicycle/): inspectable visual models connect the object, its parts and the explanation. Apply an exploded-view teaching metaphor and preserve the same object throughout. The drawn layer sheets are a teaching metaphor, not three literal physical browser surfaces.
- [GSAP's timeline documentation](https://gsap.com/docs/v3/GSAP/Timeline/): compose and control a sequence, including pause, resume and seeking. Use the browser timeline for live interactivity rather than running a Python renderer for each input.
- [MDN's Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices): give the learner control of playback and audio activation. Start narration only after a play action; keep mute, pause, captions and a text alternative available.

## Implemented prototype

“One page. Three layers.” uses one large visual stage instead of the academy sidebar and repeated lesson panels. A 43-second sequence presents the page, separates three illustrated instruction sheets, focuses on each role, and brings the working page back together. HTML is content, CSS is appearance, and JavaScript provides the example button's action. Colour, object identity and labels stay consistent. Motion, narration and the page states share a timeline.

The narration audio is the playback clock. GSAP animates the scene from that clock, so pause and seek also pause and seek the drawing. If audio cannot play, a silent clock keeps the sequence usable. Reduced-motion users can open the experiment directly. A permanent “Let me try” action avoids making a film a prerequisite for playing.

The end is an experiment: remove HTML, CSS or the JavaScript action independently; edit the heading; click the page's button. The page executes real escaped HTML, conditional CSS and JavaScript in an opaque-origin sandbox. Its button reveals fictional information locally. Source-checked messages report the visible result and actual height. Content changes do not award a mission completion. The project continuation opens Mission 1's original project.

The audio is **temporary synthetic prototype narration**, generated locally with Microsoft Zira. Short original Web Audio tones reinforce learner actions. No 3Blue1Brown recordings, music, characters, graphics or cloned voice are included. This is not a claim of finished voice production or matching that channel's quality. Professional voice direction, a final score and further visual refinement remain creative decisions after feedback.

## Tool choice and scope

This prototype uses React, SVG, GSAP and the browser audio APIs. It does **not** use Manim for its live scene. This lets the learner remove a layer and observe the actual browser immediately, without requiring Python or a rendering service. Manim can supply future authored clips in a hybrid format where that is useful; it is not a substitute for storyboarding, art direction, narration and sound production.

Sources: \`web/src/MotionLesson.tsx\`, \`motion-document.ts\`, \`motion-lesson.css\`, \`motion-script.json\`, \`motion-timing.json\`, and \`web/public/motion-story/narration.mp3\`. The optional Windows authoring script is \`web/scripts/render-motion-voice.ps1\`; normal builds use the checked-in MP3 and need no speech engine or FFmpeg.

Validate actual playback, audio failure, reverse seeking, real page behaviour with each layer removed, phone layouts, reduced motion, download and project continuation. Ask beginners to predict the effect of removing one layer before acting. Their enjoyment and ability to apply the idea need to be observed separately; neither is established by passing application checks.
`;export{e as default};
