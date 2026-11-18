# Day 3 — The smart stock check

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v0.3 - the smart stock checker. You can take several study sessions.

**The situation:** A support lead needs critical tickets handled first and other tickets reviewed when they are at least 24 hours old.

### One idea: Turn a rule into a decision

A condition asks a question that has a true or false answer. if runs a block when its condition is true. elif checks another condition only if the earlier condition was false. else handles what remains. A loop repeats these instructions for each item. Rule order matters: a critical ticket should keep its urgent priority even when it is also old.

**New words:**

- **Condition:** A question with a true or false result.
- **Boundary:** The exact point where a rule changes, such as 24 hours.
- **Loop:** Instructions repeated for each item or until a stopping rule is met.

### Follow the example below

1. The example checks the critical-severity rule before the age rule.
2. The age rule includes exactly 24 using >=. That symbol means greater than or equal to.
3. The remaining tickets receive the standard priority. One ticket gets one result.

### Try one small decision

A ticket is critical and 30 hours old. With the critical rule checked first, what priority should it receive?

1. Standard, because every ticket starts there
2. Review and urgent at the same time
3. Urgent

<details>
<summary>A small hint</summary>

Follow the conditions from top to bottom.

</details>

<details>
<summary>Another hint</summary>

After a true if branch, Python skips the related elif and else branches.

</details>

<details>
<summary>Answer and explanation</summary>

**Urgent** Yes. The first condition matches critical severity, so the later age branch is skipped.

</details>

**Then practise:** Find the age threshold in the example. Test an ordinary ticket at 23, 24, and 25 hours. Keep the rule unchanged and explain why exactly 24 belongs to review.

**Your project's first action:** Write three example tickets and their expected priorities: critical, ordinary at exactly 24 hours, and ordinary at 23 hours. Put the critical rule first.

**How it connects:** Your converter had input rules. Now you can express rules directly and apply them repeatedly to a queue.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

Amina has two morning jobs. One: check every item's stock and flag what is low. Two: apply the Friday rule - bills above Rs 1000 get 10% off. Writing each check by hand means one block per item, and next month there will be thirty items. Today Dukaan v0.3 learns the two halves of real work: decisions (ask a yes/no question) and loops (repeat the check for every item). One loop, one decision inside it, and the whole shop gets checked.

**Your project:** [Dukaan v0.3 - the smart stock checker](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Write if/elif/else decisions that apply business rules like discounts and stock alerts.
- Use a for loop to run the same check once per item, however many items there are.
- Combine a loop with a decision so every item is checked automatically.

## Understand the concept

### Decisions are yes/no questions

A shopkeeper decides all day: is the bill big enough for a discount? Is the stock too low? In code, each decision is a question with two answers - yes or no - written with if. The lines indented under if run only when the answer is yes. The lines under else run when the answer is no. Indentation is not decoration; it is how Python knows which lines belong to the decision. Rules with two questions use and (both must be yes) or or (one yes is enough): "bill above 2000 AND it is Friday" needs both; "tea is low OR sugar is low" needs one.

### Comparisons ask, == is not =

total > 1000 asks "is the total above 1000?" The answer is True (yes) or False (no). Watch the boundary: with >, a total of exactly 1000 gets no discount - the question is "strictly above". With >=, exactly 1000 would qualify. Real bugs live on boundaries, so always test the exact boundary value. And == (two equals signs) compares; = (one equals sign) stores. Mixing them up is the most common beginner error in every country: "if total = 1000" is always wrong.

### Repeating beats copying

Without a loop, checking three items means writing the check three times. Thirty items means thirty copies - and the day you fix a bug, you must fix it thirty times. A for loop says: "here is the job; do it once per value." You write the check once, and Python repeats it for every item. Fewer copies, fewer mistakes, and adding a fourth item changes nothing in the loop.

### for walks through a row of values

A list is values in a row inside square brackets: prices = [250, 180, 950]. (You will master lists on Day 5; today just borrow the idea.) "for price in prices:" means "take each value in turn, call it price, and run the block." First round price is 250, then 180, then 950 - then the loop ends. The block is the indented lines, just like with if. Two more tools for later: range(3) counts 0, 1, 2 for a fixed number of rounds, and while repeats until its question turns false - but a while loop must change its answer inside the block, or it never stops.

## A worked example, step by step

Amina's two morning jobs in one program: a loop checks every item's stock and flags what is low, then one decision applies the Friday discount to a Rs 1200 bill. Predict every printed line before you run - especially which items get flagged.

```python
names = ["Rice", "Sugar", "Tea"]
prices = [250, 180, 950]
stocks = [40, 90, 25]

print("Morning stock check:")
for i in range(3):
    if stocks[i] < 50:
        print(f"{names[i]}: Rs {prices[i]} - LOW STOCK, order more!")
    else:
        print(f"{names[i]}: Rs {prices[i]} - OK")

total = 1200
if total > 1000:
    discount = total / 10
else:
    discount = 0
print(f"Bill: Rs {total}, discount: Rs {discount}, to pay: Rs {total - discount}")
```

**Expected result**

```text
Morning stock check:
Rice: Rs 250 - LOW STOCK, order more!
Sugar: Rs 180 - OK
Tea: Rs 950 - LOW STOCK, order more!
Bill: Rs 1200, discount: Rs 120.0, to pay: Rs 1080.0
```

The loop runs three rounds with i = 0, 1, 2. Round 0: stocks[0] is 40, below 50, so Rice gets the LOW STOCK line. Round 1: stocks[1] is 90, so Sugar gets OK. Round 2: stocks[2] is 25, so Tea is flagged. Then the decision: 1200 > 1000 is True, so discount = 120.0 (division always gives a decimal number: 120.0). To pay is 1200 - 120.0 = 1080.0. Now predict: with total = 1000, the discount question is False - no discount. That boundary is where real discount bugs hide.

## Practise before building

### Exercise 1: Test the boundary

Set total to 1000 and predict the discount. Set it to 1001 and predict again. Run both.

**Hint:** The rule says "above 1000", not "1000 or above".

**Check your result:** Rs 0 discount at 1000, Rs 100.1 at 1001 - both predicted before running.

### Exercise 2: Count the alerts

Add a counter that counts how many items are LOW STOCK, and print the count after the loop.

**Hint:** Create low = 0 before the loop; add 1 inside the LOW STOCK branch.

**Check your result:** The count is 2 for the starter stocks.

### Exercise 3: Add a fourth item

Add "Flour", 120, 60 to the three lists and change range(3) to range(4). Predict the new lines, then run.

**Hint:** All three lists and the range must agree on 4.

**Check your result:** Four status lines print; no other code changed.

## Common mistakes and how to debug them

- Writing = when you mean == - one stores a value, two compares.
- Forgetting the colon after the if or for line - Python needs it to start a block.
- Wrong indentation - a line that looks inside the block but is not indented runs every time (or never, inside a loop).
- range(3) with four items - the loop only visits the first three. The range and the lists must agree.

## The FDE connection

Two of the most common junior tickets arrive together: "apply this business rule" and "do it for every row". Business rules change constantly - "discount now starts at Rs 1500" - and seniors always ask "what happens at exactly the threshold?" Every-row work is always a loop; copy-pasting thirty checks is thirty chances to break. Today you practiced both halves of real tickets: the decision and the repetition.

## Build your lesson project

**Dukaan v0.3 - the smart stock checker**

Amina opens the shop each morning with two jobs: check every item's stock, and apply the Friday discount to big bills. Build v0.3: one program that loops over all items printing a status line each (OK or LOW STOCK), reports the cheapest and most expensive item, then applies the discount rule to the bill. The rules live in clearly marked variables at the top, so Amina can change them without touching the logic.

- dukaan.py loops over the items - no repeated per-item lines.
- Each item prints one status line: name, price, OK or LOW STOCK; the end prints cheapest, priciest, and the discounted bill.
- DISCOUNT_LIMIT and LOW_STOCK_LIMIT variables at the top, plus a test note with the boundary values you tried.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Why is one loop better than three copied blocks when Amina adds a fourth item?
- A customer argues their Rs 1000 bill deserves the discount. What does the code say - and is the rule or the code wrong?
- What breaks if the three lists have different lengths? How would you notice?

## References and next steps

- [Python: if statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
- [Python: for statements](https://docs.python.org/3/tutorial/controlflow.html#for-statements)

[← Lesson 2](../02_Day_Python_Variables_Types/) · [Lesson 4 →](../04_Day_Functions/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** `if` = decisions. Loops = repetition. Every app on earth — Instagram, banking, AI chatbots — is these two ideas composed at scale. Learn them deeply once, recognize them everywhere forever.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### Decisions: `if / elif / else`

```python
temperature = 38

if temperature > 37:
    print("Fever — see a doctor.")
elif temperature > 36:
    print("Slightly warm — rest.")
else:
    print("Normal.")
```

The program **chooses a path** based on data. Key ideas:
- Conditions are True/False questions (that's the `bool` type from day 2).
- `elif` = "otherwise, if this…". `else` = "if nothing above matched."
- Indentation (the spaces) is how Python knows what belongs inside the decision. It matters.

Comparison operators you'll use constantly: `==` (equal), `!=` (not equal), `>` `<` `>=` `<=`. And combiners: `and`, `or`, `not`.

```python
if age >= 18 and has_id:
    print("Entry allowed.")
```

### Repetition: loops

**`while`** — repeat *until something changes*:
```python
tries = 0
while tries < 3:
    print("Trying...")
    tries = tries + 1   # if you forget this line, the loop NEVER ends
```

**`for`** — repeat *for each item*:
```python
for name in ["Ali", "Sara", "Bilal"]:
    print(f"Hello, {name}!")
```

### The two ideas together

```python
secret = 7
guess = 0

while guess != secret:          # repetition: keep going until correct
    guess = int(input("Guess: "))
    if guess < secret:          # decision: which hint?
        print("Higher...")
    elif guess > secret:
        print("Lower...")
    else:
        print("Correct!")
```

Read it out loud: "keep asking *while* the guess is wrong; *if* too low say higher…" — if you can narrate it, you own it.

### ⚠️ The classic trap: infinite loops

A `while` loop whose condition never becomes False runs **forever**. Every programmer does this once. When it happens: `Ctrl+C` stops it. Then ask: "what was supposed to change, and didn't?"

---

## 2. Specify — direct the AI

Write the spec **before** touching AI. Example:

> "Write a number guessing game: 1) computer picks a random number 1–100, 2) player guesses, gets 'higher'/'lower' hints, 3) counts tries and reports them at the end, 4) asks 'play again? (y/n)' and respects the answer, 5) if the player types a non-number, say so and don't count it as a try."

Give it to the AI. Then — critically — **check the game against YOUR spec**, rule by rule. Did it implement what you specified, or what it imagined?

## 3. Evaluate — be the senior

- Play it badly on purpose: type `abc`, type `9999`, type nothing, say `n` then `y`.
- For each surprise: was the *spec* incomplete, or did the AI misread it? Fix whichever was wrong.
- Ask the AI: "Show me where the loop could become infinite in this program, and what prevents it."
- Trace: if the secret is 42 and I guess 50, then 30, then 42 — which branches execute, in order?

## 4. Business lens 💼

"Play again? (y/n)" is a **retention loop** — the same pattern as "watch next episode?" Every business wants users to come back; loops in code mirror loops in business. And input validation ("don't count `abc` as a try") is **data quality** — garbage in, garbage out is a business problem, not just a code problem.

---

## 💻 Exercises

### Level 1
FizzBuzz, specified by you: "print 1–100; multiples of 3 → 'Fizz', of 5 → 'Buzz', of both → 'FizzBuzz'." AI builds; you verify all four cases appear.

### Level 2
A **password checker**: ask for a password, require 8+ characters AND at least one digit. Keep asking until valid. Specify the rules first — then check the AI enforced *your* rules.

### Level 3
**ATM simulator**: balance starts at 10,000. Loop a menu: 1) check balance 2) deposit 3) withdraw 4) exit. Withdraw more than balance → refuse with a message. Specify every rule (including: can balance go negative? what about non-number input?). Then be the QA engineer: try to break your own spec.

---

## ✅ Done when

- [ ] You can narrate any loop+if program out loud, branch by branch
- [ ] Your spec produced the game you imagined — you checked rule by rule
- [ ] You can explain what makes a loop infinite and how to stop one
- [ ] Committed to GitHub

## 📎 The one link

[Asabeneh — 30 Days of Python, Days 9–10](https://github.com/Asabeneh/30-Days-Of-Python) — conditionals and loops drills.

---

[← Day 2](../02_Day_Python_Variables_Types/) · [Day 4 →](../04_Day_Functions/)
<!-- original-workshop:end -->

</details>
