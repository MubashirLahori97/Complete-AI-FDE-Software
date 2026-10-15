# Day 7 — Scope and ship a complete command-line tool

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** A usable CLI expense tracker. You can take several study sessions.

**The situation:** A learner wants to record expenses, list them, and see the total from a terminal.

### One idea: Finish one useful tool

A useful app combines several small ideas. A command chooses the action, functions do the work, a collection holds the records, and a file keeps them between runs. Start with one complete action before adding more. A tiny expense tracker that another person can run teaches more than a large menu whose buttons do nothing.

**New words:**

- **CLI:** Command-line interface: an app used through typed terminal commands.
- **Scope:** The work you agree to include in this version.
- **End-to-end:** A complete path from a user's action to the result.

### Follow the example below

1. The example starts with a small collection of expenses.
2. It adds amounts to calculate a total in integer cents.
3. This demonstrates the calculation only. The project adds command handling and saving between runs.

### Try one small decision

What is the smallest useful first milestone for this expense tracker?

1. Design a logo and add ten empty commands
2. Add one expense, save it, and show it after restarting
3. Add an AI assistant before storing expenses

<details>
<summary>A small hint</summary>

Choose something a user can actually finish.

</details>

<details>
<summary>Another hint</summary>

A first complete path can be add → save → restart → list.

</details>

<details>
<summary>Answer and explanation</summary>

**Add one expense, save it, and show it after restarting** Yes. This proves one complete useful path, including persistence.

</details>

**Then practise:** Add a fictional expense of 150 cents to the example. Predict the new total first, then run the calculation and compare.

**Your project's first action:** Write the exact terminal conversation for adding one fictional expense and listing it again after a restart. Use that conversation as your first test.

**How it connects:** Combine Days 2–6: types, rules, functions, collections, and files. This becomes the expense app you will test and give a web interface later.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

A project becomes useful when another person can complete a task with it. Today you will combine data, decisions, functions, and persistence into an expense tracker. The challenge is finishing a small, coherent product: an understandable workflow, reliable behavior, useful errors, and instructions that work outside your own terminal session.

**Your project:** [A usable CLI expense tracker](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Turn a user problem into a bounded feature list and acceptance criteria.
- Compose earlier concepts into a complete expense workflow.
- Observe a new user and distinguish usability feedback from implementation guesses.

## Understand the concept

### Scope is a design decision

A first version should support a clear task from beginning to end. For an expense tracker, adding an expense, listing expenses, and showing a total form a coherent workflow. Bank integrations, receipt recognition, and multi-user permissions can wait. An explicit out-of-scope list protects the finish line. Scope is not measured by the number of technologies used; it is measured by whether the chosen user's problem can be addressed with the available time and evidence.

### Design around a vertical slice

A vertical slice crosses input, business logic, and storage for one useful action. Start by adding one valid expense and seeing it after a restart. That proves more than implementing several disconnected screens or functions. Keep the calculation independent of command parsing. Store amounts in a documented representation, such as integer cents. Decide whether the total includes all records or only a filtered view and state that meaning in the output.

### A new user tests your assumptions

Give a person the README and observe them trying a representative task. Avoid explaining each hesitation immediately, because coaching hides confusing steps. Record the action, expectation, and obstacle before proposing a fix. One person's feedback is useful evidence about that test, not proof that every user will behave the same way. Ask permission before collecting or publishing identifying feedback; fictional sample expenses are enough for the learning project.

## A worked example, step by step

A simple list supplies the data for a total. No bank connection or live financial data is involved.

```python
expenses = [
    {"id": "E1", "label": "Lunch", "amount_cents": 500},
    {"id": "E2", "label": "Bus", "amount_cents": 200},
]
total_cents = sum(expense["amount_cents"] for expense in expenses)
for expense in expenses:
    print(expense["id"], expense["label"], expense["amount_cents"])
print(f"Total: {total_cents} cents")
```

**Expected result**

```text
E1 Lunch 500
E2 Bus 200
Total: 700 cents
```

Each record has an identity, label, and numeric amount. The generator expression supplies amounts to sum without changing the records. The display loop shows individual records before the summary so a user can inspect what the total contains. An empty list naturally totals zero. A complete tracker still needs validation, persistence, and an interface; this working calculation is one vertical slice's business logic, not the finished product.

## Practise before building

### Exercise 1: Write the smallest specification

Describe the user, three core actions, and three excluded features in a short paragraph.

**Hint:** Choose a workflow that a new user can complete in a few minutes.

**Check your result:** Every core action has an observable success condition.

### Exercise 2: Trace a total

Add and remove a sample expense, predicting the total after each action.

**Hint:** Keep the record count and amount total as different quantities.

**Check your result:** The displayed records explain the calculated total.

### Exercise 3: Run a usability check

Write a task such as add one expense and inspect the total, then watch a new user follow only your instructions.

**Hint:** Record what they attempted before deciding what to change.

**Check your result:** You have one concrete observation and a corresponding improvement.

## Common mistakes and how to debug them

- Adding optional features before one workflow works end to end.
- Calculating with unvalidated text or unclear money units.
- Calling a coached demonstration a usability test without recording the help provided.

## The FDE connection

Customers need completed workflows, not a collection of impressive fragments. An FDE agrees on a useful slice, demonstrates it with realistic data, and keeps the acceptance criteria visible. Your expense tracker is practice for that delivery discipline.

## Build your lesson project

**A usable CLI expense tracker**

A freelancer needs to record small expenses and inspect a reliable total. Build a command-line tool that adds, lists, and totals fictional expenses, saves them between runs, and explains invalid input. A stranger should be able to install and use it from the README. Receipt scanning, accounts, and bank connections are outside the first version.

- An add/list/total command workflow with JSON persistence.
- A clear data model and money-unit policy.
- A README with setup, sample commands, and error examples.
- A recorded user observation and a test-results table.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What did you intentionally leave out of version one?
- Where does one vertical slice cross the system's boundaries?
- What did a new user's behavior reveal that your own testing missed?

## References and next steps

- [Python: argparse](https://docs.python.org/3/library/argparse.html)
- [Python: JSON](https://docs.python.org/3/library/json.html)

[← Lesson 6](../06_Day_Files_Errors_Debugging/) · [Lesson 8 →](../08_Day_Git_GitHub/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** **Scoping** — deciding what's in and what's out. A finished small thing beats an unfinished big thing, always. Shipping — putting a *complete, usable* thing in front of a human — is the skill this whole repo is building toward.

**Time:** ~90 minutes. **Rule:** done = a stranger can run it from your README alone.

---

## 1. Learn — the concept

### What "done" actually means

Most beginners think done = "code exists." Professionals mean:

1. **It runs** from a clean start, following written instructions.
2. **It handles the obvious failures** (bad input, missing files).
3. **A stranger can use it** without you standing behind them.
4. **It has a README** explaining what it is, how to run it, and what it does.

If any of the four is missing, it's not done — it's a draft.

### Scoping: the spec before the code

Before AI writes a line, write a **scope paragraph**:

> "Expense tracker CLI. IN: add expense (amount, category, note, date=auto-today), list all, totals by category, save/load from file. OUT: editing old entries, budgets, GUI, multi-user. Done when: I can add 5 expenses, see category totals, restart the app, and everything persists."

The OUT list is the powerful part. Every feature you *exclude* is time you keep. Clients respect "no" more than they respect "maybe later."

---

## 2. Specify — direct the AI

Give your scope paragraph to the AI, plus:

> "Build this as functions in one file, expense_tracker.py. Reuse the patterns from my contact book (day 5–6): list of dicts, file persistence, try/except on input. After building, do NOT add anything beyond the scope — if you think of extras, list them separately and I'll decide."

That last instruction matters: AI loves to gold-plate. **You hold the scope.**

## 3. Evaluate — be the senior (and the client)

**As engineer:** run the full session — add 5 expenses across 3 categories, list, totals, restart, verify persistence. Break it: bad amounts, empty categories.

**As client:** hand it to a friend — your first real user. **Watch silently.** Don't explain, don't help. Write down:
- Where did they hesitate?
- What did they try that didn't work?
- What did they ask for?

Every hesitation is a bug or a missing feature. This 10-minute exercise teaches more than a week of tutorials.

**As product owner:** triage the list. What's a must-fix before "launch"? What goes to v2? Write both lists in the README under "Known limitations."

## 4. Business lens 💼

You just did a **user test** — the cheapest, highest-value business activity in software. Companies pay thousands for what you did free in 10 minutes. And your scope paragraph? That's a **mini-proposal**. When you do day 26's client brief, it's this paragraph, grown up, with a price attached.

---

## 💻 Exercises

### Level 1
Write the README *before* the code is finished: what it is, how to run it, example session. Then make the code match the README. (README-driven development — a real professional practice.)

### Level 2
Add **one** scoped feature from your v2 list: monthly summary. Update the scope paragraph, spec it, build, evaluate. Practice the full loop on a small change.

### Level 3
**The 60-second demo:** record your screen (phone is fine) using the tracker for 60 seconds, no narration needed. Watch it back. If a stranger can't tell what the app does from the video, your UX needs work — note exactly where.

---

## ✅ Done when

- [ ] Scope paragraph written BEFORE code, with an explicit OUT list
- [ ] A stranger can clone, run, and use it from the README alone
- [ ] One real human used it while you watched silently, and you wrote down what happened
- [ ] Known limitations documented; committed and pushed to GitHub

## 📎 The one link

[Asabeneh — 30 Days of Python, Day 30](https://github.com/Asabeneh/30-Days-Of-Python) — conclusions and project thinking.

---

🎉 **Week 1 complete.** You own the core concepts: data, decisions, repetition, abstraction, modeling, persistence, failure, scoping, shipping. Everything from here is composition.

[← Day 6](../06_Day_Files_Errors_Debugging/) · [Day 8 →](../08_Day_Git_GitHub/)
<!-- original-workshop:end -->

</details>
