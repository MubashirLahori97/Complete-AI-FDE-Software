# Day 7 — Ship Dukaan v1.0

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v1.0 - the complete CLI tool. You can take several study sessions.

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

Six days of pieces: display, bills, decisions, loops, functions, lists, files. Today they become one thing a stranger can use. v1.0 adds no new ideas - it is finishing: a menu that never crashes, a README a stranger can follow, and a demo to a real person. This is Project 1, the checkpoint for all of Phase 1.

**Your project:** [Dukaan v1.0 - the complete CLI tool](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Assemble the week's pieces into one menu-driven program.
- Write a README that lets a stranger run the tool without your help.
- Demo the tool to a real person and fix what confuses them.

## Understand the concept

### Done means a stranger can use it

Your program works for you because you know how it wants to be used. Done means Amina's cousin can run it from your README alone: what the program does, how to start it, what each menu choice does. Scope is a design decision - v1.0 does five things: view stock, add item, print a bill, save, quit. Nothing more. Every extra feature is a new way to be broken; ship the five working.

### One complete path beats five half-paths

Pick "add an item" and make it work end to end: menu choice, ask for name and numbers, reject bad input with a message, save the file, confirm on screen. That is a vertical slice - one thin path through the whole program, finished. Then do the next. Five half-built features demo as five broken promises; two finished paths demo as a tool.

### The demo is part of the project

Watching a real person use your program finds what testing misses: they press 6 when the menu has 5 choices, they type the item name where the price goes. Their confusion is the bug report. A menu that never crashes is built from pieces you already own: each choice calls a function from Days 3-6, every number goes through try/except, and "quit" always works. Demo it, write down every stumble, fix them.

## A worked example, step by step

The v1.0 menu in miniature. The choices are simulated from a list so the example runs on its own - in your project, input() reads them from the shopkeeper. Predict what "9" does before you run.

```python
def view_stock():
    print("Showing stock... (your Day 6 loader plugs in here)")

def add_item():
    print("Adding an item... (your code goes here)")

choices = ["1", "9", "3"]
for choice in choices:
    print(f"Choose: {choice}")
    if choice == "1":
        view_stock()
    elif choice == "2":
        add_item()
    elif choice == "3":
        print("Goodbye!")
        break
    else:
        print("Please choose 1, 2, or 3.")
```

**Expected result**

```text
Choose: 1
Showing stock... (your Day 6 loader plugs in here)
Choose: 9
Please choose 1, 2, or 3.
Choose: 3
Goodbye!
```

The for loop feeds three choices. "1" calls view_stock(). "9" matches nothing, so the else prints guidance - this is the never-crash rule: every unexpected input gets a message, never a traceback. "3" prints goodbye and break exits the loop. In the real program this loop is while True and choice comes from input(); the structure is identical.

## Practise before building

### Exercise 1: README first

Before assembling, write the v1.0 README: what the program does, how to run it, what each menu choice does. Then build, following your own instructions word for word.

**Hint:** If you cannot describe a menu choice in one line, its job is unclear.

**Check your result:** The README is five lines or fewer and you followed it exactly while building.

### Exercise 2: The stranger test

Get someone to run your program from the README while you stay silent. Write down every place they hesitate or go wrong.

**Hint:** Do not help, explain, or point. Silence is the test.

**Check your result:** A written list of at least two confusions - real ones, not invented.

### Exercise 3: Break it on purpose

Feed the menu "three", an empty line, and "99" at every prompt. Every one must print a message.

**Hint:** Compare the choice as text: choice == "1", never choice == 1.

**Check your result:** No traceback for any bad input; the menu keeps running.

## Common mistakes and how to debug them

- Comparing the text choice to a number - input() gives text, so choice == 1 never matches; compare to "1".
- Forgetting break on quit - the menu loops forever with no way out.
- Building all five features halfway instead of finishing one complete path first.

## The FDE connection

"It works on my machine" is not done. Done is: a stranger ran it from the README, bad input did not crash it, and the demo exposed the rough edges. The first time a junior's work meets a real user is a demo or a handoff - and Project 1 holds that bar. Every project after it clears the same bar.

## Build your lesson project

**Dukaan v1.0 - the complete CLI tool**

This is Project 1 - the checkpoint for everything in Phase 1. Amina will use Dukaan every morning: it must load her stock from a file (or start fresh), let her view stock, add items, and print the bill, save after every change, and never crash on bad input. Build v1.0 as one menu-driven program. When it works, demo it to a real person - that demo is part of the project.

- dukaan.py: a menu loop (view / add item / bill / save / quit) using your Day 4-6 functions.
- Stock loads from dukaan_stock.json at startup; a missing file starts fresh with a message.
- Every change saves to the file; quitting saves too.
- A short demo video or a written walkthrough of a real person using it.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Demo it to someone: what did they try that you did not expect?
- Which Day 1-6 idea does each menu choice rely on? Name them.
- What is still fragile or missing? What would v1.1 need?

## References and next steps

- [Python: reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)

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
