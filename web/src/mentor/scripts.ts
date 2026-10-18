// Mentor scripts — the words Ustaad speaks, day by day.
// Day 1 is fully hand-scripted as the pattern proof.
// Days 2-7 are built from the beginner-path guide blocks and the
// Dukaan project briefs in lesson-projects.json (embedded here so the
// mentor stays self-contained; the JSON files are the source of truth).
// Simple English only. No jargon.

import type { CourseExercise } from '../course/types';
import type { MentorScript, MentorStep } from './engine';

// The runner wraps student code inside a function. This setup replaces
// print with a recorder so the checker can compare exactly what the
// program printed — a real stdout check, no new harness needed.
const PRINT_SETUP = `__fde_printed = []
def print(*__fde_args, **__fde_kwargs):
    __fde_printed.append(' '.join(str(__fde_value) for __fde_value in __fde_args))`;

/** Build a minimal valid exercise: learner prints lines, checker compares them. */
export function buildPrintExercise(
  title: string,
  task: string,
  hint: string,
  starter: string,
  expected: string,
): CourseExercise {
  return {
    title,
    brief: task,
    language: 'python',
    parameters: [],
    result: "'\\n'.join(__fde_printed)",
    starter,
    setup: PRINT_SETUP,
    steps: [
      {
        title,
        task,
        hint,
        solution: starter,
        cases: ['print-check'],
      },
    ],
    cases: [
      {
        id: 'print-check',
        label: 'It prints exactly the lines we expect',
        why: 'The checker compares what your program printed with the expected lines.',
        expected,
      },
    ],
  };
}

const STOCK_STARTER = `print("Amina Store")
print("Tea - Rs 50")
print("Sugar - Rs 100")
print("Rice - Rs 200")`;

const STOCK_EXPECTED = `Amina Store
Tea - Rs 50
Sugar - Rs 100
Rice - Rs 200`;

const STOCK_CHANGED_EXPECTED = `Amina Store
Tea - Rs 60
Sugar - Rs 100
Rice - Rs 200`;

function day1Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Assalam-o-Alaikum! I am Ustaad, your teacher here.',
        'I will sit beside you while you write your first program. One small step at a time.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: ['Before we start — what should I call you?'],
      action: { kind: 'ask-name' },
    },
    {
      say: [
        'Nice to meet you, {name}. Now meet Amina.',
        'Amina runs a small shop. She keeps her stock in her head and on paper slips.',
        'Over the next 90 days you will build her one real system: Dukaan, a shop management app.',
        'Today it is a few lines that print a stock list. One day it will be a website with a database. It all starts here.',
      ],
      action: { kind: 'continue', label: 'Tell me more' },
    },
    {
      say: [
        'Today you will make the computer print Amina\u2019s stock list. This is Dukaan v0.1 — the first brick.',
        'And here is the good part: you will run real Python code right here, in the first five minutes.',
      ],
      action: { kind: 'continue', label: 'I am ready' },
      guide: {
        what: 'Run your first Python program and see what it prints.',
        how: 'Read the four lines of code, press the run button, and read the four lines it prints.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — this takes about two minutes.',
      },
    },
    {
      say: [
        'This is a real Python program. It prints Amina\u2019s stock list, one line at a time.',
        'Press the run button. Watch what the computer prints.',
      ],
      action: {
        kind: 'run-code',
        starter: STOCK_STARTER,
        expect: STOCK_EXPECTED,
        hint: 'You do not need to change anything yet. Just press run and look at the four printed lines.',
      },
    },
    {
      say: [
        'Mubarak, {name}! Your first program ran.',
        'The computer followed your instructions, line by line, top to bottom.',
      ],
      action: { kind: 'celebrate' },
    },
    {
      say: ['Quick check. What did the computer just do?'],
      action: {
        kind: 'choice',
        options: [
          {
            label: 'It followed my instructions, line by line',
            feedback: 'Yes. A program is instructions, and the computer followed yours in order.',
            correct: true,
          },
          {
            label: 'It saved the stock to a file',
            feedback:
              'Not yet. print only shows text on the screen. Saving to a file comes later, on Day 6.',
            correct: false,
          },
          {
            label: 'It learned the prices by itself',
            feedback:
              'No learning happened. It printed exactly what you wrote — nothing more.',
            correct: false,
          },
        ],
      },
    },
    {
      say: [
        'Two small ideas, and then you are done with theory for today.',
        'print means: show this line on the screen. The text inside the quotes is shown exactly as written.',
        'Later, when you want to use a value more than once, you give it a name. That name is called a variable. You will meet variables properly tomorrow.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Now change one thing. In the code box, change the price of Tea from Rs 50 to Rs 60.',
        'Before you run: guess what the output will look like. Then run and check your guess.',
      ],
      action: {
        kind: 'run-code',
        starter: STOCK_STARTER,
        expect: STOCK_CHANGED_EXPECTED,
        hint: 'Change only the 50 to 60. Everything else stays exactly the same.',
      },
    },
    {
      say: [
        'You just did what real programmers do: change one thing, predict, run, check.',
        'This loop — predict, change, check — is the whole skill. You will use it every day.',
      ],
      action: { kind: 'continue', label: 'Makes sense' },
    },
    {
      say: [
        'Your first project: Dukaan v0.1 — the stock list.',
        'On your computer, make a file called dukaan.py, write the stock list program in it, and run it with python dukaan.py.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'A program that prints the shop name and three items with their prices.',
        how: 'Put the print lines in a file named dukaan.py, then run: python dukaan.py',
        where: 'On your computer, in the folder where you keep this course.',
        when: 'Today, after this lesson — about 15 minutes.',
      },
    },
    {
      say: [
        'Day 1 is done, {name}. You wrote and ran your first program.',
        'Tomorrow: text and numbers have different jobs — and Amina wants a proper bill.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 1, title: 'Meet Dukaan: your first program', steps };
}

function day2Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Welcome back, {name}. Yesterday you made the computer print.',
        'Today you learn why text and numbers have different jobs — and Amina needs this one badly.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: [
        'Amina\u2019s customers are tired of mental maths. She wants Dukaan to print a proper bill: quantity times price, the grand total, the paid amount, the change.',
        'Here is the catch: quantities typed on a keyboard arrive as text. And text cannot be multiplied.',
        'So today\u2019s job: turn text into numbers, then do the maths. This is Dukaan v0.2.',
      ],
      action: { kind: 'continue', label: 'Show me' },
      guide: {
        what: 'Change text into a number with int(), then multiply it by a price.',
        how: 'Read the code, change the "3" to a "5", predict the new total, and run.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — about three minutes.',
      },
    },
    {
      say: [
        'This is the heart of Amina\u2019s bill. The text "3" becomes the number 3. Then 3 times 50 is 150.',
        'Change the "3" to a "5". Predict the new total first — then run and check.',
      ],
      action: {
        kind: 'run-code',
        starter: `quantity_text = "3"
quantity = int(quantity_text)
price = 50
print(quantity * price)`,
        expect: '250',
        hint: 'Change only the 3 inside the quotes. The int() line turns it into a real number.',
      },
    },
    {
      say: ['Quick check. A form gives you "2" kilometres as text. Which of these gives 2000 metres?'],
      action: {
        kind: 'choice',
        options: [
          {
            label: 'int("2") * 1000',
            feedback: 'Yes. int() makes the text a number; multiplying by 1000 converts kilometres to metres.',
            correct: true,
          },
          {
            label: '"2" + "1000"',
            feedback: 'Adding text joins it: "21000". It does not convert units.',
            correct: false,
          },
          {
            label: '2 + 1000',
            feedback: 'This adds 1000 instead of multiplying. Two kilometres hold 2000 metres.',
            correct: false,
          },
        ],
      },
    },
    {
      say: [
        'Remember this: text joins, numbers calculate.',
        '"2" + "1000" glues two pieces of text together. int("2") * 1000 turns the text into a number first, then multiplies.',
        'Whenever input arrives as text and you need maths, int() (or float() for decimals) is your bridge.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Your project: Dukaan v0.2 — totals and bills.',
        'Open dukaan.py. After the stock list, ask for quantities and print a bill: each line\u2019s total, the grand total, the paid amount, and the change.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'A bill that shows quantity times price for each item, the grand total, and the change.',
        how: 'Read quantities with input(), turn each one into a number with int(), then multiply by the price.',
        where: 'In dukaan.py on your computer, right below the stock list.',
        when: 'Today — about 20 minutes. This is your main build for the day.',
      },
    },
    {
      say: [
        'Day 2 is done, {name}. You can turn text into numbers and print a real bill.',
        'Tomorrow: Amina opens the shop each morning and checks every item\u2019s stock. You will teach the program to make decisions.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 2, title: 'Text and numbers have different jobs', steps };
}

function day3Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Welcome back, {name}. Yesterday you turned text into numbers.',
        'Today the program starts making decisions. This is Dukaan v0.3.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: [
        'Every morning Amina opens the shop with one job: check every item\u2019s stock. If an item is running low, she must reorder.',
        'The rule is simple: stock below 20 means LOW STOCK, otherwise OK. You will turn this rule into code with if and else.',
      ],
      action: { kind: 'continue', label: 'Show me' },
      guide: {
        what: 'Write a rule with if/else: below 20 prints LOW STOCK, otherwise prints OK.',
        how: 'Change the stock number, predict OK or LOW STOCK, and run to check.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — about three minutes.',
      },
    },
    {
      say: [
        'The program checks the rule from top to bottom. If stock is below 20, it prints LOW STOCK. Otherwise it prints OK.',
        'Change the 12 to 30. Predict what it prints — then run and check.',
      ],
      action: {
        kind: 'run-code',
        starter: `stock = 12
if stock < 20:
    print("LOW STOCK")
else:
    print("OK")`,
        expect: 'OK',
        hint: 'Change only the 12. Is 30 below 20? Predict first, then run.',
      },
    },
    {
      say: [
        'The order of rules matters. Python checks the first rule; if it is true, it skips the rest.',
        'That is why the most important rule goes first. Remember this — it will save you many bugs.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Quick check. A support ticket is critical and 30 hours old. The critical rule is checked first. What priority does it get?',
      ],
      action: {
        kind: 'choice',
        options: [
          {
            label: 'Standard, because every ticket starts there',
            feedback:
              'A starting value does not beat a true rule. The program checks the rules, and the critical rule is true.',
            correct: false,
          },
          {
            label: 'Review and urgent at the same time',
            feedback:
              'An if/elif/else chain picks exactly one branch. The first true rule wins.',
            correct: false,
          },
          {
            label: 'Urgent',
            feedback: 'Yes. The first rule — critical — is true, so the program takes it and skips the rest.',
            correct: true,
          },
        ],
      },
    },
    {
      say: [
        'Your project: Dukaan v0.3 — the smart stock checker.',
        'Loop over every item, print OK or LOW STOCK for each one, then apply the Friday discount to big bills.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'A program that checks each item\u2019s stock with if/else and discounts big Friday bills.',
        how: 'Use a loop for the items, an if/else for the stock rule, and one more if for the discount.',
        where: 'In dukaan.py on your computer, below the bill code.',
        when: 'Today — about 25 minutes.',
      },
    },
    {
      say: [
        'Day 3 is done, {name}. Your programs can now make decisions.',
        'Tomorrow: your code works, but the same maths is copied in three places. You will give each small job its own name.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 3, title: 'Turn a rule into a decision', steps };
}

function day4Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Welcome back, {name}. Yesterday your program learned to decide.',
        'Today we clean up. Dukaan works, but the same maths is copied in three places. Time for functions.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: [
        'Amina wants one small change: the low-stock limit moves to 40. With copied code you would edit it in three places — and miss one.',
        'A function gives a small job its own name. You write the maths once, then use the name everywhere.',
      ],
      action: { kind: 'continue', label: 'Show me' },
      guide: {
        what: 'Write a function that takes a price and a quantity and returns their total.',
        how: 'Keep the working line, add a new print line below it, predict the output, and run.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — about three minutes.',
      },
    },
    {
      say: [
        'def names the job and its inputs. return hands the answer back to whoever called it.',
        'Keep the first print. Add this line below it: print(line_total(250, 0)). Predict what it prints — then run.',
      ],
      action: {
        kind: 'run-code',
        starter: `def line_total(price, quantity):
    return price * quantity

print(line_total(250, 3))`,
        expect: '750\n0',
        hint: 'Add the new print line below the existing one. 250 times 0 is 0.',
      },
    },
    {
      say: [
        'Quick check. One item costs 250 cents. You buy 3. What should a line-total function return?',
      ],
      action: {
        kind: 'choice',
        options: [
          {
            label: '253 cents',
            feedback: 'Adding price and quantity mixes two different meanings. A line total is price times quantity.',
            correct: false,
          },
          {
            label: '750 cents',
            feedback: 'Yes. 250 × 3 = 750. Returning the number lets other code use it — for example, to add a delivery fee.',
            correct: true,
          },
          {
            label: 'Nothing, because print already returns the total',
            feedback: 'print shows a value on the screen but hands nothing back. return is what gives the answer to the caller.',
            correct: false,
          },
        ],
      },
    },
    {
      say: [
        'The big idea: print shows, return gives back.',
        'When a job needs its answer reused — in another calculation, another function — return it. When a human needs to see it, print it.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Your project: Dukaan v0.4 — organized code.',
        'Rebuild the same program with functions: one for a line total, one for the stock check. Then change the low-stock limit to 40 in exactly one place.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'The same Dukaan program, rebuilt with functions — the low-stock limit lives in one place.',
        how: 'Move the line-total maths into a function, move the stock rule into a function, then change the limit once.',
        where: 'In dukaan.py on your computer. Rewrite it cleanly, top to bottom.',
        when: 'Today — about 30 minutes. This is real refactoring.',
      },
    },
    {
      say: [
        'Day 4 is done, {name}. You can name a job once and reuse it everywhere.',
        'Tomorrow: Amina\u2019s four items live in three separate lists that keep getting mixed up. You will pick one tidy shape for the data.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 4, title: 'Give a small job its own function', steps };
}

function day5Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Welcome back, {name}. Yesterday you gave small jobs their own names.',
        'Today you choose how to organise data. Two customers are both named Ali — and your program must keep both.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: [
        'Amina\u2019s shop now has four items, and she keeps mixing up the three separate lists: names in one, prices in another, stock in a third.',
        'Delete one item and you must delete it in three places. The fix: one list of dictionaries. Each item is one neat package: name, price, stock together.',
      ],
      action: { kind: 'continue', label: 'Show me' },
      guide: {
        what: 'Store records in a dictionary with unique IDs, so two records can share a name safely.',
        how: 'Read the code and run it. Watch both Alis appear — neither overwrites the other.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — about three minutes.',
      },
    },
    {
      say: [
        'The ID is the identity. The name is only a description.',
        'C001 and C002 are different keys, so both records survive — even though both display names are Ali. Run it and see.',
      ],
      action: {
        kind: 'run-code',
        starter: `contacts = {
    "C001": "Ali - Lahore",
    "C002": "Ali - Karachi",
}
for code, info in contacts.items():
    print(code, info)`,
        expect: 'C001 Ali - Lahore\nC002 Ali - Karachi',
        hint: 'You do not need to change anything. Just run and check that both records appear.',
      },
    },
    {
      say: ['Quick check. You add another customer named Ali. Which approach keeps both customers safely?'],
      action: {
        kind: 'choice',
        options: [
          {
            label: 'Give them different IDs and keep Ali as each display name',
            feedback: 'Yes. Stable unique IDs tell records apart even when names match.',
            correct: true,
          },
          {
            label: 'Use Ali as the key for both records',
            feedback: 'A dictionary keeps one value per key. The second Ali would replace the first.',
            correct: false,
          },
          {
            label: 'Delete the first Ali before adding the second',
            feedback: 'That loses a real customer. The problem is not too many Alis — it is the missing ID.',
            correct: false,
          },
        ],
      },
    },
    {
      say: [
        'The rule: ask what identifies a thing, and what only describes it.',
        'IDs identify. Names describe. When two things share a description, the ID keeps them apart.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Your project: Dukaan v0.5 — the stock book.',
        'Turn the stock into one list of dictionaries. Every feature — the list, the bill, the alerts — must work on the new shape. Deleting an item becomes one operation, not three.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'One list of dictionaries holding every item\u2019s name, price, and stock.',
        how: 'Replace the three separate lists with one list of dictionaries, then point every feature at the new shape.',
        where: 'In dukaan.py on your computer.',
        when: 'Today — about 30 minutes.',
      },
    },
    {
      say: [
        'Day 5 is done, {name}. Your data has a shape now — tidy, and safe from mix-ups.',
        'Tomorrow: Dukaan forgets everything when it closes. You will give it a memory that survives.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 5, title: 'Choose how to organise your data', steps };
}

function day6Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Welcome back, {name}. Yesterday you gave your data a tidy shape.',
        'Today the hard truth: when Dukaan closes, it forgets everything. Every morning Amina retypes the stock. You will fix that.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: [
        'The fix has three parts: when the program starts, load the stock from a file. After every change, save. And no bad typing may ever crash it.',
        'The file format is JSON — text shaped like Python dictionaries and lists. Python can turn it back into real data with one call.',
      ],
      action: { kind: 'continue', label: 'Show me' },
      guide: {
        what: 'Turn JSON text back into a real dictionary with json.loads, and check its shape.',
        how: 'Read the code and run it. Watch the text become a dictionary you can use.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — about three minutes.',
      },
    },
    {
      say: [
        'json.loads reads the text and rebuilds the dictionary. isinstance checks the shape — is it really a dict?',
        'Run it. The shop name appears, and the shape check prints True.',
      ],
      action: {
        kind: 'run-code',
        starter: `import json

text = '{"name": "Amina Store", "items": 3}'
shop = json.loads(text)
print(shop["name"])
print(isinstance(shop, dict))`,
        expect: 'Amina Store\nTrue',
        hint: 'You do not need to change anything. Just run and watch the text become usable data.',
      },
    },
    {
      say: [
        'Two lessons in one: loading is easy — but valid JSON can still have the wrong shape.',
        'That is why you check with isinstance before trusting it. Never trust a file blindly; check what it actually contains.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Quick check. Your contacts print correctly. You close the app, reopen it, and they are gone. What was missing?',
      ],
      action: {
        kind: 'choice',
        options: [
          {
            label: 'More print statements',
            feedback: 'Printing shows a result on screen. It does not keep a record for the next run.',
            correct: false,
          },
          {
            label: 'A different contact name',
            feedback: 'The data is lost because it lived only in memory during that run. The name changes nothing.',
            correct: false,
          },
          {
            label: 'Saving the records and loading them on the next run',
            feedback: 'Yes. Memory forgets; files remember. Load on start, save after every change.',
            correct: true,
          },
        ],
      },
    },
    {
      say: [
        'Your project: Dukaan v0.6 — memory that survives.',
        'On start, load the stock book from dukaan_stock.json (or start fresh with a clear message if there is no file). Save after every change. And "three" or "-5" as a quantity must never crash the program.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'Dukaan remembers its stock between runs and never crashes on bad input.',
        how: 'Load the JSON file at start, save it after each change, and wrap every number input in a check.',
        where: 'In dukaan.py on your computer.',
        when: 'Today — about 35 minutes. This is the biggest build so far.',
      },
    },
    {
      say: [
        'Day 6 is done, {name}. Your program has a memory now.',
        'Tomorrow is the big one: Dukaan v1.0 — the complete tool. Everything from this week comes together.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 6, title: 'Save data so it survives a restart', steps };
}

function day7Script(): MentorScript {
  const steps: MentorStep[] = [
    {
      say: [
        'Welcome back, {name}. This is Day 7 — the end of week one.',
        'You can print, convert types, decide, name jobs with functions, shape data, and save it. Today you finish one useful tool.',
      ],
      action: { kind: 'continue', label: 'Got it' },
    },
    {
      say: [
        'A finished tool is not ten half-built features. It is one complete path a user can actually walk: add something, save it, and see it again after a restart.',
        'For Dukaan v1.0 that path is: open the program, see the stock, add an item, print a bill, close it — and tomorrow everything is still there.',
      ],
      action: { kind: 'continue', label: 'Show me' },
      guide: {
        what: 'Add up a list of expenses and print the total — then extend it yourself.',
        how: 'Add a fictional expense of 150 to the list, predict the new total, and run.',
        where: 'In the code box below, right on this page.',
        when: 'Right now — about three minutes.',
      },
    },
    {
      say: [
        'The expenses start at 200 and 100. Add your 150 to the list.',
        'Predict the total before you run: 450. Then run and compare.',
      ],
      action: {
        kind: 'run-code',
        starter: `expenses = [200, 100]
total = 0
for amount in expenses:
    total = total + amount
print(total)`,
        expect: '450',
        hint: 'Add , 150 inside the square brackets so the list reads [200, 100, 150].',
      },
    },
    {
      say: [
        'Quick check. What is the smallest useful first milestone for this expense tracker?',
      ],
      action: {
        kind: 'choice',
        options: [
          {
            label: 'Design a logo and add ten empty commands',
            feedback: 'None of these let a user record an expense or see it again. Pretty is not working.',
            correct: false,
          },
          {
            label: 'Add one expense, save it, and show it after a restart',
            feedback: 'Yes. One complete path — add, save, restart, see — proves the tool actually works.',
            correct: true,
          },
          {
            label: 'Add an AI assistant before storing any expenses',
            feedback: 'An assistant on top of broken storage helps nobody. Make the core path work first.',
            correct: false,
          },
        ],
      },
    },
    {
      say: [
        'This is how professionals ship: the smallest path that a real user can finish, working end to end.',
        'Every feature you add later — menus, AI, a website — sits on top of this one working path.',
      ],
      action: { kind: 'continue', label: 'Understood' },
    },
    {
      say: [
        'Your project: Dukaan v1.0 — the complete CLI tool. This is the checkpoint for everything in Phase 1.',
        'One menu program: load the stock from a file (or start fresh), view stock, add items, print the bill, save after every change, and never crash on bad input.',
      ],
      action: { kind: 'do', label: 'I did it ✓' },
      guide: {
        what: 'One menu-driven program that does everything from Days 1–6, without crashing.',
        how: 'Combine the stock list, bill, stock checker, functions, dictionaries, and file saving into one menu loop.',
        where: 'In dukaan.py on your computer. This replaces the old version.',
        when: 'Today — take the time it needs. This is your week-one proof.',
      },
    },
    {
      say: [
        'Week one is done, {name}. Seven days ago you had never run a program. Now you own a complete tool.',
        'Keep the fire burning — tomorrow the streak grows, and soon Dukaan meets its first AI feature.',
      ],
      action: { kind: 'celebrate' },
    },
  ];
  return { day: 7, title: 'Finish one useful tool', steps };
}

function fallbackScript(day: number): MentorScript {
  return {
    day,
    title: `Day ${day}`,
    steps: [
      {
        say: [
          `Assalam-o-Alaikum, {name}. Day ${day} is coming soon.`,
          'I am still writing the mentor lesson for this day. The full learning path is ready for you, though.',
        ],
        action: { kind: 'continue', label: 'Take me to the learning path' },
      },
      {
        say: [
          'Open the learning path and continue with the lesson for this day there.',
          'Come back here when the mentor lesson is ready — your XP and streak are safe.',
        ],
        action: { kind: 'do', label: 'I did it ✓' },
        guide: {
          what: `Complete Day ${day} from the learning path.`,
          how: 'Open the curriculum, find your day, and follow the Learn, Practise, Project flow.',
          where: 'On the learning path page of this app.',
          when: 'Today, at your own pace.',
        },
      },
      {
        say: [`Day ${day} is done, {name}. See you tomorrow.`],
        action: { kind: 'celebrate' },
      },
    ],
  };
}

export function getMentorScript(day: number): MentorScript {
  switch (day) {
    case 1:
      return day1Script();
    case 2:
      return day2Script();
    case 3:
      return day3Script();
    case 4:
      return day4Script();
    case 5:
      return day5Script();
    case 6:
      return day6Script();
    case 7:
      return day7Script();
    default:
      return fallbackScript(day);
  }
}
