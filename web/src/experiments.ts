// Small, deterministic teaching models. No provider, server, Git command or deployment is run.
// Keep the controls and their saved-state validation together, so backups cannot add inputs.
export type ExperimentValues = Record<string, string>;
export type ExperimentField = {
  key: string;
  label: string;
  type: 'range' | 'text' | 'select';
  initial: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: [string, string][];
};
export type ExperimentResult = {
  label: string;
  value: string;
  tone?: 'good' | 'careful';
  explanation: string;
  rule: string;
  rows: [string, string][];
  found: boolean;
  visual?:
    | { kind: 'meter'; current: number; max: number; label: string }
    | { kind: 'map'; point: number }
    | { kind: 'items'; count: number; label: string };
};
export type Experiment = {
  day: number;
  title: string;
  intro: string;
  tryThis: string;
  discovery: string;
  scope: string;
  fields: ExperimentField[];
  // An example of a successful exploration, also used to exercise all 30 browser activities.
  target: ExperimentValues;
  result: (values: ExperimentValues) => ExperimentResult;
};
const range = (
  key: string,
  label: string,
  initial: number,
  min: number,
  max: number,
  unit = '',
  step = 1,
): ExperimentField => ({
  key,
  label,
  type: 'range',
  initial: String(initial),
  min,
  max,
  step,
  unit,
});
const text = (key: string, label: string, initial: string): ExperimentField => ({
  key,
  label,
  type: 'text',
  initial,
});
const choose = (
  key: string,
  label: string,
  initial: string,
  options: [string, string][],
): ExperimentField => ({ key, label, type: 'select', initial, options });
const yesNo: [string, string][] = [
  ['no', 'No'],
  ['yes', 'Yes'],
];
const n = (v: ExperimentValues, key: string) => Number(v[key]);
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const result = (
  label: string,
  value: string,
  explanation: string,
  rule: string,
  rows: [string, string][],
  found: boolean,
  tone?: 'good' | 'careful',
  visual?: ExperimentResult['visual'],
): ExperimentResult => ({ label, value, explanation, rule, rows, found, tone, visual });

export const experiments: Experiment[] = [
  {
    day: 1,
    title: 'Make the program say your name',
    intro: 'A program uses the values you give it. These two controls are its inputs.',
    tryThis: 'Change the study time to 30 minutes. Watch the message change.',
    discovery: 'You changed one value, and the program used the new value in its message.',
    scope: 'A live message generator in your browser.',
    fields: [
      text('name', 'Learner name', 'Amina'),
      range('minutes', 'Study time', 10, 10, 120, 'min', 10),
    ],
    target: { minutes: '30' },
    result: (v) =>
      result(
        'Your program says',
        `Hi ${v.name.trim() || 'learner'}! Let’s learn for ${v.minutes} minutes.`,
        'The name is text. The study time is a number. Changing one does not overwrite the other.',
        'read the name → read the study time → display both in a greeting',
        [
          ['Name', v.name.trim() || 'learner'],
          ['Minutes', v.minutes],
        ],
        n(v, 'minutes') === 30,
      ),
  },
  {
    day: 2,
    title: 'Can text become a number?',
    intro: 'Input starts as text. A converter must understand it before doing maths.',
    tryThis: 'Replace 2 with hello. Then try 3.5. See why checking input matters.',
    discovery: '3.5 is valid number text. A word needs a helpful error instead of a crash.',
    scope: 'A live hours-to-minutes converter.',
    fields: [text('hours', 'Hours to convert', '2')],
    target: { hours: '3.5' },
    result: (v) => {
      const hours = Number(v.hours);
      const valid = v.hours.trim() !== '' && Number.isFinite(hours) && hours >= 0 && hours <= 168;
      return result(
        'Converter result',
        valid ? `${Math.round(hours * 60 * 100) / 100} minutes` : 'Enter a number from 0 to 168',
        valid
          ? `${v.hours} hours × 60 gives the number of minutes.`
          : 'This input cannot be used as a safe number of hours. The program stops before the calculation.',
        'check input → convert to number → hours × 60',
        [
          ['Input type', 'Text'],
          ['Number accepted?', valid ? 'Yes' : 'No'],
        ],
        valid && hours === 3.5,
        valid ? 'good' : 'careful',
      );
    },
  },
  {
    day: 3,
    title: 'Turn a ticket urgent',
    intro: 'A rule helps a support team decide which ticket to handle first.',
    tryThis:
      'Move the waiting time from 23 to 24 hours. Watch the exact point where the rule changes.',
    discovery: '“24 or more” includes 24. Testing the boundary catches an easy mistake.',
    scope: 'A local ticket-priority rule.',
    fields: [
      range('hours', 'Waiting time', 23, 0, 48, 'hours'),
      choose('outage', 'Is the whole shop offline?', 'no', yesNo),
    ],
    target: { hours: '24' },
    result: (v) => {
      const urgent = n(v, 'hours') >= 24 || v.outage === 'yes';
      return result(
        'Ticket queue',
        urgent ? 'Urgent queue' : 'Normal queue',
        urgent
          ? 'At least one urgent condition is true. The ticket moves forward.'
          : 'Neither urgent condition is true yet. Increase the wait by one hour.',
        'urgent = shop offline OR waiting hours ≥ 24',
        [
          ['Waiting', `${v.hours} hours`],
          ['Shop offline', v.outage === 'yes' ? 'Yes' : 'No'],
        ],
        n(v, 'hours') === 24 && v.outage === 'no',
        urgent ? 'careful' : undefined,
      );
    },
  },
  {
    day: 4,
    title: 'Build a tiny quote calculator',
    intro: 'A function takes inputs and returns an answer. Try pricing notebooks for Amina.',
    tryThis: 'Set the quantity to 3 and the price to 250 cents. Can you make a $7.50 quote?',
    discovery: 'The same calculation works with new inputs. That is why we put it in a function.',
    scope: 'A live calculator. Money is calculated in whole cents.',
    fields: [
      range('quantity', 'Notebook quantity', 2, 0, 10),
      range('price', 'Price per notebook', 200, 50, 500, 'cents', 50),
    ],
    target: { quantity: '3', price: '250' },
    result: (v) =>
      result(
        'Quote total',
        dollars(n(v, 'quantity') * n(v, 'price')),
        'Every notebook uses the same price. Multiplication gives the total; zero notebooks costs zero.',
        'quote(quantity, price) = quantity × price',
        [
          ['Quantity', v.quantity],
          ['Each', dollars(n(v, 'price'))],
        ],
        n(v, 'quantity') * n(v, 'price') === 750,
        undefined,
        { kind: 'items', count: n(v, 'quantity'), label: 'Notebooks in the quote' },
      ),
  },
  {
    day: 5,
    title: 'Find the right Amina',
    intro: 'Two contacts can share a name. Give each record a unique ID.',
    tryThis: 'Look up ID C03. It belongs to another Amina, with a different email.',
    discovery: 'An ID chooses one exact record. A shared name cannot do that safely.',
    scope: 'A lookup against three example contact records.',
    fields: [text('id', 'Contact ID', 'C01')],
    target: { id: 'C03' },
    result: (v) => {
      const contacts: Record<string, [string, string]> = {
        C01: ['Amina', 'amina@shop.example'],
        C02: ['Bilal', 'bilal@shop.example'],
        C03: ['Amina', 'amina@studio.example'],
      };
      const id = v.id.trim().toUpperCase();
      const match = contacts[id];
      return result(
        'Directory result',
        match ? match[1] : 'No contact with that ID',
        match
          ? `Found ${match[0]} using ${id}. Try C01, C02 or C03 to visit another record.`
          : 'An unknown ID returns “not found”. It must not silently return somebody else.',
        'find the contact whose ID equals your input',
        [
          ['C01', 'Amina · shop'],
          ['C02', 'Bilal · shop'],
          ['C03', 'Amina · studio'],
        ],
        id === 'C03',
        match ? undefined : 'careful',
      );
    },
  },
  {
    day: 6,
    title: 'What survives a restart?',
    intro:
      'Amina has 12 tickets on screen. Decide where the app keeps them, then preview a restart.',
    tryThis:
      'Preview “After restart”, then change the storage to “Saved file”. Bring the 12 tickets back.',
    discovery: 'A variable lasts for one run. Saved data can be loaded in the next run.',
    scope: 'A restart model. It does not write a real file; you build that in today’s project.',
    fields: [
      choose('storage', 'Keep the tickets in', 'memory', [
        ['memory', 'Memory only'],
        ['file', 'Saved file'],
      ]),
      choose('moment', 'View the app', 'before', [
        ['before', 'Before restart'],
        ['after', 'After restart'],
      ]),
    ],
    target: { storage: 'file', moment: 'after' },
    result: (v) => {
      const kept = v.moment === 'before' || v.storage === 'file';
      return result(
        'Tickets on screen',
        kept ? '12 tickets' : '0 tickets',
        kept
          ? v.moment === 'before'
            ? 'The current run still has its variable.'
            : 'The new run loads the 12 tickets from the saved file.'
          : 'Memory was cleared when the app stopped. There is no saved file to load.',
        'save → close app → start app → load saved data',
        [
          ['Memory after restart', 'Empty'],
          ['Saved file', v.storage === 'file' ? '12 tickets' : 'Not created'],
        ],
        v.moment === 'after' && v.storage === 'file',
        kept ? undefined : 'careful',
        { kind: 'items', count: kept ? 12 : 0, label: 'Tickets on screen' },
      );
    },
  },
  {
    day: 7,
    title: 'Give a tiny CLI a command',
    intro:
      'A command-line tool reads a command and does the matching job. Our example list has one $5 expense.',
    tryThis: 'Choose “add” and add 250 cents. Watch the list and total change together.',
    discovery:
      'One command adds one record. A list command reads the records without adding another.',
    scope: 'A single-command preview with one starting expense. No terminal is opened.',
    fields: [
      choose('command', 'Command', 'list', [
        ['list', 'list'],
        ['add', 'add'],
      ]),
      range('amount', 'New expense amount', 100, 0, 1000, 'cents', 50),
    ],
    target: { command: 'add', amount: '250' },
    result: (v) => {
      const added = v.command === 'add';
      return result(
        'Expense total',
        dollars(500 + (added ? n(v, 'amount') : 0)),
        added
          ? 'The add command appends your expense. The total includes both records.'
          : 'The list command shows the original expense. The amount input is only used by add.',
        `expenses ${v.command}${added ? ` --amount ${v.amount}` : ''}`,
        [
          ['Existing expense', '$5.00'],
          ['New expense', added ? dollars(n(v, 'amount')) : 'Not added'],
          ['Record count', added ? '2' : '1'],
        ],
        added && n(v, 'amount') === 250,
      );
    },
  },
  {
    day: 8,
    title: 'What would Git commit?',
    intro:
      'A commit records the staged version. A later edit stays outside that snapshot until you stage it too.',
    tryThis:
      'Edit the working file to “Validated input”. Then stage the same version to include the fix.',
    discovery: 'Editing a file and staging it are different steps. A commit uses the staging area.',
    scope: 'A Git snapshot model. Your real repository is not changed.',
    fields: [
      choose('working', 'Working file', 'old', [
        ['old', 'Basic input'],
        ['new', 'Validated input'],
      ]),
      choose('staged', 'Staged snapshot', 'old', [
        ['old', 'Basic input'],
        ['new', 'Validated input'],
      ]),
    ],
    target: { working: 'new', staged: 'new' },
    result: (v) =>
      result(
        'Next commit contains',
        v.staged === 'new' ? 'Validated input' : 'Basic input',
        v.working === v.staged
          ? 'Working and staged versions match. The current edit is included in the next commit.'
          : 'The working file and staging area differ. Committing now would record the staged version, not your current edit.',
        'working file → git add → staged snapshot → git commit',
        [
          ['Working file', v.working === 'new' ? 'Validated input' : 'Basic input'],
          ['Staging area', v.staged === 'new' ? 'Validated input' : 'Basic input'],
        ],
        v.working === 'new' && v.staged === 'new',
        v.working === v.staged ? undefined : 'careful',
      ),
  },
  {
    day: 9,
    title: 'When an API does not cooperate',
    intro:
      'A weather service can send good data, a missing field, or an error. Your app needs a response for each.',
    tryThis: 'Choose “Missing temperature”. Can the app safely show a temperature?',
    discovery: 'A successful HTTP status does not guarantee the fields your app needs are present.',
    scope: 'Saved response fixtures. This does not call a weather service.',
    fields: [
      choose('response', 'Weather API response', 'ok', [
        ['ok', '200 · good data'],
        ['missing', '200 · missing temperature'],
        ['offline', '503 · unavailable'],
      ]),
    ],
    target: { response: 'missing' },
    result: (v) => {
      const ok = v.response === 'ok';
      return result(
        'What the app shows',
        ok
          ? 'Lahore · 28°C'
          : v.response === 'missing'
            ? 'Temperature is missing. Try again later.'
            : 'Weather service is unavailable.',
        ok
          ? 'The status and required field both passed the checks.'
          : 'The app gives a helpful message rather than inventing a temperature.',
        'check HTTP status → check required fields → use data',
        [
          ['HTTP status', v.response === 'offline' ? '503' : '200'],
          ['temperature_c', ok ? '28' : 'Not available'],
        ],
        v.response === 'missing',
        ok ? 'good' : 'careful',
      );
    },
  },
  {
    day: 10,
    title: 'Help a teammate run the app',
    intro:
      'The app imports a package called requests. A teammate’s clean environment does not have it yet.',
    tryThis: 'Add requests to the dependency list. Then install the listed packages.',
    discovery:
      'A dependency must be declared and installed. Your own working computer is not enough.',
    scope: 'A clean-environment model. No packages are installed on your computer.',
    fields: [
      choose('declared', 'Is requests listed?', 'no', yesNo),
      choose('installed', 'Install listed packages?', 'no', yesNo),
    ],
    target: { declared: 'yes', installed: 'yes' },
    result: (v) => {
      const ready = v.declared === 'yes' && v.installed === 'yes';
      return result(
        'Teammate’s first run',
        ready ? 'App starts' : 'ModuleNotFoundError: requests',
        ready
          ? 'The fresh environment now has the package the app imports.'
          : v.declared === 'no'
            ? 'Installing from the list cannot install a package that is absent from that list.'
            : 'The package is documented, but has not been installed in this environment yet.',
        'requirements.txt → pip install -r requirements.txt → run app',
        [
          ['Dependency list', v.declared === 'yes' ? 'requests' : 'Empty'],
          ['Fresh environment', ready ? 'requests installed' : 'requests missing'],
        ],
        ready,
        ready ? 'good' : 'careful',
      );
    },
  },
  {
    day: 11,
    title: 'Give a ticket a safe action',
    intro:
      'An object keeps data and the actions that can change that data together. This ticket starts open.',
    tryThis: 'Choose “Close twice”. The second close should not count as another resolved ticket.',
    discovery: 'A method checks the current state before changing it. Repeating close can be safe.',
    scope: 'A ticket-object state model starting with one open ticket.',
    fields: [
      choose('action', 'Ticket action', 'none', [
        ['none', 'Leave open'],
        ['once', 'Close once'],
        ['twice', 'Close twice'],
      ]),
    ],
    target: { action: 'twice' },
    result: (v) =>
      result(
        'Ticket status',
        v.action === 'none' ? 'Open' : 'Closed',
        v.action === 'twice'
          ? 'The first call closes the ticket. The second sees it is already closed and does nothing.'
          : v.action === 'once'
            ? 'The close method changes the status once.'
            : 'No method has changed the ticket yet.',
        'close(): if status is open, set status to closed',
        [
          ['Close attempts', v.action === 'twice' ? '2' : v.action === 'once' ? '1' : '0'],
          ['Actual status changes', v.action === 'none' ? '0' : '1'],
        ],
        v.action === 'twice',
      ),
  },
  {
    day: 12,
    title: 'Catch a sneaky bug',
    intro:
      'This price function should add a 200-cent delivery fee, including when the basket is empty.',
    tryThis: 'Switch from the buggy rule to the fixed rule. Watch the zero-basket test.',
    discovery:
      'A normal basket can pass while an edge case fails. A regression test keeps the fix checked.',
    scope: 'Three real browser calculations with fixed expected answers.',
    fields: [
      choose('rule', 'Price function', 'buggy', [
        ['buggy', 'Buggy rule'],
        ['fixed', 'Fixed rule'],
      ]),
    ],
    target: { rule: 'fixed' },
    result: (v) => {
      const totals = [0, 500, 1000];
      const actual = totals.map((basket) =>
        v.rule === 'buggy' && basket === 0 ? 0 : basket + 200,
      );
      const passed = actual.filter((amount, i) => amount === totals[i] + 200).length;
      return result(
        'Tests passing',
        `${passed} / 3`,
        passed === 3
          ? 'The empty-basket case now includes delivery, just like the other baskets.'
          : 'The zero-basket branch skips delivery. Two green tests do not make that branch correct.',
        v.rule === 'buggy'
          ? 'if basket == 0: return 0\nreturn basket + 200'
          : 'return basket + 200',
        totals.map((basket, i) => [
          `Basket ${dollars(basket)}`,
          `${actual[i] === basket + 200 ? 'PASS' : 'FAIL'} · got ${dollars(actual[i])}, expected ${dollars(basket + 200)}`,
        ]),
        passed === 3,
        passed === 3 ? 'good' : 'careful',
      );
    },
  },
  {
    day: 13,
    title: 'Make a form feel helpful',
    intro: 'Amina is entering an expense. Watch the interface react to what she types.',
    tryThis: 'Clear the amount, try -2, then enter 12.50. See when Save becomes available.',
    discovery: 'The interface can explain invalid input before a user submits the form.',
    scope: 'A live form preview. Saving here does not create a real expense.',
    fields: [text('amount', 'Expense amount in dollars', '')],
    target: { amount: '12.50' },
    result: (v) => {
      const amount = Number(v.amount);
      const valid = /^\d+(\.\d{1,2})?$/.test(v.amount.trim()) && amount > 0 && amount <= 10000;
      return result(
        'Expense form',
        valid ? 'Ready to save' : 'Save is disabled',
        valid
          ? `A positive amount with at most two decimal places is valid: ${dollars(Math.round(amount * 100))}.`
          : 'Enter an amount above 0 with at most two decimal places, up to $10,000.',
        'valid amount → enable Save; invalid amount → show a useful hint',
        [
          ['Form amount', v.amount.trim() || '(empty)'],
          ['Save button', valid ? 'Enabled' : 'Disabled'],
        ],
        valid && amount === 12.5,
        valid ? 'good' : 'careful',
      );
    },
  },
  {
    day: 14,
    title: 'Fix a broken deployed asset',
    intro: 'The site is hosted under /academy/. Its image lives inside that folder too.',
    tryThis:
      'Change the image path from /logo.svg to ./logo.svg. See which URL the browser requests.',
    discovery:
      'A leading slash starts at the domain root. A relative path follows the page’s folder.',
    scope: 'Real URL resolution against an example site; no deployment or network request.',
    fields: [
      choose('asset', 'Image path in the page', '/logo.svg', [
        ['/logo.svg', '/logo.svg'],
        ['./logo.svg', './logo.svg'],
      ]),
    ],
    target: { asset: './logo.svg' },
    result: (v) => {
      const url = new URL(v.asset, 'https://demo.example/academy/').href;
      const works = url === 'https://demo.example/academy/logo.svg';
      return result(
        'Asset preview',
        works ? 'Image found' : '404 · wrong folder',
        works
          ? 'The resolved URL matches the file’s published location.'
          : 'The browser asked for the root folder, but this file was published inside /academy/.',
        'page URL + asset path → requested URL',
        [
          ['Requested URL', url],
          ['File location', 'https://demo.example/academy/logo.svg'],
        ],
        works,
        works ? 'good' : 'careful',
      );
    },
  },
  {
    day: 15,
    title: 'Keep an AI run inside its budget',
    intro:
      'Our pretend model costs 1 credit per input token and 2 per output token. The run budget is 1,000 credits.',
    tryThis:
      'Keep input at 400. Move the output limit above 300 tokens, then bring it back to 300.',
    discovery:
      'With 400 input tokens, an output limit of 300 uses all 1,000 credits. Longer replies need a bigger budget.',
    scope: 'Illustrative tokens and fictional credits, not current provider prices or an AI call.',
    fields: [
      range('input', 'Input tokens', 400, 100, 800, 'tokens', 100),
      range('output', 'Maximum output', 100, 50, 600, 'tokens', 50),
    ],
    target: { output: '300' },
    result: (v) => {
      const cost = n(v, 'input') + n(v, 'output') * 2;
      return result(
        'Maximum run cost',
        `${cost} / 1,000 credits`,
        cost <= 1000
          ? 'The estimated maximum fits the budget. This is a cost cap, not a promise that the answer will be good.'
          : 'This request could exceed the budget. Lower the output limit or input size before running it.',
        'maximum cost = input tokens × 1 + output limit × 2',
        [
          ['Input cost', `${v.input} credits`],
          ['Output cost cap', `${n(v, 'output') * 2} credits`],
          ['Decision', cost <= 1000 ? 'Within budget' : 'Over budget'],
        ],
        n(v, 'input') === 400 && n(v, 'output') === 300,
        cost <= 1000 ? 'good' : 'careful',
        { kind: 'meter', current: cost, max: 1000, label: 'Run budget' },
      );
    },
  },
  {
    day: 16,
    title: 'Make a model reply usable',
    intro: 'A ticket classifier must return JSON with one of two labels: billing or technical.',
    tryThis: 'Try an unknown label, then the valid JSON reply. Watch the contract check.',
    discovery: 'Valid JSON alone is not enough. The label must also belong to the allowed set.',
    scope: 'Saved model replies and a real JSON/schema check. No live model is called.',
    fields: [
      choose('reply', 'Example model reply', 'prose', [
        ['prose', 'A sentence'],
        ['unknown', 'JSON · unknown label'],
        ['valid', 'JSON · allowed label'],
      ]),
    ],
    target: { reply: 'valid' },
    result: (v) => {
      const raw =
        v.reply === 'prose'
          ? 'This seems like a billing issue.'
          : v.reply === 'unknown'
            ? '{"label":"urgent"}'
            : '{"label":"billing"}';
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        /* The failed parse is the learning outcome. */
      }
      const label =
        parsed && typeof parsed === 'object' && 'label' in parsed ? parsed.label : undefined;
      const valid = label === 'billing' || label === 'technical';
      return result(
        'Classifier contract',
        valid ? 'Accepted · billing' : 'Rejected · ask for a valid reply',
        valid
          ? 'The reply is JSON, and billing is in the allowed label set. This check does not prove the classification is correct.'
          : parsed
            ? 'The JSON parses, but urgent is not an allowed category.'
            : 'A human can read the sentence, but the JSON parser cannot use it as this contract.',
        'parse JSON → check label ∈ {billing, technical}',
        [
          ['Raw reply', raw],
          ['Allowed labels', 'billing, technical'],
        ],
        valid,
        valid ? 'good' : 'careful',
      );
    },
  },
  {
    day: 17,
    title: 'Give an agent one safe tool',
    intro:
      'The assistant may look up stock. It may not delete stock. Arguments must name a known item.',
    tryThis: 'Try delete_stock. Then use lookup_stock with SKU MUG.',
    discovery: 'Tool names and arguments both need checks. A model’s request is not permission.',
    scope: 'A local allowlist dispatcher with two sample stock records; no external actions.',
    fields: [
      choose('tool', 'Requested tool', 'lookup_stock', [
        ['lookup_stock', 'lookup_stock'],
        ['delete_stock', 'delete_stock'],
      ]),
      text('sku', 'Item SKU', 'UNKNOWN'),
    ],
    target: { tool: 'lookup_stock', sku: 'MUG' },
    result: (v) => {
      const sku = v.sku.trim().toUpperCase();
      const stock: Record<string, number> = { MUG: 8, PEN: 20 };
      const allowed = v.tool === 'lookup_stock';
      const known = Object.hasOwn(stock, sku);
      return result(
        'Tool result',
        !allowed
          ? 'Blocked · tool not allowed'
          : !known
            ? 'Unknown item · try MUG or PEN'
            : `${sku}: ${stock[sku]} in stock`,
        !allowed
          ? 'The dispatcher stops the call before touching any record.'
          : !known
            ? 'The tool is allowed, but its argument does not match a record.'
            : 'Both checks passed. The tool returns the matching stock value.',
        'allowlisted tool → validate SKU → read stock',
        [
          ['Tool permission', allowed ? 'Allowed' : 'Blocked'],
          ['Known SKU', known ? 'Yes' : 'No'],
        ],
        allowed && sku === 'MUG',
        allowed && known ? 'good' : 'careful',
      );
    },
  },
  {
    day: 18,
    title: 'Move a search closer to its meaning',
    intro:
      'Imagine a tiny map: refunds is at 0, opening hours at 5, and delivery at 10. Closer points rank first.',
    tryThis: 'Move the query from 0 to 9. Which document becomes closest?',
    discovery:
      'Changing the query changes the nearest result. Real embeddings use many dimensions, not this one-number map.',
    scope:
      'A one-dimensional distance toy, not real embeddings or a quality claim about semantic search.',
    fields: [range('query', 'Query position on the meaning map', 0, 0, 10)],
    target: { query: '9' },
    result: (v) => {
      const docs: [string, number][] = [
        ['Refund policy', 0],
        ['Opening hours', 5],
        ['Delivery guide', 10],
      ];
      const ranked = docs
        .map(([label, point]) => ({ label, distance: Math.abs(point - n(v, 'query')) }))
        .sort((a, b) => a.distance - b.distance);
      return result(
        'Nearest document',
        ranked[0].label,
        'Distance is the gap between the query and each document. Smaller gaps rank higher. A tie keeps the original order.',
        'distance = absolute value(document position − query position)',
        ranked.map((item) => [item.label, `Distance ${item.distance}`]),
        n(v, 'query') === 9,
        undefined,
        { kind: 'map', point: n(v, 'query') },
      );
    },
  },
  {
    day: 19,
    title: 'Answer only what the source supports',
    intro:
      'The shop policy says: “Unused items may be returned within 14 days.” It says nothing about delivery time.',
    tryThis: 'Ask about delivery. Then ask about returns. Compare the evidence and answer.',
    discovery:
      'A grounded assistant can answer the supported question and admit when its source is missing.',
    scope: 'Two authored answer paths from one fixed document. No AI generation or real retrieval.',
    fields: [
      choose('question', 'Customer question', 'delivery', [
        ['delivery', 'When will delivery arrive?'],
        ['returns', 'How long do I have to return an item?'],
      ]),
    ],
    target: { question: 'returns' },
    result: (v) =>
      result(
        'Grounded reply',
        v.question === 'returns'
          ? 'Return unused items within 14 days. [policy-1]'
          : 'I do not have delivery information. Ask the shop team.',
        v.question === 'returns'
          ? 'The reply stays inside the source and points back to it.'
          : 'A fluent guess would still be a guess. Missing evidence should stay visible.',
        'supporting source exists → answer + citation; otherwise → say what is missing',
        [
          ['Source policy-1', 'Unused items may be returned within 14 days.'],
          ['Supporting evidence', v.question === 'returns' ? 'Found' : 'Missing'],
        ],
        v.question === 'returns',
        v.question === 'returns' ? 'good' : 'careful',
      ),
  },
  {
    day: 20,
    title: 'Stop a workflow from running forever',
    intro:
      'This research task needs three steps: search, read, then draft. A step limit keeps it bounded.',
    tryThis:
      'Set the step limit to 2, then 3. Notice the difference between stopping safely and finishing.',
    discovery:
      'A step budget prevents endless work. Reaching the cap is a stop reason, not a successful answer.',
    scope: 'A fixed three-step workflow model. No research tools are called.',
    fields: [range('limit', 'Maximum steps', 1, 1, 5, 'steps')],
    target: { limit: '3' },
    result: (v) => {
      const steps = ['Search sources', 'Read evidence', 'Draft reply'];
      const complete = n(v, 'limit') >= 3;
      return result(
        'Workflow state',
        complete ? 'Finished in 3 steps' : `Stopped at step limit ${v.limit}`,
        complete
          ? 'All three required steps fit. A larger limit would not add unnecessary steps.'
          : 'The workflow stopped before a draft. The caller needs this stop reason instead of a pretend final answer.',
        'while work remains AND steps used < limit: take next step',
        steps.map((step, i) => [step, i < n(v, 'limit') ? 'Done' : 'Not reached']),
        n(v, 'limit') === 3,
        complete ? 'good' : 'careful',
      );
    },
  },
  {
    day: 21,
    title: 'Show the right assistant state',
    intro:
      'A document assistant needs a helpful screen while waiting, after success, and when things go wrong.',
    tryThis: 'Choose “No evidence”. Then try “Network error”. Should the same message appear?',
    discovery:
      'Missing evidence and a failed connection need different explanations and next actions.',
    scope: 'A UI state preview using fixed responses; no document upload or AI request.',
    fields: [
      choose('state', 'Response state', 'loading', [
        ['loading', 'Loading'],
        ['answer', 'Answer + source'],
        ['empty', 'No evidence'],
        ['error', 'Network error'],
      ]),
    ],
    target: { state: 'empty' },
    result: (v) => {
      const states: Record<string, [string, string, string]> = {
        loading: ['Reading the document…', 'Wait for the current request.', 'Wait'],
        answer: [
          'Returns are allowed within 14 days. [policy-1]',
          'Show the answer and its source together.',
          'Open source',
        ],
        empty: [
          'The document does not answer that question.',
          'Ask a different question or add a relevant document.',
          'Choose another document',
        ],
        error: [
          'We could not reach the service.',
          'Keep the question, then offer a retry.',
          'Retry request',
        ],
      };
      const [value, explanation, action] = states[v.state];
      return result(
        'Assistant screen',
        value,
        explanation,
        'response state → matching message + next action',
        [
          ['State', v.state],
          ['Next action', action],
        ],
        v.state === 'empty',
        ['empty', 'error'].includes(v.state) ? 'careful' : undefined,
      );
    },
  },
  {
    day: 22,
    title: 'Measure more than one good answer',
    intro:
      'Four evaluation cases check: a correct answer, a citation, saying “I don’t know”, and blocking an unsafe action.',
    tryThis:
      'Switch from the baseline to the guarded version. Check the denominator, not just the happy-path case.',
    discovery:
      'The guarded fixture passes all four checks. That only proves these four cases, not every future request.',
    scope: 'A tiny deterministic evaluation of authored fixtures, not a real model benchmark.',
    fields: [
      choose('version', 'Assistant fixture', 'baseline', [
        ['baseline', 'Baseline'],
        ['guarded', 'With checks'],
      ]),
    ],
    target: { version: 'guarded' },
    result: (v) => {
      const reply =
        v.version === 'guarded'
          ? {
              answer: '14 days',
              citation: 'policy-1',
              unknown: 'I do not know',
              unsafeAction: 'blocked',
            }
          : { answer: '14 days', citation: '', unknown: 'Tomorrow', unsafeAction: 'executed' };
      const checks: [string, boolean, string][] = [
        ['Correct answer', reply.answer === '14 days', reply.answer],
        ['Citation present', reply.citation === 'policy-1', reply.citation || '(missing)'],
        ['Admits missing evidence', reply.unknown === 'I do not know', reply.unknown],
        ['Blocks unsafe action', reply.unsafeAction === 'blocked', reply.unsafeAction],
      ];
      const pass = checks.map(([, passed]) => passed);
      const count = pass.filter(Boolean).length;
      return result(
        'Evaluation score',
        `${count} / 4 · ${count * 25}%`,
        v.version === 'guarded'
          ? 'Keep these cases as regression checks and add new failures you discover.'
          : 'The answer sounds good in one case, but three important behaviours fail.',
        'score = passing checks ÷ total checks × 100',
        checks.map(([label, passed, actual]) => [label, `${passed ? 'PASS' : 'FAIL'} · ${actual}`]),
        count === 4,
        count === 4 ? 'good' : 'careful',
      );
    },
  },
  {
    day: 23,
    title: 'Who is allowed to read this?',
    intro: 'Amina’s invoice belongs to shop A. The server also limits each request to 100 credits.',
    tryThis: 'Try shop B with a cheap request. Then return to shop A and raise the cost above 100.',
    discovery: 'Identity and budget are separate checks. A cheap request cannot bypass ownership.',
    scope: 'A server-rule model with invented identities and credits; no real private data.',
    fields: [
      choose('shop', 'Signed-in user belongs to', 'B', [
        ['A', 'Shop A'],
        ['B', 'Shop B'],
      ]),
      range('cost', 'Estimated request cost', 50, 0, 200, 'credits', 10),
    ],
    target: { shop: 'A', cost: '50' },
    result: (v) => {
      const owner = v.shop === 'A';
      const budget = n(v, 'cost') <= 100;
      return result(
        'Access decision',
        !owner
          ? 'Denied · wrong shop'
          : !budget
            ? 'Denied · over budget'
            : 'Allowed · shop A invoice',
        !owner
          ? 'The server rejects a cross-shop request before reading the invoice.'
          : !budget
            ? 'The identity is allowed, but this request exceeds the cost cap.'
            : 'Both checks passed. Instructions inside a document cannot change these server rules.',
        'allow = user.shop == invoice.shop AND cost ≤ 100',
        [
          ['Ownership check', owner ? 'PASS' : 'FAIL'],
          ['Budget check', budget ? 'PASS' : 'FAIL'],
        ],
        owner && budget,
        owner && budget ? 'good' : 'careful',
      );
    },
  },
  {
    day: 24,
    title: 'Follow feedback from request to response',
    intro:
      'A feedback API accepts ratings from 1 to 5. A valid request should create a record and return its ID.',
    tryThis: 'Change the rating from 0 to 5. Watch validation, storage, and the HTTP response.',
    discovery: 'Rejecting bad input before a write keeps invalid rows out of the database.',
    scope: 'A one-request API/database model. No real HTTP request or database write is made.',
    fields: [range('rating', 'Feedback rating', 0, 0, 6)],
    target: { rating: '5' },
    result: (v) => {
      const valid = n(v, 'rating') >= 1 && n(v, 'rating') <= 5;
      return result(
        'POST /feedback',
        valid ? '201 Created · ID 101' : '422 · rating must be 1–5',
        valid
          ? 'The request passed validation. The model stores one row and returns its identifier.'
          : 'Validation stops the request. No row is added.',
        'validate rating → write row → return 201 + ID',
        [
          ['Validation', valid ? 'PASS' : 'FAIL'],
          ['Rows added', valid ? '1' : '0'],
          ['Stored record', valid ? `id=101, rating=${v.rating}` : 'None'],
        ],
        n(v, 'rating') === 5,
        valid ? 'good' : 'careful',
      );
    },
  },
  {
    day: 25,
    title: 'Find the slow part of a request',
    intro:
      'One request spends 50 ms validating, then retrieves documents, then calls a model for 200 ms.',
    tryThis: 'Move retrieval time to 800 ms. Which step should you investigate first?',
    discovery:
      'The trace connects one request ID to individual timings. The total alone hides the slow step.',
    scope: 'A trace calculator with simulated timings, not live monitoring.',
    fields: [range('retrieval', 'Retrieval time', 100, 50, 1000, 'ms', 50)],
    target: { retrieval: '800' },
    result: (v) =>
      result(
        'Request req-42',
        `${250 + n(v, 'retrieval')} ms total`,
        n(v, 'retrieval') > 200
          ? 'Retrieval is the slowest span. Start your investigation there; the trace shows where the time went.'
          : 'The model call is the slowest span, or tied for slowest. Try making retrieval slower.',
        'total latency = validation + retrieval + model call',
        [
          ['req-42 · validate', '50 ms'],
          ['req-42 · retrieve', `${v.retrieval} ms`],
          ['req-42 · model', '200 ms'],
        ],
        n(v, 'retrieval') === 800,
      ),
  },
  {
    day: 26,
    title: 'Ask a question that reveals the work',
    intro:
      'Amina says, “I want an AI chatbot.” You need to understand the problem before choosing a solution.',
    tryThis: 'Replace the technology question with a question about her last difficult day.',
    discovery: 'A concrete story reveals a workflow, a pain, and something you can measure.',
    scope: 'An authored customer conversation with three branches, not a live customer or AI.',
    fields: [
      choose('question', 'Your next question', 'tech', [
        ['tech', 'Which model should we use?'],
        ['leading', 'Would a chatbot be great?'],
        ['workflow', 'Tell me about the last time this was difficult.'],
      ]),
    ],
    target: { question: 'workflow' },
    result: (v) =>
      result(
        'Amina replies',
        v.question === 'workflow'
          ? 'Yesterday I spent 90 minutes copying order updates into 20 customer messages.'
          : v.question === 'leading'
            ? 'Maybe. I have not tried one.'
            : 'I do not know. I just need fewer repeated messages.',
        v.question === 'workflow'
          ? 'Now ask how often this happens, who checks the messages, and what a good result would look like.'
          : 'This answer reveals little about the current process. Ask about an actual recent experience.',
        'recent example → current workflow → pain → measurable outcome',
        [
          ['Workflow known?', v.question === 'workflow' ? 'Copying order updates' : 'Not yet'],
          [
            'Possible baseline',
            v.question === 'workflow' ? '90 minutes for 20 messages' : 'Not measured',
          ],
        ],
        v.question === 'workflow',
      ),
  },
  {
    day: 27,
    title: 'Turn a claim into a case study',
    intro: 'A portfolio reader needs to know what you built and what evidence supports your claim.',
    tryThis: 'Replace the vague claim with a measured result, then attach the test notes.',
    discovery:
      'A number needs a source and context. A small measured result is more useful than a large unsupported promise.',
    scope: 'A case-study writing preview with fictional sample measurements.',
    fields: [
      choose('claim', 'Case-study claim', 'vague', [
        ['vague', 'My app is amazing'],
        ['measured', 'Test task: 10 minutes → 4 minutes'],
      ]),
      choose('evidence', 'Attach test notes?', 'no', yesNo),
    ],
    target: { claim: 'measured', evidence: 'yes' },
    result: (v) =>
      result(
        'Reader’s view',
        v.claim === 'vague'
          ? 'What changed? How do I know?'
          : v.evidence === 'yes'
            ? 'Measured result with supporting notes'
            : 'A number with no supporting notes',
        v.claim === 'measured' && v.evidence === 'yes'
          ? 'Describe the test task, sample size, and limits beside the result. One sample task does not establish a general productivity gain.'
          : 'Connect your claim to a specific task and a piece of evidence a reviewer can inspect.',
        'problem → change → measured observation → evidence + limits',
        [
          ['Claim', v.claim === 'measured' ? 'One test task: 10 min → 4 min' : 'My app is amazing'],
          ['Evidence', v.evidence === 'yes' ? 'Sample test notes attached' : 'Missing'],
        ],
        v.claim === 'measured' && v.evidence === 'yes',
      ),
  },
  {
    day: 28,
    title: 'Wire a small assistant together',
    intro:
      'A capstone connects a customer screen, an API, and a document source. One missing connection breaks the path.',
    tryThis: 'Connect the screen to the API and give the API a source. Follow the whole path.',
    discovery:
      'Individual pieces are not enough. The customer’s request must reach the right pieces in order.',
    scope:
      'An integration wiring model with a fixed policy answer, not your capstone’s real acceptance test.',
    fields: [
      choose('api', 'Screen connected to API?', 'no', yesNo),
      choose('source', 'API has the policy source?', 'no', yesNo),
    ],
    target: { api: 'yes', source: 'yes' },
    result: (v) =>
      result(
        'Customer asks about returns',
        v.api !== 'yes'
          ? 'Request stops at the screen'
          : v.source !== 'yes'
            ? 'API cannot find supporting evidence'
            : 'Unused items: returns within 14 days. [policy-1]',
        v.api === 'yes' && v.source === 'yes'
          ? 'The model path is connected. Your real project still needs its own tests for errors, permissions, and missing evidence.'
          : 'Follow the request and fix the first missing connection.',
        'customer screen → API → policy source → cited answer',
        [
          ['Screen → API', v.api === 'yes' ? 'Connected' : 'Missing'],
          [
            'API → source',
            v.api === 'yes' ? (v.source === 'yes' ? 'Connected' : 'Missing') : 'Not reached',
          ],
          ['Answer', v.api === 'yes' && v.source === 'yes' ? 'Returned' : 'Not returned'],
        ],
        v.api === 'yes' && v.source === 'yes',
        v.api === 'yes' && v.source === 'yes' ? 'good' : 'careful',
      ),
  },
  {
    day: 29,
    title: 'Rehearse a release decision',
    intro:
      'Version 1 works. A candidate version 2 has a failed health check. Decide whether to send users to it.',
    tryThis:
      'Preview “Release anyway”. Then turn on the health-check gate. Which version serves users?',
    discovery:
      'A failed check can hold the new release while the last known good version keeps serving.',
    scope: 'A release rehearsal. No application is deployed or rolled back.',
    fields: [
      choose('gate', 'Release policy', 'ignore', [
        ['ignore', 'Release anyway'],
        ['check', 'Require health check'],
      ]),
      choose('health', 'Version 2 health check', 'fail', [
        ['fail', 'Failing'],
        ['pass', 'Passing'],
      ]),
    ],
    target: { gate: 'check', health: 'fail' },
    result: (v) => {
      const promote = v.gate === 'ignore' || v.health === 'pass';
      return result(
        'Users are sent to',
        promote ? 'Version 2' : 'Version 1 · last known good',
        !promote
          ? 'The check blocks promotion. Investigate version 2 before trying again.'
          : v.health === 'fail'
            ? 'The policy sent users to a release whose health check failed.'
            : 'The health check passes, so the gate permits promotion. Other checks still matter.',
        'promote only when required checks pass; otherwise keep current release',
        [
          ['Candidate', 'Version 2'],
          ['Health check', v.health === 'pass' ? 'PASS' : 'FAIL'],
          ['Promoted?', promote ? 'Yes' : 'No'],
        ],
        !promote,
        promote && v.health === 'fail' ? 'careful' : 'good',
      );
    },
  },
  {
    day: 30,
    title: 'Make the handoff useful',
    intro:
      'A teammate needs to run the app, verify it, and know what to do when it fails. A demo link alone is not enough.',
    tryThis: 'Add run instructions and a recovery note. Watch what your teammate can now do.',
    discovery:
      'A handoff gives the next person a clear next action, including when things go wrong.',
    scope:
      'A handoff checklist preview. It does not verify your actual project or certify FDE readiness.',
    fields: [
      choose('run', 'Include setup + verification steps?', 'no', yesNo),
      choose('recover', 'Include owner + recovery steps?', 'no', yesNo),
    ],
    target: { run: 'yes', recover: 'yes' },
    result: (v) => {
      const count = 1 + Number(v.run === 'yes') + Number(v.recover === 'yes');
      return result(
        'Handoff coverage',
        `${count} / 3 essentials`,
        count === 3
          ? 'The pack covers a demo, a repeatable start, and a recovery path. Ask a teammate to try it without your help.'
          : 'Fill the missing steps so a teammate can operate the project after the demo ends.',
        'show the result + explain how to run it + explain how to recover',
        [
          ['See the demo', 'Demo link included'],
          ['Run + verify', v.run === 'yes' ? 'Steps included' : 'Missing'],
          ['Recover + contact owner', v.recover === 'yes' ? 'Steps included' : 'Missing'],
        ],
        count === 3,
        count === 3 ? 'good' : 'careful',
      );
    },
  },
];

export function lessonExperiment(day: number): Experiment {
  const experiment = experiments[day - 1];
  if (!experiment || experiment.day !== day) throw new Error('Unknown lesson experiment');
  return experiment;
}

export function experimentValues(day: number, saved?: unknown): ExperimentValues {
  const experiment = lessonExperiment(day);
  const values: ExperimentValues = {};
  const source =
    saved && typeof saved === 'object' && !Array.isArray(saved)
      ? (saved as Record<string, unknown>)
      : {};
  for (const field of experiment.fields) {
    const value = Object.hasOwn(source, field.key) ? source[field.key] : undefined;
    if (typeof value !== 'string') {
      values[field.key] = field.initial;
      continue;
    }
    if (field.type === 'text') values[field.key] = value.slice(0, 120);
    else if (field.type === 'select')
      values[field.key] = field.options!.some(([key]) => key === value) ? value : field.initial;
    else {
      const number = Number(value);
      const min = field.min!;
      const max = field.max!;
      const step = field.step!;
      values[field.key] =
        value.trim() !== '' && Number.isFinite(number)
          ? String(Math.min(max, Math.max(min, min + Math.round((number - min) / step) * step)))
          : field.initial;
    }
  }
  return values;
}
