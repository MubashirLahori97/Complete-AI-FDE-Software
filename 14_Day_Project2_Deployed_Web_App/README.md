# 📘 Day 14 — 🛠 Project 2: Deployment — Your First Live URL

**Concept:** **Deployment** is moving software from your laptop to a computer that serves strangers, 24/7. It's where "my project" becomes "a product." Everything changes at this boundary: secrets can't live in code, paths differ, versions must be pinned, and *you* can't be there to restart it. Deployment is the professional threshold — cross it today.

**Time:** ~90 minutes. **Rule:** done = the URL works on your phone, on mobile data, logged out.

---

## 1. Learn — the concept

### What deployment actually is

Your laptop → their server:

| Your laptop | Production server |
|---|---|
| You restart things by hand | It must **recover by itself** |
| Secrets in `.env` on disk | Secrets in the platform's **secret manager** |
| "Works on my machine" | Must work on **their** machine — hence day 10's recipe |
| You are the only user | **Strangers**, with strange inputs, at 3 AM |

The deployment checklist (memorize the shape of it):
1. **Recipe complete?** `requirements.txt` pinned, builds from zero (day 10).
2. **Secrets out of code?** API keys in the platform's secrets, never in the repo (check: `git log` must contain zero keys — ever).
3. **Entry point declared?** The platform needs to know how to start your app (`streamlit run app.py`).
4. **Smoke test from outside:** open the URL on your phone, logged out, on mobile data. If it works there, it works.

### The mindset shift

Deployed software is **observed, not debugged**. You can't `print()` on a server you don't own — you read logs. You can't ask the user what they clicked — you watch behavior. Days 24–25 make this rigorous; today, feel the shift.

---

## 2. Specify — direct the AI

> "Walk me through deploying my Streamlit expense tracker to Streamlit Community Cloud: 1) what files the platform needs and why, 2) how to connect my GitHub repo, 3) where secrets go (I have none yet — explain what I'd do when I do), 4) the exact smoke test after deploy. Explain each step BEFORE I do it — I need to understand the machinery, not just click through."

Then deploy. For real. Today.

## 3. Evaluate — be the senior

- **The phone test:** open the URL on your phone, mobile data, logged out, in a private browser tab. Every condition matters: it proves strangers can reach it.
- **Break the boundary:** what's different between laptop and cloud? Write down 3 differences you actually observed (paths? versions? speed?).
- **The secret audit:** `git log --all -p | grep -i "key\|secret\|token"` — verify zero secrets ever touched the repo. (If one did: rotate it immediately, then learn why `.gitignore` + secret managers exist.)
- **First production bug:** something *will* differ. Find it, fix it, redeploy. That loop — deploy → observe → fix → redeploy — is the professional heartbeat. Feel it.
- Ask the AI: "Quiz me — why can't I just email someone my .py file instead of deploying? What does the platform actually do with my repo?"

## 4. Business lens 💼

A live URL **changes every conversation you'll ever have about your work**:

- "I built an expense tracker" → polite nod.
- "Here — try it: [link]" → they *use* it. Ten seconds of use beats ten minutes of description.

This is why deployment is a business skill, not a technical chore. Freelancers win contracts with live demos. Founders raise interest with live products. Job seekers stand out with live portfolios. **Deployed > described**, always. Share your URL with 3 people today — and watch what they do, silently (day 7's user test, now at internet scale).

---

## 💻 Exercises

### Level 1
Custom page title + icon + a one-line description on the deployed app. Details signal care.

### Level 2
**The redeploy drill:** change one visible thing, commit, push, watch it redeploy. Time the loop: commit → live. That number is your **iteration speed** — the most important productivity metric in software.

### Level 3
Add a tiny **feedback form** to the app ("What confused you?") that appends to a file. Read the first 3 responses. You now have a **production feedback loop** — the smallest version of what every serious product runs.

---

## ✅ Done when

- [ ] The URL works on your phone, on mobile data, logged out, private tab
- [ ] You can explain what the platform does with your repo, without notes
- [ ] Zero secrets in git history (audited, not assumed)
- [ ] 3 real humans have opened it; README has the live link

## 📎 The one link

[Streamlit — Deploy your app](https://docs.streamlit.io/deploy) — the exact path you just walked.

---

🎉 **Week 2 complete.** You now think like an engineer: versioned, reproducible, tested, interfaced, and **deployed**. Week 3 is where it gets magical — AI engineering: how the models actually work, and how to build with them.

[← Day 13](../13_Day_First_Web_App/) · [Day 15 →](../15_Day_LLMs_How_They_Work/)
