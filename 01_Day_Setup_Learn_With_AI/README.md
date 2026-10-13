# 📘 Day 1 — Your Toolchain + What a Program IS

**Concept:** A program is *instructions + data*. The toolchain (editor, interpreter, terminal, AI assistant) is just how instructions reach the machine. In the AI era, you don't type every instruction — you *specify* them and *evaluate* what the AI produces.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## The loop (memorize this — it's all 30 days)

1. **Learn** — one concept, owned 100%. Not memorized — *understood*.
2. **Specify** — you write the specification; the AI writes the first draft of the code. Precise specs are now a core engineering skill: vague specs produce garbage, precise specs produce software.
3. **Evaluate** — read the AI's code, test it, try to break it. Ask the AI to quiz you until you can teach the concept back.
4. **Business lens** — who pays for this? What does it cost? What breaks in production?
5. **Commit** — push to GitHub. Your history is your proof of work.

The AI is your junior developer: fast, confident, and sometimes wrong. **You are the senior.** Never ship output you can't explain or defend.

---

## Part 1 — Install your tools (~30 min)

### 1. Python 3.11+
- Download from [python.org/downloads](https://www.python.org/downloads/). On Windows, **check "Add python.exe to PATH"** during install.
- Verify: `python --version` → you should see `Python 3.11.x` or newer.

### 2. VS Code
- From [code.visualstudio.com](https://code.visualstudio.com/). Install the **Python** extension (by Microsoft).

### 3. Git + GitHub
- Install from [git-scm.com](https://git-scm.com/downloads). Create a free [github.com](https://github.com) account.
- `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`

### 4. Your AI pair programmer
Pick **one**: Claude Code, ChatGPT, Cursor, or Copilot. Free tiers carry you through this whole repo.

> Stuck? Paste the exact error into your AI assistant. Reading errors is a day-6 concept — you're early.

**💼 Business lens:** every tool above is free. Your startup cost is zero — that's why software businesses scale the way they do.

---

## Part 2 — Specify, then evaluate (~20 min)

**You write the spec first** (this is the skill):

> "Write a Python program that asks the user for their name, then prints a personalized welcome message for day 1 of a 30-day AI engineering challenge. Keep it to 5 lines or fewer."

Give that to your AI assistant. You'll get something like:

```python
name = input("What's your name? ")
print(f"Hello, {name}! Welcome to day 1 of becoming an AI software engineer.")
```

Run it: `python hello.py`

**Now the senior-developer part — evaluate.** Ask your AI:

> "Quiz me on this code line by line. What does each line do, and why?"

Answer out loud. You should be able to say:
- Line 1 *asks* the user for input and *stores* it in a variable called `name` — that's **data**.
- Line 2 *prints* a message; the `f"..."` lets the variable's value appear inside the text.

If you can say that without reading, you already own three concepts: variables, input/output, and string interpolation. That's the 100%-concepts standard. Hold every day to it.

---

## Part 3 — Commit (~10 min)

```bash
git init
git add hello.py
git commit -m "Day 1: my first specified-and-evaluated program"
```

Create a repo on GitHub and push (it shows you the commands). Day 8 goes deep; today, just get it online.

---

## 💻 Exercises

### Level 1 — Specify
Spec an ASCII banner printer ("print my name as a banner using # characters"). Let AI draft it. Evaluate: can you explain the loop it used?

### Level 2 — Specify + edge case
Spec: "ask for name AND city, print one sentence using both — and keep asking until neither is empty." Evaluate the validation logic line by line.

### Level 3 — Evaluate someone else's
Ask the AI to write the *worst* reasonable version of the greeting program (bad names, no validation). Critique it like a senior reviewing a junior's PR. List every issue.

---

## ✅ Done when

- [ ] You can explain "program = instructions + data" in plain words
- [ ] `python hello.py` runs
- [ ] You specified it before the AI wrote it, and you can defend every line
- [ ] Committed (and pushed) to GitHub

## 📎 The one link

[Python official tutorial](https://docs.python.org/3/tutorial/) — bookmark it; the definitive reference for the month.

---

🎉 **Day 1 complete.** You didn't just run code — you specified it, evaluated it, and understood it. That's the job now.

**[Day 2 →](../02_Day_Python_Variables_Types/)**
