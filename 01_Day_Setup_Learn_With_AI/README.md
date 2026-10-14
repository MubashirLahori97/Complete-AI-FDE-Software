# Day 1 — Your first program and your learning tools

Software engineering starts with a small, understandable loop: describe an outcome, give the computer instructions, inspect the result, and change the instructions when the result is wrong. Today you will learn what a program actually does and build a useful first artifact: a personal learning profile. You do not need to memorise syntax or install every tool in the industry.

**Your project:** [Personal learning profile generator](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Distinguish code, data, a running process, and its output.
- Run a short Python program and explain its execution order.
- Change a requirement, predict the result, and verify your prediction.

## Understand the concept

### Instructions act on data

A program is a sequence of instructions operating on values. The value can be a name, a ticket count, or a collection of orders. Code is the written description; running code is the computer carrying out that description. A text file containing code does nothing until an interpreter or other runtime executes it. Start by separating what the program receives, what it changes, and what it produces. This input → process → output view helps you understand a tiny greeting and a large customer application.

### The editor, interpreter, and terminal do different jobs

The editor helps you write and inspect files. The Python interpreter executes Python instructions. The terminal lets you ask the operating system to run commands. A command such as python profile.py means run the file profile.py using Python; it is not a line you paste inside that Python file. The current directory tells the terminal where to look. If a file cannot be found, inspect the folder and filename before changing the program. A browser lab removes setup friction, but later projects still need reproducible local setup.

### A small change is an experiment

Before running a change, predict its effect. Change one value and observe the output. If your prediction is wrong, trace the instructions in execution order instead of making several unrelated edits. AI can explain an unfamiliar line or suggest a draft, but you should still connect each instruction to a requirement. Learning to say why an output appeared is more valuable than collecting code that only works when someone else repairs it.

## A worked example, step by step

This profile uses two pieces of text and one number. Predict the two output lines before running it.

```python
name = "Mubashir"
goal = "Build useful AI software"
minutes_per_day = 120

print(f"Learner: {name}")
print(f"Goal: {goal} | Study time: {minutes_per_day} minutes")
```

**Expected result**

```text
Learner: Mubashir
Goal: Build useful AI software | Study time: 120 minutes
```

The first three instructions bind names to values. The blank line changes readability, not behavior. Each print call produces one output line. The f before the quotation mark allows expressions inside braces to appear in the text. Changing minutes_per_day changes the later output, because the expression is evaluated when print runs. The program does not create an account or save a file: those are separate requirements you will learn to implement later.

## Practise before building

### Exercise 1: Predict, then change

Change the learner name and daily minutes. Write the expected output before running the file.

**Hint:** Keep text inside matching quotation marks and the study time as a number.

**Check your result:** Both new values appear in the correct output line.

### Exercise 2: Add a requirement

Add a city variable and a third output line. Describe the new requirement in one sentence before coding.

**Hint:** Follow the same assignment and print pattern.

**Check your result:** The old lines still work and the new line shows the city.

### Exercise 3: Read a controlled failure

In a disposable copy, misspell the name used inside one print call. Read the error and then repair the spelling.

**Hint:** Python distinguishes name from Name and from names that have never been assigned.

**Check your result:** You can identify the failing line and explain why it could not find the variable.

## Common mistakes and how to debug them

- Pasting terminal commands into a Python file: keep commands and program instructions separate.
- Changing several things after an error: reproduce the error and make one targeted change.
- Thinking printed output is persistent storage: closing the process does not save an application record.

## The FDE connection

An FDE begins by making an outcome understandable to a customer and executable by a team. Even this small profile has a user, inputs, an output format, and a test. Practise describing those four things before asking AI for code. A clear specification gives you something concrete to evaluate.

## Build your lesson project

**Personal learning profile generator**

A new learner wants a short profile they can paste into their study journal. Build a program that represents their name, city, learning goal, and daily study time, then prints a readable profile. Keep the first version small enough to explain line by line. Use fixed values first; collecting interactive input is an optional extension.

- A runnable profile.py file with four named values.
- A sample output showing the complete profile.
- A README explaining how to run it and what each value means.
- A prediction-versus-result note for two changed profiles.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What is the difference between a code file and a running program?
- Which instructions store data and which produce output?
- How did a prediction help you investigate an unexpected result?

## References and next steps

- [Python: using the interpreter](https://docs.python.org/3/tutorial/interpreter.html)
- [Python: an informal introduction](https://docs.python.org/3/tutorial/introduction.html)

[Lesson 2 →](../02_Day_Python_Variables_Types/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
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

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> What is a program, in one sentence?</summary>

Instructions + data. Everything else is detail.
</details>

<details>
<summary><b>Q2.</b> The AI wrote code for you. What's your job now?</summary>

Specify precisely before it writes, evaluate ruthlessly after. Never ship output you can't explain or defend.
</details>

<details>
<summary><b>Q3.</b> Why is "it works on my machine" not good enough?</summary>

Because software has to run *elsewhere* — for strangers, without you there. (You'll prove this on day 10 and day 14.)
</details>

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
<!-- original-workshop:end -->

</details>
