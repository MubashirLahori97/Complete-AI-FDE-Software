# 📘 Day 2 — Data: Types, Variables, Representation

**Concept:** Everything in software is *data* with a *type* — and the type decides what operations mean. `"2" + "2"` gives `"22"`, but `2 + 2` gives `4`. Same symbols, different types, different universe. This single idea explains half of all beginner bugs ever.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### What's a variable?
A variable is a **named box** that holds data. You put something in, you take it out later by name.

```python
name = "Mubashir"   # a box called 'name' holding text
age = 28            # a box called 'age' holding a number
```

### The types that matter today

| Type | Python name | Example | What it's for |
|------|-------------|---------|---------------|
| Text | `str` | `"hello"` | Names, messages, anything written |
| Whole number | `int` | `42` | Counting |
| Decimal | `float` | `19.99` | Money, measurements |
| True/False | `bool` | `True` | Decisions (day 3) |

### The big insight: types change meaning

```python
print("2" + "2")   # "22"  (text joins together)
print(2 + 2)       # 4     (numbers add)
```

The `+` didn't change. The *data* changed. When a program does something "weird," the first question is always: **what type is this data, really?**

### Conversion: changing types on purpose

```python
price = input("Price? ")      # input() ALWAYS gives you text, e.g. "250"
total = float(price) * 2      # convert text -> decimal, then multiply
print(f"Double: {total}")
```

`input()` always returns text — even if the user typed a number. Forgetting this causes roughly a million beginner bugs. Now you won't be one of them.

### f-strings: text with holes

```python
name = "Mubashir"
city = "Lahore"
print(f"{name} lives in {city}.")
```

The `f` before the quotes lets `{...}` holes fill in with variable values. You'll use this every single day.

---

## 2. Specify — direct the AI

Write this spec yourself, then give it to your AI assistant:

> "Write a Python program that converts between units. It should: 1) ask the user which conversion they want (km-to-miles, celsius-to-fahrenheit, pkr-to-usd), 2) ask for the value, 3) print the result rounded to 2 decimals, 4) if the user types something that isn't a number, say 'That's not a number — try again' instead of crashing, 5) keep it under 40 lines."

Notice what you did: you specified the **behavior**, including the failure case. That's engineering.

## 3. Evaluate — be the senior

- Run it. Try: a normal number, a decimal, text like `abc`, an empty input, a negative number.
- For each: **what type** is the data at each step? Trace one conversion by hand: user types `"100"` (text) → converted to `float` → multiplied → printed.
- Ask the AI: "Quiz me — in this program, where does text become a number, and what happens if conversion fails?"
- Find one thing you'd improve. Tell the AI to change *only that*.

## 4. Business lens 💼

A currency converter with a type bug once charged customers wrong amounts at a real company — `"100" + "50"` instead of `100 + 50`. Types aren't academic. In business software, **wrong types = wrong money**. Data modeling — choosing the right types and shapes — is billable work precisely because getting it wrong is expensive.

---

## 💻 Exercises

### Level 1
Ask the AI to quiz you: "Give me 5 expressions; I tell you the type of the result." Example: `"5" * 3` → ?

### Level 2
Specify and build a **bill splitter**: total bill, number of people, tip %. Print each person's share. Handle non-number input gracefully.

### Level 3
Specify a **grade calculator**: takes 5 subject marks (0–100), prints average and a letter grade (A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F below). Reject marks outside 0–100 with a clear message. Then explain to the AI *why* each rejection rule exists — you're practicing defending specs.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> What does <code>"2" + "2"</code> give, and why?</summary>

`"22"` — both are text, so `+` joins them instead of adding. Types decide what operations mean.
</details>

<details>
<summary><b>Q2.</b> <code>input()</code> always returns what type — and why does it matter?</summary>

Text (`str`), always — even if the user typed digits. Forgetting this is the #1 beginner bug: you must convert before doing math.
</details>

<details>
<summary><b>Q3.</b> A shop's program charged a customer wrong. The code said <code>total = price + fee</code>. What do you check first?</summary>

The types of `price` and `fee`. If either is text, `+` concatenates instead of adding — wrong types = wrong money.
</details>

## ✅ Done when

- [ ] You can explain why `"2" + "2"` ≠ `2 + 2` without notes
- [ ] You can say what type every variable in your converter holds, at every step
- [ ] It survives garbage input without crashing
- [ ] Committed to GitHub

## 📎 The one link

[Asabeneh — 30 Days of Python, Day 2](https://github.com/Asabeneh/30-Days-Of-Python) — deeper drills on types and variables.

---

[← Day 1](../01_Day_Setup_Learn_With_AI/) · [Day 3 →](../03_Day_Conditionals_Loops/)
