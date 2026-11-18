# Day 6 — Saving the shop

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** Dukaan v0.6 - memory that survives. You can take several study sessions.

**The situation:** Your contact directory works, but closing the program loses its records.

### One idea: Save data so it survives a restart

Values in a running program usually disappear when the program stops. A file can keep them for a later run. JSON is a text format for structured data. Saving turns records into file contents; loading reads those contents back. A missing file and a damaged file are different problems. Handle both deliberately so a recovery step does not silently destroy existing work.

**New words:**

- **Persistence:** Keeping data after the program stops.
- **JSON:** A text format used to exchange and store structured values.
- **Exception:** A reported problem that interrupts the normal flow of instructions.

### Follow the example below

1. The example turns contact data into JSON text and reads it back.
2. Parsing checks whether the text is valid JSON. It does not guarantee the fields your app needs are present.
3. isinstance checks that the top-level value is a dictionary. Field-level validation and local file save/load are further project work.

### Try one small decision

Your contacts print correctly. You close the app, reopen it, and they are gone. What was missing?

1. More print statements
2. A different contact name
3. Saving records and loading them on the next run

<details>
<summary>A small hint</summary>

Separate what exists in memory from what exists on disk.

</details>

<details>
<summary>Another hint</summary>

A complete persistence loop is load → change → save → restart → load again.

</details>

<details>
<summary>Answer and explanation</summary>

**Saving records and loading them on the next run** Yes. Persistence needs a place to store data and a way to read it back.

</details>

**Then practise:** Keep the working round trip. Add print(isinstance(json.loads("[]"), dict)) below it. Compare that false result with the existing error from loading not valid JSON. Explain why valid JSON can still have the wrong shape.

**Your project's first action:** Reuse your Day 5 contact shape. Write down the filename you will save to and what should happen if it does not exist yet.

**How it connects:** Extend the contact directory rather than inventing a new data model. Browser lab files belong to its temporary environment; test real restart behaviour in your local project.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

Everything Dukaan knows lives in the program's memory. Close the program and it forgets - every morning Amina retypes the stock. Worse: one mistyped quantity crashes the whole bill. Today Dukaan v0.6 gets two upgrades: files give it a memory that survives closing, and try/except keeps it standing when input is bad.

**Your project:** [Dukaan v0.6 - memory that survives](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Save a Python data structure to a file and load it back with the json module.
- Use try/except to handle missing files and bad input without crashing.
- Explain why JSON is the format programs use to share structured data.

## Understand the concept

### Files remember after the program ends

Variables die when the program stops. A file survives. open("stock.json", "w") opens the file for writing; json.dump(stock, f) translates the list of dictionaries into text and writes it. Later, open("stock.json") with json.load(f) translates the text back into Python values. JSON (JavaScript Object Notation - a boring name for a useful idea) is text shaped exactly like Python lists and dicts, which is why the round trip is so smooth. "with" closes the file for you, even if something goes wrong inside the block.

### Errors are messages, not the end

int("three") fails. A missing file fails. In Day 2 that meant a crash; today it means a decision. try: says "attempt this"; except ValueError: says "if that specific failure happens, do this instead." The program keeps running - it prints a helpful message, uses a safe default, and carries on. Catch specific errors (ValueError, FileNotFoundError), not everything: hiding all errors also hides your own bugs, and then nothing can be fixed.

### JSON: the text format programs share

json.dump translates your list of dictionaries into text; json.load rebuilds it. The text is not Python - it is JSON, a format almost every language reads. That is why it matters beyond this lesson: on Day 9 you will read JSON from a real supplier API, and the file you save today is the same shape as the data that API sends. Keep the stock book to lists, dicts, text, and numbers - JSON cannot hold everything Python can.

## A worked example, step by step

Amina's stock book, saved to a file and loaded back. The file might not exist yet - the program must not crash. Read the code, predict the exact output, then run it. Then, as an experiment: comment out the save block and run again - predict which branch runs.

```python
import json
import os

FILENAME = "dukaan_stock.json"

stock = [
    {"name": "Rice", "price": 250, "qty": 40},
    {"name": "Sugar", "price": 180, "qty": 90},
]

with open(FILENAME, "w") as f:
    json.dump(stock, f)
print("Saved the stock book.")

try:
    with open(FILENAME) as f:
        loaded = json.load(f)
    print(f"Loaded {len(loaded)} items: {loaded[0]['name']} and {loaded[1]['name']}")
except FileNotFoundError:
    print("No saved file yet - starting fresh.")
    loaded = []

typed = "three"
try:
    qty = int(typed)
except ValueError:
    print(f"'{typed}' is not a number - using 0.")
    qty = 0
print(f"Quantity accepted: {qty}")

os.remove(FILENAME)
print("Demo file cleaned up.")
```

**Expected result**

```text
Saved the stock book.
Loaded 2 items: Rice and Sugar
'three' is not a number - using 0.
Quantity accepted: 0
Demo file cleaned up.
```

json.dump translates the stock list into text and writes it to dukaan_stock.json. The try block then reads it back: the file exists, so json.load rebuilds the list and the "Loaded 2 items" line prints - the except branch is skipped. Next, int("three") raises ValueError; the except catches it, prints the friendly message, and qty becomes 0 instead of crashing. Finally the demo deletes its own file so nothing is left behind. Now the experiment: comment out the save block and run again. This time open() raises FileNotFoundError, and you will see the "starting fresh" branch run. That branch is what v1.0 uses on every first launch.

## Practise before building

### Exercise 1: Watch the missing-file branch

Comment out the save block (the "with open ... 'w'" part) and run. Predict what prints before you run.

**Hint:** Without the save, the file does not exist when the load runs.

**Check your result:** "No saved file yet - starting fresh." prints, and the program finishes normally.

### Exercise 2: Corrupt the file

In a scratch file, run only the load part after writing the text "hello" into dukaan_stock.json by hand. What error appears? Describe it in your own words.

**Hint:** json.load on non-JSON text raises json.JSONDecodeError.

**Check your result:** You can name the error and explain that the file's text was not valid JSON.

### Exercise 3: Round-trip your stock book

Build your 3-item stock book (a list of dicts), save it with json.dump, load it back, and print loaded == stock_book.

**Hint:** == on two lists compares every value inside them.

**Check your result:** It prints True - the round trip lost nothing.

## Common mistakes and how to debug them

- Catching every error with a bare "except:" - it hides your real bugs along with the expected failures.
- Mixing up the file modes: json.dump needs the file opened for writing, json.load for reading.
- Saving values JSON cannot hold and being surprised on load - keep the stock book to lists, dicts, text, and numbers.

## The FDE connection

Two rules every junior learns the hard way. One: users type anything - "three", "-5", an empty line. A program that crashes on bad input is a bug report waiting to happen, and "handle invalid input gracefully" is one of the most common junior tickets there is. Two: data loss is the unforgivable bug. Losing Amina's stock book would be worse than any crash. Save carefully, load defensively, and never let a missing file become a lost morning.

## Build your lesson project

**Dukaan v0.6 - memory that survives**

Dukaan forgets everything when it closes - every morning Amina retypes the stock. Build v0.6: on start, load the stock book from dukaan_stock.json (or start fresh with a clear message if there is no file); after every change, save; and no bad input may ever crash it - "three", "-5", and empty input all get a friendly message.

- dukaan.py loads the stock book from dukaan_stock.json on start, or starts fresh with a message.
- Adding an item saves the file immediately.
- A test note: the bad inputs you tried and what the program printed.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Why is the load wrapped in try/except but the save usually is not?
- What Python values can JSON not hold? What would break if the stock book used them?
- Amina deletes the file by accident. What does she lose, and what would you change so she loses less?

## References and next steps

- [Python: reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Python: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)

[← Lesson 5](../05_Day_Lists_Dictionaries/) · [Lesson 7 →](../07_Day_Project1_CLI_App/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** Programs have **amnesia** — when they stop, everything in memory vanishes. *Persistence* (saving to files) is how software remembers. And *everything fails*: files vanish, users type nonsense, networks drop. Engineering isn't writing the happy path — it's expecting failure and handling it gracefully.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### Persistence: memory vs files

```python
contacts = [...]   # lives in RAM — gone when the program exits
```

```python
# Save: turn data into text, write it to a file
with open("contacts.txt", "w") as f:
    f.write("Ali,0300-1111111,Lahore\n")

# Load: read the file, turn text back into data
with open("contacts.txt") as f:
    for line in f:
        name, phone, city = line.strip().split(",")
```

`with open(...)` handles opening *and* closing — even if something goes wrong. The pattern "data → text → file → text → data" is called **serialization**, and every database on earth is a fancier version of it.

### Failure: the `try/except` mindset

```python
try:
    age = int(input("Age? "))      # might explode if user types "abc"
    print(f"Next year: {age + 1}")
except ValueError:
    print("That's not a number — try again.")
```

- `try:` — "attempt this dangerous thing."
- `except ValueError:` — "if *this specific* failure happens, do this instead of crashing."
- Golden rule: catch **specific** failures, not everything. `except:` (bare) hides bugs you'll never find.

### Reading tracebacks: the most underrated skill

```
Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
    total = float(price) * 2
ValueError: could not convert string to float: 'abc'
```

Read **bottom-to-top**: the last line names the failure (`ValueError`) and the *data* that caused it (`'abc'`). The lines above show *where* (`line 3`). That's the whole debugging method: **what failed → on what data → at which line → why.**

### The debugging loop (memorize it)

1. **Reproduce** — make it fail on demand.
2. **Read** — traceback bottom-to-top: what, on what data, where.
3. **Hypothesize** — "I think X is wrong because…"
4. **Test** — change one thing, re-run. One thing at a time.
5. **Fix at the cause**, not the symptom.

---

## 2. Specify — direct the AI

> "Extend my contact book (day 5): 1) on start, load contacts from contacts.txt if it exists; if the file is missing, start empty (no crash, no error message needed); 2) after every add/delete, save all contacts back to the file, one per line as name,phone,city; 3) if a line in the file is malformed (wrong number of fields), skip it and continue loading the rest; 4) wrap file operations so a disk error shows 'Could not save — your changes are still in memory' instead of a traceback."

You just specified **four failure behaviors**. Most beginners specify zero. This is what "engineering" means.

## 3. Evaluate — be the senior

Break it on purpose — this is the fun part:
- Delete `contacts.txt` → start the program. Does it start clean?
- Write garbage into the file (`not,a,valid,line,with,too,many`) → does it skip and continue?
- Make the file read-only (or point it at a bad path) → do you get your friendly message or a raw traceback?
- For each: trace the exact path through `try/except` that handled it. If you can't trace it, you don't own it.

Then ask the AI: "Quiz me — show me three tracebacks; I tell you what failed, on what data, at which line."

## 4. Business lens 💼

A shop's billing software that **loses data on crash** isn't a buggy app — it's a *liability*. Data loss destroys trust permanently; one lost customer database can kill a small business's faith in software. Persistence + graceful failure handling is what makes software **trustworthy enough to sell**. When you demo (day 27), "your data is safe even if…" is a selling sentence.

---

## 💻 Exercises

### Level 1
Write a program that opens a file that doesn't exist — handle it so gracefully a user never sees the word "Traceback."

### Level 2
Add **error logging** to your contact book: every caught failure appends a timestamped line to `errors.log`. Then trigger three different failures and read the log. (This is day-25 observability, five-minute version.)

### Level 3
Ask the AI to write **three buggy programs** (one type error, one file error, one logic error that produces no traceback). Debug each using only the traceback + the debugging loop. For the logic error — no traceback to help — write down your hypothesis *before* changing anything. That's the discipline.

---

## ✅ Done when

- [ ] Your contact book survives restart, missing files, and malformed lines
- [ ] You can read any traceback bottom-to-top: what failed, on what data, at which line
- [ ] You can recite the debugging loop without notes
- [ ] Committed to GitHub

## 📎 The one link

[Python docs — Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html) — the definitive reference.

---

[← Day 5](../05_Day_Lists_Dictionaries/) · [Day 7 →](../07_Day_Project1_CLI_App/)
<!-- original-workshop:end -->

</details>
