# Day 18 — Embeddings, vector similarity, and retrieval evaluation

Embeddings represent information as vectors that can support similarity search. A similarity score is not a fact check, and a plausible example is not proof that retrieval will work on a customer's data. Today you will inspect the mathematics with small illustrative vectors, then design a FAQ-search project with labelled queries and a clear comparison method.

**Your project:** [FAQ retrieval comparison workbench](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain vectors, dimensions, and cosine similarity in practical terms.
- Distinguish illustrative vectors from learned embedding-model output.
- Evaluate keyword and vector retrieval using expected relevant documents.

## Understand the concept

### An embedding model supplies a representation

A learned embedding model maps input into a vector space. The vector's usefulness depends on the model, training, and task. Similarity in that space can help find related content, but it does not guarantee that a document answers the question or is true. Do not combine document and query vectors produced by incompatible models or dimensions. Record which model and configuration created an index so future queries use a compatible representation.

### Cosine compares direction

For non-zero vectors of equal dimension, cosine similarity divides their dot product by the product of their lengths. This helps compare direction rather than raw magnitude. A zero vector needs an explicit policy because its cosine denominator is zero. A mismatched dimension is invalid input, not a reason to silently ignore extra coordinates. Small hand-authored vectors make the formula understandable, but their chosen directions are not evidence that a real model captured semantic meaning.

### Retrieval needs labelled queries

Define which documents should be relevant to a query before judging the ranking. Inspect top-k results, exact-identifier queries, paraphrases, and questions with no useful match. Keyword search can be effective for product codes and exact terms; vector retrieval can help with some semantic variations. Compare them on your actual task rather than assuming one always wins. A threshold tuned on one example can fail elsewhere, so include varied and held-out queries.

## A worked example, step by step

The example validates dimensions and non-zero lengths before calculating a score.

```python
import math

def cosine(left, right):
    if len(left) != len(right):
        raise ValueError("Dimensions must match")
    norm_left = math.sqrt(sum(value * value for value in left))
    norm_right = math.sqrt(sum(value * value for value in right))
    if norm_left == 0 or norm_right == 0:
        raise ValueError("Zero vectors have no cosine similarity")
    return sum(a * b for a, b in zip(left, right)) / (norm_left * norm_right)

query = [0.8, 0.2]
illustrative_document = [1.0, 0.0]
print(f"Illustrative similarity: {cosine(query, illustrative_document):.3f}")
```

**Expected result**

```text
Illustrative similarity: 0.970
```

The function first enforces the mathematical input contract. Each norm is the square root of the sum of squared coordinates. zip pairs compatible coordinates for the dot product. The division produces a direction-based similarity for the supplied vectors. The final result describes this mathematical example only. To investigate real semantic retrieval, replace the illustrative vectors with a documented model's outputs and evaluate relevant-document ranking on independent query labels.

## Practise before building

### Exercise 1: Compare directions

Compute similarity for identical, perpendicular, and opposite illustrative vectors.

**Hint:** Try [1, 0] against [1, 0], [0, 1], and [-1, 0].

**Check your result:** The scores are 1, 0, and -1 within numerical tolerance.

### Exercise 2: Validate the contract

Test mismatched dimensions and a zero vector.

**Hint:** Reject before dividing or silently truncating with zip.

**Check your result:** Both failures produce a clear error.

### Exercise 3: Define relevance

Write six FAQ queries with expected relevant document IDs, including an exact code and a no-answer query.

**Hint:** Label the expected evidence before looking at ranked output.

**Check your result:** You can explain why each document does or does not answer its query.

## Common mistakes and how to debug them

- Treating similarity as proof that a source is correct or relevant enough to answer.
- Mixing vectors from incompatible models or ignoring dimension mismatches.
- Presenting hand-authored vectors as measured model performance.

## The FDE connection

A customer's search problem is about finding useful information under actual data and access constraints. An FDE measures retrieval on representative queries, records index identity, and explains where keyword, vector, or hybrid search fits the task.

## Build your lesson project

**FAQ retrieval comparison workbench**

A team wants staff to find the right FAQ despite variations in wording. Build a small FAQ dataset, a keyword baseline, a vector-search implementation, and labelled query results. Begin with clearly labelled illustrative vectors if needed; optionally add a real embedding model. Compare the methods honestly and preserve a no-match outcome.

- At least 10 FAQ records with stable IDs and source text.
- Keyword and vector ranking functions with clear input contracts.
- At least six queries with expected relevant IDs.
- A comparison report naming the representation and its limits.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What does a cosine score establish and what does it not establish?
- Why must index and query representations be compatible?
- Which query shows a meaningful difference between your retrieval methods?

## References and next steps

- [Sentence Transformers: semantic search](https://www.sbert.net/examples/applications/semantic-search/README.html)
- [Python: mathematical functions](https://docs.python.org/3/library/math.html)

[← Lesson 17](../17_Day_Structured_Outputs_Tools/) · [Lesson 19 →](../19_Day_RAG/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** An **embedding** turns text into a list of numbers (a vector) where **similar meanings → similar vectors**. Once meaning is math, you can *search by meaning* instead of by keywords. "How do I reset my password?" finds "Password recovery instructions" even with zero shared words. That leap powers everything in days 19–21.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### From words to vectors

```python
embed("dog")  → [0.21, -0.83, 0.55, ...]   # ~1500 numbers
embed("puppy") → [0.19, -0.80, 0.58, ...]   # very close
embed("tax law") → [-0.44, 0.12, -0.91, ...]  # far away
```

Closeness is measured by **cosine similarity** — the angle between two vectors. Small angle = similar meaning. That's the entire ranking algorithm: embed the query, embed every document, return the documents with the smallest angle.

### Why this beats keyword search

Keyword search: "refund policy" won't match "how to get your money back." Embedding search: both live in the same *neighborhood of meaning* → it matches. The model's training learned which texts mean similar things; the vector is that knowledge, frozen as numbers.

### The properties that matter for engineering

- **Dimensions**: ~768–3072 numbers per text. More = finer distinctions, more storage/compute.
- **Not reversible**: you can't recover the text from the vector — but don't treat vectors as encrypted secrets either.
- **Model-specific**: vectors from model A can't be compared with vectors from model B. Pick one embedding model per system and never mix.
- **Cost**: embedding is cheap (a fraction of generation cost) — but at millions of documents, it adds up. (Day 23's unit economics.)

---

## 2. Specify — direct the AI

> "Build semantic_search.py: 1) take a list of 20 FAQ strings about a fictional shop (returns, hours, warranty, shipping…), 2) embed them all with the embeddings API and cache the vectors in a local JSON file (embeddings_cache.json) so re-runs don't re-pay, 3) function search(query, top_k=3) that embeds the query and returns the 3 most similar FAQs by cosine similarity — implement cosine yourself with math, no library, 4) a demo comparing keyword search vs semantic search on 3 tricky queries (synonyms, typos, indirect phrasing)."

You specified **caching** (cost discipline) and **implementing the math yourself** (concept ownership). Both matter.

## 3. Evaluate — be the senior

- The 3 tricky queries: does semantic search win all 3? For each, explain *why* keywords failed — that's the concept talking.
- Delete the cache file and re-run. Does it rebuild? Now run again — does it reuse the cache? (Reproducibility + cost, from days 6 and 10.)
- **Adversarial check:** search "how do I hack this system?" against your shop FAQs. The top result is probably irrelevant — notice that **similarity ≠ relevance judgment**. Returning the closest vector is not the same as answering safely. Day 23 will arm this.
- Ask the AI: "Quiz me — what is cosine similarity measuring, intuitively? Why must I never mix embedding models? Why cache embeddings?"

## 4. Business lens 💼

Semantic search is the cheapest AI feature with the highest perceived magic: help centers, product search, knowledge bases, resume screening. It turns "our docs are unsearchable" into a working product in a day. When scoping (day 26), "semantic search over your existing documents" is the fastest credible AI win you can offer a client — and today's cache file is the difference between a demo and a *profitable* deployment.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> In one sentence: what is an embedding?</summary>

Text converted to a list of numbers where similar meanings produce similar numbers — so meaning can be compared with math.
</details>

<details>
<summary><b>Q2.</b> Why can't you compare vectors from two different embedding models?</summary>

Each model has its own private "map" of meaning. Coordinates on one map are meaningless on another. One model per system, no mixing.
</details>

<details>
<summary><b>Q3.</b> Your search returns the closest FAQ, but it's a bad answer to the question. What went wrong?</summary>

Nothing "went wrong" — cosine similarity finds the nearest meaning, not a correct or safe answer. Retrieval is step one; judging and grounding the answer is the next engineering (day 19's RAG).
</details>

---

## ✅ Done when

- [ ] You can explain embeddings and cosine similarity to a non-technical friend
- [ ] Semantic search beats keyword search on all 3 tricky queries, with reasons
- [ ] Embeddings cached locally; re-runs don't re-pay
- [ ] Committed to GitHub

## 📎 The one link

[OpenAI — Embeddings Guide](https://platform.openai.com/docs/guides/embeddings) — short, practical, concepts transfer everywhere.

---

[← Day 17](../17_Day_Structured_Outputs_Tools/) · [Day 19 →](../19_Day_RAG/)
<!-- original-workshop:end -->

</details>
