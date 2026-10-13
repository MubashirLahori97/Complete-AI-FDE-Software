# 📖 Full Curriculum — 30 Days: Concepts, Engineering, Business

**Premise:** AI writes the code. Your job is the three things AI can't do for you: **understand concepts 100%, engineer systems with judgment, and turn software into business value.**

**The promise:** a normal person with zero knowledge — 30 days later — walks into a business, fixes a real problem with AI software, and gets paid for it. Learning is lifelong; earning starts on day 30.

**Time per day:** 60–90 minutes. **Rule:** a day isn't done until you can explain the concept in plain words *and* something runs.

**The daily loop:** Learn the concept → Specify it to AI → Evaluate what AI built → Business lens → Commit.

---

## WEEK 1 — How software actually works

*Theme: the concepts underneath every program ever written. Get these to 100% and everything later is just composition.*

### Day 1: Your toolchain + what a program IS
- **Concept:** A program is instructions + data. The toolchain (editor, interpreter, terminal, AI assistant) is just how instructions reach the machine.
- **Specify → AI builds:** You describe a greeting program; AI drafts it; you read every line.
- **Evaluate:** Ask the AI to quiz you line by line. Explain what `input`, variables, and `print` do — out loud.
- **💼 Business lens:** Every tool you installed is free. Your total startup cost: zero. That's why software businesses scale.
- **The one link:** [Python official tutorial](https://docs.python.org/3/tutorial/)
- **Done when:** It runs, you can explain each line, it's committed.

### Day 2: Data — types, variables, representation
- **Concept:** Everything is data with a *type*, and types decide what operations mean. `"2" + "2"` vs `2 + 2` is the whole lesson.
- **Specify → AI builds:** A unit converter. You specify the conversions and edge cases; AI drafts.
- **Evaluate:** Feed it garbage input. Does it crash? Make it not crash — and understand *why* your fix works.
- **💼 Business lens:** Wrong types cause real money bugs (currencies, quantities). Data modeling is a billable skill.
- **The one link:** [Asabeneh — 30 Days of Python, Day 2](https://github.com/Asabeneh/30-Days-Of-Python)
- **Done when:** You can explain every variable's type and why it matters.

### Day 3: Decisions & repetition — the logic of all software
- **Concept:** `if` = decisions, loops = repetition. Every app on earth is these two ideas composed.
- **Specify → AI builds:** A guessing game. *You* write the rules as a spec first ("the program picks 1–100, says higher/lower, counts tries") — then AI builds to your spec.
- **Evaluate:** Play it. Find a rule the AI got wrong. Fix the spec, not just the code.
- **💼 Business lens:** Writing a clear spec before building is literally what clients pay engineers for.
- **The one link:** [Asabeneh — 30 Days of Python, Days 9–10](https://github.com/Asabeneh/30-Days-Of-Python)
- **Done when:** You can explain every branch, and your spec produced the game you imagined.

### Day 4: Abstraction — the most important idea in software
- **Concept:** A function hides *how* and exposes *what*. Abstraction is how humans manage complexity — the single most valuable concept in the repo.
- **Specify → AI builds:** Have AI refactor your week-1 code into functions. Then *you* judge: which abstractions are good, which hide too much?
- **Evaluate:** For each function, answer: what does it hide, what does it expose, what would break if I changed it?
- **💼 Business lens:** Good abstractions = cheaper changes = cheaper maintenance. Clients pay for software that can evolve.
- **The one link:** [Corey Schafer — Python functions (YouTube)](https://www.youtube.com/@coreyms)
- **Done when:** You can explain abstraction with a non-code example (a car dashboard, a restaurant menu).

### Day 5: Collections & structured data
- **Concept:** Lists = ordered collections, dicts = labeled collections. Data *modeling* — choosing the right shape — is a design decision, not syntax.
- **Specify → AI builds:** A contact book. You design the data model first (what fields? what structure?); AI implements your model.
- **Evaluate:** Ask: what happens with 10,000 contacts? With duplicate names? Change the model and see what breaks.
- **💼 Business lens:** Every business app is a data model + operations. Modeling is the billable part; typing it is not.
- **The one link:** [Asabeneh — 30 Days of Python, Days 5 & 8](https://github.com/Asabeneh/30-Days-Of-Python)
- **Done when:** You can defend your data model choices in plain words.

### Day 6: State, persistence & failure
- **Concept:** Programs forget everything when they stop — unless state is persisted. And *everything fails*: files vanish, networks drop, users type nonsense. Engineering = expecting failure.
- **Specify → AI builds:** Contact book that saves/loads from a file. Specify the failure cases first ("file missing", "corrupted file").
- **Evaluate:** Delete the file. Corrupt it. Read every traceback top-to-bottom and point to the failing line.
- **💼 Business lens:** Downtime costs money. "What happens when it fails?" is the question that separates hobbyists from professionals.
- **The one link:** [Python docs — errors and exceptions](https://docs.python.org/3/tutorial/errors.html)
- **Done when:** You can read any traceback and name the exact failing line and why.

### Day 7: 🛠 Project 1 — scope & ship a complete tool
- **Concept:** Scoping: deciding what's in and what's out. A finished small thing beats an unfinished big thing — always.
- **Specify → AI builds:** A CLI expense tracker. Write a one-paragraph spec *before* touching AI. Build only what's in the spec.
- **Evaluate:** Give it to a friend (your first "client"). Watch silently. Note every confusion — that's your bug list.
- **💼 Business lens:** Watching a real user struggle with your software teaches more business than any course. Write down what surprised you.
- **The one link:** Your days 1–6 code — reuse it. Reference: [Asabeneh Day 30](https://github.com/Asabeneh/30-Days-Of-Python)
- **Done when:** A stranger can clone it and run it from your README alone.

---

## WEEK 2 — Engineering: the discipline around the code

*Theme: AI writes drafts. Engineers make them trustworthy, reproducible, and usable.*

### Day 8: Version control — time travel for software
- **Concept:** Git = a timeline of every decision. Branches = parallel universes. This is how teams (and your future self) stay sane.
- **Specify → AI builds:** Ask AI to explain what each of your past commits did — then rewrite them as a clean, professional history.
- **Evaluate:** Break something on a branch, merge a fix, read the diff. You should *see* the story.
- **💼 Business lens:** Clients and employers read your GitHub history. A clean history says "professional" before you say a word.
- **The one link:** [Pro Git book (free)](https://git-scm.com/book/en/v2)
- **Done when:** Your repo history reads like a story a stranger could follow.

### Day 9: How the internet works — requests, APIs, JSON
- **Concept:** The internet is programs talking to programs. HTTP = the language, APIs = the contracts, JSON = the packaging.
- **Specify → AI builds:** A weather CLI using a real API. You specify: what endpoint, what to display, what to do when the city doesn't exist.
- **Evaluate:** Draw the round trip: your code → request → server → response → your code. Explain each hop.
- **💼 Business lens:** Almost every paid AI product is "our system + someone else's API." Integration is where the money is.
- **The one link:** [MDN — HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- **Done when:** You can explain the full request/response round trip without notes.

### Day 10: Reproducibility — "works on my machine" is a bug
- **Concept:** Software must run *elsewhere*, not just on your laptop. Environments, dependencies, versions — the unglamorous stuff that decides whether software is real.
- **Specify → AI builds:** Have AI write a `setup.sh` that recreates your project from zero. Then test it in a fresh folder.
- **Evaluate:** Delete your venv and rebuild from your instructions. If it fails, your instructions were the bug.
- **💼 Business lens:** A client can't use what they can't install. Reproducibility is professionalism.
- **The one link:** [Python docs — venv](https://docs.python.org/3/tutorial/venv.html)
- **Done when:** Fresh clone + your steps = working program. No exceptions.

### Day 11: Modeling reality — objects (just enough)
- **Concept:** Classes model things with *state + behavior*. The key judgment: when does a class earn its existence vs. a simple function or dict?
- **Specify → AI builds:** Refactor the expense tracker into classes. Then argue *against* each class — could it be simpler?
- **Evaluate:** For every class, answer: what state does it own? What would break if it were a dict instead?
- **💼 Business lens:** Over-engineering costs clients money. The judgment of "just enough" is senior-level thinking.
- **The one link:** [Corey Schafer — Python OOP (YouTube)](https://www.youtube.com/@coreyms)
- **Done when:** You can defend every class — and name one you deleted.

### Day 12: Trust — testing & reading code
- **Concept:** Tests are *executable proof* that code does what you claim. In the AI era this matters more, not less: AI is confident and sometimes wrong.
- **Specify → AI builds:** Have AI write code with a subtle bug. Write the test that catches it. (Then fix the bug.)
- **Evaluate:** Read one file of a real open-source project. Summarize what it does in 3 sentences.
- **💼 Business lens:** "How do you know it works?" — the first question any serious client asks. Tests are your answer.
- **The one link:** [pytest — getting started](https://docs.pytest.org/en/stable/getting-started.html)
- **Done when:** `pytest` passes and you can explain what each test proves.

### Day 13: Interfaces — logic humans can use
- **Concept:** Logic without an interface is invisible. A UI translates human intent into function calls — that's all it is.
- **Specify → AI builds:** Your expense tracker as a Streamlit web app. Specify the screens first, in words.
- **Evaluate:** Watch a non-technical person use it without your help. Every hesitation is a design flaw.
- **💼 Business lens:** Clients don't buy code; they buy interfaces. The UI *is* the product to them.
- **The one link:** [Streamlit docs](https://docs.streamlit.io/)
- **Done when:** A non-coder can use it with zero explanation from you.

### Day 14: 🛠 Project 2 — deployment: your first live URL
- **Concept:** Deployed software lives on someone else's computer, serving strangers. Deployment is where "my project" becomes "a product."
- **Specify → AI builds:** Deploy your app to Streamlit Cloud. Specify what could differ from your laptop (secrets, paths, versions).
- **Evaluate:** Open it on your phone, on mobile data, logged out. Fix the first production-only bug.
- **💼 Business lens:** A live URL changes every conversation: "here, try it" beats any slide deck. Share it with 3 people.
- **The one link:** [Streamlit — deploy](https://docs.streamlit.io/deploy)
- **Done when:** It works for strangers, and your README has the live link.

---

## WEEK 3 — AI engineering: concepts behind the magic

*Theme: how AI systems actually work — deeply enough to design, evaluate, and debug them.*

### Day 15: How LLMs actually work (practical)
- **Concept:** Next-token prediction at scale. Tokens = the unit of thought *and* money. Context window = working memory. Temperature = randomness dial.
- **Specify → AI builds:** Your first API call. Specify the model, max tokens, temperature — and predict the cost before running.
- **Evaluate:** Run the same prompt at temperature 0 vs 1. Explain the difference. Calculate the cost of 10,000 users.
- **💼 Business lens:** Tokens are money. Every AI business is token economics: cost per user vs. price per user. Do the math.
- **The one link:** [OpenAI API quickstart](https://platform.openai.com/docs/quickstart) (or Google AI Studio — free)
- **Done when:** You can explain tokens, context, and temperature to a non-technical friend.

### Day 16: Specification — prompts as engineering
- **Concept:** A prompt is a *specification* given to a guessing machine. Vague specs → random output. Precise specs → reliable behavior.
- **Specify → AI builds:** A ticket classifier that outputs JSON, right 10/10 times. Improve the *spec* step by step, not the code.
- **Evaluate:** 10 test tickets. Score it. Find the one it gets wrong and fix the specification.
- **💼 Business lens:** "Make it behave reliably" is what businesses pay for. Reliability is the product.
- **The one link:** [Anthropic — prompt engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- **Done when:** 10/10 correct, and you can say *why* each spec sentence exists.

### Day 17: Connecting models to code — tools
- **Concept:** Tool calling = the model decides *what* to do, your code does *how*. The contract between them (the schema) is the engineering.
- **Specify → AI builds:** A natural-language calculator: model calls your `calculate()`. You define the tool contract.
- **Evaluate:** Draw the full loop: user → model → tool call → your code → model → answer. Break one link; observe.
- **💼 Business lens:** Tools are how AI touches real business systems (databases, bookings, payments). This is the integration money from day 9, supercharged.
- **The one link:** [OpenAI — function calling](https://platform.openai.com/docs/guides/function-calling)
- **Done when:** You can draw the loop from memory and explain each arrow.

### Day 18: Meaning as math — embeddings
- **Concept:** Embeddings turn meaning into coordinates. Similar meaning = nearby coordinates. This single idea powers search, RAG, and recommendations.
- **Specify → AI builds:** Semantic search over 50 FAQs. Specify: what should match that keyword search would miss?
- **Evaluate:** Write the example where keyword search fails and semantic wins. Explain *why* in plain words.
- **💼 Business lens:** "Search that understands what I mean" is a feature businesses pay for. You now know the 10-line version of it.
- **The one link:** [OpenAI — embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- **Done when:** You can explain embeddings with the king−man+woman intuition, correctly.

### Day 19: RAG — grounding AI in real documents
- **Concept:** Models hallucinate; documents don't. RAG = retrieve the facts, then generate *from* them, with citations.
- **Specify → AI builds:** A Q&A bot over a real PDF. Specify chunking, and what "I don't know" looks like.
- **Evaluate:** 5 questions. Check every answer against the source. Try one question the docs can't answer — it must admit ignorance.
- **💼 Business lens:** "Chat with our documents" is the #1 requested AI feature in businesses. You can now scope and price it.
- **The one link:** [LangChain — RAG concepts](https://python.langchain.com/docs/concepts/rag/)
- **Done when:** Cited answers, plus one honest "I don't know."

### Day 20: Agents — goals, tools, and loops
- **Concept:** An agent = a goal + tools + a loop (reason → act → observe → repeat). Powerful and dangerous: loops can spiral.
- **Specify → AI builds:** A research agent. Specify the goal, the tools, the max steps, and the stop conditions.
- **Evaluate:** Read its full thought/action log. Narrate *why* it did each step. Find one dumb decision and fix the spec.
- **💼 Business lens:** Agents are sold as magic and fail as magic. The business value is in *constrained* agents with clear stop rules — that's your edge.
- **The one link:** [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- **Done when:** You can narrate its decisions and it always stops cleanly.

### Day 21: 🛠 Project 3 — a live AI product
- **Concept:** Composition: everything from week 3 as one working system.
- **Specify → AI builds:** Deploy a RAG chatbot over real documents. Spec first: what it knows, what it refuses, what success looks like.
- **Evaluate:** Stranger-test it. Collect the confusing moments. Add "try these questions" prompts.
- **💼 Business lens:** This is a demo you can show a paying client next week. Price it in your head: what would you charge to build this for a business?
- **The one link:** [Streamlit — deploy](https://docs.streamlit.io/deploy)
- **Done when:** A stranger uses it unaided and understands what it does.

---

## WEEK 4 — Ship like a Forward Deployed Engineer

*Theme: the FDE is where engineering meets business — deployed systems, real clients, real money.*

### Day 22: Proof — evaluating AI systems
- **Concept:** AI output is guess-based, so "it worked once" proves nothing. Evals = a fixed test set you re-run — your regression safety net.
- **Specify → AI builds:** A 20-question eval set for your chatbot, with a scoring rubric. AI can help *draft* questions; you approve each one.
- **Evaluate:** Run it. Record the score: "my bot scores X/40." Change your prompt, re-run, prove improvement (or catch regression).
- **💼 Business lens:** Evals are how you *sell* reliability: "we test every change against 40 cases" is a sentence clients pay for.
- **The one link:** [OpenAI cookbook — evaluation](https://cookbook.openai.com/)
- **Done when:** You have a number, a re-runnable suite, and both are committed.

### Day 23: Production reality — safety, attacks & cost
- **Concept:** Production AI = guardrails + threat modeling + unit economics. The model is 20%; everything around it is 80%.
- **Specify → AI builds:** Attack your own bot (5 prompt injections). Specify the guardrails, rate limits, and token budget.
- **Evaluate:** Every attack must fail gracefully. Compute cost per 1,000 users. Set a budget that pages you.
- **💼 Business lens:** Do the full unit economics: cost per user per month vs. price. If the math doesn't work, the product doesn't work.
- **The one link:** [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- **Done when:** It survives your attacks and you know its cost per 1,000 users.

### Day 24: Backends — APIs & persistence
- **Concept:** Frontends are faces; backends are the business. An API is a *contract* other software builds on. Databases are memory that outlives the process.
- **Specify → AI builds:** A FastAPI backend for your chatbot: `POST /ask`, feedback storage, stats. Spec the endpoints first.
- **Evaluate:** Hit it with `curl`. Break the contract (wrong fields) — does it reject cleanly?
- **💼 Business lens:** APIs are products too — many AI businesses *are* APIs. Contracts, versioning, and uptime are the business model.
- **The one link:** [FastAPI — first steps](https://fastapi.tiangolo.com/tutorial/first-steps/)
- **Done when:** `curl` returns a real RAG answer and every Q/A is stored.

### Day 25: Operations — logging, tracing & runbooks
- **Concept:** You can't fix what you can't see. Observability = the system telling you its story: what happened, how slow, at what cost.
- **Specify → AI builds:** Request IDs, latency + token + cost logging, a simple dashboard. Specify the 5 questions your logs must answer.
- **Evaluate:** Answer "what happened yesterday at 3pm?" from your logs. Write the runbook: "if the bot is slow, check these 5 things in order."
- **💼 Business lens:** Uptime is a promise you sell. Runbooks are how a one-person operation keeps promises like a team.
- **The one link:** [FastAPI — middleware](https://fastapi.tiangolo.com/tutorial/middleware/)
- **Done when:** Your logs answer the 5 questions and the runbook is committed.

### Day 26: 💼 Discovery — turning human problems into specs
- **Concept:** The most valuable skill in the repo: *discovery*. Clients describe pains, not specs. Your job: listen, ask, and translate pain into a buildable, priced scope.
- **Specify → AI builds:** Interview a real small business for 20 minutes (AI helps you *prepare* questions, not conduct it). Write a one-page brief: problem, users, in-scope, out-of-scope, price.
- **Evaluate:** Is the brief so clear a stranger could build v1? What's deliberately excluded — and why?
- **💼 Business lens:** This IS the business. Discovery → scoped brief → price → build → deploy. The FDE loop in one day.
- **The one link:** [The Mom Test — official site](https://www.momtest.com/) (short book on asking honest questions; library has it)
- **Done when:** The brief exists as `CLIENT_BRIEF.md` — clear enough for a stranger to build from.

### Day 27: 💼 Packaging — portfolio & getting paid
- **Concept:** Skill that can't be *seen* can't be *bought*. Packaging = making your work legible to non-technical buyers in 60 seconds.
- **Specify → AI builds:** AI drafts your GitHub profile README and project READMEs; you rewrite every line until a non-technical friend "gets it."
- **Evaluate:** The 60-second test: show your profile to someone non-technical. Can they say what you do and why it matters?
- **💼 Business lens:** List 10 companies hiring AI/FDE roles. Read what they actually ask for. Map your 3 projects to their requirements — that's your pitch.
- **The one link:** Your own repos, read as a hiring manager: [github.com/MubashirLahori97](https://github.com/MubashirLahori97)
- **Done when:** A stranger understands your value in 60 seconds, and you have a target list.

### Day 28: 🏁 Capstone, part 1 — build a client-grade system
- **Concept:** Everything composed under a deadline: RAG + API + guardrails + evals + database — specified, evaluated, and tested by you.
- **Specify → AI builds:** Take your day-26 brief (or invent a client). Write the full spec *before* AI writes a line. Build to the spec.
- **Evaluate:** Eval suite passes at your bar. A second human tests it; fix what confuses them.
- **💼 Business lens:** Write the proposal you'd send the client: scope, timeline, price. Even if fictional, the exercise is the skill.
- **The one link:** Everything you've built — you're the resource now.
- **Done when:** It works for someone who isn't you, with evals to prove it.

### Day 29: 🏁 Capstone, part 2 — deploy it live
- **Concept:** Shipping = the entire deployment checklist + monitoring + telling the world. Undeployed work has zero business value.
- **Specify → AI builds:** Deploy with a checklist (AI drafts it; you verify each item). Write the launch post: problem, what you built, demo link, lessons learned.
- **Evaluate:** 5 real humans try it. Collect feedback. Fix the top complaint within the day.
- **💼 Business lens:** The launch post IS marketing. Founders and freelancers get clients from posts exactly like this one.
- **The one link:** [Render — deploy a Python app](https://render.com/docs)
- **Done when:** The link works, 5 humans tried it, the post is published.

### Day 30: 💼 Ship it — demo, retrospective, next 90 days
- **Concept:** The story of the work is part of the work. Retrospectives turn experience into judgment.
- **Specify → AI builds:** A 3-minute demo video (you present; AI helps script it) + written retrospective + next-90-day plan.
- **Evaluate:** The retrospective must name: what broke, what you'd do differently, which concept was hardest and why.
- **💼 Business lens:** Your next 90 days: pick ONE depth area and ONE way to get paid (freelance FDE work, a job, a micro-product). Write it down. Commit to it publicly.
- **The one link:** Your commit history — 30 days of proof: [the repo](https://github.com/MubashirLahori97/Complete-AI-FDE-Software)
- **Done when:** Anyone can see: 30 days ago I couldn't build software; today I ship AI systems and understand them.

---

## After day 30

You have what AI can't give you: **concepts at 100%, engineering judgment, and business sense.** The next 90 days: go deep in one area, build one serious thing in it, and start charging — freelance, employment, or your own product. Your edge as an FDE: you speak both languages, the client's problem and the engineer's solution.

*AI writes the code. You do everything that matters around it. Fork this repo, do it in public, and show your work.*
