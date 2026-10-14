# Day 6 — Persistence, errors, and systematic debugging

An in-memory directory disappears when the process stops. A useful tool often needs durable state, but saving state introduces new failure modes: missing files, invalid data, and interrupted writes. Today you will connect persistence to recovery and learn to investigate errors using evidence rather than a sequence of guesses.

**Your project:** [Persistent contact book with recovery](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Serialize structured data to JSON and load it back deliberately.
- Distinguish missing, corrupt, and invalid stored data.
- Read an exception and investigate the relevant failing operation.

## Understand the concept

### Persistence is a boundary

Memory belongs to a running process. A file survives beyond that process, but the file format becomes a contract between versions of the application. JSON represents a useful subset of values such as objects, arrays, strings, numbers, booleans, and null. It does not automatically preserve custom Python objects or validate your business rules. Loading syntactically valid JSON is therefore followed by checking that the stored shape and required fields match what your program expects.

### Failures need different recovery policies

A missing data file on first launch can mean an empty directory. A corrupt existing file may represent information the user expects you to preserve. Do not treat both cases as permission to overwrite the file with an empty object. Decide which errors are recoverable, which need user action, and what evidence to keep. For writes, an intermediate file followed by an appropriate replacement can reduce partial-write risks; the exact durability guarantee still depends on the operating system and storage setup.

### Debugging starts with reproduction

Read the exception type, message, and relevant stack frames. Identify the input and operation that caused the failure. Reproduce it with the smallest useful example, state a hypothesis, and test one targeted change. Catching every exception and continuing silently removes the evidence you need. A useful error message explains the problem and next action while avoiding private data. After the fix, re-run the successful path as well as the failing case.

## A worked example, step by step

JSON parsing and application-level validation are separate checks. A small in-memory example keeps the two concepts visible.

```python
import json

contacts = {"C001": {"name": "Ali", "city": "Lahore"}}
saved_text = json.dumps(contacts)
loaded = json.loads(saved_text)
if not isinstance(loaded, dict):
    raise ValueError("Expected a contact directory")
assert loaded == contacts
print("Round trip preserved 1 contact")

try:
    json.loads("not valid JSON")
except json.JSONDecodeError:
    print("Stored data is not valid JSON; keep the original for investigation")
```

**Expected result**

```text
Round trip preserved 1 contact
Stored data is not valid JSON; keep the original for investigation
```

dumps converts the dictionary into a JSON text representation, while loads parses that representation into Python values. The isinstance check validates the outer shape and the assertion confirms this sample round trip. A real application must also inspect each contact's fields. The deliberate invalid text produces JSONDecodeError, which is handled specifically. The message recommends preserving the original data instead of pretending a failed read means there are no contacts.

## Practise before building

### Exercise 1: Separate parsing from validation

Load a valid JSON array where the program expects a dictionary. Reject the shape clearly.

**Hint:** Valid JSON is not necessarily valid application data.

**Check your result:** The failure is a schema problem, not incorrectly reported as corrupt JSON.

### Exercise 2: Record a debugging hypothesis

Introduce a missing contact field and write the input, observed failure, hypothesis, and fix in four short lines.

**Hint:** Find the operation that assumes the missing field exists.

**Check your result:** Your fix addresses the assumption and a regression example remains.

### Exercise 3: Test recovery locally

Use a temporary project data file to test first launch, a normal save, and a damaged copy.

**Hint:** Do not experiment on your only copy of useful data.

**Check your result:** The normal state reloads and damaged data is not silently overwritten.

## Common mistakes and how to debug them

- Equating valid JSON with valid records: validate the expected data shape after parsing.
- Returning empty data for every exception: that can hide corruption and cause information loss.
- Fixing the symptom without preserving a regression case: keep the input that exposed the assumption.

## The FDE connection

Customer data is part of the product, not disposable debugging material. An FDE plans how to diagnose a failure, protect existing records, and explain recovery to the operator. A modest contact file is a good place to learn these habits before working with a production database.

## Build your lesson project

**Persistent contact book with recovery**

Extend the contact directory so records survive closing and reopening the program. Store them in a documented JSON file, validate loaded records, and distinguish first launch from damaged existing data. Add a recovery message and a backup approach that preserves the user's information while you investigate a failure.

- Save and load operations with a documented data-file path and format.
- A validated contact schema compatible with lesson 5.
- A recovery policy for missing, malformed, and invalid files.
- A restart test and a debugging log for one controlled failure.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- How are parsing, validation, and recovery different?
- Which failure must not be treated as empty data?
- What evidence helped you choose a targeted debugging fix?

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
