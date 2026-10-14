# Day 2 — Data, variables, types, and conversion

A value's type determines what operations mean. Two values can look identical on a screen and still behave differently inside a program. This lesson connects types to real failures in quantities, user input, and conversion tools. Your project is a conversion desk that accepts values deliberately, checks them, and produces clearly labelled results.

**Your project:** [A reliable unit conversion desk](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Identify strings, integers, floating-point numbers, booleans, and missing values.
- Convert text into numbers at an input boundary and handle failed conversion.
- Define a conversion's input unit, output unit, and expected behavior.

## Understand the concept

### A variable is a name bound to a value

In Python, amount = 10 binds the name amount to an integer object. Reassigning amount changes which value the name refers to; it does not change all values elsewhere in the program. Use names that describe the role of the value, such as distance_km, rather than an unexplained x. Including units in names prevents a subtle category of bugs: a correct calculation applied to the wrong measurement. Type information and domain meaning are related, but a float alone cannot tell you whether a number means kilometres or dollars.

### Representation changes behavior

The string "2" contains a text character. The integer 2 represents a number. Adding two strings joins their text, while adding two integers performs arithmetic. A float represents a number approximately using binary floating-point; many decimal fractions are not represented exactly. For beginner measurement calculations, document a rounding policy. For currency, integer minor units or a carefully chosen Decimal policy are usually clearer than assuming float rounding always matches accounting rules.

### Validate at the boundary

User-entered data and API payloads arrive from outside your program. Convert them at a clear boundary before relying on arithmetic. float("2.5") succeeds, while float("two") raises ValueError. Catch the failure when you can return a useful message; do not silently substitute zero. After conversion, check domain rules too: a distance may not be negative, even though -3 is a perfectly valid number. Numeric parsing is therefore only one part of validation.

## A worked example, step by step

Convert a text value representing kilometres into metres. The unit appears in both names and output.

```python
raw_distance = "2.5"
try:
    distance_km = float(raw_distance)
    if distance_km < 0:
        raise ValueError("Distance cannot be negative")
    distance_m = distance_km * 1000
    print(f"{distance_km:g} km = {distance_m:g} m")
except ValueError:
    print("Enter a non-negative number of kilometres")
```

**Expected result**

```text
2.5 km = 2500 m
```

raw_distance is text because it represents an input boundary. float creates a numeric value for arithmetic. The condition checks a domain rule, not a type rule. Multiplying by 1000 applies the conversion factor. The g format keeps this example's display compact; it does not change the stored numeric value. The except block handles invalid text and rejected negative distances. Try changing raw_distance to an empty string, zero, and -1 and follow the executed path in each case.

## Practise before building

### Exercise 1: Explain two different additions

Run "2" + "2" and 2 + 2. Inspect each operand with type() and explain the difference.

**Hint:** Do not infer the type from the displayed characters alone.

**Check your result:** You can predict 22 versus 4 without running the expressions again.

### Exercise 2: Reject invalid input

Test empty text, whitespace, two, zero, and a negative distance. Define the desired message for each rejected value.

**Hint:** Parsing and domain validation are separate decisions.

**Check your result:** Rejected input produces a clear message instead of a false conversion result.

### Exercise 3: Add temperature conversion

Write the Celsius-to-Fahrenheit formula in words, then implement it using a named input and output.

**Hint:** fahrenheit = celsius * 9 / 5 + 32.

**Check your result:** 0 C becomes 32 F and 100 C becomes 212 F.

## Common mistakes and how to debug them

- Joining numeric text instead of adding numbers: inspect types at the boundary.
- Silently treating invalid input as zero: a fallback value can create a believable but wrong result.
- Mixing units or formatting too early: compute using clearly named numeric values, then format for display.

## The FDE connection

Customer integrations often fail because two systems represent the same idea differently. One export contains numeric text, another uses a different unit, and a third omits missing values. Documenting and validating those boundaries is engineering work. Your converter is a small integration with an explicit contract.

## Build your lesson project

**A reliable unit conversion desk**

A shop employee needs a small converter for distances and temperatures. Build a program with a clearly selected conversion, labelled inputs and outputs, and helpful handling of invalid input. Keep distance validation separate from temperature rules: negative Celsius values are valid, while the project's distance contract rejects negative distances.

- A converter supporting kilometres to metres and Celsius to Fahrenheit.
- A written input contract for both conversions.
- A test-results table with valid, zero, negative, and non-numeric examples.
- A short explanation of types and unit names in the implementation.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Why does input representation matter to arithmetic?
- Which checks are type validation and which are business rules?
- Where does rounding happen, and what information can rounding lose?

## References and next steps

- [Python: numbers and text](https://docs.python.org/3/tutorial/introduction.html)
- [Python: floating-point arithmetic](https://docs.python.org/3/tutorial/floatingpoint.html)

[← Lesson 1](../01_Day_Setup_Learn_With_AI/) · [Lesson 3 →](../03_Day_Conditionals_Loops/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
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

The types of `price` and `fee`. If either is text, `+` glues together instead of adding — wrong types = wrong money.
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
<!-- original-workshop:end -->

</details>
