# 📘 Day 7 — 🛠 Project 1: Scoping & Shipping a Complete Tool

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
