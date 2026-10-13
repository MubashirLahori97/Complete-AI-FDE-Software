# 📘 Day 12 — Trust: Testing & Reading Code Like an Engineer

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
- Ask the AI: "Quiz me — what's the difference between testing the contract vs testing the implementation? Why do we test edges more than happy paths?"

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

## 📎 The one link

[pytest — Getting Started](https://docs.pytest.org/en/stable/getting-started.html) — everything you need, nothing you don't.

---

[← Day 11](../11_Day_OOP_Essentials/) · [Day 13 →](../13_Day_First_Web_App/)
