# Day 21 — Compose and share a usable document assistant

A document assistant becomes a product when a new user can understand its scope, ask a useful question, inspect the evidence, and recover from failure. Today you will combine earlier components behind one interface and evaluate the whole workflow. The project can begin in a clearly labelled offline mode and add real generation only after its evidence boundaries work.

**Your project:** [A shareable document-assistant demo](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Compose retrieval, answer contracts, source display, and useful interface states.
- Test the complete user workflow rather than only individual functions.
- Publish a scoped demonstration with honest operating limits.

## Understand the concept

### Composition needs shared contracts

The frontend, retrieval layer, and answer generator need compatible data shapes. Define question input, answer text, source records, and status categories before connecting them. Preserve distinctions such as no evidence, invalid request, and temporarily unavailable service. A boolean success field alone may hide the information the interface needs to guide recovery. Reuse earlier validated components instead of implementing each boundary differently inside a new UI.

### First-use guidance is part of the product

Explain what collection the assistant uses and offer representative starting questions. Show a loading state when work is in progress, an answer with inspectable source passages, and a useful no-answer state. Keep model/fixture identity clear. An attractive empty chat box can leave a user unsure what to ask and what to trust. A source panel must connect evidence to the specific answer, not merely list every document in the collection.

### A shared demo needs a data policy

Use fictional or intentionally public documents for a public demonstration. Browser code cannot safely contain a private model API credential. A real-provider integration belongs in a trusted local or hosted backend with explicit configuration. An offline extractive demonstration is useful for workflow testing but must not be sold as measured model performance. Inspect the deployed application in a clean context and record what a new user could actually complete.

## A worked example, step by step

A structured response preserves the answer, evidence, and mode so a UI can display them honestly.

```python
import json

response = {
    "status": "answered",
    "mode": "extractive-fixture",
    "answer": "Standard shipping takes 3 to 5 business days.",
    "sources": [{"id": "FAQ-01", "passage": "Standard shipping takes 3 to 5 business days."}],
}
print("Status:", response["status"])
print("Mode:", response["mode"])
print("Sources:", len(response["sources"]))
assert json.loads(json.dumps(response)) == response
```

**Expected result**

```text
Status: answered
Mode: extractive-fixture
Sources: 1
```

The response separates status from answer text and preserves a source record with a stable ID. The mode tells the interface whether it is showing a fixture, extractive baseline, or real provider result. The JSON round trip checks that this sample can cross a frontend/backend boundary. It does not prove answer correctness or a working deployment. Test those separately through representative questions and actual user interaction.

## Practise before building

### Exercise 1: Design interface states

Sketch ready, loading, answered, no-evidence, and failed states.

**Hint:** Each state should tell the user what happened and what they can do next.

**Check your result:** A service error is not presented as an unsupported factual answer.

### Exercise 2: Trace one question

Follow a question through input validation, retrieval, answer creation, and source display.

**Hint:** Check the contract at each boundary.

**Check your result:** The visible source actually supports the displayed answer.

### Exercise 3: Observe a stranger test

Ask a new user to answer a policy question using only your interface.

**Hint:** Record any coaching you had to provide.

**Check your result:** You have a concrete usability finding and a retested improvement.

## Common mistakes and how to debug them

- Combining components without agreeing on their input/output shapes.
- Showing every source instead of evidence relevant to the answer.
- Publishing private documents or putting provider credentials in browser code.

## The FDE connection

An FDE turns working components into a customer workflow with a useful handoff. Integration, onboarding, evidence display, and deployment verification are all part of the result the customer can use.

## Build your lesson project

**A shareable document-assistant demo**

Create a usable interface for the grounded assistant from lesson 19. Include example questions, answer/source display, no-evidence and failure states, and an honest mode label. Publish a fictional-data demo or document a reproducible local version while a trusted backend is being prepared. A real-provider extension must keep credentials out of the frontend.

- A usable interface connected to the validated answer contract.
- A fictional/public document collection and scope explanation.
- A verified demo URL or a reproducible local delivery record.
- A workflow test report and one observed usability improvement.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What could a new user do without your coaching?
- How does the interface distinguish scope limits from service failure?
- Which part of the delivery still needs verification?

## References and next steps

- [MDN: learning web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)
- [Streamlit documentation](https://docs.streamlit.io/)

[← Lesson 20](../20_Day_Agents/) · [Lesson 22 →](../22_Day_Evals/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Today you ship your first real AI product:** a RAG chatbot over real documents, deployed to a live URL. This is the Week 3 proof — and the template for the kind of thing businesses actually buy.

**Time:** 2–3 hours. **Scope:** tight. One chatbot, one document set, live URL. **Done when strangers can use it.**

---

## The mission

**Build and deploy "AskMyDocs"** — a chatbot that answers questions from a real document collection, with sources shown, "I don't know" when it can't, and a live public URL.

### Suggested document set (pick one)

- A local business's public FAQs/policies (with permission)
- Public documentation of an open-source tool you like
- Your own notes from days 15–20 (delightfully meta)

---

## The spec (write this before touching code)

Your README for the project must answer:

1. **What it does:** "Answers questions about X documents; shows sources; admits ignorance."
2. **Architecture:** Streamlit UI → retrieve (embeddings) → grounded prompt → model → answer + sources. Draw the diagram (day 19's pipeline).
3. **Reliability contract:** temperature=0; "answer only from context"; top-3 chunks shown with every answer.
4. **Cost model:** tokens per question (measured), estimated monthly cost at 100 questions/day. Write the number.
5. **Known limits:** "Fails gracefully on unanswerable questions; no real-time data; English only."

---

## The build (your call on order)

- [ ] Index pipeline: chunk → embed → cache (days 18–19, reused)
- [ ] Streamlit chat UI (day 13's patterns): question box, answer, expandable "sources" showing the retrieved chunks
- [ ] The honesty test: 3 unanswerable questions → all get "I don't know"
- [ ] 10-question eval set: run it, score it, fix the worst failure (day 22's instinct, early)
- [ ] Secrets in `.env`/Streamlit secrets, never in code (day 14's audit, again)
- [ ] Deploy to Streamlit Cloud → **live URL**
- [ ] Project README with the spec above + the URL + the cost model

## The senior review (do this before calling it done)

- [ ] Ask it something it can't know → honest "I don't know"? (If not, you're not done.)
- [ ] Check the sources panel → are the chunks actually relevant?
- [ ] Open the URL in incognito → works for a stranger?
- [ ] Read your cost model → could this survive real usage without losing money?
- [ ] Show it to one real person. Watch them use it. Write down what confused them.

---

## 🧠 Milestone check — Week 3

<details>
<summary><b>Q1.</b> Explain your chatbot's full pipeline in 60 seconds.</summary>

Index (chunk → embed → cache) → per question: embed → retrieve top-3 → grounded prompt → model answers from context only → show answer + sources. Temperature 0, "I don't know" when unsupported.
</details>

<details>
<summary><b>Q2.</b> What's the single most important behavior you tested?</summary>

Honest ignorance. A chatbot that admits what it doesn't know is trustworthy; one that invents answers is a liability you shipped to the public.
</details>

<details>
<summary><b>Q3.</b> What's your cost per 100 questions, and why does it matter?</summary>

Your measured number. It matters because it decides pricing: if each question costs $0.01 and you charge nothing, 10k questions cost you $100. Token economics or the business dies.
</details>

---

## ✅ Done when

- [ ] Live URL works for a stranger in incognito
- [ ] Sources shown with every answer; "I don't know" tested and passing
- [ ] Project README has spec, cost model, known limits, and the URL
- [ ] Committed; URL shared with at least one real person

## 📎 The one link

[Streamlit — Build a Chatbot](https://docs.streamlit.io/develop/tutorials/llms/build-conversational-apps) — the official chat UI pattern you'll build on.

---

**You now have three shipped projects: a CLI tool, a live web app, and a live AI product.** Week 4 is about making all of this *production-grade and sellable*.

[← Day 20](../20_Day_Agents/) · [Day 22 →](../22_Day_Evals/)
<!-- original-workshop:end -->

</details>
