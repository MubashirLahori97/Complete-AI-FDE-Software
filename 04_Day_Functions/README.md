# Day 4 — Functions, contracts, and useful abstraction

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** A reusable quote calculator. You can take several study sessions.

**The situation:** A business needs to calculate several quotes without copying the same arithmetic everywhere.

### One idea: Give a small job its own function

A function is a named set of instructions for one job. You give it inputs and it can return a result. Think of a calculator button: give it price and quantity, then receive a line total. Returning a value lets other code use it. Printing only displays it. Keep the calculation separate from the way the quote looks on screen.

**New words:**

- **Function:** A named, reusable piece of work.
- **Argument:** A value you pass into a function.
- **Return:** Send a result back to the code that called the function.

### Follow the example below

1. def introduces the calculation and names its inputs.
2. The calculation uses integer cents. For example, 250 cents means 2.50 in the example currency.
3. return gives the calculated amount back. A separate print statement displays the result.

### Try one small decision

One item costs 250 cents. You buy 3. What should a line-total function return?

1. 253 cents
2. 750 cents
3. Nothing, because print already returns the total

<details>
<summary>A small hint</summary>

A line total is price multiplied by quantity.

</details>

<details>
<summary>Another hint</summary>

Keep the answer in cents: 250 + 250 + 250.

</details>

<details>
<summary>Answer and explanation</summary>

**750 cents** Yes. 250 × 3 = 750 cents. Returning this number lets another function add delivery.

</details>

**Then practise:** Keep the existing example and assertion. Add print(line_total_cents(250, 0)) below it. Check that this extra line prints 0. Explain why returning the total is useful.

**Your project's first action:** Write one example quote by hand with two items and a delivery fee, all in cents. Work out the expected grand total before writing functions.

**How it connects:** Use conditions from Day 3 to reject invalid quantities. This calculator can later support a web form without changing its arithmetic.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

A function gives a small operation a name, explicit inputs, and an observable result. It helps you reason about a program one responsibility at a time. Today you will turn a calculation into a contract and build a quote calculator whose business rules can be tested without reading interactive input or printing a screen.

**Your project:** [A reusable quote calculator](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Distinguish a function's parameters, return value, and side effects.
- Separate pure calculation from input/output code.
- Write and test a function contract with normal and invalid inputs.

## Understand the concept

### Name what the operation means

A function should expose a useful idea to its caller. total_cents(price_cents, quantity) tells you more than process(a, b). The caller needs to know allowed inputs, the result, and possible errors. Those expectations are the contract. Implementation details can change while the contract stays stable, letting other parts of the program continue to work. Start with an operation you can describe in one sentence; if the sentence contains several unrelated tasks, the function may be taking on too much.

### Return and print are different

return passes a value back to the caller and ends that function call. print writes a representation to an output stream. A function that only prints a total is harder to reuse in a web API or a test. Let calculation functions return values; let the interface decide how to display them. A function with no explicit return returns None in Python. That often explains why a caller unexpectedly receives a missing value after an apparently successful print.

### Pure logic is easier to test

A pure calculation uses its inputs to produce a result without modifying external state. It does not read the keyboard, save a file, or call a network service. Such functions are straightforward to test with known examples. Side effects are necessary in real applications, but keep their boundaries visible. The goal is not to create the largest possible number of functions; it is to separate responsibilities where the separation helps you understand and change the system.

## A worked example, step by step

A line total is calculated in integer minor units. Validation is part of the function contract.

```python
def line_total_cents(price_cents, quantity):
    if price_cents < 0 or quantity < 0:
        raise ValueError("Price and quantity must be non-negative")
    return price_cents * quantity

subtotal = line_total_cents(250, 3)
assert subtotal == 750
print(f"Subtotal: {subtotal} cents")
```

**Expected result**

```text
Subtotal: 750 cents
```

def creates a callable function; its body runs when the caller supplies the two arguments. The validation rejects negative inputs before calculating. return gives the integer result to the caller, which stores it as subtotal. The assertion checks a known example independently of the display text. The final print belongs to the interface layer. The example assumes integer inputs; a complete project must document or validate that assumption rather than relying on the function name alone.

## Practise before building

### Exercise 1: Separate output from logic

Replace a calculator that prints inside its calculation with a function that returns its result.

**Hint:** Move print to the caller.

**Check your result:** The result can be asserted without capturing printed text.

### Exercise 2: Test a contract

Check normal quantity, zero quantity, negative quantity, and a non-integer quantity.

**Hint:** Decide which inputs are supported before writing validation.

**Check your result:** Supported values return predictable results and rejected values have clear errors.

### Exercise 3: Compose operations

Add two line totals and an explicit delivery fee using separate named operations.

**Hint:** Reuse line_total_cents rather than copying its formula.

**Check your result:** Changing one unit price affects only the related line and grand total.

## Common mistakes and how to debug them

- Confusing printed output with a return value: inspect what the caller actually receives.
- Reading input inside every calculation: isolate the interface so tests can call the logic directly.
- Making an abstraction before understanding the rule: a shorter name does not automatically make a clearer contract.

## The FDE connection

Customer systems change. A useful contract lets you replace a price source, UI, or storage layer without rewriting the business calculation. An FDE explains which changes stay local and which changes affect the contract other teams rely on.

## Build your lesson project

**A reusable quote calculator**

A small service business creates quotes with line items and a delivery fee. Build calculation functions using integer cents, plus a thin display layer. Define supported prices and quantities explicitly. The first version has no tax integration, discounts, payments, or live exchange rates; those are separate scope decisions.

- Calculation functions for line totals, subtotal, and grand total.
- A readable example quote with two line items.
- A written contract for integer prices and quantities.
- Tests for zero, negative, and unsupported inputs.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which function contracts could another developer rely on?
- Why is returning a value different from printing it?
- Which possible future change would require a contract change?

## References and next steps

- [Python: defining functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)

[← Lesson 3](../03_Day_Conditionals_Loops/) · [Lesson 5 →](../05_Day_Lists_Dictionaries/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** A function hides *how* and exposes *what*. You don't need to know how `print()` works inside — you just use it. Abstraction is how humans manage complexity: the single most valuable concept in this entire repo.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### What's a function?

A **named, reusable block** that takes input, does something, and optionally gives back output.

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Mubashir")   # 'message' now holds "Hello, Mubashir!"
print(message)
```

- `def greet(name):` — **defines** it. `name` is a *parameter* (a placeholder).
- `greet("Mubashir")` — **calls** it. `"Mubashir"` is an *argument* (the real value).
- `return` — sends a result **back** to the caller. Without `return`, the function does its job but hands you nothing.

### The big idea: hide the how, show the what

```python
def celsius_to_fahrenheit(c):
    return (c * 9/5) + 32

print(celsius_to_fahrenheit(37))  # 98.6 — you didn't need the formula
```

The caller doesn't know or care about the formula. That's abstraction: **complexity hidden behind a simple name**. Your day-2 converter, refactored into functions, becomes a *toolkit* instead of a script.

### Why this matters more than syntax

Real software is thousands of functions calling each other. Nobody holds it all in their head — they hold the *names* and trust the *contracts* ("give it X, it returns Y"). When you direct AI to build software, **you'll specify functions**: their names, inputs, outputs. That's the job now.

### Scope: where variables live

```python
x = 10          # global: visible everywhere

def show():
    y = 5       # local: exists ONLY inside show()
    print(x)    # can read global
    print(y)

show()
# print(y)  <- ERROR: y doesn't exist out here
```

Variables born inside a function die with it. This is a feature: functions can't accidentally trample each other's data.

---

## 2. Specify — direct the AI

> "Refactor my unit converter (day 2) into functions: one function per conversion (km_to_miles, celsius_to_fahrenheit, pkr_to_usd), plus a main() that handles user interaction. Each conversion function takes a number and returns a number — no input()/print() inside them. Keep input/output in main() only."

That last sentence is a **design rule** you're imposing: *logic separated from interaction*. This is real engineering judgment — functions that only compute are testable, reusable, and honest.

## 3. Evaluate — be the senior

For **each** function the AI produced, answer in writing:
1. What does it **hide**? (the formula, the details)
2. What does it **expose**? (name, input, output — the contract)
3. Could a stranger use it correctly knowing *only* the name and contract? If not, the abstraction leaks — rename or redesign it.
4. Is there any copy-pasted logic that should be one function? Any function doing two unrelated jobs that should be two?

Then ask the AI: "Which of these functions would break if I changed its internals, and which are safe? Why?"

## 4. Business lens 💼

Every business is abstraction too: a restaurant menu hides the kitchen; a bank app hides the ledger. Clients pay for **interfaces that hide complexity** — "I click, it happens." When you scope work (day 26), you'll draw these boundaries: what the client sees vs. what the system does. Functions are where that thinking starts.

---

## 💻 Exercises

### Level 1
Specify: `is_prime(n)` — returns True if n is prime, False otherwise. AI builds; you test with 2, 7, 9, 15, 97. Then explain *why* the logic works, not just that it passes.

### Level 2
Specify: `stats(numbers)` — takes a list, returns min, max, and average. Design decision first: **how** should it return three values? (Hint: ask the AI for options, then *you* choose and defend the choice.)

### Level 3
Rewrite your day-3 guessing game so `main()` is under 10 lines — everything else in well-named functions. Then do the senior review: for each function, write one sentence on what it hides and what it exposes. If you can't write the sentence, the function's job is unclear — fix it.

---

## ✅ Done when

- [ ] You can explain abstraction with a non-code example (menu/kitchen, car dashboard)
- [ ] You can explain parameters vs arguments vs return values in your own words
- [ ] Your converter is functions with logic separated from input/output — and you can defend the design
- [ ] Committed to GitHub

## 📎 The one link

[Corey Schafer — Python Functions (YouTube)](https://www.youtube.com/@coreyms) — the clearest functions explanation on the internet.

---

[← Day 3](../03_Day_Conditionals_Loops/) · [Day 5 →](../05_Day_Lists_Dictionaries/)
<!-- original-workshop:end -->

</details>
