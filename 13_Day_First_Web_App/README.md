# Day 13 — Frontend fundamentals and a usable web interface

An interface translates a person's intent into operations they can understand. Today you will learn the different responsibilities of HTML, CSS, and JavaScript, connect a form to a calculation, and build a small expense dashboard. A framework can help later, but it should not hide the browser concepts you need to inspect and debug.

**Your project:** [Responsive expense dashboard](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain how HTML structure, CSS presentation, and JavaScript behavior cooperate.
- Handle a form submission with validation and visible feedback.
- Test an interface with keyboard input, a narrow screen, and a new user.

## Understand the concept

### Structure communicates meaning

HTML describes the document and its controls. A heading introduces a section; a label identifies an input; a button performs an action. Use those elements instead of treating every part of the interface as a clickable box. The browser and assistive technology can then expose useful behavior and names. A placeholder is a temporary hint, not a reliable replacement for a visible label. Start with a semantic interface that works before adding decorative styling.

### Presentation should support the task

CSS controls layout, spacing, typography, and visual states. A readable interface has a clear order, adequate contrast, and enough room for its controls. Test a narrow viewport rather than assuming a desktop layout shrinks automatically. Avoid conveying an error only through colour: provide a message. Focus indicators help keyboard users see which control will receive the next action. Small, consistent styling decisions are usually more useful than several unrelated visual effects.

### Behavior connects events to state

JavaScript handles events such as submitting a form. The handler reads input, validates it, updates state, and renders feedback. Python and JavaScript use different syntax, but the input → process → output pattern remains. Browser validation improves usability, yet a future backend must validate its own inputs because browser controls can be bypassed. A localStorage demo persists data in one browser; it is not a shared server database or an authenticated account.

## A worked example, step by step

A labelled form updates a total in integer cents. The JavaScript checks the value again before changing state.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Expense dashboard</title>
<style>body{font-family:system-ui;max-width:600px;margin:40px auto;padding:20px}input,button{padding:12px}label{display:block;margin-bottom:8px}</style>
<h1>Expense dashboard</h1>
<form id="expense-form">
  <label for="amount">Amount in cents</label>
  <input id="amount" type="number" min="0" step="1" required>
  <button type="submit">Add expense</button>
</form>
<p id="result" role="status">Total: 0 cents</p>
<script>
let total = 0;
document.getElementById('expense-form').addEventListener('submit', event => {
  event.preventDefault();
  const raw = document.getElementById('amount').value;
  const amount = Number(raw);
  if (raw.trim() === '' || !Number.isInteger(amount) || amount < 0) {
    document.getElementById('result').textContent = 'Enter a non-negative integer amount';
    return;
  }
  total += amount;
  document.getElementById('result').textContent = `Total: ${total} cents`;
});
</script>
</html>
```

**Expected result**

```text
The initial screen shows Total: 0 cents.
Submitting 250 shows Total: 250 cents.
Submitting another 100 shows Total: 350 cents.
```

The label and input are connected by matching for and id values. The submit handler prevents a normal page navigation, reads the input as text, and converts it deliberately. Validation occurs before changing total. textContent displays a text value without interpreting it as HTML. The status region provides feedback. This starter has only an accumulated in-memory total; your project will add named records, an empty state, persistence, and useful recovery.

## Practise before building

### Exercise 1: Trace an event

Explain what happens between pressing the button and seeing the new total.

**Hint:** Name the event, input boundary, validation, state change, and render step.

**Check your result:** You can predict the result for two consecutive submissions.

### Exercise 2: Use a keyboard

Complete the form using Tab and Enter, then inspect the focus indicator.

**Hint:** Native controls provide much of the basic keyboard behavior.

**Check your result:** The task is possible without a mouse and the input has a useful name.

### Exercise 3: Test a small screen

Inspect the page at a 375px viewport and with longer labels or expense names.

**Hint:** Look for clipped controls and page-wide horizontal scrolling.

**Check your result:** The primary task remains readable and usable.

## Common mistakes and how to debug them

- Using placeholder text as the only input label.
- Treating client-side validation as a future backend security boundary.
- Confusing a one-browser localStorage record with a shared customer database.

## The FDE connection

A customer experiences the workflow, not the internal class names. An FDE watches whether intended users can complete the task, understand feedback, and recover from mistakes. Accessibility and error states are part of that task, not optional polish added after the demo.

## Build your lesson project

**Responsive expense dashboard**

A freelancer wants to add labelled expenses, see a list and total, remove a mistaken record, and return to the data later in the same browser. Build a semantic HTML/CSS/JavaScript interface using fictional data. Document that browser-local persistence is a learning constraint and does not provide shared accounts or server-side authorization.

- A responsive form, expense list, total, and empty state.
- Clear labels, keyboard behavior, and validation messages.
- Browser-local persistence with useful handling of damaged saved data.
- A usability and narrow-viewport test report.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which responsibilities belong to HTML, CSS, and JavaScript?
- What behavior does your local persistence guarantee?
- What changed after watching another person use the interface?

## References and next steps

- [MDN: learning web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)
- [MDN: client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)

[← Lesson 12](../12_Day_Testing_Clean_Code/) · [Lesson 14 →](../14_Day_Project2_Deployed_Web_App/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Logic without an interface is **invisible**. A UI is just a translation layer: human intent in (clicks, typing), function calls out. Buttons call functions. Forms collect arguments. Charts display return values. Once you see this, every app demystifies: it's your day-4 functions wearing clothes.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The translation layer

Your expense tracker has `add_expense(amount, category, note)`. A web UI for it is:

- **Text box** → collects `amount` (an argument)
- **Dropdown** → collects `category` (an argument)
- **Button "Add"** → calls `add_expense(...)` with those arguments
- **Table/chart** → displays what the functions return

That's it. No new programming universe — **the same functions, new clothes.**

### Streamlit: Python → web page in minutes

```python
import streamlit as st

st.title("Expense Tracker")

amount = st.number_input("Amount", min_value=0.0)
category = st.selectbox("Category", ["Food", "Transport", "Bills", "Other"])
note = st.text_input("Note")

if st.button("Add expense"):
    add_expense(amount, category, note)   # YOUR day-7 function, unchanged
    st.success("Added!")

st.bar_chart(totals_by_category())       # YOUR function, visualized
```

Every `st.something` is a widget that **collects input or displays output**. Rerun model: when the user interacts, the script re-runs top to bottom with the new values. Simple mental model, enormously productive.

### The design insight

Good UI = **fewer decisions for the user**. Dropdown instead of free text (no typos in categories). Sensible defaults. One primary button. You'll evaluate your UI the same way you evaluate code: *watch a human use it*.

---

## 2. Specify — direct the AI

> "Build a Streamlit app (app.py) for my expense tracker. Reuse my existing functions — do NOT rewrite the logic, only the interface. Screens: 1) Add expense form (amount, category dropdown, note, date defaults today), 2) table of all expenses, 3) bar chart of totals by category. Rules: category must be a dropdown (no free text), amount can't be negative, show a success message on add. Keep logic and UI in separate sections of the file."

"Reuse my functions, don't rewrite the logic" — you're enforcing **separation of concerns**, a professional architecture instinct.

## 3. Evaluate — be the senior

- Run `streamlit run app.py`. Add an expense through the UI, then check: did it hit the *same* functions (and file) as the CLI? Two interfaces, one logic — verify it.
- **The silent user test:** hand it to a non-technical person. Zero explanation from you. Note every hesitation — each is a UI bug.
- Break it: negative amount, empty note, 100-character category via devtools (or just ask: what *can't* the UI prevent?). Where does validation live — UI, function, or both? (Answer: **both**. UI for kindness, functions for truth — because functions can be called from anywhere.)
- Ask the AI: "Quiz me — in this app, which parts are interface and which are logic? If I wanted a mobile app tomorrow, what would I reuse?"

## 4. Business lens 💼

**Clients don't buy code; they buy interfaces.** To a shop owner, your Python functions don't exist — the *screen* is the product. This is why "it works in the terminal" never closes a deal but "here, click around" does. The UI is also where **first impressions** form: a clean, working interface signals a professional builder before a word is spoken.

---

## 💻 Exercises

### Level 1
Add a **date picker** to the form (default: today). Verify the date flows into your existing function unchanged.

### Level 2
Add **CSV import**: upload a file of expenses, parse it, add each row. (Day-6 file skills + day-9 "data travels as text" — composition!)

### Level 3
**Two interfaces, one truth:** make the CLI and the web app share *one* functions file (import it in both). Prove it: add via CLI, see it in the web app. Then write the architecture in one paragraph: where does logic live, where does interface live, and why?

---

## ✅ Done when

- [ ] You can explain "UI = translation layer: widgets collect arguments, displays show return values" without notes
- [ ] A non-technical human used it with zero help from you
- [ ] Logic is shared between CLI and web (not duplicated)
- [ ] Committed to GitHub

## 📎 The one link

[Streamlit docs — Get Started](https://docs.streamlit.io/) — excellent, example-driven.

---

[← Day 12](../12_Day_Testing_Clean_Code/) · [Day 14 →](../14_Day_Project2_Deployed_Web_App/)
<!-- original-workshop:end -->

</details>
