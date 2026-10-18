# Day 5 — The real stock book

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v0.5 - the stock book. You can take several study sessions.

**The situation:** Two customers have the same name. Your contact directory must keep both records.

### One idea: Choose how to organise your data

A list stores a sequence of values. A dictionary connects keys to values, like looking up a contact by an ID. A person's name can change and two people can share it, so a name makes a poor unique key. Give each contact a stable ID and keep the name inside the record. Searching should find records without removing the others.

**New words:**

- **List:** An ordered collection of values.
- **Dictionary:** A collection where a key lets you find its value.
- **ID:** A value chosen to identify one record reliably.

### Follow the example below

1. Two contacts named Ali have different dictionary keys, so neither overwrites the other.
2. The loop displays each ID, name, and city.
3. get looks up C003. Because it is missing, the example displays Contact not found.

### Try one small decision

You add another customer named Ali. Which approach keeps both customers safely?

1. Give them different IDs and keep Ali as each display name
2. Use Ali as the key for both records
3. Delete the first Ali before adding the next

<details>
<summary>A small hint</summary>

Ask which field identifies a person and which field only describes them.

</details>

<details>
<summary>Another hint</summary>

A unique ID can be C-001 or C-002 even when both display names are Ali.

</details>

<details>
<summary>Answer and explanation</summary>

**Give them different IDs and keep Ali as each display name** Yes. Stable unique IDs distinguish records even when names match.

</details>

**Then practise:** Add a contact with a new ID and a duplicate display name. Run the example and check that the original record still exists.

**Your project's first action:** Draw two contact records with different IDs but the same name. Add a city to each and decide which fields are required.

**How it connects:** Your queue already held several tickets. Now you are choosing a deliberate data structure; tomorrow you will save records between runs.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

Three separate lists - names, prices, quantities - are an accident waiting to happen: delete from one list and forget the others, and rice gets sugar's price. Real programs keep each item's facts together. Today Dukaan v0.5 gets a real stock book: a list of dictionaries, where every item is one labeled bundle. Add, remove, and search - the way real data works.

**Your project:** [Dukaan v0.5 - the stock book](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Store ordered values in a list and grow it with append().
- Label values with a dictionary so item["price"] replaces price1.
- Build and search a list of dictionaries as a tiny in-memory database.

## Understand the concept

### A list keeps things in order

A list is values in a row: names = ["Rice", "Sugar", "Tea"]. Positions start at 0: names[0] is "Rice". append() adds to the end, so the list grows without you rewriting it. len() tells you how many values there are. Lists are for "many of the same kind of thing" - many items, many prices, many customers. One row, one idea.

### A dictionary labels each value

A dictionary is values with name tags: item = {"name": "Rice", "price": 250, "qty": 40}. You read a value by its label: item["price"] gives 250. Labels beat positions: item["price"] still works if you add new labels later, while "the second value" breaks the moment the order changes. Use the wrong label - item["cost"] - and Python answers with a KeyError: the label does not exist. Label spelling must match exactly, including capitals.

### A list of dictionaries is a tiny database

Put the bundles in a row: stock = [{"name": "Rice", ...}, {"name": "Sugar", ...}]. Now each item's facts travel together - deleting one item deletes all its facts at once, and nothing can desynchronize. To find something, loop and check labels: "if item["name"] == "Tea":" - the same loop-plus-decision pattern from Day 3, now with labeled data. This shape - a list of labeled records - is how almost all real data looks, including the JSON you will save on Day 6.

## A worked example, step by step

Amina's stock book: three items as labeled bundles in a list. Add flour, find tea, count the book. Predict the two printed lines before you run.

```python
stock = [
    {"name": "Rice", "price": 250, "qty": 40},
    {"name": "Sugar", "price": 180, "qty": 90},
    {"name": "Tea", "price": 950, "qty": 25},
]

stock.append({"name": "Flour", "price": 120, "qty": 60})

for item in stock:
    if item["name"] == "Tea":
        print(f"Found Tea: Rs {item['price']}, qty {item['qty']}")

print(f"Items in the stock book: {len(stock)}")
```

**Expected result**

```text
Found Tea: Rs 950, qty 25
Items in the stock book: 4
```

stock starts as a list of three dictionaries - three bundles in a row. append() adds a fourth bundle at the end; the list is now four long, and nothing else had to change. The loop takes each bundle in turn and checks its "name" label; only Tea's bundle matches, so only one line prints. len(stock) counts the bundles: 4, because the appended flour counts. Predict first: if you searched for "Bread" instead, nothing would print - the loop would simply find no match, which is also the answer to "how do I know it is missing?"

## Practise before building

### Exercise 1: Remove an item

Remove Sugar by building a new list with only the items you want to keep. Predict the length, then print it.

**Hint:** Loop over stock; append each item whose name is not "Sugar" to a new list.

**Check your result:** Length is 3 after removal; rice, tea, and flour remain.

### Exercise 2: Change a price by label

Raise Tea's price to 1000: loop, match the name, assign item["price"] = 1000. Print the book after.

**Hint:** Loop, match the name, assign to the label.

**Check your result:** Tea shows Rs 1000; every other item is unchanged.

### Exercise 3: Count the stock value

Loop over the book and add up price times qty for every bundle. Predict the total first.

**Hint:** total = 0 before the loop; inside: total = total + item["price"] * item["qty"].

**Check your result:** Rs 57150 (10000 + 16200 + 23750 + 7200), matching your prediction.

## Common mistakes and how to debug them

- Using item["Price"] instead of item["price"] - labels are case-sensitive; KeyError means the label does not exist.
- Forgetting that positions start at 0 - stock[3] on a 3-item list is an error.
- Keeping three parallel lists instead of bundles - one deletion desynchronizes everything.

## The FDE connection

Almost every junior ticket touches labeled data: "the API returns a list of orders - show each customer's total." That API data arrives as JSON, which looks exactly like Python dictionaries in a list. Reading item["price"] today is reading real API responses next week. And the parallel-lists bug - rice getting sugar's price - is a real production bug juniors get asked to fix. Bundles prevent it by construction.

## Build your lesson project

**Dukaan v0.5 - the stock book**

Amina's shop now has four items and she keeps mixing up the three parallel lists. Rebuild v0.5: the stock becomes one list of dictionaries. Every feature - the list, the bill, the alerts, the report - must work on the new shape. Deleting an item must be one operation, not three.

- dukaan.py stores stock as a list of dicts with name, price, qty labels.
- All v0.5 features work unchanged on the new shape.
- New: remove an item by name in one operation; search prints one item's full record.
- A note: one real mistake the old parallel lists could cause, in your own words.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What breaks in the parallel-lists version when you delete the second item but forget one list?
- Why is item["price"] clearer than prices[1] to a stranger reading your code?
- Where else in real software have you seen labeled bundles? (Hint: Day 9's APIs.)

## References and next steps

- [Python: data structures](https://docs.python.org/3/tutorial/datastructures.html)

[← Lesson 4](../04_Day_Functions/) · [Lesson 6 →](../06_Day_Files_Errors_Debugging/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Lists = **ordered** collections. Dicts = **labeled** collections. Choosing the right shape for your data — *data modeling* — is a design decision, not syntax. Get the model right and the code writes itself; get it wrong and everything fights you.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### Lists: order matters

```python
fruits = ["apple", "mango", "banana"]
print(fruits[0])      # "apple" — counting starts at 0!
fruits.append("grapes")
print(len(fruits))    # 4
```

Use a list when **order matters** or you have many of the same kind of thing.

### Dictionaries: labels matter

```python
person = {
    "name": "Mubashir",
    "city": "Lahore",
    "role": "AI Engineer"
}
print(person["city"])       # "Lahore" — look up by LABEL, not position
person["role"] = "AI FDE"   # update by label
```

Use a dict when each piece of data has a **name**. A contact isn't "item 0, 1, 2" — it's name, phone, city.

### Nesting: the real world is nested

```python
contacts = [
    {"name": "Ali",   "phone": "0300-1111111", "city": "Lahore"},
    {"name": "Sara",  "phone": "0300-2222222", "city": "Karachi"},
]
```

A **list of dicts**: many contacts (order), each with labeled fields. This exact shape powers half the world's business software — and it's also what JSON APIs send you (day 9).

### The design question

Same data, two models. Which is right?

```python
# Option A: list of dicts
[{"name": "Ali", "phone": "..."}, {"name": "Sara", "phone": "..."}]

# Option B: dict of dicts, keyed by name
{"Ali": {"phone": "..."}, "Sara": {"phone": "..."}}
```

Option B finds "Sara" instantly; Option A keeps insertion order and allows duplicate names. **There is no universally right answer** — the right model depends on how you'll *use* the data. That judgment call is data modeling, and it's a senior skill.

---

## 2. Specify — direct the AI

Design the model **yourself first** — on paper, in words — then spec:

> "Build a contact book. Data model: a list of dicts, each with name, phone, city. Features: 1) add contact (reject empty name; warn on duplicate phone), 2) search by name (case-insensitive, partial match — 'ali' finds 'Ali Raza'), 3) delete by exact name, 4) list all. All data lives in memory for now (persistence is day 6). Functions only — no classes yet."

You made three modeling decisions in that spec (list-of-dicts, duplicate rule, search behavior). The AI just typed them.

## 3. Evaluate — be the senior

- Test: add two contacts, search partial name, search with different case, add duplicate phone, delete non-existent name.
- Ask: "What happens with 10,000 contacts — which operation gets slow, and why?" (Searching a list checks each item one by one — that's fine at 100, painful at 10 million. Noticing this is engineering intuition forming.)
- Challenge the model: "Propose two alternative data models for this contact book and argue when each wins." Pick one — defend it in one paragraph.

## 4. Business lens 💼

Every business app is **a data model + operations on it**. A shop's inventory, a clinic's patients, a school's students — all lists of labeled things. When a client says "we need software to manage X," your first job is modeling X. Clients pay for the model being *right* (captures their reality) more than for the code being clever.

---

## 💻 Exercises

### Level 1
Reverse a list **without** `.reverse()` — specify the approach first ("build a new list, walking backwards"), then have AI implement your approach.

### Level 2
Word frequency counter: "the cat sat on the mat" → `{"the": 2, "cat": 1, ...}`. Before AI builds: **which structure** holds the answer, and why? (Say it before you spec it.)

### Level 3
Extend the contact book: add an `"tags"` field (a **list inside the dict** — e.g. `["client", "lahore"]`), plus search-by-tag. Then write the senior review: draw your final data model as nested boxes and label every level. If you can't draw it, you don't own it yet.

---

## ✅ Done when

- [ ] You can explain when to use a list vs a dict — with a reason, not a rule
- [ ] You designed the contact book's data model *before* AI implemented it
- [ ] You can defend your model against at least one alternative
- [ ] Committed to GitHub

## 📎 The one link

[Asabeneh — 30 Days of Python, Days 5 & 8](https://github.com/Asabeneh/30-Days-Of-Python) — lists and dictionaries deep drills.

---

[← Day 4](../04_Day_Functions/) · [Day 6 →](../06_Day_Files_Errors_Debugging/)
<!-- original-workshop:end -->

</details>
