import { check, demo, example, project, reference, section, step } from './content-helpers.mjs';

const py = (title, brief, parameters, result, starter, steps, cases, setup) => ({
  title,
  brief,
  language: 'python',
  parameters,
  result,
  starter,
  steps,
  cases,
  ...(setup ? { setup } : {}),
});
const pythonRef = reference('Python tutorial', 'https://docs.python.org/3/tutorial/');
const apiRef = reference(
  'FastAPI first steps',
  'https://fastapi.tiangolo.com/tutorial/first-steps/',
);
const quote1 =
  'def quote(price, quantity):\n    return {"items": price * quantity, "total": price * quantity}';
const quote2 =
  'def quote(price, quantity):\n    items = price * quantity\n    discount = items // 10 if quantity >= 5 else 0\n    return {"items": items, "total": items - discount}';
const quote3 =
  'def quote(price, quantity):\n    if type(price) is not int or type(quantity) is not int or price < 0 or quantity < 0:\n        raise ValueError("Use non-negative whole numbers")\n    items = price * quantity\n    discount = items // 10 if quantity >= 5 else 0\n    return {"items": items, "total": items - discount}';
const sqlSetup =
  'import sqlite3\nconnection = sqlite3.connect(":memory:")\nconnection.execute("CREATE TABLE orders(id INTEGER PRIMARY KEY, shop TEXT NOT NULL, total INTEGER NOT NULL)")\nconnection.executemany("INSERT INTO orders VALUES (?, ?, ?)", rows)';
const sql1 =
  'def find_orders(shop, minimum):\n    return [list(row) for row in connection.execute("SELECT id, total FROM orders ORDER BY id")]';
const sql2 =
  'def find_orders(shop, minimum):\n    return [list(row) for row in connection.execute("SELECT id, total FROM orders WHERE shop = ? ORDER BY id", (shop,))]';
const sql3 =
  'def find_orders(shop, minimum):\n    return [list(row) for row in connection.execute("SELECT id, total FROM orders WHERE shop = ? AND total >= ? ORDER BY id", (shop, minimum))]';
const rows = [
  [1, 'amina', 900],
  [2, 'bilal', 1200],
  [3, 'amina', 1500],
  [4, "O'Reilly", 500],
];
const api1 =
  'def create_message(body):\n    return {"status": 201, "body": {"text": body["text"].strip()}}';
const api2 =
  'def create_message(body):\n    if not isinstance(body, dict) or not isinstance(body.get("text"), str):\n        return {"status": 422, "body": {"error": "text must be a string"}}\n    text = body["text"].strip()\n    if not text or len(text) > 200:\n        return {"status": 422, "body": {"error": "text must contain 1 to 200 characters"}}\n    return {"status": 201, "body": {"text": text}}';
const api3 = api2.replace(
  '    text = body["text"].strip()',
  '    if set(body) != {"text"}:\n        return {"status": 422, "body": {"error": "unexpected fields"}}\n    text = body["text"].strip()',
);
const permit1 = 'def can_read(user, order):\n    return user is not None';
const permit2 =
  'def can_read(user, order):\n    return user is not None and user.get("shop") == order.get("shop")';
const permit3 =
  'def can_read(user, order):\n    if user is None or not user.get("shop") or user.get("shop") != order.get("shop"):\n        return False\n    return user.get("role") == "staff" or user.get("id") == order.get("customer_id")';
const gate1 = 'def release(checks):\n    return "ready" if checks.get("tests") else "stop:tests"';
const gate2 =
  'def release(checks):\n    for name in ("tests", "migration", "config"):\n        if not checks.get(name):\n            return "stop:" + name\n    return "ready"';
const gate3 = gate2.replace(
  '("tests", "migration", "config")',
  '("tests", "migration", "config", "health", "rollback")',
);
const allGreen = { tests: true, migration: true, config: true, health: true, rollback: true };

export default [
  {
    day: 13,
    slug: 'python-rules',
    title: 'Move a familiar rule to Python',
    chapter: 'Services',
    concepts: ['Python functions', 'Backend rules'],
    prerequisites: [4, 12],
    outcome: 'Translate the pricing rule without changing its behaviour.',
    story:
      'Amina needs the same correct price on her website and at the service that accepts orders. Use a familiar problem to learn Python before learning a server framework.',
    demo: demo('Keep the same promise', { quantity: 2, price: '100 cents', total: '200 cents' }, [
      [
        'Order 5 items',
        { quantity: 5, total: '450 cents' },
        'Five items cost 500 cents before a ten percent discount. The rule is the same in either language.',
      ],
      [
        'Try a negative quantity',
        { quantity: -1, result: 'reject' },
        'A language change must preserve input validation as well as the happy path.',
      ],
    ]),
    sections: [
      section(
        'Start with what you already know',
        'Python has variables, conditions, lists, dictionaries, and functions. These are the same ideas you used in JavaScript. def introduces a function; return sends its result back. A dictionary such as {"total": 200} resembles a JavaScript object.',
        'Python uses indentation to group statements. Put four spaces before the lines inside a function or if block. You do not put braces around those blocks. Read the program from the top and follow the values, rather than memorising punctuation.',
      ),
      section(
        'Use integer money',
        'Keep amounts in cents. items = price * quantity computes the subtotal. // performs floor division: 505 // 10 is 50, so the discount stays a whole number. Write down the rounding policy before implementing it.',
        'The conditional expression discount = items // 10 if quantity >= 5 else 0 chooses one of two values. You can also write a normal if block. Both forms must produce the same agreed prices.',
      ),
      section(
        'Keep a clear function boundary',
        'This function accepts two numbers and returns a dictionary. It does not read a web page or connect to a database. That small boundary makes the pricing rule easy to test and reuse in a server.',
        'Validate both inputs before multiplying. In Python, bool is related to int, so type(value) is int deliberately rejects True and False here. Raise ValueError when the caller breaks the contract. An API will later turn that into a useful response.',
      ),
      section(
        'Run it outside the browser',
        'The exercise runs actual Python in a browser runtime. The downloadable kit also runs with Python on your computer. Use python --version, then python check.py in the extracted folder. Some systems use python3 instead.',
        'A backend is a program that responds to requests and owns shared rules and data. Merely rewriting a function in Python does not create a server. In lesson 15 you will call this sort of function from a real HTTP endpoint.',
      ),
    ],
    words: [
      { term: 'Indentation', meaning: 'Spaces that identify a group of Python statements.' },
      { term: 'Dictionary', meaning: 'A collection of named values.' },
      { term: 'Backend', meaning: 'The service responsible for shared rules and data.' },
    ],
    example: example('python', quote2 + '\nprint(quote(100, 5))', '{"items": 500, "total": 450}', [
      'def creates a reusable rule with two inputs.',
      'The subtotal and discount use whole cents.',
      'return gives the caller a structured result.',
    ]),
    exercise: py(
      'A Python price quote',
      'Write quote(price, quantity). Return items and total in cents, subtract ten percent for five or more items, and reject inputs outside the contract.',
      ['price', 'quantity'],
      'quote(price, quantity)',
      'def quote(price, quantity):\n    return {}',
      [
        step(
          'Calculate the subtotal',
          'Return items and total, both equal to price times quantity.',
          'Use a dictionary with the two required keys.',
          quote1,
          ['ordinary', 'zero'],
        ),
        step(
          'Apply the bulk discount',
          'For quantity at least five, subtract items // 10 from total.',
          'Calculate items once, then calculate discount separately.',
          quote2,
          ['bulk', 'rounding'],
        ),
        step(
          'Guard the boundary',
          'Reject non-integer or negative inputs with ValueError. Booleans are not valid quantities.',
          'Use type(value) is int for both inputs before arithmetic.',
          quote3,
          ['negative', 'fraction', 'boolean'],
        ),
      ],
      [
        check(
          'ordinary',
          'Two items',
          [100, 2],
          { items: 200, total: 200 },
          'The common case remains unchanged.',
        ),
        check(
          'zero',
          'An empty order',
          [100, 0],
          { items: 0, total: 0 },
          'Zero is an allowed boundary.',
        ),
        check(
          'bulk',
          'The first discounted quantity',
          [100, 5],
          { items: 500, total: 450 },
          'The threshold is inclusive.',
        ),
        check(
          'rounding',
          'A whole-cent discount',
          [101, 5],
          { items: 505, total: 455 },
          'Floor rounding prevents fractional cents.',
        ),
        check(
          'negative',
          'Negative quantity',
          [100, -1],
          null,
          'Bad input must not become a price.',
          'ValueError',
        ),
        check(
          'fraction',
          'Fractional quantity',
          [100, 1.5],
          null,
          'The shop sells whole units.',
          'ValueError',
        ),
        check(
          'boolean',
          'A boolean quantity',
          [100, true],
          null,
          'Python booleans must not silently become quantities.',
          'ValueError',
        ),
      ],
    ),
    project: project(
      'The same quote in two languages',
      'Run the JavaScript and Python pricing rules against an agreed set of order examples. Explain any intentional difference before changing code.',
      [
        'Both implementations.',
        'A shared table of expected quotes.',
        'A README with both commands.',
      ],
      [
        [
          'Prepare the contract',
          [
            'Write down inputs, outputs, rounding, and rejection rules.',
            'Choose ordinary, threshold, and invalid examples.',
          ],
        ],
        [
          'Translate and run',
          [
            'Run the Python kit.',
            'Implement the same rule in JavaScript.',
            'Compare each result with the agreed table.',
          ],
        ],
        [
          'Explain and extend',
          [
            'Add shipping as a separate input.',
            'Document how each language reports an invalid input.',
            'Have another person run both commands.',
          ],
        ],
      ],
      [
        'Money stays in whole cents.',
        'Both languages match the agreed valid quotes.',
        'Invalid inputs are rejected.',
        'Discount rounding is documented.',
        'Both commands work from the README.',
      ],
      [
        ['Five items at 101 cents', '505 subtotal and 455 before shipping.'],
        ['Negative or boolean quantity', 'A clear rejection.'],
        ['Shipping applied', 'The documented order of calculations is followed.'],
      ],
      'Add a maximum order size and test its exact boundary in both languages.',
      [
        'Which ideas transferred directly?',
        'Where did indentation change how you read the program?',
        'Why should the API call this rule rather than copy it?',
      ],
    ),
    references: [pythonRef],
  },
  {
    day: 14,
    slug: 'stored-orders',
    title: 'Save and find orders with SQL',
    chapter: 'Services',
    concepts: ['SQL queries', 'Relations and transactions'],
    prerequisites: [13],
    outcome: 'Query real SQLite data safely and explain a transaction.',
    story:
      'Amina wants her orders to survive a restart. She also shares the service with another shop. Find the right shop’s orders without trusting text as SQL commands.',
    demo: demo('Find the right stored rows', { rows: 4, result: 'all shops' }, [
      [
        'Choose Amina’s shop',
        { rows: 4, result: 'orders 1 and 3' },
        'A WHERE condition selects matching rows without deleting the others.',
      ],
      [
        'Set a minimum of 1000 cents',
        { result: 'order 3' },
        'A second condition narrows the result. The stored rows are still unchanged.',
      ],
    ]),
    sections: [
      section(
        'A table holds records',
        'A SQLite database is stored in a file in the local project. A table has named columns and rows. orders has id, shop, and total columns. A primary key identifies a row; a foreign key can connect an order to a customer row.',
        'The browser lab uses a real in-memory SQLite database for repeatable tests. That database lasts only for the exercise run. The project changes the connection to a file and checks that records survive closing and reopening it.',
      ),
      section(
        'Select only the rows you need',
        'SELECT id, total chooses columns. FROM orders chooses a table. WHERE shop = ? AND total >= ? adds conditions. ORDER BY id makes the result predictable. A query returns rows; it does not remove the unmatched rows.',
        'Write the intended result before the query. For Amina and minimum 1000, only order 3 should appear. An empty result is a normal result, not proof that the database failed.',
      ),
      section(
        'Keep values separate from SQL',
        'Pass values as a parameter tuple: connection.execute(sql, (shop, minimum)). The database binds those values to the question marks. A shop name containing an apostrophe remains a value.',
        'Do not construct SQL by inserting shop text into the query. Parameter binding applies to values; table or column names need an explicit allowed list when they are dynamic. The tests include an attempted SQL condition in the shop name.',
      ),
      section(
        'Make related changes together',
        'A transaction groups changes so they commit together or roll back together. Creating an order and reducing stock should not leave only half the operation saved. Use with connection: for a local transaction and raise an error if stock would become negative.',
        'Enable PRAGMA foreign_keys = ON for every SQLite connection that uses foreign keys. Add constraints such as CHECK(total >= 0). Back up a database before a schema migration, and verify the restored copy rather than assuming a copied file is usable.',
      ),
    ],
    words: [
      { term: 'Primary key', meaning: 'A value that uniquely identifies a row.' },
      { term: 'Parameter', meaning: 'A value supplied separately from the SQL command.' },
      {
        term: 'Transaction',
        meaning: 'A group of data changes that succeed or are undone together.',
      },
    ],
    example: example(
      'python',
      'sql = "SELECT id, total FROM orders WHERE shop = ? AND total >= ? ORDER BY id"\nresult = connection.execute(sql, ("amina", 1000)).fetchall()\nprint(result)',
      '[(3, 1500)] for the supplied orders',
      [
        'The SQL selects two columns and two conditions.',
        'The tuple supplies values without changing the SQL command.',
        'ORDER BY makes the returned order deterministic.',
      ],
    ),
    exercise: py(
      'A shop-scoped order query',
      'The lab provides connection containing the rows. Write find_orders(shop, minimum) and return lists containing id and total. Use parameter binding.',
      ['rows', 'shop', 'minimum'],
      'find_orders(shop, minimum)',
      'def find_orders(shop, minimum):\n    return []',
      [
        step(
          'Read the stored rows',
          'Select id and total and order by id.',
          'Wrap each returned tuple with list(row) so the result is JSON-friendly.',
          sql1,
          ['all', 'empty'],
        ),
        step(
          'Choose the shop safely',
          'Add WHERE shop = ? and bind the shop value.',
          'The parameters are a tuple; a single value needs a trailing comma.',
          sql2,
          ['shop', 'apostrophe', 'injection'],
        ),
        step(
          'Add a second condition',
          'Require total >= minimum as well as the correct shop.',
          'Bind both values in the order their placeholders appear.',
          sql3,
          ['minimum', 'boundary'],
        ),
      ],
      [
        check(
          'all',
          'Read all Amina rows',
          [
            [
              [1, 'amina', 900],
              [3, 'amina', 1500],
            ],
            'amina',
            0,
          ],
          [
            [1, 900],
            [3, 1500],
          ],
          'Read the selected columns in order.',
        ),
        check(
          'empty',
          'An empty table',
          [[], 'amina', 0],
          [],
          'An empty query is still successful.',
        ),
        check(
          'shop',
          'Two shops share a table',
          [rows, 'amina', 0],
          [
            [1, 900],
            [3, 1500],
          ],
          'Other shops must stay out of the result.',
        ),
        check(
          'apostrophe',
          'A shop name with punctuation',
          [rows, "O'Reilly", 0],
          [[4, 500]],
          'Bound parameters support ordinary punctuation.',
        ),
        check(
          'injection',
          'Text that looks like a SQL condition',
          [rows, "amina' OR 1=1 --", 0],
          [],
          'Input text must not become a command.',
        ),
        check(
          'minimum',
          'A minimum total',
          [rows, 'amina', 1000],
          [[3, 1500]],
          'The second condition narrows the result.',
        ),
        check(
          'boundary',
          'The exact minimum',
          [rows, 'amina', 900],
          [
            [1, 900],
            [3, 1500],
          ],
          'At least includes equality.',
        ),
      ],
      sqlSetup,
    ),
    project: project(
      'Orders that survive a restart',
      'Create a SQLite file with customers, products, and orders. Record an order and stock change in one transaction.',
      [
        'A schema and sample-data script.',
        'Parameterized query functions.',
        'A persistence and rollback test report.',
      ],
      [
        [
          'Store real data',
          [
            'Create a database file and enable foreign keys.',
            'Give rows primary keys and connect an order to a customer.',
            'Close the connection and reopen the file.',
          ],
        ],
        [
          'Query safely',
          [
            'Reuse the shop and minimum query.',
            'Bind all user values.',
            'Test apostrophes, missing shops, and empty data.',
          ],
        ],
        [
          'Protect a purchase',
          [
            'Group order insertion and stock reduction in a transaction.',
            'Fail when stock is insufficient.',
            'Verify that neither partial change remains after the failure.',
          ],
        ],
      ],
      [
        'Rows survive reopening the database.',
        'Queries bind values.',
        'Orders reference existing customers.',
        'Negative stock cannot be committed.',
        'Failed purchases leave both tables unchanged.',
      ],
      [
        ['Reopen the file', 'The previously created order is present.'],
        ['Apostrophe in a shop name', 'Only the exact shop matches.'],
        ['Purchase more than available stock', 'No order or stock change is committed.'],
      ],
      'Add a migration that introduces order status. Test it on a copy of an older database and restore the backup.',
      [
        'What does the browser’s in-memory database prove?',
        'Why does binding a value prevent it changing the query?',
        'Which two changes must be atomic in your project?',
      ],
    ),
    references: [reference('Python sqlite3', 'https://docs.python.org/3/library/sqlite3.html')],
  },
  {
    day: 15,
    slug: 'message-api',
    title: 'Give the shop a real API',
    chapter: 'Services',
    concepts: ['HTTP contracts', 'FastAPI validation'],
    prerequisites: [11, 14],
    outcome: 'Run an endpoint with a documented request and response.',
    story:
      'The website and shop staff need one service for creating messages. Agree on the exact request before connecting the interface.',
    demo: demo(
      'Follow the request contract',
      { request: '{text: "Hello"}', response: '201 Created' },
      [
        [
          'Send an empty message',
          { request: '{text: " "}', response: '422 Invalid input' },
          'The service rejects data that cannot become a useful message.',
        ],
        [
          'Try setting the record owner',
          { request: '{text: "Hello", owner: "someone else"}', response: '422 Unexpected fields' },
          'The client cannot choose server-owned fields.',
        ],
      ],
    ),
    sections: [
      section(
        'Agree on the boundary',
        'An API lets programs communicate through a contract. POST /messages accepts JSON containing text. A successful response uses 201 and returns a created record. Invalid text uses 422 with a useful explanation.',
        'Keep the contract small: trim outer whitespace, accept 1 to 200 characters, and reject extra fields. The service chooses ids and ownership. Writing examples of accepted and rejected requests prevents frontend and backend from guessing differently.',
      ),
      section(
        'Run a real endpoint',
        'FastAPI maps a Python function to an HTTP method and path. A Pydantic model describes allowed fields and performs runtime validation. The project includes a FastAPI service; start it using the README and open /docs to inspect its generated API documentation.',
        'The browser exercise implements the response decision as a function so you can inspect it quickly. It does not listen on a network port. The project requires actual requests to the running service and verifies response status and JSON.',
      ),
      section(
        'Validate before saving',
        'JSON being syntactically valid does not make its contents acceptable. Check the object shape, field types, and limits before using the database. Trim first, then measure the remaining text. Reject a whitespace-only message.',
        'Validation errors are expected client outcomes. Internal database failures are different; do not turn every exception into a successful empty list. Avoid returning traceback details to customers. Keep diagnostic details in controlled server logs.',
      ),
      section(
        'Prove the contract with requests',
        'Use curl, the API docs, or a small test client to send normal, boundary, and invalid requests. Inspect both HTTP status and body. A response of 201 with the wrong owner is still a bug.',
        'Keep service, data access, and business rules separate enough to test. Use a temporary test database, not a real shop database. Before releasing, document how a client should recover from validation errors and temporary service failures.',
      ),
    ],
    words: [
      { term: 'Endpoint', meaning: 'An HTTP method and path handled by the service.' },
      { term: 'Contract', meaning: 'The agreed input, output, and failure behaviour.' },
      {
        term: 'Runtime validation',
        meaning: 'Checking the values a running program actually receives.',
      },
    ],
    example: example(
      'python',
      api2 + '\nprint(create_message({"text": " Hello "}))',
      '{"status": 201, "body": {"text": "Hello"}}',
      [
        'The function checks the shape before reading text.',
        'Trimming happens before the length rule.',
        'The output includes the status and a predictable body.',
      ],
    ),
    exercise: py(
      'Validate a create-message request',
      'Return a status/body dictionary. Use 201 for a valid trimmed text and 422 for bad requests. The project turns this rule into real HTTP behaviour.',
      ['body'],
      'create_message(body)',
      'def create_message(body):\n    return {"status": 201, "body": {}}',
      [
        step(
          'Accept a valid message',
          'Return trimmed text in a 201 response.',
          'Return exactly status and body; body has only text.',
          api1,
          ['valid', 'trim'],
        ),
        step(
          'Reject invalid text',
          'Reject a non-object or non-string text with text must be a string. Reject blank or over-200 text with text must contain 1 to 200 characters.',
          'Check type before calling strip; check length after stripping.',
          api2,
          ['shape', 'blank', 'long', 'limit'],
        ),
        step(
          'Reject extra fields',
          'After checking text type, require the only request field to be text. Use unexpected fields for other keys.',
          'Compare set(body) with {"text"}.',
          api3,
          ['extra'],
        ),
      ],
      [
        check(
          'valid',
          'A useful message',
          [{ text: 'Hello' }],
          { status: 201, body: { text: 'Hello' } },
          'A normal request should succeed.',
        ),
        check(
          'trim',
          'Outer spaces',
          [{ text: ' Hello ' }],
          { status: 201, body: { text: 'Hello' } },
          'Store the agreed normal form.',
        ),
        check(
          'shape',
          'Text with the wrong type',
          [{ text: 12 }],
          { status: 422, body: { error: 'text must be a string' } },
          'The field must support text operations.',
        ),
        check(
          'blank',
          'Only whitespace',
          [{ text: '  ' }],
          { status: 422, body: { error: 'text must contain 1 to 200 characters' } },
          'Empty content is rejected after trimming.',
        ),
        check(
          'long',
          '201 characters',
          [{ text: 'a'.repeat(201) }],
          { status: 422, body: { error: 'text must contain 1 to 200 characters' } },
          'Test immediately beyond the limit.',
        ),
        check(
          'limit',
          'Exactly 200 characters',
          [{ text: 'a'.repeat(200) }],
          { status: 201, body: { text: 'a'.repeat(200) } },
          'The upper limit is inclusive.',
        ),
        check(
          'extra',
          'A client-supplied owner',
          [{ text: 'Hello', owner: 'bilal' }],
          { status: 422, body: { error: 'unexpected fields' } },
          'The service owns sensitive fields.',
        ),
      ],
    ),
    project: project(
      'A running message service',
      'Use the service workspace in the kit to implement and call a FastAPI endpoint backed by SQLite. Add tests before attaching the website.',
      [
        'A running FastAPI application.',
        'A written request/response contract.',
        'HTTP tests using a temporary database.',
      ],
      [
        [
          'Start the service',
          [
            'Create a Python virtual environment.',
            'Install the pinned requirements.',
            'Start the service and inspect /docs.',
          ],
        ],
        [
          'Create and retrieve',
          [
            'Validate text with a request model.',
            'Save a valid message using a parameterized statement.',
            'Return 201 and an id chosen by the service.',
          ],
        ],
        [
          'Test the boundary',
          [
            'Send ordinary, blank, over-limit, and extra-field requests.',
            'Retrieve the saved record after a restart.',
            'Compare each result with the contract.',
          ],
        ],
      ],
      [
        'Requests reach a real HTTP service.',
        'A valid message is stored.',
        'Invalid input is rejected before storage.',
        'Server-owned fields cannot be overwritten.',
        'The test suite uses an isolated database.',
      ],
      [
        ['Valid POST', '201 with a server-selected id and trimmed text.'],
        ['Blank POST', '422 with no stored record.'],
        ['Service restart', 'The created record remains available.'],
      ],
      'Add a separate list endpoint with pagination and a documented maximum page size.',
      [
        'How does the browser function differ from an HTTP server?',
        'Which validation happens before storage?',
        'What must a client inspect besides the status?',
      ],
    ),
    references: [
      apiRef,
      reference('FastAPI request bodies', 'https://fastapi.tiangolo.com/tutorial/body/'),
    ],
  },
  {
    day: 16,
    slug: 'permissions',
    title: 'Let the right person see the right data',
    chapter: 'Services',
    concepts: ['Identity', 'Authorization and safe input'],
    prerequisites: [15],
    outcome: 'Enforce ownership on the service, including cross-shop failures.',
    story:
      'Amina’s customers should see their own orders. Her staff can help customers in her shop. A staff member from another shop still cannot see Amina’s orders.',
    demo: demo('Check identity, then permission', { person: 'not signed in', result: 'deny' }, [
      [
        'Sign in as the order’s customer',
        { person: 'customer in Amina’s shop', result: 'allow own order' },
        'A known identity is the beginning of a permission check.',
      ],
      [
        'Switch to another shop’s staff',
        { person: 'staff in Bilal’s shop', result: 'deny' },
        'A staff role does not grant permission across every shop.',
      ],
    ]),
    sections: [
      section(
        'Identify the person',
        'Authentication establishes who is making a request. A service may verify a password and issue a session cookie. Later requests use that session to obtain the identity on the server.',
        'Never accept a client’s user id, shop, or role as proof of identity. In the browser exercise the user dictionary is a trusted fixture supplied by the test. In the project, it must come from a verified server session.',
      ),
      section(
        'Decide what that person may do',
        'Authorization checks permission for a specific operation and record. First deny missing identity. Next require the same shop. Finally allow shop staff or the customer who owns the order.',
        'Keep the order important in the check: permission for order 1 does not imply permission for order 2. Check every read and write endpoint. Hiding a button in the interface does not prevent a direct request.',
      ),
      section(
        'Keep credentials and input controlled',
        'Use a proven password hashing method with a salt and appropriate work factor. Store session tokens carefully, expire sessions, and invalidate them on logout. Production cookies need HTTPS, Secure, HttpOnly, and a considered SameSite policy.',
        'A cookie-based write also needs protection against cross-site requests. The service workspace uses a CSRF token for state-changing requests. Validate input and bind database parameters even after authentication: a signed-in user can still send bad data.',
      ),
      section(
        'Test denied cases explicitly',
        'Test a missing session, another customer in the same shop, a customer in another shop, and staff in another shop. A useful permission test proves the denied request cannot read or change the target record.',
        'Choose a consistent response policy, including whether unauthorized callers can learn that a record exists. Keep detailed reasons out of public errors. Record a safe denial event with a request id rather than a password or session token.',
      ),
    ],
    words: [
      { term: 'Authentication', meaning: 'Establishing who made a request.' },
      {
        term: 'Authorization',
        meaning: 'Deciding whether that person may perform a particular action.',
      },
      { term: 'Session', meaning: 'A server-verified sign-in record used across requests.' },
    ],
    example: example(
      'python',
      permit3 +
        '\nprint(can_read({"id": 7, "shop": "amina", "role": "customer"}, {"shop": "amina", "customer_id": 7}))',
      'True',
      [
        'A missing or mismatched shop is rejected first.',
        'Staff permission is scoped to the shop.',
        'A customer must own this particular order.',
      ],
    ),
    exercise: py(
      'An order permission rule',
      'Write can_read(user, order). Deny missing identity, require a non-empty matching shop, and then allow staff or the owning customer.',
      ['user', 'order'],
      'can_read(user, order)',
      'def can_read(user, order):\n    return True',
      [
        step(
          'Require an identity',
          'Return False for None and True for the supplied same-shop staff example.',
          'None means that authentication did not provide an identity.',
          permit1,
          ['anonymous', 'staff'],
        ),
        step(
          'Keep shops separate',
          'Require user.shop and order.shop to match.',
          'Compare shops before deciding whether a role grants permission.',
          permit2,
          ['cross'],
        ),
        step(
          'Check role or ownership',
          'Require a non-empty shop. In that shop allow staff, or a user whose id matches customer_id.',
          'Use the final two conditions only after the shop check passes.',
          permit3,
          ['owner', 'other', 'missing'],
        ),
      ],
      [
        check(
          'anonymous',
          'No session identity',
          [null, { shop: 'amina', customer_id: 7 }],
          false,
          'Anonymous callers are denied.',
        ),
        check(
          'staff',
          'Amina’s staff',
          [
            { id: 9, shop: 'amina', role: 'staff' },
            { shop: 'amina', customer_id: 7 },
          ],
          true,
          'Staff can support their own shop.',
        ),
        check(
          'cross',
          'Another shop’s staff',
          [
            { id: 9, shop: 'bilal', role: 'staff' },
            { shop: 'amina', customer_id: 7 },
          ],
          false,
          'The shop boundary comes before the role.',
        ),
        check(
          'owner',
          'The owning customer',
          [
            { id: 7, shop: 'amina', role: 'customer' },
            { shop: 'amina', customer_id: 7 },
          ],
          true,
          'Customers can read their own order.',
        ),
        check(
          'other',
          'Another customer in the same shop',
          [
            { id: 8, shop: 'amina', role: 'customer' },
            { shop: 'amina', customer_id: 7 },
          ],
          false,
          'Same shop alone is insufficient for a customer.',
        ),
        check(
          'missing',
          'Missing shop fields',
          [{ id: 7 }, { customer_id: 7 }],
          false,
          'Two missing values must not count as a valid shop match.',
        ),
      ],
    ),
    project: project(
      'A service with scoped access',
      'Run the service workspace with two shops and two customer accounts. Connect permission checks to every protected endpoint.',
      [
        'A session-based service.',
        'An access matrix for roles and operations.',
        'Cross-customer and cross-shop HTTP tests.',
      ],
      [
        [
          'Establish identity',
          [
            'Inspect the workspace password and session implementation.',
            'Sign in using a prepared local account.',
            'Verify that logout invalidates the session.',
          ],
        ],
        [
          'Enforce access',
          [
            'Obtain identity from the verified session.',
            'Apply a shop and record check on each endpoint.',
            'Prevent request fields from changing ownership.',
          ],
        ],
        [
          'Attempt denied requests',
          [
            'Use another customer session to request the record.',
            'Try another shop’s staff session.',
            'Verify denied writes leave the database unchanged.',
          ],
        ],
      ],
      [
        'Identity comes from a verified session.',
        'Customers see only their permitted records.',
        'Staff access stays within their shop.',
        'Cookie-based writes require the CSRF token.',
        'Logs omit passwords and session tokens.',
      ],
      [
        ['Another customer requests an order', 'Denied without exposing the order.'],
        ['Cross-shop staff requests it', 'Denied despite the staff role.'],
        ['Logout then repeat the request', 'The old session is rejected.'],
      ],
      'Add an expiry test with a controlled clock and document how production HTTPS and cookie settings differ from localhost.',
      [
        'Why is hiding a button insufficient?',
        'Where does trusted identity come from?',
        'Which test proves a denied write did nothing?',
      ],
    ),
    references: [
      reference(
        'OWASP authorization guidance',
        'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
      ),
      reference(
        'OWASP session guidance',
        'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html',
      ),
    ],
  },
  {
    day: 17,
    slug: 'connect-interface',
    title: 'Connect the page to the service',
    chapter: 'Services',
    concepts: ['Frontend/backend integration', 'Loading and failure recovery'],
    prerequisites: [12, 16],
    outcome: 'Show honest request states without losing a customer’s draft.',
    story:
      'A customer writes a message. The connection drops just after they press Send. The page should keep their words and explain what is known about the request.',
    demo: demo('Keep the customer informed', { state: 'editing', draft: 'Where is my order?' }, [
      [
        'Send the request',
        { state: 'sending', draft: 'kept' },
        'Disable duplicate submission while one request is pending.',
      ],
      [
        'The network fails',
        { state: 'retry available', draft: 'kept', saved: 'unknown' },
        'A connection failure does not prove the server did nothing. Keep the draft and explain the uncertainty.',
      ],
    ]),
    sections: [
      section(
        'Give each request a visible state',
        'Represent idle, sending, saved, validation error, sign-in required, and connection failure explicitly. The page should tell a person what happened and what they can do next.',
        'Use the same API contract on both sides. Send JSON, use the correct method and content type, and include the verified session and CSRF token as required. Parse and validate the response before treating it as a created message.',
      ),
      section(
        'Protect the draft',
        'Keep the text while a request is in progress and when it fails. Clear it only after a validated successful response. Disable the Send button while waiting so repeated clicks do not create two simultaneous requests.',
        'A failed network response may happen after the server stored the message. A retry may duplicate it. For important operations, use an idempotency key generated once for the attempted action and reused for a retry; the service should return the same outcome for that key.',
      ),
      section(
        'Connect real processes',
        'Run the frontend and backend from the workspace. The development frontend proxy forwards /api to the local service. For production, the build can be served from the same origin. That avoids guessing cross-origin cookie settings.',
        'The exercise uses prepared HTTP outcomes to teach the UI reducer. It does not make a real request. Your project must use fetch against the running service and inspect the network panel, including denied and invalid requests.',
      ),
      section(
        'Recover deliberately',
        'Show validation errors next to the form. Show a sign-in action for an expired session. Offer a retry after a temporary connection problem, retaining the draft and idempotency key.',
        'Cancel or ignore old responses when a component changes to another record. Test a slow request followed by a navigation. The most recent screen must not be overwritten by an older unrelated response.',
      ),
    ],
    words: [
      {
        term: 'Reducer',
        meaning: 'A function that calculates the next state from the current state and an event.',
      },
      {
        term: 'Idempotency key',
        meaning: 'A unique action identifier that lets a service recognize a repeated attempt.',
      },
      {
        term: 'Origin',
        meaning: 'The combination of scheme, host, and port used for a web address.',
      },
    ],
    example: example(
      'javascript',
      'function nextState(state, event) {\n  if (event === "send") return {...state, status: "sending"};\n  if (event === "saved") return {draft: "", status: "saved"};\n  return {...state, status: "retry"};\n}\nconsole.log(nextState({draft: "Hello", status: "sending"}, "network"));',
      '{"draft":"Hello","status":"retry"}',
      [
        'The spread keeps the existing draft.',
        'Only an acknowledged success clears text.',
        'A connection failure keeps a path to recovery.',
      ],
    ),
    exercise: {
      title: 'A request-state reducer',
      brief:
        'Write nextState(state, event). Return exactly draft and status. send enters sending; saved clears draft; invalid, unauthorized, and network preserve it and use invalid, signin, and retry. Ignore send while already sending and ignore unknown events.',
      language: 'javascript',
      parameters: ['state', 'event'],
      result: 'nextState(state, event)',
      starter: 'function nextState(state, event) { return state; }',
      steps: [
        step(
          'Begin and finish a request',
          'Handle send and saved. Keep text on send; clear it on saved.',
          'Create a new object instead of changing the supplied state.',
          'function nextState(state,event){if(event==="send")return {...state,status:"sending"};if(event==="saved")return {draft:"",status:"saved"};return state;}',
          ['send', 'saved'],
        ),
        step(
          'Keep drafts after failure',
          'Map invalid to invalid, unauthorized to signin, and network to retry. Preserve draft.',
          'Put the three event/status names in a small mapping.',
          'function nextState(state,event){if(event==="send")return {...state,status:"sending"};if(event==="saved")return {draft:"",status:"saved"};const failures={invalid:"invalid",unauthorized:"signin",network:"retry"};return failures[event]?{...state,status:failures[event]}:state;}',
          ['invalid', 'signin', 'network'],
        ),
        step(
          'Guard repeated or unknown events',
          'When state.status is sending, another send leaves state unchanged. Unknown events also leave it unchanged.',
          'Guard the duplicate before the ordinary send condition.',
          'function nextState(state,event){if(event==="send"&&state.status==="sending")return state;if(event==="send")return {...state,status:"sending"};if(event==="saved")return {draft:"",status:"saved"};const failures={invalid:"invalid",unauthorized:"signin",network:"retry"};return Object.hasOwn(failures,event)?{...state,status:failures[event]}:state;}',
          ['duplicate', 'unknown'],
        ),
      ],
      cases: [
        check(
          'send',
          'Submit a draft',
          [{ draft: 'Hello', status: 'idle' }, 'send'],
          { draft: 'Hello', status: 'sending' },
          'Sending does not discard the draft.',
        ),
        check(
          'saved',
          'A confirmed save',
          [{ draft: 'Hello', status: 'sending' }, 'saved'],
          { draft: '', status: 'saved' },
          'Clear only after success.',
        ),
        check(
          'invalid',
          'Validation rejected the message',
          [{ draft: 'Hello', status: 'sending' }, 'invalid'],
          { draft: 'Hello', status: 'invalid' },
          'The person needs their text to correct it.',
        ),
        check(
          'signin',
          'The session expired',
          [{ draft: 'Hello', status: 'sending' }, 'unauthorized'],
          { draft: 'Hello', status: 'signin' },
          'The draft survives authentication recovery.',
        ),
        check(
          'network',
          'Connection lost',
          [{ draft: 'Hello', status: 'sending' }, 'network'],
          { draft: 'Hello', status: 'retry' },
          'The outcome may be unknown; keep the draft.',
        ),
        check(
          'duplicate',
          'A repeated submit',
          [{ draft: 'Hello', status: 'sending' }, 'send'],
          { draft: 'Hello', status: 'sending' },
          'The state model rejects a duplicate pending action.',
        ),
        check(
          'unknown',
          'An unrelated event',
          [{ draft: 'Hello', status: 'idle' }, 'other'],
          { draft: 'Hello', status: 'idle' },
          'Unknown events must not accidentally clear data.',
        ),
      ],
    },
    project: project(
      'A connected message form',
      'Connect the React form to the real service workspace. Demonstrate each request state using HTTP responses and a stopped service.',
      [
        'A frontend using the real API.',
        'Visible loading, success, and failure states.',
        'A duplicate/retry and draft-preservation report.',
      ],
      [
        [
          'Make one real request',
          [
            'Start both processes using the README.',
            'Sign in and obtain the CSRF token.',
            'Submit text and retrieve the saved record.',
          ],
        ],
        [
          'Represent failure',
          [
            'Keep the draft during requests.',
            'Show validation and sign-in actions.',
            'Stop the service and inspect the connection-failure state.',
          ],
        ],
        [
          'Make retry reliable',
          [
            'Reuse one idempotency key for a retry.',
            'Prevent a second in-flight submission.',
            'Test that stale responses cannot overwrite a new screen.',
          ],
        ],
      ],
      [
        'The form calls the running backend.',
        'Response JSON is validated.',
        'Only confirmed success clears the draft.',
        'Duplicate and retry behaviour is documented and tested.',
        'A keyboard user can understand and recover from an error.',
      ],
      [
        ['Stop the backend then submit', 'Draft remains with a recovery action.'],
        ['Repeat the same idempotency key', 'Only one record is created.'],
        ['Expired session', 'Sign-in is requested without losing text.'],
      ],
      'Add cancellation when switching between orders and reproduce a slow, stale response.',
      [
        'Which states does the person need to see?',
        'Why can a network error have an unknown outcome?',
        'Where is duplicate protection enforced beyond the button?',
      ],
    ),
    references: [
      reference(
        'MDN Fetch API',
        'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
      ),
    ],
  },
  {
    day: 18,
    slug: 'release-service',
    title: 'Test and release the whole service',
    chapter: 'Services',
    concepts: ['Integration tests', 'Deployment and recovery'],
    prerequisites: [17],
    outcome: 'Run a release rehearsal with real requests and a tested rollback.',
    story:
      'Amina will depend on your system tomorrow morning. Before making it available, prove that its important paths work and that you can recover a failed release.',
    demo: demo(
      'Check a release in order',
      { tests: 'pass', migration: 'untested', decision: 'stop' },
      [
        [
          'Test the database migration',
          { migration: 'pass', config: 'verified', decision: 'check health' },
          'A green code test is only one part of a release.',
        ],
        [
          'Rehearse rollback',
          { health: 'pass', rollback: 'verified', decision: 'ready for review' },
          'A release needs a working recovery path as well as a happy path.',
        ],
      ],
    ),
    sections: [
      section(
        'Choose tests for the boundaries',
        'A unit test checks a small rule such as quote. An integration test checks connected parts such as an endpoint, session, and database. A browser test checks what a person can do in the interface.',
        'Use a few meaningful flows: sign in, create a message, retrieve it, deny another customer, and preserve a failed draft. Test both status and stored data. A mocked repository test alone cannot prove that the SQL and endpoint are connected correctly.',
      ),
      section(
        'Separate environments',
        'Use disposable data for tests and local practice. Put environment-specific configuration in server variables. Keep real credentials out of the frontend bundle and repository.',
        'Pin dependency versions and record the runtime version. Build the frontend from a clean checkout. A deployment package should be repeatable, so a teammate can reproduce what was released instead of relying on files left on your machine.',
      ),
      section(
        'Release with a checklist you can prove',
        'Before deployment, run tests, rehearse migrations on a copy, verify required configuration, and check the service health endpoint. Health should communicate whether the service is ready to accept work, including the database dependency.',
        'A green status is evidence only if the underlying check actually ran. The browser exercise plans a gate; it does not deploy. The project records command outputs, an HTTP smoke test, and a database reopen check.',
      ),
      section(
        'Practice rollback before an incident',
        'Keep the previously working application version and a verified database backup. Document whether a migration is reversible; rolling back code alone may not undo a changed schema.',
        'Rehearse recovery locally with a deliberate failing version. Restore the intended version and data, then repeat the main smoke flow. Do not declare recovery because a process starts: prove that a customer can complete the operation.',
      ),
    ],
    words: [
      { term: 'Integration test', meaning: 'A test of multiple connected parts working together.' },
      {
        term: 'Smoke test',
        meaning: 'A small check that the most important released behaviour works.',
      },
      {
        term: 'Rollback',
        meaning: 'Returning to a verified earlier version after a failed change.',
      },
    ],
    example: example(
      'python',
      gate3 +
        '\nprint(release({"tests": True, "migration": True, "config": True, "health": True, "rollback": False}))',
      'stop:rollback',
      [
        'The checks have a deliberate order.',
        'The first failed or missing check stops the gate.',
        'Ready is returned only when every required check has evidence.',
      ],
    ),
    exercise: py(
      'A release decision',
      'Write release(checks). Check tests, migration, config, health, rollback in that order. Missing or false values stop with stop:name; all true returns ready.',
      ['checks'],
      'release(checks)',
      'def release(checks):\n    return "ready"',
      [
        step(
          'Require passing tests',
          'Stop with stop:tests when tests is false or missing.',
          'Use checks.get("tests") so a missing result also stops.',
          gate1,
          ['tests', 'ready'],
        ),
        step(
          'Verify data and configuration',
          'After tests, require migration and config in that order.',
          'A loop can avoid repeating the same condition.',
          gate2,
          ['migration', 'config'],
        ),
        step(
          'Verify operation and recovery',
          'Finally require health and rollback. Fail closed on missing evidence.',
          'Extend the ordered list; do not use a default of True.',
          gate3,
          ['health', 'rollback', 'missing'],
        ),
      ],
      [
        check(
          'tests',
          'Tests failed',
          [{ ...allGreen, tests: false }],
          'stop:tests',
          'Broken behaviour cannot pass the gate.',
        ),
        check(
          'ready',
          'Every check verified',
          [allGreen],
          'ready',
          'A complete set of evidence permits review.',
        ),
        check(
          'migration',
          'Migration unverified',
          [{ ...allGreen, migration: false }],
          'stop:migration',
          'Stored data needs its own check.',
        ),
        check(
          'config',
          'Configuration missing',
          [{ ...allGreen, config: false }],
          'stop:config',
          'A build may fail with wrong deployment settings.',
        ),
        check(
          'health',
          'Service is unhealthy',
          [{ ...allGreen, health: false }],
          'stop:health',
          'A running process is not always ready.',
        ),
        check(
          'rollback',
          'Recovery not rehearsed',
          [{ ...allGreen, rollback: false }],
          'stop:rollback',
          'Recovery needs evidence before release.',
        ),
        check(
          'missing',
          'No check evidence',
          [{}],
          'stop:tests',
          'Missing information is not success.',
        ),
      ],
    ),
    project: project(
      'A full-stack release rehearsal',
      'Release the local shop workspace from a clean checkout. Use the included Docker option or documented local commands, and rehearse a failure and recovery.',
      [
        'Integration and browser test evidence.',
        'A release and configuration checklist.',
        'A rollback rehearsal with a smoke-test result.',
      ],
      [
        [
          'Run connected tests',
          [
            'Use a disposable database.',
            'Test sign-in, create, list, and denied access.',
            'Exercise the connected frontend in a browser.',
          ],
        ],
        [
          'Build a reproducible release',
          [
            'Install from pinned dependencies.',
            'Build the frontend and start the service.',
            'Check health and a real create-message request.',
          ],
        ],
        [
          'Recover a deliberate failure',
          [
            'Record the last working version.',
            'Back up and verify data.',
            'Introduce a harmless local failure, restore, and repeat the smoke test.',
          ],
        ],
      ],
      [
        'The build starts from documented commands.',
        'Tests exercise real endpoint/database boundaries.',
        'Health reflects the database dependency.',
        'No private configuration enters the frontend bundle.',
        'The rollback restores a usable service and intended data.',
      ],
      [
        ['Clean checkout', 'Build and main flow succeed.'],
        ['Database unavailable', 'Health or requests report failure accurately.'],
        ['Rollback rehearsal', 'The verified version serves the main flow again.'],
      ],
      'Add a CI job that runs these checks and retains a safe failure report. Document which checks still require a human rehearsal.',
      [
        'Which boundary did each test cover?',
        'What did your health check actually prove?',
        'What would code rollback leave unchanged in the database?',
      ],
    ),
    references: [
      reference('FastAPI testing', 'https://fastapi.tiangolo.com/tutorial/testing/'),
      reference('FastAPI deployment', 'https://fastapi.tiangolo.com/deployment/'),
    ],
  },
];
