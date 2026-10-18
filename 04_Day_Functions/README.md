# Day 4 — The reusable counter

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v0.4 - organized code. You can take several study sessions.

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

Dukaan now computes totals, discounts, and stock checks - but the same small jobs are scattered everywhere: "price times quantity" appears in the bill, in the stock value, in the report. When Amina changes a rule, you must hunt down every copy. Today v0.4 gets organized: each repeated job becomes a function - a named, reusable piece with inputs and an answer.

**Your project:** [Dukaan v0.4 - organized code](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Define a function with def that packages one job under one name.
- Pass inputs as parameters and get answers back with return.
- Explain the difference between printing a value and returning it.

## Understand the concept

### A function is a job with a name

def total_value(price, qty): creates a reusable job called total_value. The indented lines are the job's instructions - they only run when you call the function by name: total_value(250, 40). You write the logic once and use it ten times. When the rule changes, you change it in one place. That is the whole point: one definition, many uses. Name it after the job it does, not after how it does it.

### Parameters in, return out

price and qty are parameters - empty slots that get filled each time you call. return sends the answer back to the caller: rice_value = total_value(250, 40) stores 10000 in rice_value. Contrast this with print: print shows a value on the screen and gives back nothing. A function that prints its answer cannot be reused in a calculation - you cannot add up printed lines. Return the answer; let the caller decide whether to print it.

### True and False are answers too

is_low_stock(40) answers a yes/no question, so it returns True or False. True and False are Python's words for yes and no - they are values, just like numbers. You can store them, print them, and use them directly in an if: "if is_low_stock(stock):" reads almost like English. Functions that answer questions make decisions readable, and readable code is code the team trusts.

## A worked example, step by step

Amina wants two reusable jobs: the value of some stock (price times quantity) and a low-stock test. Read the code, predict all four printed lines, then run.

```python
def total_value(price, qty):
    return price * qty

def is_low_stock(stock):
    return stock < 50

rice_value = total_value(250, 40)
sugar_value = total_value(180, 90)

print(f"Rice stock value: Rs {rice_value}")
print(f"Sugar stock value: Rs {sugar_value}")
print(f"Rice low? {is_low_stock(40)}")
print(f"Sugar low? {is_low_stock(90)}")
```

**Expected result**

```text
Rice stock value: Rs 10000
Sugar stock value: Rs 16200
Rice low? True
Sugar low? False
```

The two def blocks define jobs but run nothing yet - defining is not calling. total_value(250, 40) fills price with 250 and qty with 40, computes 10000, and return hands it back to be stored in rice_value. is_low_stock(40) asks "40 < 50?" - True. is_low_stock(90) asks "90 < 50?" - False. Notice the callers never see inside the functions; they only know the name, the inputs, and the answer. That separation is what lets you reuse code and change it safely.

## Practise before building

### Exercise 1: A bill-line function

Write bill_line(price, qty) that returns price times qty. Call it for (950, 2) and (180, 5). Predict both answers, then run.

**Hint:** One def, one return, two calls.

**Check your result:** 1900 and 900 - both predicted before running.

### Exercise 2: Return vs print

Write a version of total_value that prints the answer instead of returning it. Then try adding two calls together. What happens, and why?

**Hint:** A function with no return gives back a special value called None.

**Check your result:** You can explain why adding returned values works but adding printed output fails.

### Exercise 3: Reuse three times

Use total_value three times - rice, sugar, tea - and add the three answers into stock_worth. Predict the total, then run.

**Hint:** worth = total_value(250, 40) + total_value(180, 90) + total_value(950, 25)

**Check your result:** Rs 49950, matching your prediction. One function, three uses.

## Common mistakes and how to debug them

- Calling a function before defining it - Python reads top to bottom, so def must come first.
- Forgetting return - the function then gives back None, and None + 5 is an error.
- Printing inside the function instead of returning - then the answer cannot be reused in maths.

## The FDE connection

In code review, seniors constantly say: "extract this into a function - you wrote it three times." Duplicated logic is how real bugs are born: the discount gets fixed in the bill but not in the report. Juniors who name small jobs well - total_value, is_low_stock - write code the whole team can read. Today's project is your first refactor: same behavior, better shape. That word will follow you for your whole career.

## Build your lesson project

**Dukaan v0.4 - organized code**

Dukaan works, but its logic is scattered: price times quantity is computed in three places, the low-stock test in two. Amina wants a small change - the low-stock limit moves to 40 - and you should only have to change it once. Rebuild v0.4: same program, organized into functions. Nothing the user sees changes; everything about the code gets better.

- dukaan.py rewritten with functions: line_total, is_low_stock, bill_total at minimum.
- No duplicated price-times-quantity logic - every use calls the function.
- The low-stock limit appears exactly once in the file.
- A before/after note: which lines disappeared and why the new version is easier to change.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What is the difference between defining a function and calling it?
- Why is returning better than printing inside a reusable function?
- If Amina adds a "damaged goods" discount, which function would change - and which would not?

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
