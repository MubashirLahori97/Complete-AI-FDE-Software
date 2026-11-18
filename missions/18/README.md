# Mission 18: Add an AI product capability

Stage 4: Direct AI work at greater scale

A justified AI feature with explicit uncertainty, contract and data boundaries.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

Staff want help turning long visit notes into a short summary. Decide what information the model receives, what it may return and what happens when its output is wrong.

## Understand the concepts

### Training, inference, tokens and context

Training changes model parameters using data. Inference uses a trained model to produce output from supplied context. Tokens are units of representation and often billing. Context is the information available for this call; it is not automatically the complete business history.

**Example:** A summary call receives one authorized visit note and an output instruction.

**Common wrong idea:** A model automatically learns your latest records permanently from one call.

### Uncertainty and structured output

A plausible answer can be unsupported. A schema constrains output shape, not factual correctness. Validate the structure and evaluate whether meaning is supported by the input. Keep missing facts missing. Fine-tuning changes learned behaviour and differs from supplying current context or retrieval.

**Example:** A valid summary object can still invent an appointment date.

**Common wrong idea:** Valid JSON means the content is true.

## Predict, change, observe

Inspect a prepared output for a note that contains no appointment date. These are fixtures, not live model calls.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Summary with unknown date:** The shape is valid and the date remains unknown. This preserves a missing fact; broader quality still needs evaluation.
- **Valid JSON, invented date:** Shape passes; factual support fails. A schema cannot establish whether a statement is supported.
- **Malformed response:** Reject or recover without showing a misleading result. The integration must handle an invalid contract.

Flow: Authorized note + instruction (Application server) → Inference (Configured model service or local runtime) → Validate + show summary (Application boundary)

## Worked example

**before:** A fluent summary adds a date not in the note.

**action:** Ask AI to preserve missing information, validate output and evaluate supported facts on representative notes.

**after:** The feature distinguishes output format from factual support and records remaining errors.

**lesson:** If using fixtures, label them. A real model experiment requires explicit configuration and budget and a separately observed result.

Authored example; your project requires its own observations.

## Project: A note assistant with honest limits

Add a small note-summary feature with a replaceable model adapter, data boundary and supported-fact checks. A labelled fixture adapter is acceptable practice; it cannot establish real model quality.

1. Explain why this job needs AI rather than a simpler rule. Decide what information it may receive, what it should return and how it should handle missing facts.
2. Ask AI to build the connection and interface. Start with a clearly labelled fixed example, or configure an actual model with an agreed budget.
3. Try ordinary input, missing facts and wrongly shaped answers. Record the actual provider or runtime, settings, cost, or the limits of using fixed examples.

## Outcome checks

- [ ] The actual inference or fixture path, context and data boundary are accurately identified.
- [ ] Invalid structure and an unsupported factual claim are handled and recorded separately.
- [ ] The feature has an observable benefit target and no unsupported claim of real-model reliability.

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

- **explain:** Explain training, inference, tokens, context and the difference between shape and truth.
- **locate:** Find the actual model or fixture adapter and the validation boundary.
- **predict:** What happens when a note exceeds the available context or lacks a date?
- **compare:** Compare supplying context, retrieval and fine-tuning for changing visit information.
- **challenge:** AI says a schema prevents hallucination. Demonstrate a well-shaped unsupported statement.

## Reviewer guidance

Use an unfamiliar note with a missing fact. Ask the learner to predict a safe result and explain evidence limits.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The provider's data policy no longer fits the customer. Reconsider the deployment.
- The summary changes a tentative report into a certainty. Investigate the meaning error.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 15](../../15_Day_LLMs_How_They_Work/README.md)
- [Original workshop 16](../../16_Day_Prompt_Engineering/README.md)
- [Original workshop 17](../../17_Day_Structured_Outputs_Tools/README.md)
- [Original workshop 23](../../23_Day_Guardrails_Cost/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
