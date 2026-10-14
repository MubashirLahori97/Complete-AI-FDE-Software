# Day 3 — Decisions, repetition, and boundary cases

Conditions let a program choose an action; loops let it repeat an action over data. Together they express business rules such as which ticket needs attention and when processing should stop. Today you will move from isolated if statements to a small ticket-triage workflow with explicit priority rules and a visible summary.

**Your project:** [Support-ticket triage queue](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Trace which branch runs for a given condition, including equality.
- Process a collection without skipping or endlessly repeating work.
- Translate written priority rules into an ordered decision structure.

## Understand the concept

### Conditions have precise boundaries

The expression count > 10 asks a different question from count >= 10. The first excludes exactly ten; the second includes it. Test the boundary itself and the values on either side. For multiple rules, decide their order: an if/elif chain chooses the first matching branch, whereas separate if statements can run more than one branch. A ticket that is both old and critical must follow a documented priority rule, not whichever order was accidentally typed first.

### A loop needs a clear unit of work

A for loop visits items in an iterable. Identify what one iteration means: one ticket, one customer, or one attempt. Keep counters and accumulated results separate from the current item. An empty collection performs zero iterations, so your summary must still be meaningful. Avoid changing the collection you are iterating over unless you understand the behavior; filtering into a new collection is often clearer for a beginner.

### Termination belongs in the design

A while loop repeats while its condition is true. If the state used by that condition never changes, the loop can run forever. Interactive programs need a way to exit, and retrying programs need a maximum attempt count or time limit. break stops the loop; continue skips the rest of the current iteration. Neither should hide a missing design decision about what happens to rejected work or unfinished items.

## A worked example, step by step

The critical severity rule takes priority over the age rule. Trace each ticket before running the loop.

```python
tickets = [
    {"id": "T1", "severity": "critical", "age_hours": 2},
    {"id": "T2", "severity": "normal", "age_hours": 24},
    {"id": "T3", "severity": "normal", "age_hours": 3},
]
for ticket in tickets:
    if ticket["severity"] == "critical":
        priority = "urgent"
    elif ticket["age_hours"] >= 24:
        priority = "review"
    else:
        priority = "standard"
    print(ticket["id"], priority)
```

**Expected result**

```text
T1 urgent
T2 review
T3 standard
```

The list contains three dictionaries, each representing one ticket. The for statement binds ticket to each dictionary in turn. For T1, the first condition is true and the other branches are skipped. T2 reaches the age condition and qualifies at exactly 24 hours because the operator includes equality. T3 falls into the else branch. Each iteration assigns priority before it prints, so the previous ticket's result cannot accidentally be reused.

## Practise before building

### Exercise 1: Test the exact boundary

Create tickets aged 23, 24, and 25 hours. Predict their priority.

**Hint:** Focus on >= rather than the displayed age alone.

**Check your result:** Exactly 24 hours follows the written rule.

### Exercise 2: Count outcomes

Add a counter for urgent tickets and print a summary after the loop.

**Hint:** Initialise the counter before the loop and increment it only for the matching priority.

**Check your result:** The summary is correct for an empty list and for multiple critical tickets.

### Exercise 3: Bound repeated attempts

Write a three-attempt retry simulation that stops early after success.

**Hint:** Use a fixed range and break on the successful result.

**Check your result:** Failure cannot cause a fourth attempt or an endless loop.

## Common mistakes and how to debug them

- Using > where the requirement includes equality: test the threshold explicitly.
- Using separate if statements when only one priority should win: write down rule precedence.
- Forgetting empty input or stop conditions: the absence of work should still produce a useful summary.

## The FDE connection

Business policies often contain exceptions and conflicting rules. An FDE asks which rule wins and what happens at the threshold, then records examples before implementing the policy. A short, tested decision table can prevent a long argument after delivery.

## Build your lesson project

**Support-ticket triage queue**

A support lead needs a repeatable way to review tickets. Build a program that reads a small in-memory ticket list, assigns exactly one priority to each valid ticket, and prints a summary. Critical tickets are urgent; other tickets aged at least 24 hours need review; the rest are standard. Invalid or incomplete tickets must be reported instead of silently classified.

- A triage program with documented rule precedence.
- A sample queue containing normal, critical, old, and invalid tickets.
- A summary of each priority and rejected records.
- A test table for empty queues and threshold cases.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Why does rule order matter?
- What happens when the collection is empty?
- Which boundary case was most likely to reveal a bug?

## References and next steps

- [Python: control flow](https://docs.python.org/3/tutorial/controlflow.html)

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
