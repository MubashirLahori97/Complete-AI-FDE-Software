import lessonProjects from './lesson-projects.json';

export const REPO = 'https://github.com/MubashirLahori97/Complete-AI-FDE-Software';
export const dailyProjects = lessonProjects;
export type Track = 'Foundations' | 'Engineering' | 'AI systems' | 'Field work';
export interface Lesson {
  day: number;
  folder: string;
  title: string;
  summary: string;
  track: Track;
  build: string;
}

const definitions = [
  [
    'Setup_Learn_With_AI',
    'Your first program',
    'Understand instructions, data, and the tools that connect them.',
    'Write and explain a greeting program.',
  ],
  [
    'Python_Variables_Types',
    'Data, variables & types',
    'Learn why the same values can behave differently.',
    'Build a unit converter with input validation.',
  ],
  [
    'Conditionals_Loops',
    'Decisions & repetition',
    'Turn rules into conditions and repeated actions.',
    'Specify and build a number-guessing game.',
  ],
  [
    'Functions',
    'Functions & abstraction',
    'Break a problem into small pieces with clear contracts.',
    'Refactor a program into reusable functions.',
  ],
  [
    'Lists_Dictionaries',
    'Collections & data models',
    'Choose a useful structure for real-world information.',
    'Design and build a contact book.',
  ],
  [
    'Files_Errors_Debugging',
    'Persistence & debugging',
    'Save state and handle the things that go wrong.',
    'Save contacts and recover from missing files.',
  ],
  [
    'Project1_CLI_App',
    'Project 01 · A complete CLI',
    'Scope, finish, and put your first tool in someone else’s hands.',
    'Ship a command-line expense tracker.',
  ],
  [
    'Git_GitHub',
    'Git & working together',
    'Track decisions, review changes, and recover safely.',
    'Make a branch, review a diff, and merge a fix.',
  ],
  [
    'HTTP_APIs_JSON',
    'HTTP, APIs & JSON',
    'Follow a request from your program to a server and back.',
    'Build a weather CLI and handle failed requests.',
  ],
  [
    'Environments_Packages',
    'Reproducible environments',
    'Make your application work beyond your own laptop.',
    'Recreate a project from a fresh environment.',
  ],
  [
    'OOP_Essentials',
    'Objects, just enough',
    'Model state and behavior without unnecessary complexity.',
    'Compare a class-based and function-based tracker.',
  ],
  [
    'Testing_Clean_Code',
    'Testing & reading code',
    'Replace “it seems to work” with specific evidence.',
    'Write a regression test that catches a real bug.',
  ],
  [
    'First_Web_App',
    'Your first interface',
    'Turn working logic into an experience people can use.',
    'Build a web interface for your expense tracker.',
  ],
  [
    'Project2_Deployed_Web_App',
    'Project 02 · Your first URL',
    'Ship your application and test it outside your own session.',
    'Publish and test your app on another device.',
  ],
  [
    'LLMs_How_They_Work',
    'How language models work',
    'Understand tokens, context, uncertainty, and cost.',
    'Make a model call and estimate its cost.',
  ],
  [
    'Prompt_Engineering',
    'Prompts as specifications',
    'Give a model a clear task and measure its behavior.',
    'Evaluate a ticket classifier on a fixed test set.',
  ],
  [
    'Structured_Outputs_Tools',
    'Structured outputs & tools',
    'Connect model decisions to validated application code.',
    'Define and validate a calculator tool contract.',
  ],
  [
    'Embeddings_Semantic_Search',
    'Embeddings & semantic search',
    'Explore how vectors make similarity searchable.',
    'Build and compare semantic and keyword search.',
  ],
  [
    'RAG',
    'Grounding answers with RAG',
    'Retrieve relevant evidence before generating an answer.',
    'Build document Q&A with citations and abstention.',
  ],
  [
    'Agents',
    'Agents with boundaries',
    'Design a tool-using loop that can stop and recover.',
    'Build a constrained research workflow.',
  ],
  [
    'Project3_RAG_Chatbot',
    'Project 03 · An AI product',
    'Combine retrieval, generation, and a usable interface.',
    'Deploy and stranger-test a document assistant.',
  ],
  [
    'Evals',
    'Evaluating AI systems',
    'Measure quality consistently across changes.',
    'Create a scored, repeatable evaluation suite.',
  ],
  [
    'Guardrails_Cost',
    'Guardrails & unit economics',
    'Plan for adversarial input, resource limits, and budget.',
    'Test abuse cases and calculate operating costs.',
  ],
  [
    'FastAPI_Databases',
    'Backends & databases',
    'Build durable state behind a clear API contract.',
    'Build an API with validation and stored feedback.',
  ],
  [
    'Observability_Debugging',
    'Observability & operations',
    'Make problems visible and recovery repeatable.',
    'Add structured logs and a recovery runbook.',
  ],
  [
    'Client_Discovery_FDE',
    'Customer discovery',
    'Find the real problem before deciding what to build.',
    'Conduct discovery and write a measurable brief.',
  ],
  [
    'Portfolio_Getting_Hired',
    'Show your work',
    'Explain the problem, your decisions, and the evidence.',
    'Publish a case study with a working demo.',
  ],
  [
    'Capstone_Part1',
    'Capstone · Design & build',
    'Own a complete solution for a specific customer workflow.',
    'Build a scoped AI system with acceptance tests.',
  ],
  [
    'Capstone_Part2',
    'Capstone · Deploy & harden',
    'Prepare your solution for real users and real failures.',
    'Deploy, test permissions, and document rollback.',
  ],
  [
    'Ship_It',
    'Demo, reflect & continue',
    'Make the handoff clear and use feedback to plan your next step.',
    'Record a demo and an honest retrospective.',
  ],
];

export const lessons: Lesson[] = definitions.map(([folder, title, summary, build], index) => ({
  day: index + 1,
  folder: `${String(index + 1).padStart(2, '0')}_Day_${folder}`,
  title,
  summary,
  build: `Build ${lessonProjects[index].title.toLowerCase()}.`,
  track:
    index < 7
      ? 'Foundations'
      : index < 14
        ? 'Engineering'
        : index < 21
          ? 'AI systems'
          : 'Field work',
}));

export const tracks: { name: Track; range: string; description: string; skill: string }[] = [
  {
    name: 'Foundations',
    range: '01–07',
    description: 'Think in programs. Work with data. Debug with confidence.',
    skill: 'Understand',
  },
  {
    name: 'Engineering',
    range: '08–14',
    description: 'Connect systems. Test your work. Ship your first application.',
    skill: 'Build',
  },
  {
    name: 'AI systems',
    range: '15–21',
    description: 'Ground model outputs. Use tools. Measure what works.',
    skill: 'Evaluate',
  },
  {
    name: 'Field work',
    range: '22–30',
    description: 'Discover the problem. Own delivery. Prove the outcome.',
    skill: 'Deliver',
  },
];

export const phases = [
  {
    id: 2,
    title: 'Build like an engineer',
    range: 'Days 31–50',
    folder: '31_Phase2_Build_Like_An_Engineer',
    description: 'Deepen your database, API, testing, and collaboration skills.',
    tasks: [
      'Explain a schema and its tradeoffs',
      'Build an API with auth and validation',
      'Rebuild a project with a meaningful test suite',
    ],
  },
  {
    id: 3,
    title: 'Ship real products',
    range: 'Days 51–70',
    folder: '32_Phase3_Ship_Real_Products',
    description: 'Develop a frontend and deliver a secure product to real users.',
    tasks: [
      'Build an accessible, responsive frontend',
      'Test permission boundaries and failure paths',
      'Deploy a product and collect user feedback',
    ],
  },
  {
    id: 4,
    title: 'Work with customers',
    range: 'Days 71–90',
    folder: '33_Phase4_Get_Paid_Get_Hired',
    description: 'Practise discovery, delivery, interviews, and clear communication.',
    tasks: [
      'Write a scoped customer proposal',
      'Explain system design tradeoffs aloud',
      'Publish a case study with real evidence',
    ],
  },
];

export interface Question {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}
const q = (prompt: string, options: string[], answer: number, explanation: string): Question => ({
  prompt,
  options,
  answer,
  explanation,
});
export const quizzes: Record<number, Question[]> = {
  1: [
    q(
      'What is a program?',
      [
        'A set of instructions that operate on data',
        'Only the screen you see',
        'A list of computer parts',
      ],
      0,
      'Programs combine instructions and data. An interface is one way to interact with a program.',
    ),
    q(
      'AI drafted a working greeting program. What comes next?',
      [
        'Ship it without reading it',
        'Explain each line and test different inputs',
        'Make the code longer',
      ],
      1,
      'Working once is a starting point. Read the code and check whether it meets your specification.',
    ),
  ],
  2: [
    q(
      'What does Python print for "2" + "2"?',
      ['4', 'An error', '22'],
      2,
      'Both values are strings, so + joins the text. Numeric addition needs numbers.',
    ),
    q(
      'A converter receives an empty value. What should it do?',
      [
        'Validate input and return a useful message',
        'Assume the value is always zero',
        'Hide the error and report success',
      ],
      0,
      'Validation makes the input contract explicit and avoids silently producing a misleading result.',
    ),
  ],
  3: [
    q(
      'What happens when open_tickets is 10 and the condition is open_tickets > 10?',
      ['The condition is true', 'The condition is false', 'The program must crash'],
      1,
      'Greater than excludes equality. Use >= when exactly 10 should also qualify.',
    ),
    q(
      'A loop processes a growing queue. What must you think about?',
      ['Only its variable names', 'Only the first item', 'Termination and empty-input behavior'],
      2,
      'Check when the loop stops, including an empty queue and a queue that changes during processing.',
    ),
  ],
  4: [
    q(
      'What makes a function a useful abstraction?',
      [
        'A clear input/output contract that hides implementation detail',
        'As many arguments as possible',
        'A name that describes nothing',
      ],
      0,
      'Callers should understand the function’s purpose without needing to know every internal step.',
    ),
    q(
      'Two functions duplicate a rule. What is a useful next step?',
      [
        'Copy it a third time',
        'Consider one shared function and test the callers',
        'Replace all functions with one giant function',
      ],
      1,
      'A shared abstraction can reduce inconsistent changes, provided it has a clear, stable responsibility.',
    ),
  ],
  5: [
    q(
      'Which structure naturally maps a ticket ID to its details in Python?',
      ['A single string', 'A dictionary', 'An integer'],
      1,
      'A dictionary associates keys with values. A stable ticket ID is usually safer than a person’s name as a key.',
    ),
    q(
      'Two contacts have the same name. What should your data model allow?',
      [
        'Delete the older one automatically',
        'Treat names as always unique',
        'Use distinct IDs for distinct contacts',
      ],
      2,
      'Names are not reliable identifiers. Model uniqueness separately from display fields.',
    ),
  ],
  6: [
    q(
      'Why save application state to a file or database?',
      [
        'To keep it available after the process stops',
        'To avoid all possible bugs',
        'To make every operation instant',
      ],
      0,
      'Persistence keeps information beyond the lifetime of the program. Reliability still requires testing and recovery.',
    ),
    q(
      'Where should you start when a traceback appears?',
      [
        'Change unrelated code',
        'Identify the exception and the relevant failing line',
        'Delete the traceback',
      ],
      1,
      'The exception and stack identify where to investigate. Reproduce the failure before changing code.',
    ),
  ],
  7: [
    q(
      'What makes a first CLI project ready to share?',
      [
        'It has many unfinished features',
        'A new user can install and run it from the README',
        'It works only in your terminal session',
      ],
      1,
      'A usable, scoped project includes clear instructions, tested behavior, and helpful errors.',
    ),
    q(
      'A user gets confused while trying your tracker. What do you do?',
      [
        'Observe and turn the confusion into actionable feedback',
        'Explain that the user is wrong',
        'Add an unrelated AI feature',
      ],
      0,
      'Watching an actual workflow reveals problems that your own assumptions often miss.',
    ),
  ],
  8: [
    q(
      'What does a Git diff show?',
      [
        'The price of your project',
        'Every file on the computer',
        'The changes between two versions',
      ],
      2,
      'A diff lets you review added, removed, and changed lines before committing or merging.',
    ),
    q(
      'Why use a branch for a change?',
      [
        'To work and review independently from the main line',
        'To automatically fix every conflict',
        'To avoid testing',
      ],
      0,
      'A branch separates a line of work. Review, tests, and conflict resolution still matter.',
    ),
  ],
  9: [
    q(
      'What is an API contract?',
      [
        'A screen colour palette',
        'Agreed rules for requests, responses, and behavior',
        'A guarantee that the internet never fails',
      ],
      1,
      'The contract describes how another program can use the service, including error behavior.',
    ),
    q(
      'An HTTP request fails. What should you inspect?',
      [
        'Only the button shape',
        'Nothing; retry forever',
        'The status, error details, and request context',
      ],
      2,
      'Distinguish invalid input, auth failures, rate limits, and transient outages before choosing a response.',
    ),
  ],
  10: [
    q(
      'What problem does a virtual environment help solve?',
      ['Project dependencies interfering with each other', 'All network outages', 'Slow typing'],
      0,
      'Virtual environments isolate Python packages. Version records help recreate a compatible setup.',
    ),
    q(
      'What is a strong reproducibility check?',
      [
        'Rerun it in the same existing environment',
        'Start from a fresh clone and follow only the documented steps',
        'Remove installation instructions',
      ],
      1,
      'A fresh environment uncovers hidden assumptions and missing dependencies.',
    ),
  ],
  11: [
    q(
      'What does a class commonly group?',
      ['Only comments', 'State and related behavior', 'Only network requests'],
      1,
      'Classes can model entities with state and behavior. They are useful when that grouping simplifies the design.',
    ),
    q(
      'When should you introduce a class?',
      [
        'Whenever you can make the file longer',
        'Before understanding the problem',
        'When it gives a clearer model than a simpler alternative',
      ],
      2,
      'Judge the abstraction by clarity and maintenance cost, rather than by how sophisticated it looks.',
    ),
  ],
  12: [
    q(
      'What is a regression test?',
      [
        'A check that catches the return of a previously fixed bug',
        'A way to skip review',
        'Proof that every possible bug is absent',
      ],
      0,
      'Regression tests preserve important behavior across changes. No finite suite proves all behavior is correct.',
    ),
    q(
      'AI wrote tests that all pass. What should you review?',
      [
        'Only how many tests exist',
        'Whether assertions check the real requirements and edge cases',
        'Nothing; passing is enough',
      ],
      1,
      'Tests can pass while missing the failure you care about. Check their independence and coverage of requirements.',
    ),
  ],
  13: [
    q(
      'What is an interface’s main job?',
      ['Make the code longer', 'Help people achieve a task through the system', 'Hide every error'],
      1,
      'A useful interface makes actions, feedback, and recovery understandable to its intended users.',
    ),
    q(
      'What is a useful usability test?',
      [
        'Watch an intended user complete a task with minimal coaching',
        'Ask only the author to click through',
        'Count the number of colours',
      ],
      0,
      'Observe actual task completion, hesitations, and mistakes. Use the findings to improve the flow.',
    ),
  ],
  14: [
    q(
      'What changes when you deploy?',
      [
        'Nothing ever differs',
        'You no longer need dependencies',
        'The environment and users can differ from your laptop',
      ],
      2,
      'Paths, versions, configuration, permissions, and network conditions can all differ in production.',
    ),
    q(
      'Where should an API secret live?',
      [
        'In public frontend code',
        'In a server-side secret store or protected environment',
        'In a screenshot in the README',
      ],
      1,
      'Browser code and committed files are visible to users. Keep secrets on a trusted server.',
    ),
  ],
  15: [
    q(
      'What is a token?',
      [
        'A unit used by a model to represent and process text',
        'Always exactly one English word',
        'A database password',
      ],
      0,
      'Tokens can be words, parts of words, punctuation, or other representations. Tokenization depends on the model.',
    ),
    q(
      'Can a fluent model answer be factually wrong?',
      [
        'No, fluency guarantees accuracy',
        'Yes, check important claims against evidence',
        'Only when the answer is short',
      ],
      1,
      'Fluent generation is not proof of correctness. Design verification and abstention into the application.',
    ),
  ],
  16: [
    q(
      'What makes a prompt easier to evaluate?',
      [
        'A vague request for something impressive',
        'A clear task, constraints, and expected output',
        'No examples or criteria',
      ],
      1,
      'Explicit requirements let you compare behavior to a target rather than rely on an impression.',
    ),
    q(
      'A classifier succeeds on one ticket. What does that establish?',
      [
        'It will handle all future tickets',
        'The model needs no monitoring',
        'It handled that example; a representative test set is still needed',
      ],
      2,
      'Use varied, held-out cases and inspect errors. One success is not a reliability estimate.',
    ),
  ],
  17: [
    q(
      'Who should validate a model-proposed tool call?',
      [
        'Your application code before executing it',
        'Nobody; the model’s decision is sufficient',
        'Only the end user’s browser theme',
      ],
      0,
      'Check arguments, authorization, and allowed actions. Model output is untrusted input.',
    ),
    q(
      'A model requests a destructive action. What is a useful control?',
      [
        'Give it unlimited permissions',
        'Apply policy checks and appropriate human approval',
        'Hide the action from the user',
      ],
      1,
      'Use restricted permissions and explicit controls based on the action’s impact.',
    ),
  ],
  18: [
    q(
      'What does an embedding represent?',
      [
        'Only the literal spelling of a word',
        'Information as a vector used for similarity and other tasks',
        'A guarantee of factual correctness',
      ],
      1,
      'Embeddings map input into a learned vector space. Similarity is useful, but it is not evidence of truth.',
    ),
    q(
      'How do you compare semantic and keyword search?',
      [
        'Assume semantic search always wins',
        'Count code lines',
        'Test both on queries representative of your users',
      ],
      2,
      'Measure retrieval performance for your data. Exact identifiers can favor keyword search; hybrid approaches can help.',
    ),
  ],
  19: [
    q(
      'What does RAG add before generation?',
      [
        'Retrieval of relevant source information',
        'A guarantee that all sources are correct',
        'Unlimited model context',
      ],
      0,
      'RAG retrieves context for the model. Source quality, permissions, and answer faithfulness still need evaluation.',
    ),
    q(
      'The documents do not answer a question. What should your assistant do?',
      [
        'Invent a plausible answer',
        'Explain the evidence is insufficient',
        'Cite an unrelated paragraph',
      ],
      1,
      'Honest abstention is preferable to an unsupported answer. A citation must actually support the claim.',
    ),
  ],
  20: [
    q(
      'What does a tool-using agent typically combine?',
      [
        'A goal, tools, observations, and a repeated decision loop',
        'Only a text box',
        'Only a database backup',
      ],
      0,
      'An agent chooses actions, observes results, and continues toward a goal within explicit constraints.',
    ),
    q(
      'What prevents an agent from retrying forever?',
      [
        'A more confident system prompt alone',
        'No logs',
        'Step, time, and budget limits with stop conditions',
      ],
      2,
      'Enforce limits in code and provide recovery paths. Prompts alone are not a reliable resource control.',
    ),
  ],
  21: [
    q(
      'What makes a document assistant useful to a new user?',
      [
        'An unexplained empty text box',
        'Clear scope, useful examples, and supported answers',
        'A hidden demo URL',
      ],
      1,
      'Explain what the assistant knows, give starting questions, and let users inspect supporting evidence.',
    ),
    q(
      'What should you test before sharing the assistant?',
      [
        'Only a greeting',
        'Only the title font',
        'Representative questions, missing evidence, and permission boundaries',
      ],
      2,
      'Check both useful behavior and failure cases, especially who can access which documents.',
    ),
  ],
  22: [
    q(
      'Why keep a fixed evaluation set?',
      [
        'To compare changes on a consistent set of cases',
        'To avoid looking at failures',
        'To guarantee performance on every future input',
      ],
      0,
      'A consistent set makes regressions and improvements visible. Refresh it as real use reveals new cases.',
    ),
    q(
      'What should an evaluation rubric specify?',
      [
        'Only whether the answer sounds confident',
        'What counts as correct, supported, and acceptable',
        'Only the length of the prompt',
      ],
      1,
      'Define observable criteria and apply them consistently. Review automated judge scores against human judgments.',
    ),
  ],
  23: [
    q(
      'Can a prompt alone enforce data access permissions?',
      [
        'Yes, always',
        'No; enforce authorization in the application and data layer',
        'Only if it says “please”',
      ],
      1,
      'Treat prompts and retrieved text as untrusted. Enforce permissions outside the model.',
    ),
    q(
      'What belongs in an AI cost estimate?',
      [
        'Only the subscription headline',
        'Only one test call',
        'Usage volume, input/output tokens, retrieval, and infrastructure',
      ],
      2,
      'Use explicit price assumptions and realistic traffic. Add limits and monitor actual spend.',
    ),
  ],
  24: [
    q(
      'Why validate an API request?',
      [
        'To reject unsupported or malformed input clearly',
        'To eliminate the need for authentication',
        'To guarantee all data is correct',
      ],
      0,
      'Validation enforces the contract. Authorization and domain rules remain separate responsibilities.',
    ),
    q(
      'What needs a database transaction?',
      [
        'Changing a button label',
        'Related writes that must succeed or fail together',
        'Reading a static heading',
      ],
      1,
      'Transactions help keep related updates consistent, such as creating an order and its line items.',
    ),
  ],
  25: [
    q(
      'What helps connect logs from one request?',
      ['Random unrelated labels', 'A request or trace identifier', 'Removing timestamps'],
      1,
      'A shared identifier helps follow a request across components while avoiding sensitive data in logs.',
    ),
    q(
      'What should a runbook contain?',
      [
        'Only the product slogan',
        'Only a list of authors',
        'Symptoms, checks, recovery steps, and escalation guidance',
      ],
      2,
      'A runbook helps someone investigate and recover when the original developer is unavailable.',
    ),
  ],
  26: [
    q(
      'A customer says “we need AI.” What is a useful first question?',
      [
        'Can you walk me through the workflow that is causing trouble?',
        'Which model should I buy immediately?',
        'Can I build an agent without seeing your data?',
      ],
      0,
      'Start with the workflow, users, cost, and constraints. The solution may or may not need AI.',
    ),
    q(
      'What makes a useful success metric?',
      [
        '“The system is amazing”',
        'A measured reduction in handling time with a defined quality threshold',
        'The number of new frameworks installed',
      ],
      1,
      'Define a baseline, target, and guardrails with the customer before building.',
    ),
  ],
  27: [
    q(
      'What should a portfolio case study explain?',
      [
        'Only a screenshot',
        'The problem, decisions, implementation, and evidence of results',
        'A guaranteed salary claim',
      ],
      1,
      'Help the reader understand your contribution, tradeoffs, and what was actually measured.',
    ),
    q(
      'How should you describe an unmeasured impact?',
      [
        'Invent an impressive percentage',
        'Call it proven savings',
        'Label it as an estimate or leave out the claim',
      ],
      2,
      'Separate measured outcomes, assumptions, and expected benefits. Credibility depends on honest evidence.',
    ),
  ],
  28: [
    q(
      'What should come before a capstone implementation?',
      [
        'A scoped brief and observable acceptance criteria',
        'A choice of every possible framework',
        'An unlimited feature list',
      ],
      0,
      'Agree on the user, problem, scope, constraints, and evidence of success before choosing the implementation.',
    ),
    q(
      'How should you handle an ambitious optional feature?',
      [
        'Always add it before the core works',
        'Defer it unless it is necessary for the agreed outcome',
        'Replace all acceptance tests with it',
      ],
      1,
      'Protect the critical workflow and budget. Record future ideas without allowing them to block delivery.',
    ),
  ],
  29: [
    q(
      'What should you verify before deploying a customer app?',
      [
        'Only that the home page loads',
        'Permissions, secrets, error paths, and recovery',
        'Only how many commits exist',
      ],
      1,
      'A real delivery includes access controls, operational checks, and a way to recover from a bad change.',
    ),
    q(
      'Why document rollback?',
      [
        'To avoid monitoring',
        'To make deployments impossible',
        'To recover quickly when a release causes a problem',
      ],
      2,
      'Rollback is one recovery option. Test the steps and consider data compatibility as well as code.',
    ),
  ],
  30: [
    q(
      'What makes a useful delivery demo?',
      [
        'A real workflow and evidence against the acceptance criteria',
        'Only a list of packages',
        'A promise that nothing will ever fail',
      ],
      0,
      'Show what the customer can do, what was verified, and where limitations or follow-up work remain.',
    ),
    q(
      'What belongs in a retrospective?',
      [
        'Only praise',
        'What worked, what failed, and concrete improvements',
        'An invented claim of instant expertise',
      ],
      1,
      'Reflection turns experience into better decisions. Use evidence and choose actionable next steps.',
    ),
  ],
};

export const projectDefinitions = [
  {
    id: 'cli',
    title: 'Expense tracker',
    type: 'Foundations project',
    day: 7,
    description: 'A small, complete tool with reliable input handling and clear setup.',
    checks: [
      'A fresh clone runs from the README',
      'Invalid input has a helpful error',
      'Data survives a restart',
      'Someone else has tested it',
    ],
  },
  {
    id: 'web',
    title: 'Your first web application',
    type: 'Engineering project',
    day: 14,
    description: 'Turn a useful workflow into an accessible application with a live URL.',
    checks: [
      'The core task works on a phone',
      'Forms have labels and validation',
      'No secrets are exposed',
      'A new user can complete the task',
    ],
  },
  {
    id: 'rag',
    title: 'Document assistant',
    type: 'AI systems project',
    day: 21,
    description: 'A grounded assistant that knows its scope and can show its evidence.',
    checks: [
      'Citations support the answers',
      'Missing evidence produces abstention',
      'An eval set covers failure cases',
      'Document permissions are tested',
    ],
  },
  {
    id: 'capstone',
    title: 'Customer workflow capstone',
    type: 'FDE project',
    day: 30,
    description: 'Discover, build, evaluate, deploy, and hand over a customer solution.',
    checks: [
      'A brief defines the baseline and target',
      'Acceptance tests cover the scope',
      'Deployment and rollback are documented',
      'A case study separates evidence from estimates',
    ],
  },
];
