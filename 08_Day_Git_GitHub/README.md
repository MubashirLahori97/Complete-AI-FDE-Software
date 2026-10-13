# 📘 Day 8 — Version Control: Time Travel for Software

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
