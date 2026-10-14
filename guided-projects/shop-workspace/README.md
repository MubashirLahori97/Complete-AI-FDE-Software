# Amina's runnable shop workspace

This is a learning reference for lessons 15–30. It connects a real React/TypeScript page, FastAPI HTTP endpoints, SQLite records, sessions, permissions, policy retrieval, and controlled provider adapters. The default assistant is **offline-extractive**: it searches words and returns exact policy text. It is not a language model. Refunds change simulated learning data only.

First run one complete flow. Then follow your lesson's PROJECT.md and implement the required extensions. This reference does not implement every extension, production infrastructure, or an autonomous agent. Independent work and review remain necessary.

## 1. Prepare the server

Use Python 3.11+ and Node 22.12+ (the checked reference used Python 3.11 and Node 24). Open a terminal in this folder.

On Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python server.py --seed
.venv\Scripts\python -m unittest -v test_service
.venv\Scripts\python server.py
```

On macOS/Linux:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python server.py --seed
.venv/bin/python -m unittest -v test_service
.venv/bin/python server.py
```

The server listens on `http://127.0.0.1:8000`. Open `/api/health` and `/docs`. Leave this terminal running. Tests use temporary databases and fixture provider outcomes; they make no paid API call. If installation fails, read the error before proceeding. Never run tests against the shop.db you want to keep.

## 2. Start the page

In a second terminal:

```sh
cd frontend
npm ci
npm run typecheck
npm run dev
```

Open `http://127.0.0.1:5173`. The development proxy forwards `/api` to the server. Sign in with **amina** and password **learn-with-amina**. These are intentionally public local learning credentials. Customers **sara** and **omar**, and other-shop staff **bilal**, use the same local password.

1. Save a message, then reload and find it again.
2. Ask “Can I return unopened goods?” and inspect the returned source id and version.
3. Ask an unrelated question and observe the human fallback.
4. Sign in as bilal and verify Amina's sources and records stay unavailable.
5. Stop the server and try saving. The page retains the draft. Restart and retry; its action key prevents duplicate saves within that page session.

The key is kept in memory. An independent extension can persist a pending action safely across reloads. A retry with the same key and different text returns 409.

## 3. Trace the actual boundaries

- `frontend/src/main.tsx`: labels, state, draft retention, response validation, same-origin fetch, and idempotency key.
- `server.py`: request models, session identity, CSRF, shop/owner filtering, SQLite statements, proposal approvals, and AI adapters.
- `test_service.py`: connected HTTP/database tests, denied access, persistence, expiry, replay, budgets, provider failure, and log privacy.
- `evaluate.py`: a small reproducible **offline** retrieval baseline. It is a seed evaluation set, not the independent 30-case dataset required in lesson 24.

Sessions store hashes of authentication tokens, use one-hour expiry, and are invalidated on logout. Every write needs the session's CSRF token. Customer records are scoped to their owner; staff records are scoped to their shop. SQL values use placeholders. Login is limited to 30 attempts/hour per observed client; each signed-in AI operation is limited to 20 requests/hour. These teaching limits need a production review, especially behind proxies.

The policy corpus is intentionally tiny. The real embedding adapter embeds it on each request to keep the reference understandable. An independent extension should cache versioned document embeddings, rebuild changed documents, evaluate thresholds, and preserve permission filters.

## 4. Try approval using the API

Use `/docs` or an HTTP client. Sign in through `/api/auth/login`, retain its cookie, and send the returned csrf as `X-CSRF-Token`.

1. `POST /api/proposals` with `{"order_id":1,"amount":1200}` as Amina staff.
2. Inspect the returned exact amount and order before approving its id.
3. `POST /api/proposals/{id}/approve`.
4. `POST /api/proposals/{id}/execute`.
5. Repeat execution: it returns 409 and creates no second simulated refund.

Approval expires after five minutes, belongs to the stored immutable proposal, and is consumed on execution. Execution checks current balance in a transaction. The browser reference does not provide a staff approval screen; building an accessible exact-details screen is a useful independent extension. A model has no capability to call the approval endpoint in this reference.

## 5. Real provider experiment, explicitly configured

Core practice requires no API key. For a real experiment, set **server-side** variables in the server terminal: `AI_MODE=openai`, `OPENAI_API_KEY`, `OPENAI_MODEL`, and `OPENAI_EMBEDDING_MODEL`. Select models supported by your account using the current provider documentation. The template .env.example is not automatically loaded. Never put a real key in a file you commit or in frontend configuration.

Real mode calls the official SDK for embeddings and Responses structured output. Retrieval returns permitted sources; the model selects a source and exact quote, and the service validates both against the authorized corpus. It returns the source text rather than an unchecked generated policy promise. A valid source selection may still be semantically irrelevant: evaluate real answers independently.

The SDK has a ten-second timeout and no automatic retries. Context is bounded by the small corpus and 500-character question; output is capped. Set an account spend limit and calculate current model costs before your explicit experiment. The request-count guard is not a currency budget. Record actual provider usage, latency, versions, and failures for lesson 19/24. Tests use a SDK double and **do not** prove a real model's performance.

`POST /api/classify` uses an explicitly labelled keyword baseline offline; real mode validates category/confidence and sends low-confidence or failed outcomes to human review. Confidence is a heuristic signal. Calibrate the policy with labelled evaluation rather than assuming a probability.

## 6. Build and rehearse a release

```sh
cd frontend
npm ci
npm run build
```

Restart the Python server afterward. It serves the built page at `http://127.0.0.1:8000` from the same origin. Run tests, check health, and reproduce the message and policy flows. The page at port 5173 is only the development server.

Before an actual production deployment, configure HTTPS, `APP_ENV=production`, explicit `ALLOWED_HOSTS` and `ALLOWED_ORIGINS`, private credentials, real identity provisioning, log access/retention, dependency review, and process supervision. Production mode requires explicit hosts and uses Secure cookies. Do not seed the public learning accounts into a production database. A host/proxy deployment is an independent lesson 29 task, not an automatic action of this kit.

Back up SQLite using its backup API while the service is stopped or using a consistent connection. Restore to a separate file, run integrity checks, and compare important records. Practice a failed local release, restore the known code and intended data, restart, and repeat the main flow. Code rollback alone does not restore database changes.

## 7. Prove your independent change

Choose one requirement with a reviewer: versioned policy expiry, cached embeddings, a bounded workflow controller, an approval screen, cancellation of stale requests, or pending-action persistence. Agree on acceptance, implement without its solution, run normal/denied/failing tests, and explain the result. Retain a focused commit, reproducible commands, a safe report, and reviewer feedback. The readiness review uses that evidence rather than reference-code copying.
