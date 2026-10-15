import { check, demo, example, project, reference, section, step } from './content-helpers.mjs';

export default [
  {
    day: 1,
    slug: 'message-counter',
    title: 'Count messages and show the result',
    chapter: 'Programming',
    concepts: ['Variables', 'Input and output'],
    prerequisites: [],
    outcome: 'Calculate how many messages still need an answer.',
    story:
      'Amina has 10 messages. Two new messages arrive, and she answers three. Help her keep the remaining count correct.',
    demo: demo('Help Amina count', { messages: 10 }, [
      ['Add 1 message', { messages: 11 }, '10 plus 1 makes 11. The number changed.'],
      [
        'Add 1 more message',
        { messages: 12 },
        'The computer keeps the number under the name messages.',
      ],
      [
        'Answer 3 messages',
        { messages: 9 },
        '12 minus 3 makes 9. Amina still needs to answer nine messages.',
      ],
    ]),
    sections: [
      section(
        'A name for a changing number',
        'The shop needs a number it can update. A variable is a name a program uses to keep track of a value. In our example, messages is the name and 10 is its first value. When another message arrives, the name stays the same and the number becomes 11.',
        'A familiar example is the score in a game. The score changes as you play. A program needs to remember the current score, rather than guess it from the screen. A message count works in the same way.',
      ),
      section(
        'Where the numbers come from',
        'Input means information given to a program. We give our counter three inputs: the current count, the number of new messages, and the number Amina answered. Output means the result the program gives back. Here, the output is the remaining count.',
        'For this first exercise, the lesson supplies those inputs. You only change the calculation. Later, an interface will collect inputs from a person, and a backend will load them from stored records. The calculation will still have the same job.',
      ),
      section(
        'Read the calculation in order',
        'Start with 10. Add 2 to get 12. Subtract 3 to get 9. In JavaScript, + adds numbers and - subtracts them. We write current + incoming - answered to describe that process.',
        'The equals sign in let remaining = current + incoming - answered stores the calculated result under the name remaining. Read the right side first, calculate its value, then connect that value to the name on the left. You do not need to memorise every symbol today.',
      ),
      section(
        'Check the result yourself',
        'Before running the code, work out one example on paper. After running it, compare the output with your expected number. If you expected 9 and got 12, look for the instruction that subtracts answered messages.',
        'Choose a second example too. If there are zero messages and zero new messages, the result should be zero. A working program should handle quiet days as well as busy days. The checks in the exercise try both situations.',
      ),
    ],
    words: [
      { term: 'Variable', meaning: 'A name used to keep track of a value.' },
      { term: 'Input', meaning: 'Information the program receives.' },
      { term: 'Output', meaning: 'The result the program returns or displays.' },
    ],
    example: example(
      'javascript',
      'let current = 10;\nlet incoming = 2;\nlet answered = 3;\nlet remaining = current + incoming - answered;\nconsole.log(remaining);',
      '9',
      [
        'The first three lines give the program its input numbers.',
        'The fourth line calculates 10 + 2 - 3 and keeps 9 under the name remaining.',
        'console.log displays the value so you can check it. It does not save the number permanently.',
      ],
    ),
    exercise: {
      title: 'Amina’s remaining-message counter',
      brief:
        'The lesson provides current, incoming, and answered. Edit the line that calculates remaining. Start with new arrivals, then account for answered messages.',
      language: 'javascript',
      parameters: ['current', 'incoming', 'answered'],
      result: 'remaining',
      starter: 'let remaining = current;',
      steps: [
        step(
          'Include new arrivals',
          'Change the calculation so incoming messages increase the current count.',
          'Keep current and add incoming: current + incoming.',
          'let remaining = current + incoming;',
          ['arrivals', 'quiet'],
        ),
        step(
          'Remove answered messages',
          'Now subtract answered messages. The same calculation must still handle a quiet day.',
          'Read it as: old count + new arrivals - answered messages.',
          'let remaining = current + incoming - answered;',
          ['answered', 'empty'],
        ),
      ],
      cases: [
        check(
          'arrivals',
          '10 messages plus 2 arrivals',
          [10, 2, 0],
          12,
          'New arrivals must increase the count.',
        ),
        check('quiet', 'A quiet day', [0, 0, 0], 0, 'Zero is a normal count, not a missing value.'),
        check(
          'answered',
          'Three messages are answered',
          [10, 2, 3],
          9,
          'The count tracks work still to do, not every message ever received.',
        ),
        check(
          'empty',
          'All messages are answered',
          [10, 2, 12],
          0,
          'Finishing the queue should leave exactly zero.',
        ),
      ],
    },
    project: project(
      'A small message desk',
      'Make a calculation Amina can use to check the work left at the end of a shift. Use your completed exercise as the first version.',
      [
        'A calculation using all three named inputs.',
        'Two new examples with predicted and observed results.',
        'A short explanation of what the output means.',
      ],
      [
        [
          'Build the calculation',
          ['Use current, incoming, and answered.', 'Calculate remaining in one readable line.'],
        ],
        [
          'Try another shift',
          [
            'Predict the result for 8 current, 5 incoming, and 4 answered.',
            'Run that case and compare it with your prediction.',
          ],
        ],
        [
          'Explain the work',
          [
            'Name the three inputs and the output.',
            'Describe what would happen if the subtraction were missing.',
          ],
        ],
      ],
      [
        'New arrivals increase the count.',
        'Answered messages decrease it.',
        'A quiet shift returns zero.',
        'Your new example has a recorded expected and actual result.',
        'You can explain the calculation without reading the answer.',
      ],
      [
        ['8 current, 5 incoming, 4 answered', '9 messages remain.'],
        ['0 current, 0 incoming, 0 answered', '0 messages remain.'],
        ['3 current, 0 incoming, 3 answered', '0 messages remain.'],
      ],
      'Try a shift where Amina answers more messages than exist. Write down the problem you notice. Lesson 2 adds a rule to reject that input.',
      [
        'What information does the program need?',
        'What does remaining represent?',
        'What did your extra example help you check?',
      ],
    ),
    references: [
      reference(
        'JavaScript variables',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables',
      ),
    ],
  },
  {
    day: 2,
    slug: 'safe-message-rules',
    title: 'Make decisions and reject bad input',
    chapter: 'Programming',
    concepts: ['Conditions', 'Validation'],
    prerequisites: [1],
    outcome: 'Route urgent work while rejecting impossible counts.',
    story:
      'Amina wants urgent messages at the top of her queue. She also wants the app to reject impossible numbers instead of quietly accepting them.',
    demo: demo('Choose a safe result', { incoming: 2, urgent: 'yes' }, [
      [
        'Apply the urgent rule',
        { incoming: 2, result: 'urgent' },
        'A condition chooses a result when a rule is true.',
      ],
      [
        'Try minus 2 messages',
        { incoming: -2, result: 'invalid' },
        'A negative arrival count makes no sense. Validation rejects it before routing.',
      ],
      [
        'Try an ordinary message',
        { incoming: 2, urgent: 'no', result: 'normal' },
        'Valid ordinary work goes into the normal queue.',
      ],
    ]),
    sections: [
      section(
        'A program can choose',
        'A condition is a question with a true or false answer. Is this message urgent? Is this number below zero? An if instruction runs a block of code when its condition is true.',
        'A boolean is a value that is either true or false. In our exercise, urgent is a boolean supplied by the lesson. Writing if (urgent) means: use this branch when urgent is true. A default result covers the other situation.',
      ),
      section(
        'Valid input comes first',
        'Validation checks whether information is acceptable before a program uses it. A message count must be a whole number at least zero. A count of -2 is impossible. A count of 1.5 does not represent a whole message.',
        'Number.isInteger(value) checks for a whole number in JavaScript. It also rejects text such as "2". The expression value < 0 checks for a negative number. We reject bad values before deciding whether the queue is urgent.',
      ),
      section(
        'More than one rule',
        'The symbol || means or: reject the input if any listed problem is present. The symbol ! means not: !Number.isInteger(current) is true when current is not a whole number.',
        'Order matters. First check the counts. Next check that answered is no larger than current + incoming. Only then choose urgent or normal. Otherwise a request could receive an urgent label even though its numbers are invalid.',
      ),
      section(
        'Write rules people can explain',
        'A useful rule has a reason. Rejecting a negative arrival count protects the meaning of the data. Rejecting too many answered messages prevents a negative remaining count. Routing urgent messages helps Amina decide what to handle first.',
        'Keep the result vocabulary small: normal, urgent, or invalid. A later interface can show a helpful message for each result. Test one example for every branch so a change to one rule does not accidentally remove another.',
      ),
    ],
    words: [
      { term: 'Condition', meaning: 'A true-or-false question used to choose an action.' },
      { term: 'Validation', meaning: 'Checking that input follows the rules before using it.' },
      { term: 'Boolean', meaning: 'The value true or false.' },
    ],
    example: example(
      'javascript',
      'let quantity = -1;\nlet result = "accepted";\nif (!Number.isInteger(quantity) || quantity < 0) {\n  result = "invalid";\n}\nconsole.log(result);',
      'invalid',
      [
        'The default result starts as accepted.',
        'The condition checks two problems: a non-whole number or a negative number.',
        'The condition is true for -1, so the program changes result to invalid.',
      ],
    ),
    exercise: {
      title: 'A safe queue rule',
      brief: 'Return normal, urgent, or invalid. Check the numbers before deciding the priority.',
      language: 'javascript',
      parameters: ['current', 'incoming', 'answered', 'urgent'],
      result: 'result',
      starter: 'let result = "normal";',
      steps: [
        step(
          'Route urgent work',
          'Keep normal as the default. Change the result to urgent when urgent is true.',
          'Use if (urgent) { result = "urgent"; }.',
          'let result = "normal";\nif (urgent) { result = "urgent"; }',
          ['normal', 'urgent'],
        ),
        step(
          'Validate all three counts',
          'Reject negative or non-whole counts. An invalid request must stay invalid even when it is urgent.',
          'Check Number.isInteger for each count and reject any count below zero. Put the priority rule in an else if branch.',
          'let result = "normal";\nif (![current, incoming, answered].every(Number.isInteger) || current < 0 || incoming < 0 || answered < 0) {\n  result = "invalid";\n} else if (urgent) {\n  result = "urgent";\n}',
          ['negative', 'fraction', 'text'],
        ),
        step(
          'Protect the remaining count',
          'Reject a request that claims more answered messages than current + incoming.',
          'Add answered > current + incoming to the invalid branch.',
          'let result = "normal";\nif (![current, incoming, answered].every(Number.isInteger) || current < 0 || incoming < 0 || answered < 0 || answered > current + incoming) {\n  result = "invalid";\n} else if (urgent) {\n  result = "urgent";\n}',
          ['too-many', 'all-answered'],
        ),
      ],
      cases: [
        check(
          'normal',
          'Ordinary valid work',
          [10, 2, 3, false],
          'normal',
          'The default branch should remain useful.',
        ),
        check(
          'urgent',
          'Urgent valid work',
          [10, 2, 3, true],
          'urgent',
          'Urgency changes routing only after validation.',
        ),
        check(
          'negative',
          'Negative arrivals',
          [10, -2, 0, true],
          'invalid',
          'Invalid numbers must not be hidden by urgency.',
        ),
        check(
          'fraction',
          'Half a message',
          [1.5, 0, 0, false],
          'invalid',
          'Counts represent whole messages.',
        ),
        check(
          'text',
          'Text that looks like a number',
          ['10', 2, 0, false],
          'invalid',
          'The contract expects a number, not text.',
        ),
        check(
          'too-many',
          'Answering messages that do not exist',
          [2, 1, 4, true],
          'invalid',
          'The remaining queue cannot become negative.',
        ),
        check(
          'all-answered',
          'Exactly all messages answered',
          [2, 1, 3, false],
          'normal',
          'A boundary can be valid: answering all three is allowed.',
        ),
      ],
    },
    project: project(
      'A queue rule Amina can trust',
      'Write a small decision service that accepts counts and an urgency flag, then returns one clear result.',
      [
        'A decision program with three named results.',
        'A table of valid and rejected inputs.',
        'A customer-facing explanation for invalid input.',
      ],
      [
        [
          'Route work',
          ['Describe normal and urgent in plain English.', 'Implement and test both branches.'],
        ],
        [
          'Reject impossible work',
          ['Validate every count.', 'Check the exact boundary where all messages are answered.'],
        ],
        [
          'Explain rejection',
          [
            'Describe which input rule was broken.',
            'Keep the priority rule separate from validation.',
          ],
        ],
      ],
      [
        'Valid ordinary work returns normal.',
        'Valid urgent work returns urgent.',
        'Text, fractions, and negative counts are rejected.',
        'Too many answered messages are rejected.',
        'The exact valid boundary is tested.',
      ],
      [
        ['Negative incoming count', 'invalid'],
        ['Urgent work with valid counts', 'urgent'],
        ['All available messages answered', 'normal'],
      ],
      'Add a separate message describing the first validation problem. Keep the result vocabulary unchanged.',
      [
        'Why should validation happen before routing?',
        'Which boundary did you test?',
        'How would the interface explain invalid input?',
      ],
    ),
    references: [
      reference(
        'JavaScript decisions',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Conditionals',
      ),
    ],
  },
  {
    day: 3,
    slug: 'inbox-data',
    title: 'Organise messages and work through a list',
    chapter: 'Programming',
    concepts: ['Arrays and objects', 'Loops and filtering'],
    prerequisites: [2],
    outcome: 'Find the open messages belonging to one member of the team.',
    story:
      'A count alone cannot tell Amina who should answer each message. The shop needs a list of messages with an identifier, a status, and an owner.',
    demo: demo('Find the work left to do', { queue: '1 open, 2 closed, 3 open' }, [
      [
        'Keep open messages',
        { queue: '1 open, 3 open' },
        'A filter keeps items that meet a condition.',
      ],
      [
        'Keep Amina’s messages',
        { queue: '1 open — Amina' },
        'Another condition can choose work belonging to one person.',
      ],
    ]),
    sections: [
      section(
        'One message has several details',
        'An object groups named details about one thing. A message might be { id: 1, status: "open", owner: "Amina" }. We use message.status to read its status, just as we use a label to find a value.',
        'An identifier is a value used to recognise an item. Two messages can have the same text, so their text is a poor identifier. A stable id lets the interface update the intended message.',
      ),
      section(
        'An array holds a list',
        'An array is an ordered list of values. Our inbox is an array of message objects. An empty inbox is [], a valid array with no items. It should produce an empty result rather than an error.',
        'A new array can hold the identifiers we want to return. We start with let openIds = [] and add a matching id with openIds.push(message.id). The original inbox stays available for other operations.',
      ),
      section(
        'Repeat a rule for each item',
        'A loop repeats instructions. for (const message of messages) visits each message in the list. Inside the loop, an if condition decides whether to include that message.',
        'We want an open status and, when an owner is selected, the matching owner. The symbol && means both conditions must be true. The symbol || means either condition can be true. An empty owner selection means show all open messages.',
      ),
      section(
        'Choose data carefully',
        'Filtering is useful for views, reports, and search. Amina can see her open work without deleting other messages. A filter should preserve the identifiers and ordering of the selected items.',
        'A browser filter is not permission enforcement. Later, the backend will check who is allowed to read each record. For this exercise, all records are authorised fictional data and we are choosing the useful view.',
      ),
    ],
    words: [
      { term: 'Object', meaning: 'Named details grouped together for one item.' },
      { term: 'Array', meaning: 'An ordered list of values.' },
      {
        term: 'Loop',
        meaning: 'Instructions repeated for each item or until a condition changes.',
      },
    ],
    example: example(
      'javascript',
      'const messages = [{ id: 1, status: "open" }, { id: 2, status: "closed" }];\nlet openIds = [];\nfor (const message of messages) {\n  if (message.status === "open") { openIds.push(message.id); }\n}\nconsole.log(openIds);',
      '[1]',
      [
        'The array contains two message objects.',
        'The loop visits both objects. === compares values without changing them.',
        'Only the open message contributes its id to the result.',
      ],
    ),
    exercise: {
      title: 'Build a useful inbox view',
      brief:
        'Return the ids of open messages. When owner is an empty string, show all open messages. Otherwise, show only that owner’s open messages.',
      language: 'javascript',
      parameters: ['messages', 'owner'],
      result: 'openIds',
      starter: 'let openIds = [];',
      steps: [
        step(
          'Read each identifier',
          'Visit each message and add its id to openIds. Start with a queue containing only open messages.',
          'Use for (const message of messages) and openIds.push(message.id).',
          'let openIds = [];\nfor (const message of messages) { openIds.push(message.id); }',
          ['all-open', 'empty'],
        ),
        step(
          'Keep only open messages',
          'Add a status condition so closed messages are excluded.',
          'Use message.status === "open" inside the loop.',
          'let openIds = [];\nfor (const message of messages) {\n  if (message.status === "open") { openIds.push(message.id); }\n}',
          ['mixed', 'all-closed'],
        ),
        step(
          'Respect the owner selection',
          'Keep all open messages when owner is "". For a named owner, return only that person’s open messages.',
          'The owner condition is owner === "" || message.owner === owner. Combine it with the status condition using &&.',
          'let openIds = [];\nfor (const message of messages) {\n  if (message.status === "open" && (owner === "" || message.owner === owner)) { openIds.push(message.id); }\n}',
          ['amina', 'other'],
        ),
      ],
      cases: [
        check(
          'all-open',
          'Two open messages',
          [
            [
              { id: 1, status: 'open', owner: 'Amina' },
              { id: 2, status: 'open', owner: 'Bilal' },
            ],
            '',
          ],
          [1, 2],
          'Read every matching item, not just the first.',
        ),
        check('empty', 'An empty inbox', [[], ''], [], 'No work should give an empty list.'),
        check(
          'mixed',
          'Open and closed messages',
          [
            [
              { id: 1, status: 'open', owner: 'Amina' },
              { id: 2, status: 'closed', owner: 'Amina' },
            ],
            '',
          ],
          [1],
          'Closed work does not belong in the open view.',
        ),
        check(
          'all-closed',
          'No open work',
          [[{ id: 2, status: 'closed', owner: 'Amina' }], ''],
          [],
          'A non-empty source can still have no matches.',
        ),
        check(
          'amina',
          'Amina’s open work',
          [
            [
              { id: 1, status: 'open', owner: 'Amina' },
              { id: 2, status: 'open', owner: 'Bilal' },
              { id: 3, status: 'closed', owner: 'Amina' },
            ],
            'Amina',
          ],
          [1],
          'Both status and owner must match.',
        ),
        check(
          'other',
          'An owner with no messages',
          [[{ id: 1, status: 'open', owner: 'Amina' }], 'Zara'],
          [],
          'An unknown selection must not reveal another person’s items.',
        ),
      ],
    },
    project: project(
      'A team inbox filter',
      'Give Amina a view of unfinished messages, with a choice of owner. Use fictional records and stable identifiers.',
      [
        'An array of at least six message objects.',
        'A filter that returns matching ids.',
        'Examples covering empty and mixed queues.',
      ],
      [
        [
          'Describe the data',
          ['Give each message an id, status, and owner.', 'Keep the records fictional.'],
        ],
        ['Build the filter', ['Choose open status first.', 'Apply an optional owner condition.']],
        [
          'Check the view',
          [
            'Record results for all owners and one named owner.',
            'Confirm the original records are still intact.',
          ],
        ],
      ],
      [
        'Every selected message is open.',
        'A named owner excludes other owners.',
        'An empty owner selection includes all open work.',
        'Empty and all-closed inboxes return [].',
        'The original data and identifier order are preserved.',
      ],
      [
        ['Empty inbox', 'An empty list.'],
        ['Open messages owned by Amina and Bilal; select Amina', 'Only Amina’s ids.'],
        ['All messages closed', 'An empty list.'],
      ],
      'Add a count of matching messages alongside the ids. Do not confuse a view filter with server-side permissions.',
      [
        'Why use an id rather than message text?',
        'What does the loop do for an empty array?',
        'What would a backend still need to check?',
      ],
    ),
    references: [
      reference(
        'JavaScript arrays',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays',
      ),
    ],
  },
  {
    day: 4,
    slug: 'order-quotes',
    title: 'Use functions to make reliable quotes',
    chapter: 'Programming',
    concepts: ['Functions', 'Input and output contracts'],
    prerequisites: [3],
    outcome: 'Calculate a price using one reusable, tested set of rules.',
    story:
      'Different staff members are quoting different prices for the same order. Amina wants one clear calculation everyone can use.',
    demo: demo(
      'Follow the same price rule',
      { unitPrice: '200 cents', quantity: 3, shipping: '50 cents' },
      [
        [
          'Calculate the quote',
          { items: '600 cents', total: '650 cents' },
          'The same inputs produce the same quote.',
        ],
        [
          'Try zero items',
          { result: 'rejected' },
          'The function also owns the rule for unacceptable input.',
        ],
      ],
    ),
    sections: [
      section(
        'Give a group of instructions a name',
        'A function groups instructions so they can be reused. A quote function receives a price, quantity, and shipping cost, then returns an answer. Calling the function runs its instructions for the inputs you supply.',
        'The values listed in the function definition are parameters. The values supplied in a call are arguments. A return instruction sends a result back to the caller. These words describe the inputs and output you already used in earlier lessons.',
      ),
      section(
        'Agree on a contract',
        'A contract states what inputs a function accepts and what it returns. Our quote accepts a whole-number price in cents, a positive whole-number quantity, and a non-negative shipping cost. It returns items, discount, and total.',
        'A function should reject inputs outside that contract rather than produce a plausible-looking price. We use throw new RangeError to report unacceptable numbers. The caller can catch that error and explain it to the person using the app.',
      ),
      section(
        'Keep money exact',
        'Use integer cents for this exercise. A price of 200 cents is two units of currency with one hundred cents per unit. Adding and multiplying whole-number cents avoids common decimal-fraction surprises.',
        'The shop’s fictional rule is a 10% item discount for quantities of five or more. Round the discount down to a whole cent using Math.floor(items / 10). Add shipping after subtracting the discount. Real products must agree on their currency and rounding policy.',
      ),
      section(
        'Separate the rule from the screen',
        'The quote function should not read a text box or draw a button. Its job is calculation and validation. An interface can collect input and display the returned result. A backend can reuse the same contract while obtaining prices from an authoritative catalogue.',
        'A small function is easier to test because we can call it with several inputs without opening the whole application. Good boundaries also make change safer: a new screen need not invent a new pricing rule.',
      ),
    ],
    words: [
      {
        term: 'Function',
        meaning: 'A named group of instructions that can receive inputs and return a result.',
      },
      { term: 'Contract', meaning: 'The agreed rules for acceptable inputs and the result.' },
      { term: 'Return', meaning: 'Send a result back to whoever called the function.' },
    ],
    example: example(
      'javascript',
      'function itemCost(priceCents, quantity) {\n  return priceCents * quantity;\n}\nconsole.log(itemCost(200, 3));',
      '600',
      [
        'The function names its two inputs.',
        'return sends their product back to the caller.',
        'The call supplies 200 and 3. Another call can reuse the instructions with different numbers.',
      ],
    ),
    exercise: {
      title: 'A shared order quote',
      brief:
        'Write quote(priceCents, quantity, shippingCents). Return { items, discount, total }. Reject unacceptable inputs using RangeError.',
      language: 'javascript',
      parameters: ['priceCents', 'quantity', 'shippingCents'],
      result: 'quote(priceCents, quantity, shippingCents)',
      starter:
        'function quote(priceCents, quantity, shippingCents) {\n  return { items: 0, discount: 0, total: 0 };\n}',
      steps: [
        step(
          'Calculate items and shipping',
          'Multiply price by quantity. Add shipping to get the total. Keep discount at zero for now.',
          'Name the intermediate amount items so the return object is easy to explain.',
          'function quote(priceCents, quantity, shippingCents) {\n  const items = priceCents * quantity;\n  return { items, discount: 0, total: items + shippingCents };\n}',
          ['ordinary', 'free-shipping'],
        ),
        step(
          'Enforce the input contract',
          'Reject non-whole numbers, negative prices or shipping, and quantities below one.',
          'Validate all three inputs before multiplying. Throw new RangeError("Invalid quote input") on failure.',
          'function quote(priceCents, quantity, shippingCents) {\n  if (![priceCents, quantity, shippingCents].every(Number.isInteger) || priceCents < 0 || quantity < 1 || shippingCents < 0) { throw new RangeError("Invalid quote input"); }\n  const items = priceCents * quantity;\n  return { items, discount: 0, total: items + shippingCents };\n}',
          ['zero-quantity', 'fraction', 'negative'],
        ),
        step(
          'Apply the agreed discount',
          'For quantities of five or more, subtract Math.floor(items / 10). Keep shipping outside the discount.',
          'Use quantity >= 5 ? Math.floor(items / 10) : 0 to choose the discount.',
          'function quote(priceCents, quantity, shippingCents) {\n  if (![priceCents, quantity, shippingCents].every(Number.isInteger) || priceCents < 0 || quantity < 1 || shippingCents < 0) { throw new RangeError("Invalid quote input"); }\n  const items = priceCents * quantity;\n  const discount = quantity >= 5 ? Math.floor(items / 10) : 0;\n  return { items, discount, total: items - discount + shippingCents };\n}',
          ['discount', 'rounding'],
        ),
      ],
      cases: [
        check(
          'ordinary',
          'An ordinary order',
          [200, 3, 50],
          { items: 600, discount: 0, total: 650 },
          'Subtotal and shipping have separate meanings.',
        ),
        check(
          'free-shipping',
          'Zero shipping cost',
          [100, 1, 0],
          { items: 100, discount: 0, total: 100 },
          'Zero shipping is valid.',
        ),
        check(
          'zero-quantity',
          'An order with zero items',
          [100, 0, 10],
          null,
          'The contract requires at least one item.',
          'RangeError',
        ),
        check(
          'fraction',
          'A fractional quantity',
          [100, 1.5, 10],
          null,
          'The shop sells whole items in this exercise.',
          'RangeError',
        ),
        check(
          'negative',
          'Negative shipping',
          [100, 1, -10],
          null,
          'A negative cost needs a different, explicit business rule.',
          'RangeError',
        ),
        check(
          'discount',
          'The discount boundary',
          [200, 5, 50],
          { items: 1000, discount: 100, total: 950 },
          'The discount begins exactly at five items.',
        ),
        check(
          'rounding',
          'A discount containing a fraction of a cent',
          [101, 5, 0],
          { items: 505, discount: 50, total: 455 },
          'Use the stated rounding policy rather than an accidental decimal result.',
        ),
      ],
    },
    project: project(
      'A reliable quote desk',
      'Build a reusable quote function and a small catalogue of examples. Another developer should be able to call it without reading the implementation.',
      [
        'A documented quote contract.',
        'The quote function and tests.',
        'An explanation of currency units and rounding.',
      ],
      [
        [
          'Write the contract',
          ['Name the units for every price.', 'List valid input ranges and output fields.'],
        ],
        [
          'Implement the rules',
          ['Calculate items and shipping.', 'Add validation and the quantity discount.'],
        ],
        [
          'Review the boundaries',
          [
            'Test quantities of four and five.',
            'Test a fractional-cent discount and rejected inputs.',
          ],
        ],
      ],
      [
        'One function owns the calculation.',
        'All money values use integer cents.',
        'Invalid inputs raise RangeError.',
        'The discount boundary and rounding policy are tested.',
        'A caller can understand every output field.',
      ],
      [
        ['Four items', 'No discount.'],
        ['Five items at 101 cents', '50 cents discount.'],
        ['Zero quantity', 'Rejected.'],
      ],
      'Add a second delivery option using a separate function. Keep catalogue prices controlled by the shop.',
      [
        'Why separate calculation from the interface?',
        'What does the contract protect?',
        'Which rounding decision did you make explicit?',
      ],
    ),
    references: [
      reference(
        'JavaScript functions',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Functions',
      ),
    ],
  },
  {
    day: 5,
    slug: 'recover-saved-data',
    title: 'Read saved data and recover from errors',
    chapter: 'Programming',
    concepts: ['JSON', 'Error handling and saved state'],
    prerequisites: [4],
    outcome: 'Recover a valid saved basket without trusting damaged data.',
    story:
      'Amina wants a basket to survive closing an app. Saved information is text, and that text can be missing, damaged, or an older shape. The app needs a safe recovery rule.',
    demo: demo('Recover a basket', { savedText: '[{"name":"Tea","quantity":2}]' }, [
      [
        'Read the saved text',
        { basket: 'Tea × 2' },
        'JSON parsing turns text into structured values.',
      ],
      [
        'Try damaged text',
        { savedText: '{oops', basket: 'empty' },
        'An error handler recovers to a known safe starting point.',
      ],
    ]),
    sections: [
      section(
        'Structured values and stored text',
        'An object or array is useful while a program is running. Storage and network messages often carry text. JSON is a text format for representing values such as numbers, strings, arrays, and objects.',
        'JSON.stringify changes a JavaScript value into JSON text. JSON.parse changes JSON text back into a value. Parsing does not prove that the value has the right shape for your application. A perfectly valid JSON number is still the wrong shape for a basket.',
      ),
      section(
        'Expect a saved record to be missing',
        'A new user may have no saved basket. An application should choose a default, such as an empty array. The same is true after a user intentionally clears their data.',
        'A variable in memory lasts only while that program is running. Durable storage, such as a file or database, keeps data for later. Browser storage is tied to an origin and browser profile. It is useful for a small personal draft, but it does not provide shared accounts or backend permissions.',
      ),
      section(
        'Catch the failure you expect',
        'A try block contains an operation that may fail. A catch block handles the resulting error. If JSON.parse sees damaged text, it throws an error rather than guessing what you meant.',
        'Recovering to an empty basket is an explicit policy for this practice app. A real product might preserve the damaged text and offer recovery before replacing it. Avoid silently deleting valuable customer records just to make an error disappear.',
      ),
      section(
        'Check every record after parsing',
        'Our basket must be an array. Every item must have a non-empty name and a positive whole-number quantity. We accept the basket only when all items follow the rules. We return only the fields the application uses.',
        'The browser exercise practises this recovery function with supplied saved text. The independent project connects it to storage and tests a reload. Keep the two checks distinct: reading valid data and proving that the app actually saves it.',
      ),
    ],
    words: [
      { term: 'JSON', meaning: 'A text format used to store and transfer structured values.' },
      { term: 'Persistence', meaning: 'Keeping data so it can be loaded later.' },
      { term: 'Error handling', meaning: 'Responding deliberately when an operation fails.' },
    ],
    example: example(
      'javascript',
      'const saved = "[{\\"name\\":\\"Tea\\",\\"quantity\\":2}]";\ntry {\n  const basket = JSON.parse(saved);\n  console.log(basket[0].name);\n} catch (error) {\n  console.log("Could not read saved data");\n}',
      'Tea',
      [
        'saved is text, including the JSON brackets and field names.',
        'JSON.parse creates the array of records.',
        'The try/catch gives a deliberate alternative if parsing fails. Shape validation still needs to be added.',
      ],
    ),
    exercise: {
      title: 'A safe basket loader',
      brief:
        'Write loadBasket(saved). Return a cleaned array of { name, quantity } records. Return [] for missing, damaged, or unacceptable input.',
      language: 'javascript',
      parameters: ['saved'],
      result: 'loadBasket(saved)',
      starter: 'function loadBasket(saved) {\n  return [];\n}',
      steps: [
        step(
          'Read JSON safely',
          'Parse saved text inside try/catch. Missing text and damaged JSON should give an empty array.',
          'Start with if (!saved) return []. Catch parsing errors and return [].',
          'function loadBasket(saved) {\n  if (!saved) return [];\n  try { return JSON.parse(saved); } catch { return []; }\n}',
          ['valid', 'missing', 'broken'],
        ),
        step(
          'Validate the basket shape',
          'Require an array of valid records. Reject the entire saved basket if an item has a bad name or quantity.',
          'Use Array.isArray and every. Check that an item exists before reading its properties.',
          'function loadBasket(saved) {\n  if (!saved) return [];\n  try {\n    const basket = JSON.parse(saved);\n    if (!Array.isArray(basket) || !basket.every(item => item && typeof item.name === "string" && item.name.trim() !== "" && Number.isInteger(item.quantity) && item.quantity > 0)) return [];\n    return basket;\n  } catch { return []; }\n}',
          ['wrong-shape', 'invalid-item', 'null-item'],
        ),
        step(
          'Return clean records',
          'Trim each name and keep only name and quantity. Ignore unexpected fields instead of copying them into the app.',
          'After validation, map each item to a new { name: item.name.trim(), quantity: item.quantity } object.',
          'function loadBasket(saved) {\n  if (!saved) return [];\n  try {\n    const basket = JSON.parse(saved);\n    if (!Array.isArray(basket) || !basket.every(item => item && typeof item.name === "string" && item.name.trim() !== "" && Number.isInteger(item.quantity) && item.quantity > 0)) return [];\n    return basket.map(item => ({ name: item.name.trim(), quantity: item.quantity }));\n  } catch { return []; }\n}',
          ['clean'],
        ),
      ],
      cases: [
        check(
          'valid',
          'A valid basket',
          ['[{"name":"Tea","quantity":2}]'],
          [{ name: 'Tea', quantity: 2 }],
          'Ordinary saved data must survive loading.',
        ),
        check('missing', 'No saved draft', [''], [], 'A first visit needs a useful default.'),
        check(
          'broken',
          'Damaged JSON',
          ['{oops'],
          [],
          'A parsing error must not crash the recovery function.',
        ),
        check(
          'wrong-shape',
          'A JSON object instead of a basket',
          ['{"name":"Tea"}'],
          [],
          'Valid JSON can still have the wrong application shape.',
        ),
        check(
          'invalid-item',
          'An impossible quantity',
          ['[{"name":"Tea","quantity":0}]'],
          [],
          'A stored record must satisfy the same rules as a new record.',
        ),
        check(
          'null-item',
          'A null record',
          ['[null]'],
          [],
          'Check the item before accessing its fields.',
        ),
        check(
          'clean',
          'Whitespace and an unexpected field',
          ['[{"name":" Tea ","quantity":2,"admin":true}]'],
          [{ name: 'Tea', quantity: 2 }],
          'Only recognised application fields should enter the cleaned state.',
        ),
      ],
    },
    project: project(
      'A recoverable basket draft',
      'Save a fictional basket as JSON text and load it using your recovery function. Begin with the supplied text cases; connect the function to real storage when you set up the local workspace in lesson 7.',
      [
        'A loader with a documented recovery policy.',
        'Saved JSON examples for valid and damaged data.',
        'A later reload check in your local app.',
      ],
      [
        [
          'Read a good draft',
          ['Serialize a basket with JSON.stringify.', 'Load it and compare the records.'],
        ],
        [
          'Recover deliberately',
          ['Try missing and damaged text.', 'Document when the loader returns an empty basket.'],
        ],
        [
          'Check the storage boundary',
          [
            'Keep only approved fields.',
            'After local setup, save, reload, and confirm the basket remains.',
          ],
        ],
      ],
      [
        'A valid basket loads correctly.',
        'Missing and damaged text have a known result.',
        'Invalid records are rejected.',
        'Unexpected fields are removed.',
        'A real reload is checked before claiming persistence.',
      ],
      [
        ['No saved text', 'Empty basket.'],
        ['Damaged text', 'Empty basket with the recovery policy explained.'],
        ['A valid saved basket after reload', 'The same approved records.'],
      ],
      'Return a status beside the basket, such as missing, recovered, or loaded, so the interface can explain what happened.',
      [
        'What does parsing prove, and what does validation prove?',
        'Could returning [] hide valuable damaged data?',
        'What evidence would demonstrate real persistence?',
      ],
    ),
    references: [
      reference(
        'JSON.parse',
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse',
      ),
      reference(
        'Browser storage',
        'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API',
      ),
    ],
  },
  {
    day: 6,
    slug: 'debug-with-tests',
    title: 'Find a bug and protect the fix with tests',
    chapter: 'Programming',
    concepts: ['Debugging', 'Regression tests'],
    prerequisites: [5],
    outcome: 'Repair an order decision and prove that rejected orders stay rejected.',
    story:
      'The shop sometimes ships an unpaid order. Amina needs you to reproduce the problem, fix the actual rule, and keep a test that catches it if it returns.',
    demo: demo(
      'Investigate an incorrect decision',
      { payment: 'unpaid', amount: '6000 cents', result: 'ship — incorrect' },
      [
        [
          'Check the payment rule',
          { payment: 'unpaid', result: 'hold' },
          'A comparison checks payment; an assignment accidentally changes it.',
        ],
        [
          'Test exactly 5000 cents',
          { payment: 'paid', amount: '5000 cents', result: 'ship' },
          'The business rule includes 5000, so the boundary uses >=.',
        ],
      ],
    ),
    sections: [
      section(
        'Start with evidence',
        'Debugging means finding why a program behaves differently from its intended rules. Write down the input, expected result, and actual result before changing the code. A reproducible example lets another person see the same problem.',
        'Our fictional rule says: ship a paid order worth at least 5000 cents; otherwise hold it. An unpaid order worth 6000 cents should be held. If the program ships it, its payment condition needs investigation.',
      ),
      section(
        'Read the suspicious line',
        'The equals sign = assigns a value. The comparison === asks whether two values are equal. A line using payment = "paid" can change the input while the program is trying to decide what it means.',
        'Repair the reason for the wrong result rather than special-casing one example. A fix that rejects only the exact amount 6000 leaves the same payment bug at other amounts. A good test should make the intended rule visible.',
      ),
      section(
        'Protect the boundary',
        'At least 5000 includes exactly 5000. The operator >= expresses that rule. The operator > excludes the exact boundary. Test an amount just below, exactly at, and just above the threshold.',
        'Negative and fractional-cent amounts are outside this exercise’s contract. Reject them with RangeError before considering shipping. This protects the decision from strange but apparently successful outputs.',
      ),
      section(
        'Keep a regression test',
        'A regression is a previously fixed problem returning after a change. A regression test keeps the reproducing example and its expected result. Run it whenever the code changes.',
        'A passing suite is evidence about the cases it covers. It cannot prove every possible behaviour is correct. Add a case when you discover a new failure, and explain which rule that case protects. The independent project asks you to write a new case of your own.',
      ),
    ],
    words: [
      {
        term: 'Debugging',
        meaning: 'Finding the cause of a difference between expected and actual behaviour.',
      },
      { term: 'Regression test', meaning: 'A test that catches a known problem if it returns.' },
      { term: 'Boundary', meaning: 'The exact point where a rule starts or stops applying.' },
    ],
    example: example(
      'javascript',
      'function itemTotal(price, quantity) { return price + quantity; }\nconst expected = 15;\nconst actual = itemTotal(5, 3);\nconsole.log({ expected, actual });',
      '{"expected":15,"actual":8}',
      [
        'The test expectation describes three items at a price of five.',
        'The actual result exposes the incorrect addition.',
        'The evidence points to the function’s arithmetic. Repair it to multiplication, then keep the case.',
      ],
    ),
    exercise: {
      title: 'Stop shipping unpaid orders',
      brief:
        'Repair decideShipment(amountCents, payment). A paid order of at least 5000 cents ships; other valid orders are held. Reject negative or fractional amounts.',
      language: 'javascript',
      parameters: ['amountCents', 'payment'],
      result: 'decideShipment(amountCents, payment)',
      starter:
        'function decideShipment(amountCents, payment) {\n  if (amountCents > 5000 && (payment = "paid")) return "ship";\n  return "hold";\n}',
      steps: [
        step(
          'Fix the payment comparison',
          'An unpaid order must remain unpaid. Compare payment with "paid" rather than assigning a new value.',
          'Change payment = "paid" to payment === "paid".',
          'function decideShipment(amountCents, payment) {\n  if (amountCents > 5000 && payment === "paid") return "ship";\n  return "hold";\n}',
          ['paid', 'unpaid'],
        ),
        step(
          'Fix the threshold boundary',
          'Include exactly 5000 cents. Keep amounts below 5000 on hold.',
          'Use >= for an at-least rule.',
          'function decideShipment(amountCents, payment) {\n  if (amountCents >= 5000 && payment === "paid") return "ship";\n  return "hold";\n}',
          ['exact', 'below'],
        ),
        step(
          'Reject unacceptable amounts',
          'Add the amount contract before the shipping decision. Reject negative or non-whole cents using RangeError.',
          'Use Number.isInteger(amountCents) and amountCents < 0 before the payment rule.',
          'function decideShipment(amountCents, payment) {\n  if (!Number.isInteger(amountCents) || amountCents < 0) throw new RangeError("Invalid amount");\n  if (amountCents >= 5000 && payment === "paid") return "ship";\n  return "hold";\n}',
          ['negative', 'fraction', 'zero'],
        ),
      ],
      cases: [
        check(
          'paid',
          'A paid qualifying order',
          [6000, 'paid'],
          'ship',
          'The fix must preserve intended success.',
        ),
        check(
          'unpaid',
          'The original unpaid-order bug',
          [6000, 'unpaid'],
          'hold',
          'This regression case protects the payment rule.',
        ),
        check(
          'exact',
          'Exactly at the threshold',
          [5000, 'paid'],
          'ship',
          'At least includes the boundary.',
        ),
        check(
          'below',
          'Just below the threshold',
          [4999, 'paid'],
          'hold',
          'The threshold should not expand accidentally.',
        ),
        check(
          'negative',
          'Negative amount',
          [-1, 'paid'],
          null,
          'Impossible amounts must not enter the decision.',
          'RangeError',
        ),
        check(
          'fraction',
          'Fractional cents',
          [5000.5, 'paid'],
          null,
          'The amount contract uses whole cents.',
          'RangeError',
        ),
        check(
          'zero',
          'A zero-value order',
          [0, 'paid'],
          'hold',
          'Zero is valid but below the shipping threshold.',
        ),
      ],
    },
    project: project(
      'A regression repair report',
      'Deliver the shipping fix with evidence another developer can reproduce. Preserve the unpaid-order case and add one case you chose yourself.',
      [
        'A before/after reproduction.',
        'The corrected function and regression cases.',
        'A short repair report explaining the cause.',
      ],
      [
        [
          'Reproduce the bug',
          [
            'Record the unpaid 6000-cent input.',
            'Show expected hold and observed ship before the repair.',
          ],
        ],
        [
          'Repair the rule',
          ['Use comparison rather than assignment.', 'Correct the exact threshold and validation.'],
        ],
        [
          'Protect and explain',
          ['Keep the original reproducing case.', 'Add a new test and explain what it covers.'],
        ],
      ],
      [
        'A paid qualifying order still ships.',
        'The original unpaid-order case is held.',
        'The threshold boundary is correct.',
        'Invalid amounts are rejected.',
        'The report explains the cause and the evidence.',
      ],
      [
        ['6000 cents, unpaid', 'hold'],
        ['5000 cents, paid', 'ship'],
        ['4999 cents, paid', 'hold'],
        ['Negative amount', 'RangeError'],
      ],
      'Write your own regression case for an unknown payment status. Explain why a fail-safe result should be hold.',
      [
        'Which line caused the original problem?',
        'What would an example-specific patch have missed?',
        'What does a passing test suite still leave uncertain?',
      ],
    ),
    references: [
      reference(
        'JavaScript equality',
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality',
      ),
    ],
  },
];
