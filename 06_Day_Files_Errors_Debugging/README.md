# 📘 Day 6 — State, Persistence & Failure

![Day 6 visual](../images/days/day-06.svg)

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
