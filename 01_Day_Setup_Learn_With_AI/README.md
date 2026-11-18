# Day 1 — Meet Dukaan: your first program

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v0.1 — the stock list. You can take several study sessions.

**The situation:** You want a small profile that tells someone your name and what you want to learn.

### One idea: A program follows your instructions

A program is a set of instructions for a computer. Think of a short recipe: do the first step, then the next. Our program gives names to some values, then displays them. You do not need to remember every symbol yet. Start by following what each line does to the result.

**New words:**

- **Code:** The instructions you write.
- **Output:** What the program shows after it runs.
- **Variable:** A name used to refer to a value, such as your name or study time.

### Follow the example below

1. The first three lines set the name, goal, and study time. Text goes inside quotation marks; 120 is a number.
2. print displays a line. In an f-string, the value of name replaces {name}.
3. The second print uses two more values. Editing minutes_per_day changes that line's study time.

### Try one small decision

Change minutes_per_day from 120 to 30. What changes in the output?

1. The learner's name becomes 30
2. The study time becomes 30 minutes
3. The program saves a profile file

<details>
<summary>A small hint</summary>

Find the line that contains minutes_per_day inside braces.

</details>

<details>
<summary>Another hint</summary>

The label Study time stays the same. Only the value placed beside it changes.

</details>

<details>
<summary>Answer and explanation</summary>

**The study time becomes 30 minutes** Yes. The last line reads minutes_per_day, so the new value appears there.

</details>

**Then practise:** Change the name to your own name and minutes_per_day to 30. Run the code. Check that the name and study time change, while the goal stays the same.

**Your project's first action:** Write a four-line profile on paper: name, city, goal, and daily study time. This is the result your project should produce.

**How it connects:** Keep this profile as the first item in your learning journal. Tomorrow you will learn why text and numbers behave differently.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

In this course you will build one real thing: Dukaan, a shop management system. Today it is a few lines that list stock on a screen. Step by step it will grow — a database, an API, a website, a live deployment, AI features. At the end you will demo a complete system in interviews and prove you can build software from scratch. It all starts here, with lesson 1: a program is instructions plus data.

**Your project:** [Dukaan v0.1 — the stock list](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain what a program is in one sentence: instructions plus data.
- Run a Python program and describe what each line does.
- Change one value, predict the new output, and check your prediction.

## Understand the concept

### You are building Dukaan

Here is the whole journey, so you always know where you are. Days 1-7: Dukaan is a command-line stock list. Days 8-14: it gets version control and tests. Days 15-21: it gets AI features, like a chatbot that answers stock questions. Days 22-30: it becomes a real API on the internet. Days 31-90: a database, a website, logins, deployment on cloud servers. Each step happens because the shop outgrows the last version — that is how you will learn architecture: by feeling why each piece is needed.

### A program is instructions plus data

Data is the facts: the shop name, the item names, the prices. Instructions are what to do with the facts: remember this value, show that line on the screen. Code is just these two things written down. When you run the program, Python reads your instructions from top to bottom and carries them out. Everything you will ever build — websites, APIs, AI systems — is instructions plus data, stacked higher.

### Your three tools

You need three tools, and they do three different jobs. The editor (VS Code) is where you write the instructions. Python is the runner — it reads your file and carries out the instructions. The terminal is the messenger — you type 'python dukaan.py' there, which means 'hey computer, run this file with Python.' Never type terminal commands inside your Python file, and never paste Python code into the terminal as a command. Three tools, three jobs.

### Predict before you run

Here is the habit that separates engineers from typists: before you run a changed program, say out loud what you expect to see. Then run it. If you were right, you understand it. If you were wrong, you just found something to learn — read the lines in order until you see why. Do this every time, starting today.

## A worked example, step by step

Amina's shop needs a stock list on screen. Three items, three prices. Read the code, predict the exact output, then run it.

```python
shop_name = "Amina Store"
item1 = "Rice"
price1 = 250
item2 = "Sugar"
price2 = 180
item3 = "Tea"
price3 = 950

print(f"Welcome to {shop_name}")
print(f"1. {item1} - Rs {price1}")
print(f"2. {item2} - Rs {price2}")
print(f"3. {item3} - Rs {price3}")
```

**Expected result**

```text
Welcome to Amina Store
1. Rice - Rs 250
2. Sugar - Rs 180
3. Tea - Rs 950
```

The first seven lines store data: one shop name, three item names, three prices. Text goes inside quotation marks; prices are plain numbers. The last four lines are instructions: print shows text on the screen, and the f before the quotation marks lets the stored values appear inside the text. Python runs top to bottom, so the welcome line prints first. This is Dukaan v0.1 — the seed of everything you will build.

## Practise before building

### Exercise 1: Change the shop

Change the shop name to your own shop name and change one price. First write down exactly what the output will look like. Then run it.

**Hint:** Only change the values on the right side of the = sign.

**Check your result:** The output matches your written prediction exactly.

### Exercise 2: Add an item

Add a fourth item with its price, and one more print line so it appears in the list.

**Hint:** Copy the pattern: one line to store the name, one line to store the price, one print line to show it.

**Check your result:** Four items print, each with the correct price.

### Exercise 3: Break it on purpose

Delete one quotation mark and run the program. Read the error message carefully — which line does it blame? Then fix it.

**Hint:** Python tells you the line number. The real mistake is often just before it.

**Check your result:** You can point at the error and explain in your own words what went wrong.

## Common mistakes and how to debug them

- Typing 'python dukaan.py' inside the Python file — that is a terminal command, not a Python instruction.
- Forgetting quotation marks around text — Python then thinks your words are instruction names.
- Changing three things at once when something breaks — change one thing, predict, run, observe.

## The FDE connection

In a software house, a junior's first tickets look exactly like this: small, clear, testable. 'Show the stock list on screen.' Senior engineers trust juniors who write small programs they can explain line by line. That is what you practiced today — the atom of the job. Every system you will ever build is made of atoms like this one.

## Build your lesson project

**Dukaan v0.1 — the stock list**

Amina runs a small shop. She keeps stock in her head and on paper slips. She wants a program that shows her stock list on screen: item names and prices, clear enough to read at a glance. Build version 0.1 — it only displays the list. This is the first brick of the system you will grow for the whole course.

- A dukaan.py file that runs with python dukaan.py and shows the stock list.
- The program's output, copied into your notes or a screenshot.
- A two-line README: what the program does and how to run it.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Can you explain each line without looking at the screen?
- Did you predict the output before running, at least twice?
- To add a fourth item, what would you change — and how many minutes would it take?

## References and next steps

- [Python: using the interpreter](https://docs.python.org/3/tutorial/interpreter.html)

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
