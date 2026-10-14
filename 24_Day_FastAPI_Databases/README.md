# Day 24 — Backend APIs, databases, and durable feedback

A backend owns shared rules and durable state behind a contract other programs can use. Today you will connect HTTP input validation, database operations, and explicit error behavior. Your project is a small FastAPI feedback service for the assistant, with parameterized SQL and a documented trust boundary.

**Your project:** [FastAPI feedback and question service](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Specify API methods, request fields, response fields, and failure categories.
- Store and retrieve records using parameterized SQL.
- Distinguish request validation, authentication, authorization, and database consistency.

## Understand the concept

### An API is a caller-facing contract

Describe what POST /feedback accepts, what a successful response contains, and which invalid inputs are rejected. HTTP validation and domain validation are related but different: a string can be structurally valid while being an empty or unauthorized source reference. FastAPI can parse and validate declared request shapes, but your application still owns domain rules and resource permissions. Keep responses stable enough for callers to handle them deliberately.

### SQL separates values from commands

Parameterized queries pass values separately from SQL text. Building SQL by joining arbitrary input into a command risks confusing data with executable syntax. Use stable record IDs and constraints appropriate to the model. Transactions group related changes that must succeed or fail together. A single-process SQLite demonstration helps teach durable data, but production concurrency, migrations, backups, and recovery need their own operating plan.

### Trusted identity and validation are different

A valid feedback payload does not establish who sent it or whether they may inspect another user's feedback. Authenticate at a trusted boundary, then authorize the requested operation. For a local lesson prototype, a clearly labelled identity fixture can demonstrate policy, but a free-form user ID header is not production authentication. Keep provider credentials on the backend and avoid returning private internals in error responses.

## A worked example, step by step

User content is a parameter value, not part of the SQL command structure.

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE feedback (id INTEGER PRIMARY KEY, note TEXT NOT NULL)")
note = "The source passage helped me check the answer."
with connection:
    connection.execute("INSERT INTO feedback (note) VALUES (?)", (note,))
row = connection.execute("SELECT id, note FROM feedback WHERE id = ?", (1,)).fetchone()
print("Stored feedback:", row[0])
print(row[1])
connection.close()
```

**Expected result**

```text
Stored feedback: 1
The source passage helped me check the answer.
```

The connection creates a temporary in-memory database. The placeholder question mark marks a value position, and the tuple supplies the value separately. The connection context manages transaction success or failure, and the later explicit close releases the connection. The SELECT also uses a parameter. An in-memory database disappears when closed, so a durable service must use a documented file path or another persistence system and test a real restart.

## Practise before building

### Exercise 1: Write the endpoint contract

Specify feedback input, successful output, invalid input, and missing-record behavior before implementing HTTP handlers.

**Hint:** Use concrete example requests and responses.

**Check your result:** A frontend developer can build against the contract without reading database internals.

### Exercise 2: Separate data from SQL

Store a note containing quotation marks through a parameterized query.

**Hint:** Pass it as a value instead of escaping it into command text.

**Check your result:** The complete note is stored as data and the table still exists.

### Exercise 3: Test durable restart

Change the demonstration to a disposable file database and inspect it after reopening the connection.

**Hint:** Document the file location and commit behavior.

**Check your result:** The record remains after process restart.

## Common mistakes and how to debug them

- Concatenating request input into SQL commands.
- Treating a valid request schema as authentication or authorization.
- Claiming persistence based only on an in-memory database demonstration.

## The FDE connection

An FDE connects customer-facing workflows to trusted shared state. The API contract, permission boundary, and database operating story should be understandable to both the integration team and the future operator.

## Build your lesson project

**FastAPI feedback and question service**

Build POST /feedback, GET /feedback/{id}, and POST /ask for the fictional assistant. Use validated request models, a documented SQLite file, parameterized queries, and a trusted-identity boundary or explicitly labelled local identity fixtures. Reuse your answer contract and make invalid, missing, and forbidden outcomes clear. Verify the current FastAPI installation command in the linked documentation.

- An API contract and runnable FastAPI service with documented setup.
- A durable feedback schema and parameterized storage layer.
- Request validation and explicitly scoped access checks.
- HTTP, restart, and invalid-input test results.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which rules belong to schema validation versus authorization?
- What makes the SQL operation safe for arbitrary note text?
- What evidence proves the feedback is actually durable?

## References and next steps

- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Python: sqlite3](https://docs.python.org/3/library/sqlite3.html)

[← Lesson 23](../23_Day_Guardrails_Cost/) · [Lesson 25 →](../25_Day_Observability_Debugging/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Streamlit is a demo vehicle; **real products need a backend**: an API (FastAPI) that serves your AI logic to any client — web, mobile, WhatsApp — and a **database** (SQLite/Postgres) that remembers users, conversations, and usage. Today your RAG chatbot grows a spine: HTTP in, answers out, everything recorded.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### Why a backend

```
Before:  Streamlit app (UI + logic glued together, one user at a time)
After:   FastAPI server ← HTTP → any client (web/mobile/bot)
              ↓
         Database (users, conversations, token usage)
```

The API is a **contract** (day 4's idea, at system scale): `POST /ask {"question": "..."}` → `{"answer": "...", "sources": [...], "tokens_used": 412}`. Any client can use it. Your AI logic becomes a *service*.

### FastAPI in 20 lines

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AskRequest(BaseModel):
    question: str          # validated automatically: must be a string

class AskResponse(BaseModel):
    answer: str
    sources: list[str]
    tokens_used: int

@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    # your RAG pipeline from day 19 goes here
    ...
```

**Pydantic models are contracts**: bad input gets rejected with a clear error before your code ever sees it. This is validation (day 17's law #1) built into the framework.

### The database: memory that survives restarts

SQLite (a single file, zero setup) is perfect now; Postgres later when you scale. One table to start:

```sql
CREATE TABLE interactions (
    id INTEGER PRIMARY KEY,
    timestamp TEXT,
    question TEXT,
    answer TEXT,
    tokens_used INTEGER,
    was_refusal BOOLEAN
);
```

Every answer your API gives gets recorded. That table **is** your usage billing, your eval data (day 22), and your debugging history (day 25) — one table, three jobs.

---

## 2. Specify — direct the AI

> "Convert my RAG chatbot to a FastAPI backend: 1) POST /ask with Pydantic request/response models including tokens_used, 2) every interaction logged to SQLite with timestamp, question, answer, tokens, refusal flag, 3) GET /stats returning total questions, total tokens, total estimated cost, refusal rate — computed from the DB, 4) keep the Streamlit UI but make it call the API instead of the pipeline directly, 5) run with uvicorn; document the endpoints in the README."

You specified **the contract, the logging, and the stats** — the three things that make a backend production-shaped.

## 3. Evaluate — be the senior

- `curl` the API directly (no UI). Bad input (`{"question": 123}`) → clean 422 error, not a crash? Contracts hold?
- Ask 5 questions through the UI, then check `/stats` and query the DB directly. Do the numbers match? **Your billing depends on this table being right.**
- Kill the server mid-answer (Ctrl+C). Restart. Is the history intact? (That's the point of the database.)
- Load test lightly: 20 rapid requests. Does anything break? (You don't need perfection — you need to *know* the limit.)
- Ask the AI: "Quiz me — why does a backend beat Streamlit-only for real products? What do Pydantic models guarantee? What three jobs does the interactions table do?"

## 4. Business lens 💼

**An API turns your AI work into something businesses can buy and integrate.** "Here's your endpoint and docs" beats "here's a demo link" — it plugs into *their* systems (their website, their WhatsApp, their internal tools). And the interactions table is your business intelligence: which questions are asked most (→ new features), what it costs per client (→ pricing), where it refuses (→ doc gaps to fix, billable work). The backend isn't just servers and setup — it's the business.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> What does a Pydantic model guarantee at your API boundary?</summary>

That incoming data matches the contract (types, required fields) — invalid requests are rejected with clear errors before touching your logic. Validation at the border.
</details>

<details>
<summary><b>Q2.</b> Why log every interaction to the database?</summary>

One table serves three jobs: usage billing (tokens per client), eval data (real questions to test against), and debugging history (what happened when something went wrong).
</details>

<details>
<summary><b>Q3.</b> A client asks "can our mobile app use your chatbot?" — what changed by having a backend?</summary>

Nothing needs rebuilding: the API contract already serves any HTTP client. That's the whole point — the AI logic is a service now, not a demo page.
</details>

---

## ✅ Done when

- [ ] You can explain backends, API contracts, and the DB's three jobs in plain words
- [ ] `/ask` works via curl; bad input gets clean errors; `/stats` matches the DB
- [ ] Streamlit UI calls the API; history survives a restart
- [ ] Committed to GitHub

> 🔭 **Coming back to this:** [Phase 2, weeks 1–2](../31_Phase2_Build_Like_An_Engineer/) rebuilds everything you touched today — Postgres with migrations, a documented API strangers can use. Today you met the backend. There, you'll own it.

## 📎 The one link

[FastAPI Tutorial — First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/) — the official tutorial; you'll use the first half today.

---

[← Day 23](../23_Day_Guardrails_Cost/) · [Day 25 →](../25_Day_Observability_Debugging/)
<!-- original-workshop:end -->

</details>
