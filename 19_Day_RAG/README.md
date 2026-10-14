# Day 19 — RAG, source evidence, and honest abstention

Retrieval-augmented generation supplies relevant source material before an answer is generated. It does not automatically make the sources correct or the final answer faithful. Today you will separate retrieval from generation, inspect supporting evidence, and build a document assistant that can say when its evidence is insufficient.

**Your project:** [Source-grounded FAQ assistant](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Describe ingestion, retrieval, context construction, generation, and citation checking.
- Keep source identity and access policy attached to retrieved information.
- Evaluate supported answers and no-answer behavior separately.

## Understand the concept

### The pipeline has several failure points

A RAG system ingests documents, divides or structures their content, retrieves useful pieces, constructs model context, and produces an answer. A wrong answer can originate in outdated data, a missing chunk, poor ranking, misleading context, or unsupported generation. Inspect these stages separately. Chunking is a tradeoff: tiny pieces can lose necessary context while oversized pieces can dilute relevance or exceed the budget. Preserve document IDs, source locations, and freshness information so retrieval can be investigated.

### A citation must support the claim

A model can produce a citation-looking reference that is absent or irrelevant. Check that cited IDs belong to the supplied evidence and inspect whether the passage supports the actual claim. Sources themselves can be wrong, contradictory, or obsolete, so source selection and ownership matter. Authorization should filter which documents a trusted user can retrieve before those documents enter model context. A prompt asking the model to hide private information is not a substitute for that boundary.

### Abstention is a product behavior

Define what happens when there is no useful evidence or the evidence conflicts. The answer can explain that the available documents do not establish the requested fact and offer a appropriate next step. Do not fill gaps with a confident invented answer merely to make the demo look smooth. Evaluate answerability, retrieval quality, and faithfulness as different criteria. A simple extractive baseline can help inspect sources before you add an optional language-model generator.

## A worked example, step by step

A selected evidence record supplies a supported answer. The missing record produces abstention rather than a fabricated policy.

```python
evidence = {
    "shipping": {"source_id": "FAQ-01", "text": "Standard shipping takes 3 to 5 business days."}
}

def answer(topic):
    source = evidence.get(topic)
    if source is None:
        return {"answer": "The available documents do not answer this question.", "citations": []}
    return {"answer": source["text"], "citations": [source["source_id"]]}

print(answer("shipping")["answer"])
print("Source:", answer("shipping")["citations"][0])
print(answer("international-tax")["answer"])
```

**Expected result**

```text
Standard shipping takes 3 to 5 business days.
Source: FAQ-01
The available documents do not answer this question.
```

The stable source ID travels with the text. The function returns an answer and citations as separate structured fields. Missing evidence produces a different result with no citation rather than an unrelated reference. This exact-match extractive demonstration isolates evidence handling; it is not semantic retrieval or generative RAG. Your project will add a documented retrieval method and an optional generator behind the same evidence-aware contract.

## Practise before building

### Exercise 1: Locate the source of failure

Describe a wrong answer caused by missing retrieval and a different wrong answer caused by unsupported generation.

**Hint:** Inspect the retrieved passages before changing a prompt.

**Check your result:** The two failures have different targeted fixes.

### Exercise 2: Validate a citation

Try a citation ID that is absent from the supplied evidence and one whose passage does not support the claim.

**Hint:** Existence and support are separate checks.

**Check your result:** Neither citation is accepted as proof of the claim.

### Exercise 3: Write a no-answer policy

Define the message for missing, conflicting, and outdated evidence.

**Hint:** Explain the limitation and a useful next step rather than inventing a result.

**Check your result:** A new user can distinguish no evidence from a service error.

## Common mistakes and how to debug them

- Assuming retrieval makes documents true or makes generated answers faithful.
- Accepting a citation solely because its format looks correct.
- Retrieving private content and relying on a prompt to conceal it later.

## The FDE connection

Customer document assistants depend on permissions, source ownership, and operational trust. An FDE makes evidence traceable and separates what the documents establish from what the system cannot currently answer.

## Build your lesson project

**Source-grounded FAQ assistant**

A team wants answers from a small fictional policy collection. Build a retrieval-and-answer pipeline that preserves source IDs, displays supporting passages, and handles unanswered questions. Use a clearly labelled extractive or fixture baseline first; optionally connect a real model generator without weakening permission or citation checks.

- A small source collection with IDs, locations, and freshness notes.
- A retrieval method with inspectable ranked results.
- An answer contract including citations and a no-answer state.
- A labelled question set covering support, conflict, and missing evidence.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- At which pipeline stage did a observed failure begin?
- How did you verify citation support rather than format alone?
- What keeps a private source out of an unauthorized user's context?

## References and next steps

- [Microsoft: retrieval-augmented generation overview](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)
- [OWASP: prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

[← Lesson 18](../18_Day_Embeddings_Semantic_Search/) · [Lesson 20 →](../20_Day_Agents/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** **RAG (Retrieval-Augmented Generation)** = don't ask the model to *remember* your documents — **fetch the relevant chunks and put them in the prompt**. This fixes the two biggest LLM flaws at once: hallucination (it now has the facts in front of it) and stale knowledge (your documents, not its training data). Most "AI over our data" products are RAG.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The pipeline, drawn

```
1. INDEX (once):       docs → split into chunks → embed each chunk → store vectors
2. RETRIEVE (per q):   question → embed → find top-k similar chunks (day 18!)
3. GENERATE (per q):    prompt = system instructions + retrieved chunks + question
                       → model answers USING the chunks
```

### Why each step exists

- **Chunking** (e.g., 500 tokens with overlap): whole documents don't fit context windows, and one giant vector buries the relevant sentence. Chunks are the unit of retrieval. Too big → noisy; too small → loses context. Overlap (~50 tokens) prevents cutting sentences in half.
- **The grounding instruction**: "Answer ONLY from the provided context. If the answer isn't in the context, say you don't know." This is the anti-hallucination contract — day 16's spec discipline applied to generation.
- **"I don't know" is a feature**: a RAG system that admits ignorance is trustworthy; one that invents answers is a liability.

### The failure modes (know them before you ship)

| Failure | Symptom | Fix |
|---|---|---|
| Bad chunks | Retrieved text is cut mid-thought | Smaller chunks, more overlap |
| Missed retrieval | Right doc exists, not retrieved | Better chunking, hybrid search |
| Ignored context | Model answers from training, not docs | Stronger grounding instruction, lower temperature |
| Fabricated citation | Confident answer, docs don't support it | "Say you don't know" rule + evals (day 22) |

---

## 2. Specify — direct the AI

> "Build rag_demo.py: 1) index 5 text files (write 5 short docs yourself: shop policies, product specs — keep each under 800 words so chunking is visible), chunk at ~400 tokens with 50-token overlap, embed and cache, 2) ask(question): retrieve top-3 chunks, build the grounded prompt with the anti-hallucination instruction, call the model at temperature=0, 3) print the retrieved chunks AND the answer so grounding is inspectable, 4) test with 3 questions: one answerable, one partially answerable, one completely unanswerable from the docs."

You specified **inspectability** (print the chunks) and **the unanswerable test** — the two things that separate real RAG from a demo.

## 3. Evaluate — be the senior

- The unanswerable question: did it say "I don't know" or invent something? If it invented, strengthen the instruction and re-test. **This test decides whether your system is trustworthy.**
- The partially answerable one: does it answer only the supported part and decline the rest? Partial honesty is the bar.
- **Retrieval quality:** for each question, are the top-3 chunks actually the right ones? If the answer was right but the chunks were wrong, you got lucky — fix chunking, don't celebrate.
- Swap in a trick: ask about something in the docs but phrased with synonyms (day 18's strength should carry you). Then ask something *similar-sounding but different*. Watch the boundary.
- Ask the AI: "Quiz me — draw the RAG pipeline from memory. Why chunk? Why 'I don't know' is a feature? What are the 4 failure modes?"

## 4. Business lens 💼

**"Chat with our documents" is the #1 requested AI feature in small businesses** — support docs, policy manuals, product catalogs. RAG delivers it without fine-tuning (expensive, brittle). Your pricing story: a fixed setup fee + per-query cost you can compute from today's token math. And the "says I don't know" behavior is what makes a business *trust* it with customers — reliability is the product (day 16's lesson, again).

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> Why does RAG reduce hallucination?</summary>

The facts are placed in the prompt, so the model predicts continuations of *your documents* instead of its training data. Combined with "answer only from context," fabrication drops sharply.
</details>

<details>
<summary><b>Q2.</b> Your RAG answers correctly but cites the wrong chunk. Is that fine?</summary>

No — right answer, wrong retrieval means you got lucky. Retrieval quality is the system's foundation; fix chunking or ranking before it fails on a question you didn't test.
</details>

<details>
<summary><b>Q3.</b> When is RAG the wrong choice vs fine-tuning?</summary>

RAG wins when knowledge changes (docs update without retraining) and when you need citations. Fine-tuning is for behavior/style, not for memorizing facts — and it's far more expensive to maintain.
</details>

---

## ✅ Done when

- [ ] You can draw the RAG pipeline from memory and explain each step's purpose
- [ ] The unanswerable question gets an honest "I don't know"
- [ ] Retrieved chunks are printed and you've verified they're the *right* chunks
- [ ] Committed to GitHub

## 📎 The one link

[Pinecone — RAG Guide](https://www.pinecone.io/learn/retrieval-augmented-generation/) — the clearest single explainer of the pattern and its failure modes.

---

[← Day 18](../18_Day_Embeddings_Semantic_Search/) · [Day 20 →](../20_Day_Agents/)
<!-- original-workshop:end -->

</details>
