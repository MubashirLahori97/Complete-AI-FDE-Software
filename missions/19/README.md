# Mission 19: Connect AI to knowledge and actions

Stage 4: Direct AI work at greater scale

A knowledge-assisted or bounded-action feature with source and permission evidence.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The assistant needs current service policies and may propose changing a visit. Finding information and taking action require different contracts and authority.

## Understand the concepts

### Embeddings, retrieval and grounding

An embedding represents data as numbers useful for comparing learned similarity. Retrieval selects candidate information; grounding connects an answer to evidence. Similarity does not prove relevance or truth. Sources can be outdated, contradictory or malicious.

**Example:** Retrieve the current cancellation policy and show the supporting passage and version.

**Common wrong idea:** A cited document is necessarily correct or actually supports the answer.

### Tools, permissions and untrusted content

A tool lets a model request a defined operation; the application validates arguments and authority before execution. Retrieved text is information, not permission. Limit access and use suitable approval or policy for consequential actions.

**Example:** A note saying ignore restrictions cannot authorize cancelling another customer's visit.

**Common wrong idea:** The model choosing a tool proves the action is allowed.

## Predict, change, observe

Change the prepared evidence or tool request.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Current supporting policy:** Answer may cite the relevant passage while preserving its scope. Check the source, version and whether the claim follows from it.
- **Relevant but obsolete policy:** Do not present it as current policy; investigate the version. Similarity cannot establish freshness.
- **Document requests a cancellation:** Treat the instruction as untrusted content; enforce the user's actual authority. Information access is not action permission.

Flow: Question + authorized context (Application) → Retrieve source / propose tool (Search + AI adapter) → Verify support / authority (Trusted application boundary)

## Worked example

**before:** The assistant executes a cancellation because a retrieved paragraph tells it to.

**action:** Separate source material from instructions and enforce tool permissions outside the model.

**after:** The answer may use an authorized policy; an unauthorized write is refused.

**lesson:** A prepared retrieval example teaches the boundary. Test a real retriever separately before claiming search quality.

Authored example; your project requires its own observations.

## Project: An assistant with sources and boundaries

Connect the note assistant to a small versioned policy collection or a bounded visit tool. Explain the chosen retrieval or tool mechanism and test unsupported and unauthorized cases.

1. Choose which sources the assistant may read and which actions it may take. Write what it should say when information or permission is missing.
2. Ask AI to build a replaceable connection to those sources or actions. Record which source version was used and keep trusted checks separate from returned text.
3. Try a supported answer, a missing or outdated source, and a document that asks for an action the assistant is not allowed to take. Check the actual outcomes.

## Outcome checks

- [ ] A claim points to an inspected supporting passage or an action has an explicit authorized contract.
- [ ] Missing or outdated evidence does not become an invented current answer.
- [ ] Untrusted text cannot expand the feature's authority; the observed refusal is recorded.

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

- **explain:** Explain similarity, retrieval, grounding and tool authority using your feature.
- **locate:** Find the source selection or tool-validation boundary in the actual system.
- **predict:** What if the nearest retrieved passage contradicts the current policy?
- **compare:** Compare keyword search, embeddings and direct structured queries for your information.
- **challenge:** AI says a document's instruction authorizes its tool call. Explain the trust error and test the boundary.

## Reviewer guidance

Supply a plausible stale source or unauthorized request and ask for the safe result and supporting evidence.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- Two policy versions disagree. Explain how to resolve the answer.
- A tool may read visits but is asked to cancel one. Trace the refusal.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 17](../../17_Day_Structured_Outputs_Tools/README.md)
- [Original workshop 18](../../18_Day_Embeddings_Semantic_Search/README.md)
- [Original workshop 19](../../19_Day_RAG/README.md)
- [Original workshop 20](../../20_Day_Agents/README.md)
- [Original workshop 21](../../21_Day_Project3_RAG_Chatbot/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
