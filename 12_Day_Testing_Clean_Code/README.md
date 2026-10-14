# Day 12 — Testing, regression evidence, and reading code

A passing demonstration proves that one observed path worked. Tests preserve specific expectations so you can check them again after a change. Today you will learn to choose useful assertions, test boundaries independently of the implementation, and investigate a deliberately incorrect calculation before building a regression suite.

**Your project:** [A regression suite for the expense calculator](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Write assertions that express an external requirement.
- Distinguish unit checks, integration checks, and a user workflow check.
- Create a regression case that detects a concrete bug.

## Understand the concept

### Expected results must come from the requirement

If a test calculates its expected result by calling the same faulty implementation, it may only prove that the code agrees with itself. Use a manual reference example, a defined contract, or an independent oracle. Choose cases that would fail if the intended behavior were broken. A test suite is evidence about the cases and assertions it contains, not a mathematical guarantee that every possible input is correct.

### Test at useful boundaries

A unit test checks a small operation, such as a quote calculation. An integration check verifies that components cooperate, such as storing and restoring an expense. A workflow check asks whether the user can complete the whole task. Keep small deterministic checks fast and isolate external services with explicit fixtures where appropriate. A mock has a narrower meaning than a real provider test: it verifies your behavior against the mock's contract, not the provider's current availability.

### Read code with a question

Instead of reading every file equally, trace the path for a specific input or failure. Identify where input is validated, where state changes, and where output is produced. After locating the bug, first preserve a regression example that reproduces it. Make the smallest justified fix and rerun related cases. AI can propose both code and tests, but review whether the assertions would catch the reported problem rather than accepting the number of tests as a quality measure.

## A worked example, step by step

The expected total is calculated manually from the written contract, not by asking the function to provide its own expected value.

```python
def total_cents(price_cents, quantity):
    if price_cents < 0 or quantity < 0:
        raise ValueError("Negative input")
    return price_cents * quantity

assert total_cents(250, 3) == 750
assert total_cents(250, 0) == 0
try:
    total_cents(250, -1)
except ValueError:
    print("Invalid-input case passed")
else:
    raise AssertionError("Negative quantity should be rejected")
print("3 regression cases passed")
```

**Expected result**

```text
Invalid-input case passed
3 regression cases passed
```

The first assertion checks a manually known normal result and the second checks a zero boundary. The try/except verifies a rejected input and the else branch makes the absence of an exception a failing test. If multiplication is accidentally changed to addition, the first two assertions fail. For a real suite, move these examples into a test runner such as unittest or pytest so results and failures are collected systematically. Do not use assert as the only guard on real user input because Python can disable assertions in optimized mode.

## Practise before building

### Exercise 1: Prove the test can fail

In a disposable copy, change multiplication to addition and run the regression examples.

**Hint:** A useful test should detect a plausible wrong implementation.

**Check your result:** The test fails for the intended reason and passes again after repair.

### Exercise 2: Choose independent expectations

Write a manual expected quote for two line items, zero quantity, and a delivery fee.

**Hint:** Do not calculate expected output using the function under test.

**Check your result:** The reference values can be reviewed without reading the implementation.

### Exercise 3: Trace one real file

Read an earlier project's validation path and summarise its input, state change, and output in three sentences.

**Hint:** Follow one task rather than describing every helper function.

**Check your result:** Your summary predicts where a malformed input should be rejected.

## Common mistakes and how to debug them

- Writing expectations that duplicate the implementation's mistake.
- Mocking every layer and then claiming a real integration was verified.
- Counting passing tests without inspecting whether they assert useful behavior.

## The FDE connection

A customer asks how you know a change is safe. An FDE answers with concrete requirements, representative checks, and known limits. A clear regression case is stronger evidence than saying an AI assistant reviewed the code and it looks correct.

## Build your lesson project

**A regression suite for the expense calculator**

The expense calculator once produced an incorrect total. Build a repeatable test suite that captures that failure, normal calculations, zero values, invalid input, and a storage round trip. Keep the expected results independent and write a short report describing what the suite establishes and what still requires a workflow or provider check.

- A test module runnable with unittest or pytest.
- A regression case for a documented calculation bug.
- Boundary, invalid-input, and storage integration cases.
- A report of assertions, observed results, and coverage limits.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What requirement does each assertion establish?
- Which test could pass while the application is still unusable?
- How did you know the regression test was capable of detecting the bug?

## References and next steps

- [Python: unittest](https://docs.python.org/3/library/unittest.html)
- [pytest: getting started](https://docs.pytest.org/en/stable/getting-started.html)

[← Lesson 11](../11_Day_OOP_Essentials/) · [Lesson 13 →](../13_Day_First_Web_App/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** A test is **executable proof** that code does what you claim. In the AI era this matters *more*, not less: AI writes fast, sounds confident, and is sometimes wrong. Your job as the senior: **prove it works, don't trust it works.** "How do you know?" is the most important question in engineering.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### What a test actually is

```python
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5          # the claim, in code
    assert add(-1, 1) == 0         # edge case: negatives
    assert add(0, 0) == 0          # edge case: zeros

# run with: pytest
```

`assert` = "this MUST be true, or scream." A test file is a list of claims about your code. Run `pytest`, and it checks every claim in milliseconds. **Green = the claims hold. Red = something broke** — and it tells you exactly which claim.

### The anatomy: Arrange–Act–Assert

```python
def test_withdraw_too_much():
    acc = BankAccount("M", 100)          # ARRANGE: set up the world
    result = acc.withdraw(500)           # ACT: do the thing
    assert result == "Insufficient funds."  # ASSERT: check the outcome
    assert acc.balance == 100            # ASSERT: check nothing else broke
```

Three beats. Every test you'll ever write is this rhythm.

### What to test (the judgment)

- **The contract**: does it do what it promises? (withdraw refuses overdraft)
- **The edges**: zeros, empties, negatives, duplicates — where bugs live.
- **The failures**: bad input → graceful message, not traceback (day 6).

You don't test *everything* — you test **what would embarrass you if it broke in front of a client**.

### Reading code: the other half of trust

Half of engineering is reading *other people's* code — libraries, AI output, teammates' PRs. The method: **don't read top-to-bottom.** Find the entry point (`main`), then follow the calls. Ask at each function: what does it promise? Skim the how; verify the what.

---

## 2. Specify — direct the AI

> "I have an expense tracker with functions: add_expense, totals_by_category, save/load. Write pytest tests for: 1) adding a valid expense increases the list, 2) totals_by_category math is correct with 3 categories, 3) adding with an empty category is rejected gracefully, 4) save then load preserves all data exactly. For each test, use arrange-act-assert and name it test_<what>_<expected>. Then run them."

Then the twist — **you** write one more test the AI didn't think of. That's the senior move: the test suite is only as good as the imagination behind it.

## 3. Evaluate — be the senior

- Run `pytest -v`. All green? Now **break your code on purpose** (change a `+` to `-` in totals) and re-run. Does the suite catch it? A test suite that can't catch a deliberate bug is decoration.
- **Mutation review:** for each test, ask "what bug would slip past this test?" Write down one gap per test file. Gaps are normal — *knowing* them is the skill.
- Read one real file from an open-source project you use (e.g., a small function in `requests`). Entry point → follow calls → 3-sentence summary. Time yourself: 15 minutes max.
- Ask the AI: "Quiz me — what's the difference between testing the contract vs testing the insides? Why do we test edges more than happy paths?"

## 4. Business lens 💼

**"How do you know it works?"** — the first question any serious client asks, and the question that kills most freelancers. Your answer: *"Here's the test suite — 24 checks, all green, run on every change."* Tests are **proof you can sell**. They also let you change code fearlessly later — which is what clients pay maintenance for.

---

## 💻 Exercises

### Level 1
Test your day-2 converter: correct conversions + non-number input handled. Four tests minimum.

### Level 2
**Test the AI's work:** have AI write a `discount(price, percent)` function. Don't read it — write tests from the *spec* first (0%, 100%, negative price, percent > 100), then run them against AI's code. Did it pass? This is how you review AI output professionally.

### Level 3
**Find a real bug:** run your full expense-tracker suite, then have AI "improve" one function. Re-run. If something goes red, you just experienced *regression* — and your suite earning its keep. Write down what the suite caught that your eyes didn't.

---

## ✅ Done when

- [ ] You can explain arrange-act-assert and what makes a good test target, without notes
- [ ] Your suite catches a deliberately introduced bug
- [ ] You can summarize a stranger's code file in 3 sentences after 15 minutes
- [ ] Committed and pushed to GitHub

> 🔭 **Coming back to this:** in [Phase 2, week 3](../31_Phase2_Build_Like_An_Engineer/) you'll take testing pro — 70%+ coverage, CI pipelines, tests as team practice. Today you learned to trust your code. There, you'll make *teams* trust it.

## 📎 The one link

[pytest — Getting Started](https://docs.pytest.org/en/stable/getting-started.html) — everything you need, nothing you don't.

---

[← Day 11](../11_Day_OOP_Essentials/) · [Day 13 →](../13_Day_First_Web_App/)
<!-- original-workshop:end -->

</details>
