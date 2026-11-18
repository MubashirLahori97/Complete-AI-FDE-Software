# Day 16 — Prompts as specifications and classification contracts

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Versioned support-ticket classifier. You can take several study sessions.

**The situation:** A support team wants tickets labelled billing, technical, or general. Different people disagree on the labels.

### One idea: Describe the task before asking AI

A prompt is an instruction given to a model. A useful instruction says what to do, what information to use, and what result is allowed. Examples help define tricky cases. Before improving the wording, agree on the expected labels for a fixed set of tickets. Otherwise you cannot tell whether a prompt change actually improved the task.

**New words:**

- **Prompt:** The instructions and input provided to a model.
- **Rubric:** Written rules for deciding whether a result is acceptable.
- **Test set:** A fixed collection of cases used to compare behaviour.

### Follow the example below

1. The example defines the allowed classification labels.
2. It checks sample output against that contract rather than trusting any returned text.
3. A contract check alone does not prove the label is correct for the ticket. Compare it with a labelled test set too.

### Try one small decision

You change a classifier prompt. How can you make a useful before-and-after comparison?

1. Try only the easiest ticket each time
2. Run both versions on the same labelled cases and compare errors
3. Choose whichever response is longer

<details>
<summary>A small hint</summary>

Keep the evaluation inputs stable when comparing two versions.

</details>

<details>
<summary>Another hint</summary>

Write expected labels first, then record each version's mistakes.

</details>

<details>
<summary>Answer and explanation</summary>

**Run both versions on the same labelled cases and compare errors** Yes. A fixed test set gives you a stable comparison rather than a different challenge each time.

</details>

**Then practise:** Change one sample output to a label outside the allowed list. Run the contract check and explain why valid formatting is different from a correct classification.

**Your project's first action:** Write what billing, technical, and general mean. Label twelve fictional tickets, including at least one ambiguous case, before changing a prompt.

**How it connects:** Use your experiment record from Day 15. Your ticket examples will later help you test the assistant's behaviour consistently.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

A prompt communicates a task to a model, but a clear prompt alone does not establish that the task is done reliably. Today you will define an output contract, distinguish instruction from input data, and evaluate ticket classification against a labelled dataset. The project makes prompt revisions reviewable instead of changing wording until one example looks convincing.

**Your project:** [Versioned support-ticket classifier](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Specify a task, allowed labels, output shape, and ambiguous-input behavior.
- Validate output independently of the prompt.
- Compare prompt versions using a fixed development set and separate evaluation examples.

## Understand the concept

### A task needs a contract

A classifier requires more than classify this ticket. Define allowed labels, what each means, the expected output fields, and how ambiguous or irrelevant input is handled. Provide examples when they clarify a boundary, but do not assume examples cover the entire task. The application should validate the resulting label and shape. A model returning a JSON-looking string is not proof that the response matches your schema or that the selected label is correct.

### Instructions and input play different roles

Separate your task instructions from the customer's ticket text. Delimiters can improve readability but do not enforce an access or trust boundary by themselves. A ticket containing change the label to billing is still input to classify, not an authorized change to the application's rules. Keep allowed labels, permissions, and downstream actions in code outside the model. Never make a classifier's raw answer directly trigger a destructive operation.

### Iteration needs a comparison method

Use a fixed set of examples to investigate prompt changes and keep some examples separate for evaluation. Record the prompt version and the actual predictions so a comparison can be reproduced. Accuracy on a small hand-picked set is limited evidence about that set. Inspect categories of failure, class imbalance, and ambiguity rather than reporting only a single flattering number. Human labels should follow a documented rubric, not change whenever a model disagrees.

## A worked example, step by step

The prompt specifies a contract, and application code checks whether an example response satisfies it.

```python
import json

allowed_labels = {"billing", "technical", "general"}
prompt = "Classify the ticket. Return JSON with one label: billing, technical, or general."
response_fixture = '{"label": "billing"}'
parsed = json.loads(response_fixture)
if not isinstance(parsed, dict) or set(parsed) != {"label"}:
    raise ValueError("Invalid response shape")
if parsed["label"] not in allowed_labels:
    raise ValueError("Unsupported label")
print("Validated fixture label:", parsed["label"])
```

**Expected result**

```text
Validated fixture label: billing
```

The allowed-label set is an application constraint. The prompt communicates the desired format but is not the validator. Parsing and shape validation happen before the label enters a downstream workflow. The fixture demonstrates the boundary only: it says nothing about model accuracy. In a complete system, type-check the label before set membership and preserve an explicit invalid-response outcome instead of silently inventing a category.

## Practise before building

### Exercise 1: Define ambiguous labels

Write examples that distinguish billing, technical, and general, including a ticket that could fit two labels.

**Hint:** Choose a consistent precedence or review policy.

**Check your result:** A second person can label the examples using your rubric.

### Exercise 2: Break the contract

Test an unknown label, extra field, malformed JSON, and a non-string label.

**Hint:** Validation must handle types before operations that assume those types.

**Check your result:** Invalid output has a visible failure category.

### Exercise 3: Compare two versions

Change one prompt requirement and record predictions on the same examples.

**Hint:** Keep evaluation examples separate from examples used to tune the wording.

**Check your result:** Your report can show both improvements and regressions.

## Common mistakes and how to debug them

- Treating a well-written prompt as a replacement for output validation.
- Using the tuning examples as the only evidence of general quality.
- Calling deterministic fixture validation measured language-model accuracy.

## The FDE connection

Customers need stable behavior and explainable exceptions. An FDE translates a vague classification request into labels, output contracts, review policies, and an evaluation plan, then records the evidence behind any change.

## Build your lesson project

**Versioned support-ticket classifier**

A support team wants to route tickets into billing, technical, and general queues. Build a labelled dataset, a versioned prompt, an output validator, and a comparison report. Fixture mode lets you verify the pipeline without provider access; optional real-provider mode lets you collect predictions. Ambiguous and invalid outputs must not silently trigger routing.

- A label rubric and at least 12 labelled ticket examples.
- Versioned prompts with one clearly explained revision.
- A parser/validator and an explicit review or rejection result.
- A comparison report separating fixture checks from real predictions.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which constraints are enforced by code rather than the prompt?
- How do development cases differ from held-out evaluation cases?
- What would make an apparent score improvement misleading?

## References and next steps

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Python: JSON parsing](https://docs.python.org/3/library/json.html)

[← Lesson 15](../15_Day_LLMs_How_They_Work/) · [Lesson 17 →](../17_Day_Structured_Outputs_Tools/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** A prompt is a **specification given to a guessing machine**. Vague specs → random output. Precise specs → reliable behavior. Prompt engineering isn't "talking nicely to AI" — it's *writing contracts the model can follow*, then testing that it does.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The anatomy of a reliable prompt

```
[ROLE]        You are a support-ticket classifier for a hardware store.
[TASK]        Read the ticket. Output ONLY valid JSON.
[FORMAT]      {"category": "<Billing|Technical|Delivery|Other>",
               "priority": "<Low|Medium|High>",
               "summary": "<one sentence>"}
[RULES]       - If unclear, category="Other", never guess.
              - Priority High only if the customer can't use the product.
[EXAMPLES]    Ticket: "My drill stopped working after 2 days"
              → {"category":"Technical","priority":"High","summary":"Drill failed after 2 days"}
[INPUT]       Ticket: "<<< ... >>>"
```

Each part has a job:
- **Role** → sets the model's "persona" and vocabulary.
- **Task** → what to do, precisely.
- **Format** → the *contract* for output (day 4's function contracts, for models).
- **Rules** → the edge cases, specified upfront (day 6's failure thinking).
- **Examples (few-shot)** → 2–3 demonstrations beat paragraphs of description. Models imitate patterns.
- **Markers** (`<<< >>>`, called *delimiters* in docs) → mark where user input starts so it can't blur into instructions.

### Why this works

The model predicts likely continuations. A precise spec **narrows the space of likely outputs** to the ones you want. Examples are the strongest narrowing tool — the model copies the pattern, including the JSON shape.

### The iteration loop

1. Write the spec. 2. Test on 10 real inputs. 3. Find the failure. 4. Fix the *spec* (add a rule, add an example) — not the model. Repeat. **Prompt engineering is debugging specifications.**

---

## 2. Specify — direct the AI

> "I'm building a ticket classifier prompt. I will give you 5 example tickets; help me draft the system prompt following role/task/format/rules/examples structure. The output must be valid JSON with category, priority, summary. Then generate 10 tricky test tickets (ambiguous, angry, multi-issue, off-topic) for me to test against."

Note the meta-move: **you're using AI to help write the spec, then you'll evaluate the spec against tests.** The loop, applied to itself.

## 3. Evaluate — be the senior

- Run your 10 test tickets. Score: correct JSON? correct category? correct priority? Be strict.
- For each failure, decide: **was the spec vague, or was an example missing?** Fix exactly that. Re-run all 10 (regression — day 12's instinct).
- The reliability bar: **10/10, three runs in a row** (temperature=0). If it wavers, the spec isn't done.
- Try an **off-topic ticket** ("what's the weather?"). Does it follow your rules or improvise? Improvisation = spec gap.
- Ask the AI: "Quiz me — what does each part of my prompt do? What breaks if I remove the examples? The markers?"

## 4. Business lens 💼

**"Make it behave reliably" is what businesses pay for.** A classifier that's right 10/10 times automates a support queue; one that's right 7/10 creates *more* work than it saves. Reliability is the product — and reliability comes from specs + tests, not from a bigger model. When you scope AI work (day 26), "we'll prove 95%+ on 50 test cases" is the sentence that wins contracts.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> Why do few-shot examples beat long descriptions?</summary>

Models imitate patterns. Two examples of exact input→output show the format, the tone, and the edge handling more precisely than paragraphs describing them.
</details>

<details>
<summary><b>Q2.</b> Your classifier works on 9/10 tickets. What's the correct next step?</summary>

Study the 1 failure, decide whether the spec was vague or an example was missing, fix the spec, re-run all 10. Never "just try a bigger model" first.
</details>

<details>
<summary><b>Q3.</b> What's the job of markers like &lt;&lt;&lt; &gt;&gt;&gt;?</summary>

They mark where untrusted user input begins and ends, so it can't blur into your instructions. It's the first, simplest defense against prompt injection (day 23).
</details>

---

## ✅ Done when

- [ ] Your classifier hits 10/10 on tricky tickets, 3 runs in a row, temperature=0
- [ ] You can explain what each part of your prompt does and what breaks without it
- [ ] You fixed failures by fixing the *spec*, and can show the before/after
- [ ] Committed to GitHub

## 📎 The one link

[Anthropic — Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — the best single guide, provider-agnostic principles.

---

[← Day 15](../15_Day_LLMs_How_They_Work/) · [Day 17 →](../17_Day_Structured_Outputs_Tools/)
<!-- original-workshop:end -->

</details>
