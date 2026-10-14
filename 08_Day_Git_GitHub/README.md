# Day 8 — Git, collaboration, and reviewable changes

Version control gives you a record of changes and a way to collaborate without losing the explanation of how a system evolved. Today you will practise the difference between your files, staged changes, commits, and branches. Your project is a small feature delivered through a reviewable branch, complete with a regression example and a useful change description.

**Your project:** [A reviewed validation feature](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain the working tree, staging area, commit, and branch.
- Review a diff before recording a change.
- Deliver a bounded feature with evidence and clear review notes.

## Understand the concept

### A commit records a chosen snapshot

The working tree contains files you are editing. The staging area selects changes for the next commit. A commit records that chosen snapshot with its parent history and message. Saving a file in an editor does not create a commit, and staging it does not send it to GitHub. Use git status to see what state you are in and git diff to inspect the actual change. The distinction helps you avoid including unrelated experiments or sensitive configuration in a feature.

### Branches separate lines of work

A branch names a line of commits. Creating a feature branch allows a change to be reviewed before it joins the shared main line. It does not create a separate backup of every uncommitted file, so understand the current working state before switching. A merge combines histories and can require resolving conflicting edits. Read the conflicting requirements and preserve the intended behavior; removing conflict markers without testing is not sufficient.

### A review needs context and evidence

A useful change description starts with the problem, states the resulting behavior, and explains the relevant tests. Keep the diff focused enough for another person to understand. A reviewer should not have to reconstruct your chat history to learn why a change exists. A regression example links the change to a real failure. Record the remaining limitation as well as the successful path, and do not claim tests you did not run.

## A worked example, step by step

Use these commands while delivering a small validation feature in a separate learner project.

```bash
# Inspect before editing or switching branches
git status
git switch -c feature/expense-validation
# Make and test the intended changes in your editor
git diff
git add expenses.py README.md
git diff --cached
git commit -m "Reject invalid expense amounts with a useful message"
git log -1 --oneline
```

**Expected result**

```text
A new feature branch contains one reviewed commit.
The commit includes the intended code and documentation changes.
Exact commit IDs and command output vary by repository.
```

The initial status establishes the starting state. switch creates a named feature branch. diff before staging shows the working changes, while diff --cached shows what the commit will contain. Naming files when staging helps keep the change bounded. The commit message describes behavior rather than a vague update. The final log displays the recorded commit. Pushing a branch and opening a pull request are later collaboration steps, not automatic consequences of the commit.

## Practise before building

### Exercise 1: Inspect three states

Edit a file, stage it, then commit it while inspecting status and the relevant diff at each stage.

**Hint:** A working diff and a staged diff answer different questions.

**Check your result:** You can identify which version will enter the commit.

### Exercise 2: Write review context

Describe the validation bug, before/after behavior, and the test input in three sentences.

**Hint:** Lead with the user-visible problem.

**Check your result:** A reviewer understands the purpose without reading your study journal.

### Exercise 3: Reason about a conflict

On disposable branches, change the same sample rule differently and explain the required combined behavior.

**Hint:** Use a separate exercise repository and inspect the conflict before resolving it.

**Check your result:** The resolution is tested against both original requirements.

## Common mistakes and how to debug them

- Assuming saving, committing, and pushing are the same action.
- Staging the entire repository without reviewing unrelated files.
- Resolving a conflict based only on its text markers instead of the intended behavior.

## The FDE connection

Customer delivery usually involves other engineers, existing systems, and future operators. Small, reviewable changes make it easier to establish trust and hand work over. Your history should explain decisions, not merely prove that many lines were generated.

## Build your lesson project

**A reviewed validation feature**

A teammate reports that your expense tool accepts an invalid amount. Deliver a targeted fix in a feature branch of your own project repository. Include a reproduction case, tests, updated instructions, and a review description. Preserve unrelated work and make the result easy to inspect before merging.

- A feature branch containing a bounded behavior change.
- Before/after output for the reported input.
- A regression test and updated user-facing instructions.
- A pull-request-style description and a reviewed diff.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What is recorded in a commit and what is not?
- How did you keep unrelated work out of this change?
- What evidence would help a reviewer find a missed edge case?

## References and next steps

- [Pro Git: recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [Pro Git: branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)

[← Lesson 7](../07_Day_Project1_CLI_App/) · [Lesson 9 →](../09_Day_HTTP_APIs_JSON/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Git is a **timeline of every decision** you ever made in a project. A commit is a saved snapshot with a message explaining *why*. A branch is a **parallel universe** where you can experiment without breaking the real world. This is how professionals — and teams — stay sane.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The timeline mental model

Imagine your project as a film. Every commit is a **frame** — a snapshot of all your files at one moment, with a message describing what changed and why.

```
* 3a7f2c1  Add totals by category        <- you are here
* 9b1e4d0  Add file persistence
* 41c8f2a  Day 1: my first program
```

Made a mistake? **Time-travel** back to any frame. Want to know *why* a line exists? Read the commit message from the day it was born. This beats "final_v2_REALLY_FINAL.py" forever.

### Commits: small, messaged, honest

```bash
git add expense_tracker.py
git commit -m "Add totals by category"
```

- `git add` = "stage these changes for the snapshot."
- `git commit -m "..."` = "take the snapshot, with this message."
- Good messages are **imperative and specific**: "Add totals by category" ✓, "fix stuff" ✗, "asdf" ✗✗✗.

Rule of thumb: **commit when something works**, not at end of day. Small commits = easy time travel.

### Branches: parallel universes

```bash
git branch add-charts       # create a universe called 'add-charts'
git checkout add-charts     # step into it
# ... build charts, commit ...
git checkout main           # step back — main is untouched
git merge add-charts         # bring the work over when it's good
```

The `main` branch is the **known-good world**. You never experiment there directly — you branch, break things freely, and merge only what works. A **pull request (PR)** is just "hey, please review my universe before merging it" — even if you're both the author and reviewer, the ritual forces a second look.

### GitHub: the timeline, published

`git push` uploads your timeline to GitHub. Now it's **backup + portfolio + collaboration** in one. Anyone can read your history and see *how you think*.

---

## 2. Specify — direct the AI

> "My expense tracker repo has messy history — a few giant commits with bad messages like 'update' and 'fix'. Teach me to: 1) rewrite the last 4 commit messages properly WITHOUT changing the code, 2) create a branch called 'add-monthly-summary', add that feature there, 3) open a pull request against main and merge it myself, 4) show me the final history as a story. Explain each command before I run it."

You're not asking AI to *do* Git for you — you're asking it to **teach** while you type. The commands must live in your fingers.

## 3. Evaluate — be the senior

- Run `git log --oneline --graph` — does your history read like a story? Would a stranger understand what happened, in order?
- On your branch, deliberately break something, commit it, then fix it in the next commit. Merge. Now the history shows the *mistake and the fix* — that's honest engineering, and it's fine.
- Ask the AI: "Quiz me — what's the difference between git add, commit, push? What does a branch actually contain? What happens to main when I commit on a branch?"
- The killer question: **"If I delete my laptop tonight, what survives?"** (Answer: everything pushed. Everything unpushed dies with the laptop. Push like it matters — it does.)

## 4. Business lens 💼

Employers and clients **read your GitHub history before they read your CV**. A year of small, well-messaged commits says "disciplined professional" louder than any certificate. And in team/contract work, clean branches + PRs are how you prove what you built and when — it's your **paper trail for getting paid**.

---

## 💻 Exercises

### Level 1
Rewrite your last 4 commit messages using `git rebase -i` (have AI walk you through it — then explain back what each step did).

### Level 2
Branch → break → fix → PR → merge, all on your expense tracker. Write the PR description as if a client will read it: what changed, why, how you tested.

### Level 3
**The disaster drill:** copy your repo folder somewhere safe, then in the original: delete a file, commit the deletion, then recover it using Git history. If you can resurrect deleted work from the timeline, you truly understand what Git *is*.

---

## ✅ Done when

- [ ] You can explain add vs commit vs push, and branches vs main, without notes
- [ ] Your history reads like a story a stranger could follow
- [ ] You've done a full branch → PR → merge cycle yourself
- [ ] Everything is pushed — nothing exists only on your laptop

## 📎 The one link

[Pro Git book (free, official)](https://git-scm.com/book/en/v2) — chapters 1–3 cover 90% of daily Git.

---

[← Day 7](../07_Day_Project1_CLI_App/) · [Day 9 →](../09_Day_HTTP_APIs_JSON/)
<!-- original-workshop:end -->

</details>
