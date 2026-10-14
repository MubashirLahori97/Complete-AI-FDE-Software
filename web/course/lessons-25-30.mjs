import { check, demo, example, project, reference, section, step } from './content-helpers.mjs';

const js = (title, brief, parameters, result, starter, steps, cases, setup) => ({
  title,
  brief,
  language: 'javascript',
  parameters,
  result,
  starter,
  steps,
  cases,
  ...(setup ? { setup } : {}),
});
const agent1 =
  'function run(events,limit){let used=0;for(const event of events){if(event==="done")return {state:"done",used};used++;}return {state:"waiting",used};}';
const agent2 =
  'function run(events,limit){let used=0;for(const event of events){if(used>=limit)return {state:"budget",used};if(event==="done")return {state:"done",used};used++;}return {state:"waiting",used};}';
const agent3 =
  'function run(events,limit){if(!Number.isInteger(limit)||limit<0)throw new RangeError("Invalid step limit");let used=0;for(const event of events){if(used>=limit)return {state:"budget",used};if(event==="done")return {state:"done",used};if(event==="write")return {state:"approval",used};if(event==="error")return {state:"failed",used};if(event!=="lookup")return {state:"unknown",used};used++;}return {state:"waiting",used};}';
const log1 =
  'function safeLog(record){return {requestId:String(record.requestId||"missing"),event:String(record.event||"unknown")};}';
const log2 =
  'function safeLog(record){const status=["ok","failed","denied"].includes(record.status)?record.status:"unknown";const duration=Number.isFinite(record.duration)&&record.duration>=0?record.duration:0;return {requestId:String(record.requestId||"missing"),event:String(record.event||"unknown"),status,duration};}';
const log3 =
  'function safeLog(record){const status=["ok","failed","denied"].includes(record.status)?record.status:"unknown";const duration=Number.isFinite(record.duration)&&record.duration>=0?record.duration:0;const code=typeof record.code==="string"&&/^[A-Z_]{1,40}$/.test(record.code)?record.code:"UNKNOWN";return {requestId:String(record.requestId||"missing").slice(0,80),event:["request","tool","provider"].includes(record.event)?record.event:"unknown",status,duration,code};}';
const scope1 =
  'function scope(requirements){return requirements.filter(item=>item.necessary).map(item=>item.task);}';
const scope2 =
  'function scope(requirements){return requirements.filter(item=>item.necessary&&item.measurable).map(item=>item.task);}';
const scope3 =
  'function scope(requirements){const names=requirements.filter(item=>item.necessary===true&&item.measurable===true&&typeof item.task==="string").map(item=>item.task.trim()).filter(Boolean);return [...new Set(names)].slice(0,3);}';
const order1 = 'function buildOrder(parts){return Object.keys(parts);}';
const order2 =
  'function buildOrder(parts){const done=new Set();const result=[];function visit(name){if(done.has(name))return;for(const dependency of parts[name])visit(dependency);done.add(name);result.push(name);}for(const name of Object.keys(parts))visit(name);return result;}';
const order3 =
  'function buildOrder(parts){const done=new Set();const active=new Set();const result=[];function visit(name){if(done.has(name))return;if(!Object.hasOwn(parts,name))throw new Error("Missing dependency: "+name);if(active.has(name))throw new Error("Cycle: "+name);active.add(name);for(const dependency of parts[name])visit(dependency);active.delete(name);done.add(name);result.push(name);}for(const name of Object.keys(parts))visit(name);return result;}';
const migrate1 =
  'function migrate(rows){return rows.map(row=>({...row,status:row.status??"open"}));}';
const migrate2 =
  'function migrate(rows){return rows.map(row=>{const status=row.status??"open";if(!["open","closed"].includes(status))throw new RangeError("Invalid status");return {...row,status};});}';
const migrate3 =
  'function migrate(rows){const ids=new Set();return rows.map(row=>{if(!Number.isInteger(row.id)||row.id<=0||ids.has(row.id))throw new RangeError("Invalid or duplicate id");ids.add(row.id);const status=row.status??"open";if(!["open","closed"].includes(status))throw new RangeError("Invalid status");return {...row,status};});}';
const skills = ['build', 'debug', 'data', 'security', 'ai', 'delivery', 'explain', 'independent'];
const fullEvidence = skills.map((skill) => ({
  skill,
  verified: true,
  artifact: 'report:' + skill,
  independent: true,
}));
const ready1 =
  'function readiness(evidence){const required=["build","debug"];const gaps=required.filter(skill=>!evidence.some(item=>item.skill===skill&&item.verified===true));return {ready:gaps.length===0,gaps};}';
const ready2 =
  'function readiness(evidence){const required=' +
  JSON.stringify(skills) +
  ';const gaps=required.filter(skill=>!evidence.some(item=>item.skill===skill&&item.verified===true&&typeof item.artifact==="string"&&item.artifact.trim()));return {ready:gaps.length===0,gaps};}';
const ready3 = ready2.replace(
  'item.verified===true&&',
  'item.verified===true&&item.independent===true&&',
);

const lessons = [
  {
    day: 25,
    slug: 'bounded-workflow',
    title: 'Build an assistant that knows when to stop',
    chapter: 'Delivery',
    concepts: ['Agent workflows', 'Limits and failure states'],
    prerequisites: [21, 24],
    outcome: 'Implement a bounded workflow with explicit stopping reasons.',
    story:
      'Amina’s assistant can look up an order, retrieve a policy, and draft a reply. If it cannot finish, it should explain why instead of looping or trying unapproved actions.',
    demo: demo('Bound a workflow', { stepsUsed: 0, stepLimit: 2, state: 'working' }, [
      [
        'Look up an order',
        { stepsUsed: 1, state: 'working' },
        'One allowed operation consumes one step.',
      ],
      [
        'Request a refund write',
        { stepsUsed: 1, state: 'wait for approval' },
        'The workflow stops at a write boundary. A model proposal cannot bypass the application.',
      ],
    ]),
    sections: [
      section(
        'Write a workflow before adding an agent',
        'A workflow describes the permitted states and transitions: receive a question, retrieve evidence, draft, validate, and finish or escalate. Start with a deterministic sequence when it meets the need.',
        'An agent may choose an action based on model output. That choice adds uncertainty, so keep a small registry of permitted actions and a clear controller. Separate the controller from the model and tool adapters so the controller can be tested without a paid model call.',
      ),
      section(
        'Make stopping states visible',
        'Use distinct completion, waiting, budget, approval, failed, and unknown-action states. The caller needs to know whether there is an answer, missing information, or required human action. Do not report a stopped workflow as a completed answer.',
        'The lab processes prepared event names. lookup consumes one step; done completes; write requires approval; error fails. It is a controller exercise, not evidence of an autonomous model’s performance.',
      ),
      section(
        'Limit more than step count',
        'Set maximum steps, elapsed time, provider tokens or cost, tool calls, retries, and repeated identical actions. Check limits before an operation and account for its actual result afterward. A retry is another operation.',
        'Keep tool execution under server permissions. Validate the proposed action at every iteration. A stop condition must terminate work, including delayed responses and pending operations, rather than merely change a label in the interface.',
      ),
      section(
        'Test the worst transitions',
        'Reproduce repeated lookup, malformed action, provider failure, approval change, timeout, and duplicate completion. Check both the reported state and the actual tool calls. A budget label is incorrect if another tool executes afterward.',
        'For a real provider run, save a safe trace of chosen actions and outcomes without exposing private messages or credentials. Use those traces to add regression cases and compare whether an agent improves on the fixed workflow.',
      ),
    ],
    words: [
      {
        term: 'Controller',
        meaning: 'Application code that decides which state and operation may follow.',
      },
      { term: 'Step budget', meaning: 'The maximum number of allowed operations in a run.' },
      {
        term: 'Terminal state',
        meaning: 'A state from which the current run performs no further work.',
      },
    ],
    example: example(
      'javascript',
      agent3 + '\nconsole.log(run(["lookup","write","lookup"],3));',
      '{"state":"approval","used":1}',
      [
        'The lookup consumes a step.',
        'The write proposal stops at approval.',
        'The final lookup is never processed.',
      ],
    ),
    exercise: js(
      'A bounded event controller',
      'Write run(events,limit). Process lookup, done, write, error. Check the step budget before each event. Invalid limits raise RangeError; unknown events stop. Return state and used.',
      ['events', 'limit'],
      'run(events,limit)',
      'function run(events,limit){return {state:"waiting",used:0};}',
      [
        step(
          'Track work and completion',
          'lookup increments used. done returns done immediately. An exhausted event list returns waiting.',
          'Use an early return to ensure later events are not processed.',
          agent1,
          ['done', 'empty'],
        ),
        step(
          'Stop at the budget',
          'Before each event, stop with budget if used >= limit.',
          'Put the check before processing the next event.',
          agent2,
          ['limit', 'zero'],
        ),
        step(
          'Handle unsafe and failed transitions',
          'write returns approval, error returns failed, unknown events return unknown. Reject invalid limits.',
          'These stops do not consume or execute a lookup.',
          agent3,
          ['write', 'error', 'unknown', 'invalid'],
        ),
      ],
      [
        check(
          'done',
          'Stop after completion',
          [['lookup', 'done', 'lookup'], 3],
          { state: 'done', used: 1 },
          'Completion terminates the run.',
        ),
        check(
          'empty',
          'No events',
          [[], 2],
          { state: 'waiting', used: 0 },
          'No work has been done.',
        ),
        check(
          'limit',
          'Repeated lookups',
          [['lookup', 'lookup', 'lookup'], 2],
          { state: 'budget', used: 2 },
          'The third lookup cannot run.',
        ),
        check(
          'zero',
          'No available budget',
          [['done'], 0],
          { state: 'budget', used: 0 },
          'Check the bound before processing even a completion event.',
        ),
        check(
          'write',
          'A proposed write',
          [['lookup', 'write', 'lookup'], 3],
          { state: 'approval', used: 1 },
          'Writing requires a separate authorized flow.',
        ),
        check(
          'error',
          'A failed operation',
          [['error', 'lookup'], 3],
          { state: 'failed', used: 0 },
          'A failure must not continue blindly.',
        ),
        check(
          'unknown',
          'An unlisted action',
          [['shell'], 3],
          { state: 'unknown', used: 0 },
          'Unknown capabilities are rejected.',
        ),
        check(
          'invalid',
          'Invalid step bound',
          [['lookup'], -1],
          null,
          'Bounds are validated.',
          'RangeError',
        ),
      ],
    ),
    project: project(
      'A bounded shop assistant',
      'Implement a controller using the actual service tool adapters. Compare a fixed workflow with an optional model-chosen workflow and keep their evaluation evidence separate.',
      [
        'A state/transition table.',
        'A controller with step, time, and cost limits.',
        'Tests proving no operations run after stopping.',
      ],
      [
        [
          'Define the flow',
          [
            'List allowed states and tools.',
            'Choose a fixed sequence as the baseline.',
            'Write the human handoff outcome.',
          ],
        ],
        [
          'Add real adapters',
          [
            'Use scoped order lookup and policy retrieval.',
            'Validate every proposed tool call.',
            'Keep writes behind exact approval.',
          ],
        ],
        [
          'Prove termination',
          [
            'Count actual tool invocations in tests.',
            'Reproduce repeated actions, timeout, and provider failure.',
            'Assert that terminal states execute no later operations.',
          ],
        ],
      ],
      [
        'All actions pass a tool registry.',
        'Limits are checked before operations.',
        'Stopping reasons are visible.',
        'Approval and permissions remain server enforced.',
        'Tests inspect actual calls after stopping.',
      ],
      [
        ['Repeated identical lookup', 'The run stops within its limit.'],
        ['Write proposal', 'No simulated money changes before approval.'],
        ['Delayed provider result after timeout', 'No late tool operation begins.'],
      ],
      'Persist a resumable run and prevent an expired approval from being reused after recovery.',
      [
        'Why begin with a fixed workflow?',
        'Which budget counts retries?',
        'How did you prove that stop actually stopped?',
      ],
    ),
    references: [
      reference(
        'OpenAI function calling',
        'https://developers.openai.com/api/docs/guides/function-calling',
      ),
    ],
  },
  {
    day: 26,
    slug: 'safe-diagnostics',
    title: 'Find a failure without exposing private data',
    chapter: 'Delivery',
    concepts: ['Observability and privacy', 'Incident recovery'],
    prerequisites: [18, 25],
    outcome: 'Produce controlled diagnostic events and an incident reproduction.',
    story:
      'Amina reports that some requests fail. You need enough evidence to find the fault, but logging every message, password, or token creates another problem.',
    demo: demo(
      'Follow a safe request trace',
      { requestId: 'req-42', event: 'request', status: 'failed' },
      [
        [
          'Find the provider event',
          { requestId: 'req-42', event: 'provider', code: 'TIMEOUT' },
          'A shared request id connects events without copying private message text.',
        ],
        [
          'Recover and retest',
          { requestId: 'req-43', status: 'ok' },
          'Record what changed and prove the original failing operation now works.',
        ],
      ],
    ),
    sections: [
      section(
        'Observe outcomes and boundaries',
        'Logs are records of events. Metrics summarize counts or distributions. A trace connects events from the same operation. Use a generated request id to connect frontend reports, server events, and provider outcomes.',
        'Record safe event names, status, elapsed time, error code, and version. These can reveal where latency or failure occurs. A trace without private message content can still show that a provider timed out after retrieval succeeded.',
      ),
      section(
        'Use an allowed list of fields',
        'Select fields to log instead of copying entire request or exception objects. Passwords, API keys, session tokens, customer text, and unrestricted tool output should not enter routine logs. Even ids can be personal data, so collect only what the investigation needs.',
        'The lab returns a small allowed-field record. It is not a complete anonymizer: free-form request ids can themselves contain private text. The project generates ids on the service and uses a fixed event vocabulary, retention policy, and restricted access.',
      ),
      section(
        'Reproduce before repairing',
        'Record the reported operation, expected result, actual result, version, and safe request id. Reproduce using disposable data. Narrow the boundary: interface, API validation, data query, retrieval, provider, or tool execution.',
        'Make a focused repair and add a regression case for the original trigger. Do not clear errors by converting failures to success. Verify the main operation and inspect whether the repair changes other important outcomes.',
      ),
      section(
        'Recover and communicate clearly',
        'An incident report states impact, timeline, cause supported by evidence, repair, verification, and prevention. If cause is uncertain, state what the evidence does and does not show.',
        'A temporary fallback may keep the shop working while the model is unavailable. Distinguish recovery from permanent repair. Rehearse deletion and retention of logs, and verify that a secret sent in a test never appears in captured events.',
      ),
    ],
    words: [
      {
        term: 'Observability',
        meaning: 'Evidence about what a system is doing and where it fails.',
      },
      {
        term: 'Request id',
        meaning: 'A generated identifier connecting events from one operation.',
      },
      { term: 'Regression case', meaning: 'A test that reproduces a previously fixed failure.' },
    ],
    example: example(
      'javascript',
      log3 +
        '\nconsole.log(safeLog({requestId:"r1",event:"provider",status:"failed",duration:1200,code:"TIMEOUT",apiKey:"private"}));',
      '{"requestId":"r1","event":"provider","status":"failed","duration":1200,"code":"TIMEOUT"}',
      [
        'Only selected fields enter the output.',
        'Status, duration, and code have explicit contracts.',
        'The apiKey field is never copied.',
      ],
    ),
    exercise: js(
      'An allowed-field diagnostic record',
      'Write safeLog(record). First select requestId and event; then add validated status/duration; finally add a bounded code and fixed event vocabulary. Extra private fields must disappear.',
      ['record'],
      'safeLog(record)',
      'function safeLog(record){return record;}',
      [
        step(
          'Select fields explicitly',
          'Return only requestId and event. Missing values become missing and unknown.',
          'Build a new object; do not spread the source record.',
          log1,
          ['private', 'missing'],
        ),
        step(
          'Validate status and duration',
          'Add status from ok/failed/denied, else unknown. Add non-negative finite duration, else zero.',
          'Check numeric values before logging them.',
          log2,
          ['bad', 'duration'],
        ),
        step(
          'Bound the vocabulary',
          'Use request/tool/provider events or unknown. Add code matching 1–40 uppercase letters/underscores or UNKNOWN. Limit requestId to 80 characters.',
          'A fixed code is safer than an arbitrary exception message.',
          log3,
          ['code', 'long'],
        ),
      ],
      [
        check(
          'private',
          'Private fields are omitted',
          [
            {
              requestId: 'r1',
              event: 'request',
              status: 'ok',
              duration: 12,
              code: 'OK',
              password: 'secret',
              text: 'private',
            },
          ],
          { requestId: 'r1', event: 'request' },
          'Select only intended diagnostic fields.',
        ),
        check(
          'missing',
          'Missing fields',
          [{}],
          { requestId: 'missing', event: 'unknown' },
          'Missing input has a defined result.',
        ),
        check(
          'bad',
          'Invalid status',
          [{ requestId: 'r2', event: 'tool', status: 'anything', duration: 3 }],
          { requestId: 'r2', event: 'tool', status: 'unknown', duration: 3 },
          'Use a bounded status vocabulary.',
        ),
        check(
          'duration',
          'Negative elapsed time',
          [{ requestId: 'r3', event: 'provider', status: 'failed', duration: -1 }],
          { requestId: 'r3', event: 'provider', status: 'failed', duration: 0 },
          'Invalid elapsed time is not recorded as real duration.',
        ),
        check(
          'code',
          'Free-form error text',
          [
            {
              requestId: 'r4',
              event: 'customer secret',
              status: 'failed',
              duration: 2,
              code: 'password=secret',
            },
          ],
          { requestId: 'r4', event: 'unknown', status: 'failed', duration: 2, code: 'UNKNOWN' },
          'Free text cannot become an event or error code.',
        ),
        check(
          'long',
          'Oversized request id',
          [{ requestId: 'r'.repeat(90), event: 'request', status: 'ok', duration: 0, code: 'OK' }],
          { requestId: 'r'.repeat(80), event: 'request', status: 'ok', duration: 0, code: 'OK' },
          'Bound diagnostic size.',
        ),
      ],
    ),
    project: project(
      'A reproducible timeout incident',
      'Inject a provider timeout in the service workspace, follow its safe request trace, repair recovery behaviour, and add a regression test.',
      [
        'A safe structured event report.',
        'An incident reproduction and repair.',
        'Retention and private-field test evidence.',
      ],
      [
        [
          'Instrument boundaries',
          [
            'Generate the request id on the server.',
            'Use fixed event and error codes.',
            'Record duration and version without customer text.',
          ],
        ],
        [
          'Reproduce and repair',
          [
            'Use a disposable failing provider adapter.',
            'Locate the failing boundary from events.',
            'Return an honest fallback and retain the user draft.',
          ],
        ],
        [
          'Verify and document',
          [
            'Add the timeout as a regression.',
            'Search captured logs for a planted test secret.',
            'Write impact, supported cause, recovery, and prevention.',
          ],
        ],
      ],
      [
        'Events connect using a server-generated id.',
        'Private content and credentials are excluded.',
        'Timeouts are reported accurately.',
        'The original failing operation has a regression.',
        'Retention and access rules are documented.',
      ],
      [
        ['Planted secret in request', 'Absent from captured logs.'],
        ['Provider timeout', 'A controlled fallback and diagnostic code.'],
        ['Recovery run', 'The original flow succeeds without hiding errors.'],
      ],
      'Add a latency dashboard and alert threshold, then test its behaviour with synthetic slow requests.',
      [
        'Which evidence located the fault?',
        'What data did you deliberately avoid collecting?',
        'What separates recovery from the root-cause repair?',
      ],
    ),
    references: [
      reference(
        'OWASP logging guidance',
        'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html',
      ),
    ],
  },
  {
    day: 27,
    slug: 'customer-discovery',
    title: 'Understand the customer before choosing the build',
    chapter: 'Delivery',
    concepts: ['Discovery and outcomes', 'Scope and acceptance'],
    prerequisites: [24, 26],
    outcome: 'Turn observed customer work into a bounded project brief.',
    story:
      'Amina asks for “an AI that runs the shop.” You need to find the actual problem, agree on a useful first outcome, and explain which work belongs in a later release.',
    demo: demo(
      'Make the request concrete',
      { request: 'AI that runs the shop', scope: 'unclear' },
      [
        [
          'Observe the current task',
          {
            problem: 'Staff repeatedly answer returns questions',
            outcome: 'Faster correct replies',
          },
          'An observed workflow makes the problem testable.',
        ],
        [
          'Agree on one first release',
          {
            scope: 'Policy answers with citations and staff fallback',
            excluded: 'Automatic refunds',
          },
          'A small agreement clarifies what success means and what remains manual.',
        ],
      ],
    ),
    sections: [
      section(
        'Observe before proposing',
        'Ask the customer to show the current task with safe sample data. Who does it, how often, what takes time, and what happens when it goes wrong? Listen for constraints such as unreliable connectivity, staff skills, privacy, and systems already in use.',
        'An FDE works close to the customer, translates the need into software, and follows the result in use. This includes communication, data integration, debugging, deployment, and handoff. Choosing a model is only one implementation decision.',
      ),
      section(
        'Define an outcome and a baseline',
        'An outcome describes a change for the customer: reduce median reply preparation time while maintaining supported answers. Measure the current workflow before setting a target. Define who reviews correctness and how ambiguous cases are handled.',
        'Separate the desired outcome from a feature. “Use AI” is an implementation preference, not a success measure. A search page might solve the problem with less risk; compare that alternative honestly.',
      ),
      section(
        'Set scope and acceptance together',
        'List must-have and later features. For each must-have, write a measurable acceptance condition, expected failure behaviour, and responsible reviewer. Include access rules, operations, and support work in the scope.',
        'The exercise filters a prepared requirements list. It does not perform discovery or judge whether a stated requirement is truly necessary. The project requires an actual conversation or an explicitly labelled role-play, observations, and a customer-reviewed brief.',
      ),
      section(
        'Make tradeoffs visible',
        'Document assumptions, dependencies, data access, risks, and open questions. State what the first release excludes and why. Record who can approve a scope change and how it affects cost and delivery.',
        'Demonstrate a small working slice early using real customer constraints and safe data. Capture feedback and change the brief when evidence changes. A clear disagreement explained with evidence is more useful than silently building an unrealistic promise.',
      ),
    ],
    words: [
      {
        term: 'Discovery',
        meaning: 'Learning how the customer works and what problem needs solving.',
      },
      {
        term: 'Acceptance condition',
        meaning: 'A specific observable result used to decide whether work meets the agreement.',
      },
      { term: 'Scope', meaning: 'The agreed work and boundaries of a release.' },
    ],
    example: example(
      'javascript',
      scope3 +
        '\nconsole.log(scope([{task:"Policy search",necessary:true,measurable:true},{task:"Animated logo",necessary:false,measurable:true}]));',
      '["Policy search"]',
      [
        'The supplied list distinguishes necessity and measurable acceptance.',
        'Only clear required tasks enter this small first-release list.',
        'This function cannot replace the conversation that establishes those labels.',
      ],
    ),
    exercise: js(
      'A bounded first-release list',
      'Write scope(requirements). Keep tasks labelled necessary and measurable with true booleans. Trim non-empty task names, remove duplicates, and keep at most three in their original order.',
      ['requirements'],
      'scope(requirements)',
      'function scope(requirements){return [];}',
      [
        step(
          'Keep required work',
          'Select necessary tasks and return their names.',
          'filter chooses records; map chooses their task fields.',
          scope1,
          ['required', 'empty'],
        ),
        step(
          'Require measurable acceptance',
          'Keep only records whose necessary and measurable flags are true.',
          'Check both flags before selecting a task.',
          scope2,
          ['vague', 'clear'],
        ),
        step(
          'Normalize and bound the list',
          'Require strict boolean flags and string task names. Trim, remove blank/duplicate names, and limit to three.',
          'Use a Set after normalizing names.',
          scope3,
          ['duplicate', 'limit', 'strict'],
        ),
      ],
      [
        check(
          'required',
          'A required task and a later task',
          [
            [
              { task: 'Search', necessary: true, measurable: true },
              { task: 'Logo', necessary: false, measurable: true },
            ],
          ],
          ['Search'],
          'First release focuses on required work.',
        ),
        check('empty', 'No requirements', [[]], [], 'Do not invent a task.'),
        check(
          'vague',
          'No acceptance measure',
          [[{ task: 'Better AI', necessary: true, measurable: false }]],
          [],
          'A vague feature needs clarification.',
        ),
        check(
          'clear',
          'A checkable task',
          [[{ task: 'Show citations', necessary: true, measurable: true }]],
          ['Show citations'],
          'A measurable requirement can enter scope.',
        ),
        check(
          'duplicate',
          'Repeated and blank names',
          [
            [
              { task: ' Search ', necessary: true, measurable: true },
              { task: 'Search', necessary: true, measurable: true },
              { task: ' ', necessary: true, measurable: true },
            ],
          ],
          ['Search'],
          'Normalize before deduplicating.',
        ),
        check(
          'limit',
          'Too many first-release items',
          [['A', 'B', 'C', 'D'].map((task) => ({ task, necessary: true, measurable: true }))],
          ['A', 'B', 'C'],
          'The exercise has an explicit capacity bound.',
        ),
        check(
          'strict',
          'A string flag',
          [[{ task: 'Refund', necessary: 'yes', measurable: true }]],
          [],
          'Labels must obey the agreed shape.',
        ),
      ],
    ),
    project: project(
      'A customer-reviewed brief',
      'Interview a shop owner or conduct a clearly labelled role-play. Produce a first-release brief backed by observed tasks and measurable acceptance.',
      [
        'Workflow observations and a baseline.',
        'A bounded brief with assumptions and exclusions.',
        'Reviewer feedback and resulting revisions.',
      ],
      [
        [
          'Learn the current work',
          [
            'Ask for a demonstration with safe examples.',
            'Record users, volume, errors, and constraints.',
            'Separate observations from assumptions.',
          ],
        ],
        [
          'Write the agreement',
          [
            'Choose one customer outcome.',
            'List first-release and later tasks.',
            'Write measurable acceptance and failure behaviour.',
          ],
        ],
        [
          'Review with the customer',
          [
            'Walk through a simple prototype.',
            'Record concerns and corrections.',
            'Revise scope and identify the acceptance reviewer.',
          ],
        ],
      ],
      [
        'The problem follows observed work.',
        'The outcome has a baseline and measurement plan.',
        'Each required feature has acceptance conditions.',
        'Assumptions and exclusions are explicit.',
        'Feedback changes are recorded.',
      ],
      [
        [
          'Customer asks for automatic refunds',
          'Risk and approval requirements are discussed before scope expands.',
        ],
        ['No usable policy data', 'The dependency and fallback are documented.'],
        ['Prototype misses the staff workflow', 'Feedback produces a concrete brief revision.'],
      ],
      'Compare the AI solution with a search-only alternative using the same outcome measure.',
      [
        'Which assumption changed after discovery?',
        'What is the customer outcome rather than the feature?',
        'Who decides whether acceptance is met?',
      ],
    ),
    references: [
      reference(
        'GOV.UK understanding users',
        'https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs',
      ),
    ],
  },
  {
    day: 28,
    slug: 'capstone-build',
    title: 'Build one complete customer workflow',
    chapter: 'Delivery',
    concepts: ['Architecture and dependencies', 'Vertical integration'],
    prerequisites: [27],
    outcome: 'Deliver an inspectable working slice across interface, service, data, and AI.',
    story:
      'Amina can now explain the first release: staff sign in, search current policies, get a cited draft, review it, and record the outcome. Build that whole path before adding more features.',
    demo: demo(
      'Join the whole path',
      { interface: 'form', service: 'contract', data: 'policies' },
      [
        [
          'Trace one request',
          { path: 'form → session check → retrieval → answer → review' },
          'A vertical slice proves connected parts, not just separate demos.',
        ],
        [
          'Remove one dependency',
          { retrieval: 'unavailable', result: 'controlled fallback' },
          'Architecture includes what happens when a dependency fails.',
        ],
      ],
    ),
    sections: [
      section(
        'Draw the smallest complete system',
        'Show the browser, API, session store, database, policy index, provider adapter, and diagnostic events. Mark where identity is verified, data is filtered, model output is validated, and writes require approval.',
        'Explain each boundary with an input, output, and failure. Keep secrets on the server. The browser should receive only permitted data and public configuration. A diagram is useful when it predicts actual requests rather than merely lists technology names.',
      ),
      section(
        'Build a vertical slice',
        'A vertical slice follows one customer action through all required layers. Start with sign-in, a policy question, scoped retrieval, a cited answer, and human review. Use an offline adapter first and label it clearly.',
        'The downloadable workspace includes a runnable reference slice and extension tasks. Use it to understand boundaries, then complete an independent change. Copying a reference is practice evidence, not independent ownership of the system.',
      ),
      section(
        'Order dependencies and test failures',
        'Data and contracts need to exist before clients depend on them. The lab topologically orders a dependency graph and rejects missing parts or cycles. This is a build-planning rule, not a deployment tool.',
        'The real project tests disconnected and invalid paths: expired session, unavailable provider, missing policy, rejected approval, and duplicate retry. Capture expected/actual outcomes at each boundary and repair the earliest failing boundary.',
      ),
      section(
        'Keep the design understandable',
        'Write short decision records for important choices such as same-origin serving, SQLite, adapter mode, and human approval. Describe the constraint, considered options, choice, and consequence. Prefer a system a teammate can operate and debug.',
        'Keep a runnable main branch and focused reviewable changes. Connect the architecture diagram, API contract, data schema, evaluation report, and release runbook to the actual files and commands.',
      ),
    ],
    words: [
      {
        term: 'Vertical slice',
        meaning: 'One complete customer operation working across every needed layer.',
      },
      { term: 'Dependency', meaning: 'A part another part needs in order to work.' },
      {
        term: 'Decision record',
        meaning: 'A short explanation of a technical choice and its consequences.',
      },
    ],
    example: example(
      'javascript',
      order3 + '\nconsole.log(buildOrder({ui:["api"],api:["db"],db:[]}));',
      '["db","api","ui"]',
      [
        'The database is visited before its API dependent.',
        'Each completed part is included once.',
        'Missing dependencies and cycles stop the planner.',
      ],
    ),
    exercise: js(
      'A dependency-aware build plan',
      'Write buildOrder(parts), where keys are components and values list their dependencies. Visit keys in insertion order and each dependency in listed order. Return dependencies before dependents. Reject cycles or missing names with Error.',
      ['parts'],
      'buildOrder(parts)',
      'function buildOrder(parts){return [];}',
      [
        step(
          'List independent parts',
          'Return keys in their given order for graphs with no dependencies.',
          'Object.keys keeps the supplied key order.',
          order1,
          ['independent', 'empty'],
        ),
        step(
          'Visit dependencies first',
          'Use a depth-first visit and include each completed part once.',
          'Visit a part’s dependencies before pushing its name.',
          order2,
          ['chain', 'shared'],
        ),
        step(
          'Reject impossible plans',
          'Track active visits to detect cycles; reject names absent from parts.',
          'A visiting set differs from a completed set.',
          order3,
          ['cycle', 'missing'],
        ),
      ],
      [
        check(
          'independent',
          'Independent components',
          [{ db: [], api: [] }],
          ['db', 'api'],
          'Keep a stable order.',
        ),
        check('empty', 'No components', [{}], [], 'An empty plan has no work.'),
        check(
          'chain',
          'A three-part chain',
          [{ ui: ['api'], api: ['db'], db: [] }],
          ['db', 'api', 'ui'],
          'Dependencies precede their consumers.',
        ),
        check(
          'shared',
          'A shared dependency',
          [{ ui: ['api', 'auth'], api: ['db'], auth: ['db'], db: [] }],
          ['db', 'api', 'auth', 'ui'],
          'A shared part appears only once.',
        ),
        check(
          'cycle',
          'A cyclic graph',
          [{ api: ['db'], db: ['api'] }],
          null,
          'A cycle cannot satisfy this build plan.',
          'Error',
        ),
        check(
          'missing',
          'An absent dependency',
          [{ api: ['db'] }],
          null,
          'Missing parts need a deliberate repair.',
          'Error',
        ),
      ],
    ),
    project: project(
      'Amina’s complete policy-assistant capstone',
      'Use the workspace to deliver the customer-reviewed slice. Implement an independent feature and demonstrate both normal and denied/failing paths.',
      [
        'A runnable full-stack repository.',
        'Architecture, contract, and decision records.',
        'An integrated test and AI evaluation report.',
      ],
      [
        [
          'Run and understand',
          [
            'Follow the clean setup instructions.',
            'Trace one request across the actual files.',
            'Identify fixture and real-provider modes.',
          ],
        ],
        [
          'Own a complete change',
          [
            'Choose a requirement from the reviewed brief.',
            'Implement it across the necessary boundaries.',
            'Add meaningful tests and document the decision.',
          ],
        ],
        [
          'Demonstrate the result',
          [
            'Show sign-in, scoped retrieval, citations, and review.',
            'Reproduce provider, permission, and missing-source failures.',
            'Ask a reviewer to run the project from the README.',
          ],
        ],
      ],
      [
        'The whole main flow runs from documented commands.',
        'Permissions apply before data reaches the model.',
        'Citations expose current permitted sources.',
        'Failures have honest recovery paths.',
        'An independent change has tests and reviewer evidence.',
      ],
      [
        ['Another shop session asks the question', 'No cross-shop source is exposed.'],
        ['Provider stopped or timed out', 'The interface shows the defined fallback.'],
        ['Clean checkout by a reviewer', 'The main flow and tests are reproducible.'],
      ],
      'Add a second customer workflow and explain how it changes the architecture and evaluation requirements.',
      [
        'Which boundary caused the hardest integration failure?',
        'What did the reference help you understand?',
        'Which change can you defend without its solution?',
      ],
    ),
    references: [
      reference(
        'FastAPI larger applications',
        'https://fastapi.tiangolo.com/tutorial/bigger-applications/',
      ),
    ],
  },
  {
    day: 29,
    slug: 'safe-release',
    title: 'Harden the capstone and rehearse recovery',
    chapter: 'Delivery',
    concepts: ['Security review', 'Migrations and rollback'],
    prerequisites: [28],
    outcome: 'Release with verified permission, data, and recovery behaviour.',
    story:
      'Before staff rely on the capstone, Amina asks what happens if a deployment fails or a customer tries to access another shop. Prove those answers with tests and a recovery rehearsal.',
    demo: demo(
      'Migrate without losing the original',
      { oldRecord: 'id 1 · text Hello', backup: 'verified' },
      [
        [
          'Add the status field',
          { newRecord: 'id 1 · text Hello · status open', oldRecord: 'unchanged' },
          'A migration must preserve the existing information and obey its contract.',
        ],
        [
          'Encounter invalid data',
          { result: 'stop and investigate' },
          'Silently changing bad data can make recovery harder.',
        ],
      ],
    ),
    sections: [
      section(
        'Review threats at each boundary',
        'List assets, callers, trust boundaries, and likely failures. Test unauthorized reads/writes, changed approval, replay, unsafe HTML rendering, malformed model output, document injection, and private logging. Include provider egress and spending limits.',
        'The lab is a pure-data migration exercise. It does not certify security. The real project requires direct requests that attempt the denied operations and inspection of actual database and log outcomes.',
      ),
      section(
        'Plan a migration before executing it',
        'Describe the old schema, new schema, preserved fields, constraints, and invalid-data policy. Run a dry run on a copy. Verify row counts, ids, relationships, and representative records afterward.',
        'Keep a verified backup and test restore. A rollback may require both application version and data restore. Never assume reversing a code commit reverses a database migration or an external operation.',
      ),
      section(
        'Harden the deployment',
        'Serve over HTTPS with production cookie settings. Restrict accepted hosts and origins, set resource and request limits, and keep keys in server configuration. Pin dependencies and inspect the frontend bundle for accidental private configuration.',
        'Use health and smoke checks from the release lesson. Configure log access and retention. Record who can deploy, approve risky actions, rotate keys, and recover data. The local learning accounts and localhost settings are not production credentials.',
      ),
      section(
        'Rehearse and retain evidence',
        'Deploy a known version into a rehearsal environment with safe data. Attempt the cross-shop tests and a deliberate failed change. Restore the verified version and data, then repeat the main flow.',
        'Publish a concise release record with commit, configuration mode, migration result, evaluation version, known limits, and recovery evidence. If a required check fails, fix it or keep the release blocked with a clear owner.',
      ),
    ],
    words: [
      {
        term: 'Threat model',
        meaning: 'An account of what needs protection, from whom, and at which boundaries.',
      },
      {
        term: 'Migration',
        meaning: 'A controlled change to the structure or meaning of stored data.',
      },
      {
        term: 'Restore verification',
        meaning: 'Testing that a backup can recover the intended usable data.',
      },
    ],
    example: example(
      'javascript',
      migrate3 + '\nconsole.log(migrate([{id:1,text:"Hello"}]));',
      '[{"id":1,"text":"Hello","status":"open"}]',
      [
        'A new object preserves the old fields.',
        'The missing status gets the agreed default.',
        'Invalid status or identifiers stop rather than silently repair records.',
      ],
    ),
    exercise: js(
      'A non-mutating status migration',
      'Write migrate(rows). Preserve fields, add open for a missing/null status, keep open or closed, reject other statuses and invalid/duplicate positive integer ids with RangeError. The checker also verifies the supplied rows were not changed.',
      ['rows'],
      '({rows:migrate(rows),unchanged:JSON.stringify(rows)===before})',
      'function migrate(rows){return rows;}',
      [
        step(
          'Add a field without changing the source',
          'Return new row objects with the original fields and status defaulting to open.',
          'Use map and object spread; do not assign row.status.',
          migrate1,
          ['old', 'existing', 'empty'],
        ),
        step(
          'Reject unknown statuses',
          'Only open and closed are accepted after applying the default.',
          'Validate before returning the new row.',
          migrate2,
          ['status'],
        ),
        step(
          'Validate record identity',
          'Require unique positive integer ids. Preserve the original input even when successful.',
          'Track seen ids in a Set.',
          migrate3,
          ['duplicate', 'id'],
        ),
      ],
      [
        check(
          'old',
          'An old row',
          [[{ id: 1, text: 'Hello' }]],
          { rows: [{ id: 1, text: 'Hello', status: 'open' }], unchanged: true },
          'Preserve data and leave the input untouched.',
        ),
        check(
          'existing',
          'An existing closed row',
          [[{ id: 2, text: 'Done', status: 'closed' }]],
          { rows: [{ id: 2, text: 'Done', status: 'closed' }], unchanged: true },
          'Do not reset a valid existing status.',
        ),
        check(
          'empty',
          'No stored rows',
          [[]],
          { rows: [], unchanged: true },
          'An empty migration has a defined outcome.',
        ),
        check(
          'status',
          'Unknown status',
          [[{ id: 1, status: 'secret' }]],
          null,
          'Unexpected data needs investigation.',
          'RangeError',
        ),
        check(
          'duplicate',
          'Repeated primary key',
          [[{ id: 1 }, { id: 1 }]],
          null,
          'Identity must remain unique.',
          'RangeError',
        ),
        check(
          'id',
          'Invalid primary key',
          [[{ id: 0 }]],
          null,
          'The identity contract is checked.',
          'RangeError',
        ),
      ],
      'const before=JSON.stringify(rows);',
    ),
    project: project(
      'A hardened release and rollback',
      'Perform a threat review, data migration rehearsal, and rollback of the real capstone with safe data. Preserve the evidence for a reviewer.',
      [
        'A boundary-specific threat and test matrix.',
        'A migration/backup/restore report.',
        'A versioned release and recovery runbook.',
      ],
      [
        [
          'Test the boundaries',
          [
            'Attempt cross-shop and cross-customer requests.',
            'Test approval change, expiry, and replay.',
            'Inspect rendering, provider validation, and safe logs.',
          ],
        ],
        [
          'Rehearse data change',
          [
            'Back up and verify the restored copy.',
            'Migrate a copy and compare rows and relationships.',
            'Record whether rollback requires data restore.',
          ],
        ],
        [
          'Release and recover',
          [
            'Build a known commit with production configuration documented.',
            'Run health and main-flow smoke checks.',
            'Restore after a deliberate failure and repeat the checks.',
          ],
        ],
      ],
      [
        'Denied operations cannot change protected data.',
        'Secrets stay out of client code and logs.',
        'Migration preserves intended records and constraints.',
        'Backup restore is tested.',
        'Rollback produces a usable main flow.',
      ],
      [
        ['Another shop requests a source', 'No source content leaks.'],
        ['Migration sees invalid status', 'It stops with no silent data rewrite.'],
        [
          'A release fails its smoke test',
          'The verified earlier version and intended data are restored.',
        ],
      ],
      'Arrange an independent security review and address one reproduced finding with a focused regression test.',
      [
        'Which test checked the real boundary?',
        'What would rolling back code fail to restore?',
        'What evidence supports the release decision?',
      ],
    ),
    references: [
      reference(
        'OWASP application security verification',
        'https://owasp.org/www-project-application-security-verification-standard/',
      ),
      reference('SQLite backup guidance', 'https://www.sqlite.org/backup.html'),
    ],
  },
  {
    day: 30,
    slug: 'independent-handoff',
    title: 'Demonstrate, hand over, and test your independence',
    chapter: 'Delivery',
    concepts: ['Technical communication', 'Readiness evidence'],
    prerequisites: [29],
    outcome: 'Defend a working capstone and identify the skills that still need practice.',
    story:
      'Amina wants a teammate to run the product after your visit. A hiring reviewer also wants to see whether you can make and explain a change without following a solution.',
    demo: demo(
      'Separate practice from independence',
      { lessons: 'completed', readiness: 'needs evidence' },
      [
        [
          'Show a verified independent change',
          {
            evidence: 'implementation · tests · explanation',
            readiness: 'review the remaining skills',
          },
          'Course completion is a practice record. Independent performance supplies different evidence.',
        ],
        [
          'Identify a gap',
          { gap: 'recover a broken deployment', next: 'targeted recovery practice' },
          'A useful review ends with a concrete next task when a skill is not demonstrated.',
        ],
      ],
    ),
    sections: [
      section(
        'Demonstrate the customer outcome',
        'Start the demo with the original problem and baseline. Show the main operation with realistic safe data, then one denied case and one recoverable failure. Explain what improved and what remains limited.',
        'Be honest about the mode: an offline extractive or fixture demonstration does not prove real-model quality. Show the separate real-provider evaluation if you ran it. Give the reviewer the commit and commands needed to reproduce your claims.',
      ),
      section(
        'Hand over operation and ownership',
        'Provide setup, architecture, API contract, data model, configuration placeholders, evaluation command, known limits, and recovery steps. Identify owners for deployment, incidents, data access, and policy updates.',
        'Ask a teammate to start from a clean checkout and follow the runbook without your intervention. Record where they get stuck and improve the instructions. A handoff is successful when someone else can operate and diagnose the product.',
      ),
      section(
        'Complete an independent challenge',
        'Choose an unseen requirement with a reviewer. Examples include expiring policies, a second shop workflow, duplicate retry protection, or a stale-response bug. Agree on acceptance before coding; do not open the course solution for that challenge.',
        'You may use AI tools, as working engineers do. Keep a short record of suggestions you checked or rejected. Explain the code, tests, boundaries, tradeoffs, and one failure investigation in your own words. Independence means owning the result, not avoiding all tools.',
      ),
      section(
        'Use a readiness review with evidence',
        'Review build, debugging, data, security, AI evaluation, delivery/recovery, explanation/handoff, and independent change. For each skill attach a reproducible artifact and have a reviewer verify it. A checked box or function output cannot verify that evidence.',
        'The exercise practices a completeness rule. Its ready flag means the supplied records meet that rule, not that someone is guaranteed a job. If a skill has a gap, choose targeted practice and reassess. Beyond these 30 lessons, repeat projects with unfamiliar requirements and real team review.',
      ),
    ],
    words: [
      {
        term: 'Handoff',
        meaning: 'Giving another person enough knowledge and instructions to operate the product.',
      },
      {
        term: 'Independent evidence',
        meaning: 'Verified work on a task without following its supplied solution.',
      },
      {
        term: 'Readiness gap',
        meaning: 'A skill that has not yet been demonstrated with sufficient evidence.',
      },
    ],
    example: example(
      'javascript',
      ready3 +
        '\nconsole.log(readiness([{skill:"build",verified:true,independent:true,artifact:"repo:change"}]));',
      'ready is false; the other seven skill names appear in gaps',
      [
        'The review names the required skills explicitly.',
        'Each needs a verified independent artifact record.',
        'Missing evidence produces a practice target, not a mastery claim.',
      ],
    ),
    exercise: js(
      'An evidence completeness rule',
      'Write readiness(evidence). Return ready and gaps in the stated skill order: build, debug, data, security, ai, delivery, explain, independent. Each skill needs verified=true, independent=true, and a non-blank artifact string. This checks records, not the artifacts themselves.',
      ['evidence'],
      'readiness(evidence)',
      'function readiness(evidence){return {ready:true,gaps:[]};}',
      [
        step(
          'Require build and debugging evidence',
          'For this step require verified build and debug entries. Return missing skills in that order.',
          'Use some for each required skill.',
          ready1,
          ['basic', 'none'],
        ),
        step(
          'Cover the whole review',
          'Require all eight skills and a non-blank artifact string for each.',
          'The artifact is a link or reproducible report reference; a reviewer must inspect it.',
          ready2,
          ['all', 'artifact'],
        ),
        step(
          'Require independent work',
          'Each matching entry also needs independent === true. A completed tutorial alone does not qualify.',
          'Check all requirements on the same entry.',
          ready3,
          ['guided', 'strict'],
        ),
      ],
      [
        check(
          'basic',
          'Two verified basics',
          [
            [
              { skill: 'build', verified: true, artifact: 'build', independent: true },
              { skill: 'debug', verified: true, artifact: 'debug', independent: true },
            ],
          ],
          { ready: true, gaps: [] },
          'The intermediate rule begins with two skills.',
        ),
        check(
          'none',
          'No evidence',
          [[]],
          { ready: false, gaps: ['build', 'debug'] },
          'Missing skills remain visible.',
        ),
        check(
          'all',
          'A complete reviewed record set',
          [fullEvidence],
          { ready: true, gaps: [] },
          'All supplied records meet the completeness contract.',
        ),
        check(
          'artifact',
          'A blank AI artifact',
          [fullEvidence.map((item) => (item.skill === 'ai' ? { ...item, artifact: ' ' } : item))],
          { ready: false, gaps: ['ai'] },
          'A flag without an artifact is insufficient.',
        ),
        check(
          'guided',
          'Only guided security work',
          [
            fullEvidence.map((item) =>
              item.skill === 'security' ? { ...item, independent: false } : item,
            ),
          ],
          { ready: false, gaps: ['security'] },
          'Practice and independent evidence differ.',
        ),
        check(
          'strict',
          'A string verification flag',
          [
            fullEvidence.map((item) =>
              item.skill === 'data' ? { ...item, verified: 'yes' } : item,
            ),
          ],
          { ready: false, gaps: ['data'] },
          'Verification has a strict shape.',
        ),
      ],
    ),
    project: project(
      'A reviewer-run capstone and unseen change',
      'Complete an independent requirement, demonstrate the product, and have another person verify the handoff and eight-skill readiness review.',
      [
        'An independent change with acceptance and tests.',
        'A reproducible demo and handoff package.',
        'A reviewer-verified skill report and next-practice plan.',
      ],
      [
        [
          'Own an unseen task',
          [
            'Agree on a new requirement and acceptance.',
            'Build and debug without its reference solution.',
            'Record AI assistance and how you checked it.',
          ],
        ],
        [
          'Hand over the system',
          [
            'Have a reviewer run a clean checkout.',
            'Show main, denied, and failed/recovered paths.',
            'Explain architecture, data, evaluation, and release decisions.',
          ],
        ],
        [
          'Review readiness',
          [
            'Attach evidence for all eight skills.',
            'Ask the reviewer to reproduce important claims.',
            'Choose a targeted project for each unverified skill.',
          ],
        ],
      ],
      [
        'The change meets independently agreed acceptance.',
        'You can explain and debug its code.',
        'A reviewer can run the project and recovery instructions.',
        'AI quality claims match the actual execution mode.',
        'The review identifies verified skills and unresolved gaps.',
      ],
      [
        ['Reviewer starts from a clean checkout', 'The runbook works without hidden setup.'],
        ['Reviewer changes a requirement', 'You can adapt and explain the tradeoff.'],
        ['A skill has no independent evidence', 'It remains a gap with a concrete practice task.'],
      ],
      'Build a second capstone for a different customer workflow, work with a teammate, and repeat the independent review before applying the readiness claim to that context.',
      [
        'Which skill did the reviewer verify most convincingly?',
        'Which gap needs another project?',
        'What can you explain and change without the course solution?',
      ],
    ),
    references: [
      reference(
        'GitHub README guidance',
        'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
      ),
    ],
  },
];

const findCase = (day, id) =>
  lessons.find((lesson) => lesson.day === day).exercise.cases.find((item) => item.id === id);
for (const id of ['private', 'missing']) {
  const item = findCase(26, id);
  const original = item.expected;
  const status = id === 'private' ? 'ok' : 'unknown';
  const duration = id === 'private' ? 12 : 0;
  item.expectedAtStep = { 0: original, 1: { ...original, status, duration } };
  item.expected = { ...original, status, duration, code: id === 'private' ? 'OK' : 'UNKNOWN' };
}
for (const id of ['bad', 'duration']) {
  const item = findCase(26, id);
  item.expectedAtStep = { 1: item.expected };
  item.expected = { ...item.expected, code: 'UNKNOWN' };
}
findCase(30, 'basic').expectedAtStep = { 0: { ready: true, gaps: [] } };
findCase(30, 'basic').expected = { ready: false, gaps: skills.slice(2) };
findCase(30, 'none').expectedAtStep = { 0: { ready: false, gaps: ['build', 'debug'] } };
findCase(30, 'none').expected = { ready: false, gaps: skills };
export default lessons;
