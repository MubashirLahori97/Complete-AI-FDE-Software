const e=`# Training and inference: a model you can change

Open **Mission 18 → Understand → first concept**. The small model lab is an additional explanation; the mission's structured-output experiment, project and review remain available.

## Try four small moments

1. **Predict.** Press **Change input x**. The white dot moves and the orange score changes. The connection numbers stay fixed. This is inference: using the current model to make a prediction.
2. **Adjust.** Press **Reverse the x connection**. Notice the whole score map change. A connection number is a weight: it controls how an input contributes. Bias shifts the sum. Use the sliders to explore, or open the arithmetic.
3. **Train.** Press **Train one step**, then **Watch 30 steps**. Twelve labelled dots guide actual changes to the weights and bias. Watch the loss, boundary and predictions together. Pause or press Escape. Each run is finite, with a total limit of 200 updates.
4. **Check.** Press **Try next check example**. Eight separate examples were excluded from the training updates. Compare a prediction with its supplied answer. Select **Alternating corners** and train again: this unit cannot separate all those answers with one straight line.

The map background is the model's orange score. The dashed boundary is score 0.5. Dot colour shows the desired answer; × marks a mismatch. The white cross identifies the current input. The example picker and sliders provide keyboard alternatives to clicking the map. A score is not established as a calibrated probability.

## What actually runs

This is one sigmoid unit with two numeric inputs, not a language model:

\`\`\`text
z = wx * x + wy * y + bias
score = 1 / (1 + exp(-z))
choose orange when score >= 0.5; otherwise choose teal
\`\`\`

Each update uses the average binary cross-entropy gradient over the twelve training examples:

\`\`\`text
gradient(wx) = mean((score - target) * x)
gradient(wy) = mean((score - target) * y)
gradient(bias) = mean(score - target)
parameter = parameter - 0.8 * gradient(parameter)
\`\`\`

Parameters are bounded to −16…16. The implementation calculates sigmoid and log loss stably from the logits. The visible graph records actual loss after each update. Manual parameter edits, pattern changes and resets start a new history. Displayed numbers are rounded; the calculation retains their full precision.

The straight-split pattern uses the rule \`x + y > 0\`. The second pattern labels alternating quadrants. Each has twelve training and eight disjoint check coordinates. Only the training examples enter the gradient. Check feedback is visible during experimentation, so these examples are validation feedback, not an untouched final test. Synthetic data does not establish performance on real business inputs.

## Keeping and revisiting the experiment

Open **Keep this experiment** to explicitly save parameters, input and the current moment in browser progress. A normal academy progress backup includes this snapshot. Restore reconstructs bounded parameters and starts at step zero; imported history or claimed training achievements are not trusted. Export experiment downloads this visit's actual history and current values as JSON. Neither action completes a mission or establishes understanding.

Sound is muted by default. Optional short tones follow training loss; they are not narration. Reduced motion replaces animated training with a finite 30-step calculation and removes the travelling-light cue. Leaving the concept, pausing, pressing Escape or hiding the document interrupts animated training. Light illustrates calculation flow, not measured compute timing; connection width is capped for readability. Audio, timers and subscriptions are cleaned up.

## Apply the idea to your project

Before asking AI to build your Mission 18 feature, explain:

- Which parts use existing fixed model parameters to answer a request?
- Are you actually training or fine-tuning anything? Locate evidence; changing a prompt alone does not establish training.
- What data or context is supplied for one request, and who may access it?
- Which examples guide development, and which evaluation data will you keep separate?
- What failure would make the feature unsuitable, even if its output sounds confident?

Tokens, context windows, retrieval, multi-layer networks and provider-specific behaviour require additional explanations and project evidence. This sample demonstrates the narrower difference between inference and parameter updates.

## Research and design decisions

Reviewed 16 October 2026. These sources informed original teaching scenes; no video frames, scripts or character artwork were copied.

- [3Blue1Brown: gradient descent](https://www.3blue1brown.com/lessons/gradient-descent/) connects weights, biases, predictions and cost. Our design interpretation is to keep these consequences visible together, while revealing one action at a time. This lab uses binary cross-entropy rather than the squared-error example in that lesson.
- [Google: logistic regression](https://developers.google.com/machine-learning/crash-course/logistic-regression) and [loss and regularization](https://developers.google.com/machine-learning/crash-course/logistic-regression/loss-regularization) support the sigmoid and log-loss foundations.
- [Google: nodes and hidden layers](https://developers.google.com/machine-learning/crash-course/neural-networks/nodes-hidden-layers) explains why nonlinear structure matters. The alternating-corner counterexample makes a single unit's straight-boundary limitation visible.
- [3Blue1Brown's Manim demonstration](https://www.3blue1brown.com/lessons/manim-demo/) and [Manim Community's rendering tutorial](https://docs.manim.community/en/stable/tutorials/quickstart.html) informed the tooling decision. Manim is useful for authored animation/video. For this directly manipulated website model, SVG, HTML and React let sliders, accessible controls and the running calculation share state without a Python service or video render step. This is a project choice, not a claim that Manim has no interactive workflows.

## Implementation and evidence boundary

\`web/src/neuron-model.ts\` contains the deterministic math and datasets. \`NeuralLearningLab.tsx\` presents the staged explanation. Pure-model tests compare analytic gradients with independent numerical derivatives, exercise extreme values, check data separation and test the counterexample. Browser checks exercise prediction, real training, interruption, exports, restoration, opt-in audio and responsive controls.

Mission 18's downloadable kit includes a copy of this guide and the TypeScript model source for inspection. It is source material, not a precompiled standalone app. Run the academy with the repository's normal \`web\` setup.

Passing application tests does not demonstrate beginner comprehension, delayed concept transfer or the overall course's final creative quality. Further narration, concept-specific explanations and independent learner trials remain necessary.
`;export{e as default};
