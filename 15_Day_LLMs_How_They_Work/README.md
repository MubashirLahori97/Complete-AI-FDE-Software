# Day 15 — Language models, tokens, context, and cost

Language models can produce useful text and code, but fluent output is not evidence that an answer is correct. Today you will build an operational understanding of generation, token budgets, context limits, and cost. Your project is an experiment log that separates observed provider results from offline fixture demonstrations and estimates.

**Your project:** [LLM experiment and budget notebook](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain why tokenization and fluent generation do not guarantee factual correctness.
- Describe context and output budgets without assuming every model supports the same settings.
- Calculate an estimate from explicit input/output usage and price assumptions.

## Understand the concept

### Tokens are representation units

A tokenizer maps text into units used by the model. A token is not always a word: it can represent part of a word, punctuation, or another pattern depending on the tokenizer. Word counting is therefore not an exact token counter. A language model generates a continuation based on learned patterns and the supplied context; modern model systems can also use tools and additional processing. The practical lesson is that a convincing answer can still be unsupported, incomplete, or wrong.

### Context is supplied, not unlimited memory

A model request contains some combination of instructions, conversation, retrieved content, and tool results. The service has limits and conventions for what fits and how output is budgeted. Applications may truncate or summarise conversation history rather than sending every previous message. Do not assume the model automatically knows a customer database or permanently remembers a prior session. Inspect the actual request you construct and the provider's documented limits for the chosen model.

### Costs and controls are model-specific

An estimate should state request volume, input usage, output usage, and the relevant prices. Providers may distinguish cached, reasoning, image, tool, or other usage, so a simple text estimate is not a universal billing formula. Settings such as temperature are not supported identically by every model and do not turn generation into a factual verification process. Record the model and version, supported settings, observed usage, and the difference between an assumption and a measured result.

## A worked example, step by step

Input and output have separate assumed prices. The example is a transparent budget estimate, not a model call.

```python
requests = 2000
input_tokens_per_request = 1000
output_tokens_per_request = 500
input_price_per_million = 1.0
output_price_per_million = 4.0
input_cost = requests * input_tokens_per_request / 1_000_000 * input_price_per_million
output_cost = requests * output_tokens_per_request / 1_000_000 * output_price_per_million
print(f"Fictional estimate: ${input_cost + output_cost:.2f}")
print("Includes text input/output only; verify provider usage and prices separately")
```

**Expected result**

```text
Fictional estimate: $6.00
Includes text input/output only; verify provider usage and prices separately
```

The two usage quantities are multiplied by the expected request count and converted to millions to match the assumed price units. Separating input and output exposes which assumption drives the estimate. Doubling output length raises output cost independently of input cost. The final line states the estimate's scope. For a real provider experiment, use documented usage fields and current prices instead of treating this sample as a quote or a universal formula.

## Practise before building

### Exercise 1: Inspect representation

Compare the word count of a sentence with a supported tokenizer's output when one is available.

**Hint:** Label a word-based approximation as approximate rather than exact tokens.

**Check your result:** Your note distinguishes text words from model-specific token units.

### Exercise 2: Change budget assumptions

Double request count, then double output length, explaining which costs change.

**Hint:** Keep assumptions in named variables rather than editing a final dollar figure.

**Check your result:** Each result follows from the stated formula and scope.

### Exercise 3: Plan a model experiment

Define three prompts, a scoring rule, supported settings, and an output limit before making optional provider calls.

**Hint:** Use an offline response fixture if no provider access is available, and label it clearly.

**Check your result:** Fixture results are not reported as observed model performance.

## Common mistakes and how to debug them

- Calling tokens words or a unit of thought rather than a model representation.
- Assuming every turn contains the entire history or every model supports identical settings.
- Publishing fictional prices or mocked outputs as measured provider facts.

## The FDE connection

A customer needs a useful, affordable, assessable service. An FDE can explain what information the model receives, what it does not know, what a request is likely to cost under stated assumptions, and how output quality will be checked.

## Build your lesson project

**LLM experiment and budget notebook**

A team is deciding whether a model could help with short support summaries. Create a small experiment record containing prompts, response examples, scoring criteria, latency/usage fields, and a cost estimate. Support an offline fixture mode for learning and an optional real-provider mode. Never combine the two modes into an unlabeled performance claim.

- An experiment log with model or fixture identity and request settings.
- Three prompt cases with a human-readable quality rubric.
- A usage/cost calculator with explicit scope and assumptions.
- A comparison note distinguishing observations, estimates, and unknowns.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What context does the request actually supply?
- Which cost terms are omitted from your first estimate?
- What evidence would be needed before claiming the model is reliable?

## References and next steps

- [Hugging Face: tokenizers](https://huggingface.co/docs/transformers/main_classes/tokenizer)
- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

[← Lesson 14](../14_Day_Project2_Deployed_Web_App/) · [Lesson 16 →](../16_Day_Prompt_Engineering/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** An LLM is a **next-token prediction machine** trained on enormous text. You don't need the math — you need the *working model*: tokens (the unit of thought AND money), context window (working memory), temperature (randomness dial). Everything in weeks 3–4 hangs on these three ideas.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### Next-token prediction

Given "The cat sat on the ___", the model predicts the most likely next word: "mat". Then it feeds "mat" back in and predicts the next. Repeat hundreds of times → a paragraph. **That's all generation is**: one likely token after another, very fast.

This explains *everything* about LLM behavior:
- It's confident even when wrong → it's predicting *likely* text, not *true* text.
- It "remembers" your conversation → the whole conversation is re-fed as input every turn.
- Prompt wording matters → different input, different likely continuations.

### Tokens: the unit of thought AND money

Text is chopped into **tokens** (~4 characters each in English; ~¾ of a word):

```
"AI engineering is fun"  →  ["AI", " engineering", " is", " fun"]  = 4 tokens
```

- You are **billed per token** (input + output).
- The model's **context window** (e.g., 128k tokens) is the max input+output it can consider at once — its working memory. Exceed it and the oldest content falls off.
- So: **tokens = cost**, **context = memory**. Every AI business decision touches these.

### Temperature: the randomness dial

- `temperature=0` → always picks the *most likely* token. Predictable, boring, reliable. Use for classification, extraction, code.
- `temperature=1` → samples from the likely tokens. Creative, varied, unpredictable. Use for brainstorming, writing.
- Most production work lives at **0–0.3**. Creativity is a bug when you want reliability.

### The API call (your first)

```python
from openai import OpenAI
client = OpenAI()  # reads OPENAI_API_KEY from environment

response = client.chat.completions.create(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=100,          # hard cap: cost control
    messages=[
        {"role": "system", "content": "You are a concise assistant."},
        {"role": "user", "content": "What does an AI engineer do?"},
    ],
)
print(response.choices[0].message.content)
print("tokens used:", response.usage.total_tokens)
```

Three roles: `system` (the instructions), `user` (the input), `assistant` (the replies). `max_tokens` caps cost. **Never hardcode API keys** — environment variables or `.env` (day 14's secret audit applies forever).

> Any provider works (Google AI Studio has a generous free tier). The concepts are identical; only the library name changes.

---

## 2. Specify — direct the AI

> "Write token_math.py: 1) a function estimate_cost(prompt_tokens, completion_tokens) using gpt-4o-mini pricing ($0.15 per 1M input tokens, $0.60 per 1M output — verify current pricing and note it may change), 2) a script that sends 3 prompts to the API, prints each response AND its token usage AND computed cost, 3) everything reads the API key from environment, failing with a clear message if missing."

You specified **cost observability** from your very first API call. That's engineering.

## 3. Evaluate — be the senior

- Run the same prompt at `temperature=0` three times, then at `temperature=1` three times. Describe the difference in one paragraph — that's your working definition of temperature.
- Set `max_tokens=5` on a long question. Watch it cut off mid-thought. That's what the cap does — now you *feel* it.
- **Do the business math:** 10,000 users × 5 messages/day × ~500 tokens/message. What's the monthly cost? Write the number down. (This number decides whether AI features are profitable — day 23 goes deep.)
- Ask the AI: "Quiz me — what happens to tokens 129,000+ in a 128k context window? Why does temperature=0 matter for a classifier?"

## 4. Business lens 💼

**Tokens are money.** Every AI product is token economics: *cost per user* vs *price per user*. A chatbot that costs $0.02/message needs either high prices or huge volume. Founders who can't do this math build products that lose money on every user — the most common AI startup death. You did the math on day 1 of touching models. That's the edge.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> Why is an LLM confident even when it's wrong?</summary>

It predicts *likely* text, not *true* text. "Confident" is just high probability on the next token — truth was never the objective function.
</details>

<details>
<summary><b>Q2.</b> Your app's answers get weird on long conversations. What's probably happening?</summary>

The conversation is approaching the context window limit — oldest messages are falling out of working memory. Fix: summarize history, or retrieve only what's needed (day 19's RAG does exactly this).
</details>

<details>
<summary><b>Q3.</b> When do you want temperature=0 vs temperature=1?</summary>

0 for anything that must be reliable (classification, extraction, code, JSON). Higher for creative generation (brainstorming, marketing copy). Production defaults low.
</details>

---

## ✅ Done when

- [ ] You can explain next-token prediction, tokens, context window, and temperature to a non-technical friend
- [ ] Your script prints tokens used + cost for every call
- [ ] You've priced 10,000 users and written the number down
- [ ] API key in environment only; committed to GitHub

## 📎 The one link

[OpenAI API Quickstart](https://platform.openai.com/docs/quickstart) — or Google AI Studio if you want the free tier. Concepts identical.

---

[← Day 14](../14_Day_Project2_Deployed_Web_App/) · [Day 16 →](../16_Day_Prompt_Engineering/)
<!-- original-workshop:end -->

</details>
