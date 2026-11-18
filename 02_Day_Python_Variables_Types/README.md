# Day 2 — The price list

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v0.2 - totals and bills. You can take several study sessions.

**The situation:** A shop needs a converter. A distance written in a form arrives as text, but multiplication needs a number.

### One idea: Text and numbers have different jobs

A type tells the computer what kind of value it has. The number 2 can take part in arithmetic. The text "2" is a character inside quotation marks. Adding two text values joins them: "2" + "2" becomes "22". Convert the text to a number before calculating. Always keep the unit beside the result so another person can understand it.

**New words:**

- **String:** A text value, written inside quotation marks.
- **Integer:** A whole number, such as 0, 2, or -3.
- **Conversion:** Changing a value into another type or unit.

### Follow the example below

1. raw_distance contains the text 2.5. float changes suitable text into a number that can have a fractional part.
2. The condition rejects negative distances. The calculation multiplies kilometres by 1000.
3. The print shows both units. The except block displays a useful message if conversion or validation fails.

### Try one small decision

A form gives you "2" kilometres as text. Which calculation gives 2000 metres?

1. int("2") * 1000
2. "2" + "1000"
3. 2 + 1000

<details>
<summary>A small hint</summary>

You need two actions: convert the type, then convert the unit.

</details>

<details>
<summary>Another hint</summary>

Use int for this whole-number text and multiplication for kilometres to metres.

</details>

<details>
<summary>Answer and explanation</summary>

**int("2") * 1000** Yes. int makes the text a number; multiplying by 1000 converts kilometres to metres.

</details>

**Then practise:** Change the kilometre value to 3. Predict 3000 metres, run the code, and compare. Then try 0 and explain the result.

**Your project's first action:** Write this reference case before coding: 2 kilometres should become 2000 metres. Then write a separate temperature case: 0 Celsius should become 32 Fahrenheit.

**How it connects:** Use the values from your profile to practise identifying types. The converter introduces input rules you will reuse in later forms.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

Dukaan v0.1 shows the stock list. Today it grows into v0.2: a bill calculator. A customer buys 3 bags of rice and 2 of sugar - the program multiplies, adds, and works out the change. The new idea is small, and getting it wrong breaks everything: text and numbers are different things, and the shopkeeper's typed input always arrives as text. Convert it, or the bill is nonsense.

**Your project:** [Dukaan v0.2 - totals and bills](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Explain the difference between text and numbers with a shop example.
- Use *, +, and - to compute a bill total and the change.
- Convert typed input from text to a number with int() before doing arithmetic.

## Understand the concept

### Text and numbers look the same but behave differently

The price 250 and the text "250" look identical on your screen. To Python they are different things. 250 + 180 is 430 - arithmetic. "250" + "180" is "250180" - gluing text together. Text sticks; numbers calculate. A price you want to multiply must be a number, not text. Python calls text str (short for string, like a string of characters) and whole numbers int (short for integer). When output looks wrong - a total of 250180 instead of 430 - your first suspect is always: text where a number should be.

### Bills are arithmetic

A bill is three operations. Multiply: price times quantity for each item. Add: the line totals into a grand total. Subtract: money paid minus the total gives the change. Python writes them as *, +, and -. Order matters: Python multiplies before it adds, exactly like the maths you learned in school, so 250 * 3 + 180 * 2 means (250 * 3) + (180 * 2). When in doubt, add brackets - they cost nothing and prevent real money mistakes.

### input() always gives you text

When a program asks the shopkeeper to type a quantity, the answer arrives as text - even if they typed digits. "3" is text, and "3" * 2 is "33", not 6. So the first thing you do with typed input is convert it: int("3") turns the text into the number 3, and then you can multiply. If the text is not a number - int("three") - Python stops and shows an error naming the line. That error is useful information, not a disaster: it tells you exactly what went wrong. On Day 7 you will learn to catch it gracefully instead of crashing.

## A worked example, step by step

Amina's customer buys rice and sugar. The quantities were typed by the shopkeeper, so they arrive as text. Read the code, predict the exact output - especially the change - then run it.

```python
price_rice = 250
price_sugar = 180

typed_rice_qty = "3"
typed_sugar_qty = "2"

qty_rice = int(typed_rice_qty)
qty_sugar = int(typed_sugar_qty)

rice_total = price_rice * qty_rice
sugar_total = price_sugar * qty_sugar
total = rice_total + sugar_total

paid = 2000
change = paid - total

print(f"Rice: {qty_rice} x Rs {price_rice} = Rs {rice_total}")
print(f"Sugar: {qty_sugar} x Rs {price_sugar} = Rs {sugar_total}")
print(f"Total: Rs {total}")
print(f"Paid Rs {paid}, change Rs {change}")
```

**Expected result**

```text
Rice: 3 x Rs 250 = Rs 750
Sugar: 2 x Rs 180 = Rs 360
Total: Rs 1110
Paid Rs 2000, change Rs 890
```

The first two lines store prices as numbers. The next two store the typed quantities as text - this is what input() really gives you. int() converts each one into a real number. The line totals are price times quantity; adding them gives the grand total, 1110. Change is paid minus total: 2000 - 1110 = 890. If you skip the int() conversion, "3" * 250 does not multiply - it repeats the text "3" two hundred and fifty times. That is why conversion comes before arithmetic, every time.

## Practise before building

### Exercise 1: Predict the trap

In a scratch file, run print("2" + "2") and print(2 + 2). Before each one, write down what you expect to see.

**Hint:** Text sticks together; numbers calculate.

**Check your result:** You predicted "22" for the text version and 4 for the number version before running.

### Exercise 2: A tea bill

A customer buys 2 packs of Tea (Rs 950 each) and pays Rs 2000. Write the lines that compute the total and the change. Predict both numbers, then run.

**Hint:** Copy the pattern: line total, then paid minus total.

**Check your result:** Total is Rs 1900 and change is Rs 100, matching your prediction.

### Exercise 3: Break the conversion

Change typed_rice_qty to "three" and run. Read the error: which line does it blame, and what does ValueError mean in your own words? Then change it back.

**Hint:** ValueError means "this value cannot become a number".

**Check your result:** You can explain why int("three") fails without re-reading the message.

## Common mistakes and how to debug them

- Forgetting int() on typed input - then "3" * 250 repeats text instead of multiplying.
- Using + on two pieces of text when you meant to add numbers - "250" + "180" is "250180", not 430.
- Trying int() on text like "3kg" or "three" - only pure digit text converts; anything else is an error.

## The FDE connection

In a software house, junior tickets are full of this. "Add a totals row to the receipt" is a feature ticket. "The discount shows 250180 instead of 430 - fix it" is a bug ticket, and it is a text-vs-number bug. Seniors trust juniors who look at wrong output and name the cause in ten seconds. Today you earned that instinct: when numbers look glued together, suspect text.

## Build your lesson project

**Dukaan v0.2 - totals and bills**

Amina's customers are tired of mental maths. She wants Dukaan to print a proper bill: each item's quantity times price, the grand total, the amount paid, and the change. Quantities come from the shopkeeper typing at the keyboard. Build v0.2 on top of v0.1 - the stock list stays, the bill is new.

- dukaan.py extended: after the stock list, it asks for quantities and prints a bill.
- The bill shows each line (qty x price), the grand total, the paid amount, and the change.
- A note in your own words: why int() was needed, with one example.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Where exactly does text become a number in your program - and what breaks if you skip it?
- Show the bill for 4 bags of rice without running the program. How did you work it out?
- What would you change to add a fourth item to the bill?

## References and next steps

- [Python: numbers](https://docs.python.org/3/tutorial/introduction.html#numbers)
- [Python: strings](https://docs.python.org/3/tutorial/introduction.html#strings)

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
