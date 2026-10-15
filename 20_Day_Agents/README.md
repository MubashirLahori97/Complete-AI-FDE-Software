# Day 20 — Agents, bounded workflows, and observable tool use

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** A bounded policy-research assistant. You can take several study sessions.

**The situation:** A research assistant keeps searching because it never decides it has enough information.

### One idea: Give a tool-using workflow a stopping rule

A workflow follows planned steps. In an agent-style loop, a model may choose the next action based on the current information. That flexibility needs boundaries: permitted tools, a step limit, a budget, and explicit stopping conditions. For a predictable task, a fixed workflow may be easier to test. More autonomy is useful only when it helps the actual task.

**New words:**

- **Workflow:** An arranged sequence of actions for a task.
- **Agent loop:** Repeatedly choosing an action, observing its result, and deciding what to do next.
- **Step limit:** The maximum number of actions allowed before stopping.

### Follow the example below

1. The example walks through a fixed sequence of actions with a maximum number of steps.
2. Each step is checked before continuing. Reaching a boundary stops further actions.
3. This deterministic demonstration shows control flow. It is not proof of a live model's planning ability.

### Try one small decision

A tool keeps returning no useful evidence. What should a bounded assistant do?

1. Stop at its limit and report what remains unresolved
2. Search forever until it finds any answer
3. Ignore permission rules for the next attempt

<details>
<summary>A small hint</summary>

Think about what happens when the happy path never arrives.

</details>

<details>
<summary>Another hint</summary>

Define a useful failure result before starting the loop.

</details>

<details>
<summary>Answer and explanation</summary>

**Stop at its limit and report what remains unresolved** Yes. A controlled stop preserves the evidence and avoids endless resource use.

</details>

**Then practise:** Reduce the example's step limit. Run the same action plan again and inspect where it stops and what result it reports.

**Your project's first action:** Draw a research loop with an allowed search tool, a maximum of three steps, and outcomes for enough evidence, no evidence, and tool failure.

**How it connects:** Combine the tool boundary from Day 17 with the evidence rule from Day 19. Start with fixed steps before experimenting with model-selected actions.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

A tool-using agent observes a situation, selects an action, receives a result, and may continue toward a goal. That loop is useful only when its authority, resource limits, and stop conditions are explicit. Today you will compare a fixed workflow with an agent loop and build a bounded research assistant over a small approved knowledge collection.

**Your project:** [A bounded policy-research assistant](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Distinguish a fixed workflow from model-directed action selection.
- Enforce step, time, and budget limits in application code.
- Record observable actions and results without depending on hidden model reasoning.

## Understand the concept

### Use the least complex useful workflow

A fixed workflow follows a predefined sequence. An agent chooses some actions dynamically based on observations and a goal. If the task has a predictable structure, a fixed pipeline may be easier to test, operate, and explain. Dynamic choice adds failure possibilities such as repeated searches, invalid tools, and premature conclusions. Decide whether that flexibility improves the actual customer outcome enough to justify its cost.

### Constraints must exist outside the prompt

Limit steps, wall-clock time, allowed tools, and resource spending in application logic. The model should not be able to extend its own budget or approve a forbidden action. Provide clear outcomes for completed work, insufficient evidence, tool failure, and exhausted budget. Repeated failed attempts should not amplify an incident indefinitely. If a tool has side effects, authorization and idempotency are additional requirements beyond a loop counter.

### Observable traces support investigation

Record the proposed tool, validated arguments, accepted or rejected action, tool result category, elapsed time, and final outcome. These application-visible events are useful evidence. Do not depend on access to a model's hidden chain of thought or publish sensitive prompts and documents indiscriminately. A safe trace should let an operator reconstruct what the system did and why the application accepted it, even when the model's internal processing is unavailable.

## A worked example, step by step

An application-enforced step budget stops an unfinished scripted workflow.

```python
actions = ["search policy", "read evidence", "search again", "search again"]
max_steps = 3
completed = False
for step, action in enumerate(actions, start=1):
    if step > max_steps:
        print("Stopped: step budget exhausted")
        break
    print(f"Step {step}: {action}")
    if action == "finish":
        completed = True
        break
print("Completed:", completed)
```

**Expected result**

```text
Step 1: search policy
Step 2: read evidence
Step 3: search again
Stopped: step budget exhausted
Completed: False
```

enumerate supplies an explicit step number. The budget check happens before executing the next action. A completion flag distinguishes a stopped loop from a successful task. The fixture deliberately never finishes, exposing the budget outcome. In a real agent, a model adapter could propose actions, but the same application checks must remain authoritative. Add timeouts and tool validation rather than assuming a step count covers every failure.

## Practise before building

### Exercise 1: Compare workflow and agent

Describe a task that only needs a fixed lookup and one that might benefit from dynamic research.

**Hint:** Identify what decisions must vary between inputs.

**Check your result:** The extra flexibility has a specific user benefit.

### Exercise 2: Test each stop outcome

Add finish, invalid-action, and failed-tool fixtures.

**Hint:** Do not label every stopped loop completed.

**Check your result:** Success, failure, and budget exhaustion remain distinguishable.

### Exercise 3: Design a safe trace

List the event fields needed to investigate tool execution without copying private document text.

**Hint:** Use IDs, categories, timings, and validated action names.

**Check your result:** The trace explains actions without depending on hidden reasoning.

## Common mistakes and how to debug them

- Adding an agent when a simpler fixed workflow solves the task.
- Asking the model to stop without enforcing a resource boundary in code.
- Treating hidden chain-of-thought access as a required operational log.

## The FDE connection

Customers need predictable authority and operations more than a dramatic agent demonstration. An FDE chooses the simplest effective flow, constrains its actions, and makes failures understandable to the people who will operate it.

## Build your lesson project

**A bounded policy-research assistant**

A team needs a short evidence-based summary from approved fictional policy documents. Build a workflow with search, read, and finish actions, then optionally replace scripted action selection with a model adapter. Enforce resource limits, permitted tools, and no-answer behavior in code. The first version is read-only and cannot send messages or modify business records.

- An allowed-tool contract and fixed or model-selected action interface.
- Application-enforced step, timeout, and budget policies.
- An inspectable trace of actions and result categories.
- Fixtures for success, tool failure, invalid action, and budget exhaustion.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which decisions benefit from an agent instead of a fixed flow?
- Who controls limits and permissions?
- What observable events explain a failed run?

## References and next steps

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

[← Lesson 19](../19_Day_RAG/) · [Lesson 21 →](../21_Day_Project3_RAG_Chatbot/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** An **agent** = an LLM in a **loop**: *perceive* (read the goal + current state) → *think* (decide the next step) → *act* (call a tool) → *observe* the result → repeat until the goal is done or a limit hits. Tools (day 17) were single calls; agents are the model **choosing its own sequence of calls** to reach a goal. Powerful, and the hardest thing here to keep safe.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The loop, drawn

```
Goal: "Book me the cheapest flight option summary for Friday"

Loop (max 8 steps):
  1. THINK: "I need flight options → I have search_flights tool"
  2. ACT:   search_flights(day="Friday")
  3. OBSERVE: got 6 options
  4. THINK: "Cheapest is option 3 → summarize"
  5. ACT:   (no tool needed) write summary
  6. DONE
```

The model's "thinking" is just more token prediction — but framed as planning, it produces step-by-step behavior. The **system prompt carries the rules**: what tools exist, when to stop, what never to do.

### The three things that make agents work

1. **A sharp goal + stop conditions.** "Research X and summarize" works. "Do something useful" doesn't. Always: max steps, and a clear definition of done.
2. **Honest tools with clear descriptions** (day 17). The agent is only as capable as its tools are legible.
3. **Scratchpad memory.** The agent keeps its running notes ("tried X, got Y, next: Z") in the conversation — this is how multi-step plans survive.

### The three things that make agents dangerous

1. **No natural stop.** Without step limits, an agent can loop, burn tokens, or hammer APIs. **Always cap steps and cost.**
2. **Tool power = damage it can cause.** An agent with "send_email" and "delete_file" tools can do real damage from a misread instruction. Give the *minimum* tools for the goal.
3. **Confident wrongness compounds.** One bad tool call → the agent plans around the bad result → confidently wrong final answer. Human checkpoints on consequential actions.

---

## 2. Specify — direct the AI

> "Build research_agent.py: 1) a loop with max 6 steps: each step the model gets the goal, its scratchpad so far, and two tools — search_web(query) (use a simple DuckDuckGo/HTTP approach or a stub you write returning canned results for the demo) and save_note(text) (appends to notes.md), 2) system prompt: 'You are a research assistant. Work step by step. After each tool result, update your plan. Stop when you can answer the goal or hit 6 steps. Never invent tool results., 3) run it on: 'What are 3 free ways to deploy a Python web app in 2026?', 4) print every think/act/observe step."

You specified **the loop, the cap, the honesty rule, and full traceability**. That's agent engineering.

## 3. Evaluate — be the senior

- Read the full trace. Did each step follow from the previous observation, or did it jump? A good agent's trace reads like a plan; a bad one's reads like guessing.
- **Break the stop condition:** temporarily set max steps to 2. Does it stop gracefully and report partial results, or crash? Limits must be *handled*, not just set.
- **Test the honesty rule:** give it a goal your stubbed search can't answer. Does it admit the gap, or invent results? (Day 19's "I don't know" — now for agents.)
- Count tokens used for the whole run. Multiply by your day-15 pricing. **An agent run costs 5–20× a single call** — write the number down. (This is day 23's preview: agents are expensive; the business must justify it.)
- Ask the AI: "Quiz me — draw the agent loop from memory. What are the 3 things that make agents work and the 3 that make them dangerous?"

## 4. Business lens 💼

Agents are the most **oversold** and most **misunderstood** AI capability. Clients will ask for "an AI agent that does everything." Your job (day 26) is to scope: *which* goal, *which* tools, *what* stop conditions, *whose* approval for consequential actions, *what* it costs per run. An agent with a tight goal, 3 tools, and a human checkpoint is a product. An agent with vague goals and a credit card is a liability. Knowing the difference is what makes you the engineer in the room.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> What's the difference between tool calling (day 17) and an agent?</summary>

Tool calling: the model makes one delegated call you orchestrate. An agent: the model runs a perceive–think–act–observe loop, choosing its own sequence of tool calls until the goal is done or a limit hits.
</details>

<details>
<summary><b>Q2.</b> Name two non-negotiable safety rules for any agent you build.</summary>

Cap steps (and cost) with graceful stopping; give minimum-necessary tools; require human approval for consequential actions. Any two of these.
</details>

<details>
<summary><b>Q3.</b> Your agent's trace shows it invented a tool result instead of calling the tool. What's the root cause and fix?</summary>

The system prompt didn't enforce honesty, or the model wasn't given a way to say "I can't." Fix: explicit "never invent tool results" rule + a defined fallback (report the gap and stop).
</details>

---

## ✅ Done when

- [ ] You can draw the agent loop from memory and explain each part
- [ ] Your agent stops gracefully at the step cap with partial results
- [ ] You've priced a full agent run and written the number down
- [ ] Committed to GitHub

## 📎 The one link

[Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — the field's best practical guide; short and opinionated.

---

[← Day 19](../19_Day_RAG/) · [Day 21 →](../21_Day_Project3_RAG_Chatbot/)
<!-- original-workshop:end -->

</details>
