# Day 10 — Environments, packages, and reproducible setup

A project is not delivered if it only runs in the environment you happened to build it in. Today's work makes the setup explicit: interpreter, dependencies, run commands, and required configuration. Your project is a reproducible release of an earlier tool, verified from a clean environment rather than your already-working session.

**Your project:** [A reproducible release kit](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain which resources a Python virtual environment isolates.
- Document dependency and configuration assumptions.
- Verify a project using a clean setup and repeatable smoke test.

## Understand the concept

### An environment is more than code

The interpreter version, installed packages, environment variables, data paths, and operating system can affect behavior. A Python virtual environment isolates a package installation context; it does not automatically include private data, configure external services, or reproduce every system library. Record the assumptions that matter. A failure after a fresh installation can reveal an undocumented dependency that your development environment was hiding.

### Dependencies need an installation contract

A dependency declaration names what the project needs, while version constraints or a lock strategy control how those needs resolve. Pinning can improve repeatability but also creates maintenance work when security or compatibility changes. Use the package manager associated with the intended interpreter, for example python -m pip. Keep secrets out of dependency and configuration examples. An .env.example can document names and non-secret placeholders without publishing real values.

### Reproduction is a test

A clean setup check exercises your documentation as well as the code. Start in a new working directory and new environment; follow only the written instructions. Note where you needed an unstated action. Use a small smoke test to establish that startup and the core task work, then run the substantive tests for behavior. Document working-directory assumptions instead of relying on where your editor happens to open the terminal.

## A worked example, step by step

This check reports interpreter facts without printing secrets or assuming an exact version string.

```python
import sys

is_virtual_environment = sys.prefix != sys.base_prefix
print("Python major version:", sys.version_info.major)
print("Virtual environment:", is_virtual_environment)
print("Run command: python environment_check.py")
```

**Expected result**

```text
Python major version: 3
Virtual environment: False
Run command: python environment_check.py
The second line becomes True inside a normal venv.
```

sys.version_info exposes the interpreter version as structured data. A normal venv uses a prefix different from the base interpreter's prefix, which the boolean comparison reports. The output is diagnostic context, not a complete environment lock. Compare this check across environments, then run your project smoke test. If behavior differs, inspect the actual interpreter, installed dependencies, configuration, and paths before concluding that the code itself is wrong.

## Practise before building

### Exercise 1: Create an isolated environment

Create a venv in a disposable learner project and run its Python executable explicitly.

**Hint:** Windows typically uses .venv/Scripts/python.exe; POSIX systems use .venv/bin/python.

**Check your result:** The interpreter check identifies the environment you intended to use.

### Exercise 2: Find a hidden assumption

Move your tool into a fresh directory and follow its README without relying on the old terminal session.

**Hint:** Look for implicit data paths and missing installation commands.

**Check your result:** Every required action is now documented.

### Exercise 3: Document configuration safely

List required and optional settings using placeholder values only.

**Hint:** A configuration name is not a secret; its private value may be.

**Check your result:** The example can be shared without exposing an account credential.

## Common mistakes and how to debug them

- Running pip for a different interpreter from the one executing the project.
- Assuming a venv reproduces external services or customer data.
- Testing setup only in an environment where everything is already installed.

## The FDE connection

Customer environments vary, and support teams need reproducible instructions. An FDE treats setup, configuration ownership, and startup checks as part of the deliverable. The question is not only whether the code runs, but whether another operator can recreate the working conditions.

## Build your lesson project

**A reproducible release kit**

A teammate needs to run your expense tracker on a clean machine or environment. Package the interpreter requirement, dependency installation, configuration examples, data-path policy, and smoke test into a release kit. Keep the original working project intact while you test the clean setup in a separate directory.

- A setup guide with platform-appropriate commands.
- A dependency declaration or an explicit standard-library-only statement.
- A non-secret configuration example and data-path explanation.
- A smoke test plus evidence from a clean setup.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What does a venv isolate and what does it not reproduce?
- Which hidden assumption did the clean setup reveal?
- How would an operator know that startup succeeded?

## References and next steps

- [Python: virtual environments](https://docs.python.org/3/tutorial/venv.html)
- [Python Packaging User Guide](https://packaging.python.org/en/latest/tutorials/installing-packages/)

[← Lesson 9](../09_Day_HTTP_APIs_JSON/) · [Lesson 11 →](../11_Day_OOP_Essentials/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Software must run **elsewhere** — on a client's laptop, a server, a colleague's machine. A *virtual environment* is an isolated box of Python + packages for one project. `requirements.txt` is the **recipe** to rebuild that box anywhere. Without these, your software is a rumor; with them, it's real.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The problem

You `pip install requests` on your laptop. Your program works. You send it to a friend — **it crashes**: they don't have `requests`. Or they have version 1.0, you built against 2.31, and something subtle breaks. This is "dependency hell," and it has ended careers.

### The solution: isolated boxes + recipes

```bash
python -m venv .venv          # build an isolated box called .venv
source .venv/bin/activate     # step inside it (Windows: .venv\Scripts\activate)
pip install requests          # install ONLY inside the box
pip freeze > requirements.txt # write the recipe: exact packages + versions
```

- **venv** = your project's private Python. What you install here doesn't touch anything else on your system, and nothing else touches it.
- **requirements.txt** = the recipe. Anyone, anywhere: `pip install -r requirements.txt` → identical box.
- **The rule:** never `pip install` outside a venv. Global installs are how "it worked yesterday" mysteries begin.

### Why versions are pinned

`requirements.txt`:
```
requests==2.31.0
```

`==2.31.0` means *exactly* this version. Libraries change; today's update can break yesterday's code. Pinning says: "I built and tested against **this** — rebuild **this**." (Teams relax this later with ranges; pinned is correct for you now.)

---

## 2. Specify — direct the AI

> "My weather CLI from day 9 currently runs on my system Python. Walk me through: 1) creating a venv for it, 2) installing only what it needs inside the venv, 3) generating requirements.txt, 4) then PROVE it works by deleting the venv and rebuilding from the recipe in a fresh copy of the project folder. Explain each command before I run it — I need this in my fingers, not just done."

The proof step is the lesson. Anyone can follow install steps; **verifying from zero** is engineering.

## 3. Evaluate — be the senior

- After rebuilding from the recipe in a fresh folder: does `python weather.py` work first try? If not — **your recipe is the bug**, not the code. Fix the recipe.
- Run `pip list` inside the venv. For each package: what is it, and does your project actually need it? (If you can't justify it, it shouldn't be in the recipe.)
- Ask the AI: "Quiz me — what breaks if two projects share one global Python? What does 'activate' actually change? Why pin versions?"
- Check: is `.venv/` in your `.gitignore`? (It must be — the box is rebuilt from the recipe, never committed. Committing it is like mailing someone your kitchen instead of the recipe.)

## 4. Business lens 💼

A client can't use what they can't install. **"Just run these three commands"** (clone → venv → install → run) is the difference between a demo that impresses and a delivery that works. In freelance/contract work, the handover *is* the product — and reproducibility is what makes handovers clean. Docker (which you'll meet later) is this same idea, industrialized.

---

## 💻 Exercises

### Level 1
`pip list` in your venv. Write one line per package: what it does and why your project needs it. No line = no justification = remove it.

### Level 2
Write `setup.sh`: a script that takes a fresh clone from zero to running program (venv → install → run). Test it by actually cloning fresh. This script is gold — it's your project's **birth certificate**.

### Level 3
**Break it on purpose:** install a wrong version of `requests` in a scratch venv, run your weather CLI, observe the failure. Then fix by reinstalling from your pinned recipe. You've now *felt* dependency hell and its cure — you'll never skip pinning again.

---

## ✅ Done when

- [ ] You can explain venv vs global Python, and why recipes beat boxes, without notes
- [ ] Fresh folder + your recipe + your setup steps = working program, first try
- [ ] `.venv/` is gitignored; `requirements.txt` is committed
- [ ] Pushed to GitHub

## 📎 The one link

[Python docs — venv & pip](https://docs.python.org/3/tutorial/venv.html) — short, definitive.

---

[← Day 9](../09_Day_HTTP_APIs_JSON/) · [Day 11 →](../11_Day_OOP_Essentials/)
<!-- original-workshop:end -->

</details>
