# Day 11 — Objects, state, and domain rules

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Support-ticket domain model. You can take several study sessions.

**The situation:** A support ticket should move between allowed states. A random string should not become its status.

### One idea: Keep related state and rules together

An object groups some data with actions that use that data. A class describes how to make those objects. For a ticket, the data might be its ID and status; an action might close it. The useful part is keeping state changes behind clear rules. Use a class when this helps understanding; small functions can still be the right choice elsewhere.

**New words:**

- **Class:** A definition used to create objects with related data and actions.
- **State:** The values describing something at a particular moment.
- **Method:** A function attached to an object.

### Follow the example below

1. The class creates a ticket with an open starting state.
2. close checks whether the current state is open before changing it to closed.
3. The prints show the state before and after closing. The project adds a fuller state policy and validation.

### Try one small decision

A ticket only allows open and closed. Someone asks to set its status to banana. What should happen?

1. Reject the unsupported state and keep the previous valid state
2. Store banana because it is text
3. Delete the ticket

<details>
<summary>A small hint</summary>

The method should protect the rules, not just assign any string.

</details>

<details>
<summary>Another hint</summary>

Validate the proposed new state before changing the current one.

</details>

<details>
<summary>Answer and explanation</summary>

**Reject the unsupported state and keep the previous valid state** Yes. The transition rule protects the object's data from an invalid state.

</details>

**Then practise:** Add a second ticket.close() call after the existing example. Run it and inspect the error. Explain why the method refuses to close an already closed ticket.

**Your project's first action:** Draw the allowed ticket states and arrows between them. Decide what closing an already closed ticket should do.

**How it connects:** This revisits the support queue from Day 3. You are now putting its rules around each ticket's state.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

Objects can make a domain clearer when related state and behavior belong together. They also add complexity if introduced without a useful responsibility. Today you will model a support ticket and its allowed status transitions, then compare that design with a simpler dictionary-and-function version.

**Your project:** [Support-ticket domain model](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Identify an object's identity, state, and related behavior.
- Keep domain rules in a clear place rather than spreading them across callers.
- Compare a class with a simpler representation using actual change scenarios.

## Understand the concept

### State and behavior can form a useful unit

A ticket has an ID, title, and status. Closing the ticket is behavior governed by a rule about its current state. A class can keep those ideas together so callers do not each invent their own transition rules. The object is one representation of the domain, not the domain itself. Begin by writing the supported states and transitions in ordinary language. The useful abstraction is the rule, not merely a class declaration containing the same fields as a dictionary.

### Invariants constrain valid state

An invariant is a condition your design intends to keep true, such as a ticket always having a non-blank title. Decide whether invalid input is rejected at construction, at a method boundary, or elsewhere. Public mutable fields can let callers bypass a method's validation, so be honest about what a simple dataclass does and does not enforce. In a small lesson project, test and document the boundaries rather than claiming that a class automatically prevents all invalid state.

### Prefer the simplest model that earns its cost

A dictionary plus pure functions may be clearer for a simple transformation or one-off report. A class may help when an entity owns state and several related operations. Compare how a new rule would be added in both versions. Avoid inheritance unless the substitution relationship and behavior are clear; sharing a couple of fields is not enough reason. Good design reduces the mental work of making a correct change.

## A worked example, step by step

The close operation checks the current state rather than letting the caller silently choose an arbitrary transition.

```python
from dataclasses import dataclass

@dataclass
class Ticket:
    ticket_id: str
    title: str
    status: str = "open"

    def close(self):
        if self.status != "open":
            raise ValueError("Only an open ticket can be closed")
        self.status = "closed"

ticket = Ticket("T001", "Order question")
print(ticket.ticket_id, ticket.status)
ticket.close()
print(ticket.ticket_id, ticket.status)
```

**Expected result**

```text
T001 open
T001 closed
```

The dataclass supplies an initializer for the declared fields. self refers to the object receiving the method call. close validates the starting state before mutating status. The two output lines show the same identity through a transition. This minimal example does not validate titles or prevent direct assignment to status; those limitations are visible requirements for your project to address or document.

## Practise before building

### Exercise 1: Draw the state diagram

List the supported ticket states and allowed transitions, including attempts to repeat a transition.

**Hint:** A second close may be rejected or idempotent; choose and document one policy.

**Check your result:** Every transition has a defined result.

### Exercise 2: Protect a rule

Add a non-blank-title requirement and test where it is checked.

**Hint:** Think about creation and later updates, not just the first constructor call.

**Check your result:** Your stated boundary actually enforces or clearly limits the invariant.

### Exercise 3: Compare representations

Implement the close operation using a dictionary and function, then compare the two designs.

**Hint:** Judge a future rule change rather than counting class syntax.

**Check your result:** You can defend the simpler design for at least one use case.

## Common mistakes and how to debug them

- Introducing classes without an entity responsibility or a useful contract.
- Assuming a dataclass automatically validates every field or mutation.
- Using inheritance to share names while the behaviors do not support substitution.

## The FDE connection

A customer's workflow contains entities and rules, not merely database rows. An FDE makes those rules visible and chooses a representation that is practical for future changes. Showing where a model can still be bypassed is part of an honest design explanation.

## Build your lesson project

**Support-ticket domain model**

A help desk needs tickets with stable IDs, readable titles, and controlled status changes. Build a small domain model with create, close, and optional reopen operations. Test invalid creation and repeated transitions. Compare your object-based design with a simpler alternative and explain which one you would use for this scope.

- A ticket model and a written state-transition policy.
- Validation for required identity and title fields.
- Tests for normal, invalid, and repeated operations.
- A short class-versus-functions design comparison.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Which rule does the object own?
- What invariant can still be bypassed in your design?
- When would a dictionary and functions be clearer than this class?

## References and next steps

- [Python: classes](https://docs.python.org/3/tutorial/classes.html)
- [Python: dataclasses](https://docs.python.org/3/library/dataclasses.html)

[← Lesson 10](../10_Day_Environments_Packages/) · [Lesson 12 →](../12_Day_Testing_Clean_Code/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** A class models a thing with **state** (data it holds) + **behavior** (things it can do). The real skill isn't syntax — it's **judgment**: when does a class earn its existence, and when is a plain function or dict better? Most OOP tutorials teach too much; you need just enough, plus the judgment.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The idea in one example

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner        # state: data this account HOLDS
        self.balance = balance

    def deposit(self, amount):    # behavior: things it can DO
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            return "Insufficient funds."
        self.balance -= amount
        return f"Withdrew {amount}."

acc = BankAccount("Mubashir", 10000)
acc.deposit(5000)
print(acc.balance)   # 15000
```

- `class BankAccount:` — the **blueprint**.
- `__init__` — the constructor: runs when you create one ("birth").
- `self` — "this specific account." `acc.deposit()` means: run `deposit` **on acc's data**.
- An **object** (`acc`) is the blueprint brought to life with its own state.

### The judgment: when is a class worth it?

| Use a class when… | Use a function/dict when… |
|---|---|
| The thing has **state that changes** over time (account balance, game player) | It's a one-shot computation (convert units) |
| Multiple **behaviors operate on the same data** | One behavior, no memory needed |
| You need **many independent copies** (100 accounts) | There's only ever one of it |

The test: **"Does this thing remember things between uses?"** If yes → class candidate. If no → function. Applying this test correctly is senior thinking; most over-engineering comes from skipping it.

### What you DON'T need today

Inheritance hierarchies, polymorphism lectures, design patterns — skip them. You'll recognize when you need them (roughly: when you catch yourself writing the same class three times with small differences). Today: state + behavior + the judgment test.

---

## 2. Specify — direct the AI

> "Refactor my expense tracker into classes: an Expense class (amount, category, note, date) and an ExpenseTracker class (holds the list, with add/list/totals_by_category/save/load methods). BUT first: argue the case — for each class, tell me what state it owns and why a dict + functions wouldn't be enough. If you can't make the case for a class, don't create it."

You're making the AI **defend its design before typing** — exactly the review you'd get (or give) in a real team.

## 3. Evaluate — be the senior

- For each class, answer: **what state does it own?** What breaks if that state were global instead?
- Create two trackers. Add an expense to one. Does the other change? (If yes — shared state bug, the classic OOP footgun. Understand *why*.)
- Ask the AI: "Show me one place in this refactor where a class was NOT worth it, and what you'd use instead." Then decide if you agree — **you're the judge**.
- The killer question: "What did classes buy me here that functions didn't?" If the answer is thin, that's a lesson too.

## 4. Business lens 💼

Over-engineering **costs clients real money** — every unnecessary class is code to write, test, and maintain. The most expensive sentence in software is "let's make it flexible for the future." Clients pay for software that solves *today's* problem cleanly and can evolve *when* needed, not for architecture astronautics. "Just enough" is a business skill.

---

## 💻 Exercises

### Level 1
`BankAccount` with deposit/withdraw/balance — then add `transaction_history` (a list of dicts — day 5 meets day 11). State + behavior, small and clean.

### Level 2
Model a **library book**: title, author, `is_borrowed` state, `borrow()`/`return_book()` behavior. Rule: can't borrow an already-borrowed book. Where does the rule live — in the method or outside? (Defend your choice.)

### Level 3
**The deletion exercise:** take your refactored tracker and delete one class, replacing it with functions + dicts. Does anything get *worse*? Write a paragraph: what did the class actually buy you? If the answer is "not much," you've learned the most valuable OOP lesson there is.

---

## ✅ Done when

- [ ] You can explain state vs behavior, and the "does it remember things?" test, without notes
- [ ] Every class in your refactor is defended — state owned, alternative considered
- [ ] You can explain `self` in one sentence
- [ ] Committed to GitHub

## 📎 The one link

[Corey Schafer — Python OOP series (YouTube)](https://www.youtube.com/@coreyms) — watch only what you need; you have the core already.

---

[← Day 10](../10_Day_Environments_Packages/) · [Day 12 →](../12_Day_Testing_Clean_Code/)
<!-- original-workshop:end -->

</details>
