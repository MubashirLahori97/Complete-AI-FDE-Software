import { check, demo, example, project, reference, section, step } from './content-helpers.mjs';

const html = (body, style = '', script = '') =>
  `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Amina's shop</title><style>${style}</style></head><body>${body}${script ? `<script>${script}</script>` : ''}</body></html>`;
const formBody =
  '<main><h1>Contact Amina</h1><form id="message-form"><label for="customer">Your name</label><input id="customer" name="customer" type="text" required><label for="message">Your message</label><textarea id="message" name="message" required></textarea><button type="submit">Send message</button></form></main>';
const cards =
  '<main><h1>Amina’s inbox</h1><div class="grid"><article>Order 1: Tea</article><article>Order 2: Coffee</article></div><button>Open an order</button></main>';
const layoutStyle =
  'body{margin:0;padding:16px;font-family:system-ui;color:#254b3e}main{max-width:900px;margin:auto}.grid{display:grid;grid-template-columns:1fr;gap:16px}article{padding:16px;border:1px solid #9baa92;border-radius:10px;min-width:0}button{font:inherit;min-height:44px;padding:12px;margin-top:16px}@media(min-width:600px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}';
const inboxBody =
  '<main><h1>Amina’s inbox</h1><form id="form"><label for="body">New message</label><textarea id="body"></textarea><button type="submit">Add message</button></form><p id="status" role="status"></p><p>Messages: <output id="count">0</output></p><ul id="list"></ul></main>';
const renderInbox =
  'let messages = [{ id: 1, body: "Opening hours?" }];\nfunction render() {\n  document.getElementById("count").textContent = messages.length;\n  const list = document.getElementById("list");\n  list.textContent = "";\n  for (const message of messages) {\n    const item = document.createElement("li");\n    item.textContent = message.body;\n    list.append(item);\n  }\n}\nrender();';
const addMessage =
  '\ndocument.getElementById("form").addEventListener("submit", event => {\n  event.preventDefault();\n  const field = document.getElementById("body");\n  const body = field.value.trim();\n  messages.push({ id: messages.length + 1, body });\n  field.value = "";\n  document.getElementById("status").textContent = "Added";\n  render();\n});';
const safeMessage =
  '\ndocument.getElementById("form").addEventListener("submit", event => {\n  event.preventDefault();\n  const field = document.getElementById("body");\n  const body = field.value.trim();\n  if (!body) { document.getElementById("status").textContent = "Write a message first"; return; }\n  messages.push({ id: messages.length + 1, body });\n  field.value = "";\n  document.getElementById("status").textContent = "Added";\n  render();\n});';
const reactView =
  'import React from "react";\nexport default function App() {\n  return <main><h1>Amina’s inbox</h1><output id="count">10</output><button type="button">Add 1 message</button></main>;\n}';
const reactCount =
  'import React from "react";\nexport default function App() {\n  const [messages, setMessages] = React.useState<number>(10);\n  return <main><h1>Amina’s inbox</h1><output id="count">{messages}</output><button type="button" onClick={() => setMessages(previous => previous + 1)}>Add 1 message</button></main>;\n}';
const reactComplete =
  'import React from "react";\nexport default function App() {\n  const [messages, setMessages] = React.useState<number>(10);\n  return <main><h1>Amina’s inbox</h1><output id="count">{messages}</output><button type="button" onClick={() => setMessages(previous => previous + 1)}>Add 1 message</button><button type="button" onClick={() => setMessages(previous => Math.max(0, previous - 1))}>Answer 1 message</button><button type="button" onClick={() => setMessages(10)}>Start again</button></main>;\n}';
const dom = (id, label, script, expected, why) => ({ id, label, script, expected, why });

const lessons = [
  {
    day: 7,
    slug: 'reviewed-change',
    title: 'Set up your workspace and review a change',
    chapter: 'Programming',
    concepts: ['Git and review', 'Reproducible setup'],
    prerequisites: [6],
    outcome: 'Deliver a small tested change with a readable history.',
    story:
      'Amina wants a teammate to use your shipping fix. They need the files, the steps to run them, and a clear record of what changed.',
    demo: demo(
      'Prepare a reviewed change',
      { branch: 'main', tests: 'passing', decision: 'stop' },
      [
        [
          'Use a feature branch',
          { branch: 'feature/shipping-fix', decision: 'review the diff' },
          'A branch separates the change from the main version.',
        ],
        [
          'Review and check the change',
          { tests: 'passing', privateFiles: 'excluded', decision: 'ready for review' },
          'Passing tests and a readable change make another person’s review possible.',
        ],
      ],
    ),
    sections: [
      section(
        'A folder, an editor, and a terminal',
        'A project is a folder containing related files. An editor helps you read and change them. A terminal accepts commands that run programs or work with files. Run one command at a time and read its output before moving on.',
        'Install Node.js and Git using their official downloads. In your terminal, node --version and git --version should print their versions. Open a new terminal after installing a tool if the old terminal cannot find it. Keep your work in a new learning folder, separate from other projects.',
      ),
      section(
        'Keep a history with Git',
        'Git records versions of files. A repository is a folder with that history. A commit is a saved change with a message explaining its purpose. Git works locally; GitHub is a service where you can share a repository and review proposed changes.',
        'Start with git init in your learning folder. Use git status to see changed files. Select the intended files with git add, then make a commit. Avoid adding everything blindly: look for private files, temporary output, and unrelated changes first.',
      ),
      section(
        'Review a small branch',
        'A branch is a named line of work. Use git switch -c feature/shipping-fix to create a branch for the repair. A diff shows what changed between versions. Read it with git diff before committing.',
        'A useful review explains the problem, resulting behaviour, and tests. Include the unpaid-order reproduction from lesson 6. The browser exercise below checks a release decision; it does not run Git. The project requires real commands and a real commit in your own workspace.',
      ),
      section(
        'Make the work reproducible',
        'Another developer should be able to obtain the project and run its checks using the README. Record the runtime version, file names, command, and expected result. A clean second folder is a useful test of those instructions.',
        'Keep API keys and other private configuration out of the repository. An .env.example can contain empty placeholders and descriptions. Filename checks are only one guard: a secret can appear inside any file, so review the contents of the diff too.',
      ),
    ],
    words: [
      { term: 'Repository', meaning: 'A project folder with a recorded change history.' },
      { term: 'Commit', meaning: 'A saved change and its explanation.' },
      { term: 'Diff', meaning: 'A view of the lines added or removed by a change.' },
    ],
    example: example(
      'javascript',
      'const branch = "feature/shipping-fix";\nconst testsPass = true;\nconsole.log(branch !== "main" && testsPass);',
      'true',
      [
        'The branch name describes the change.',
        'testsPass records whether the checks succeeded.',
        'Both conditions must hold before this simplified workflow proceeds. Real review also examines the diff.',
      ],
    ),
    exercise: {
      title: 'A review-readiness rule',
      brief:
        'Write assessChange(files, testsPass, branch). Return stop:tests, stop:main, stop:private, or ready. Check in that order. This is a planning exercise; complete the Git project on your computer.',
      language: 'javascript',
      parameters: ['files', 'testsPass', 'branch'],
      result: 'assessChange(files, testsPass, branch)',
      starter: 'function assessChange(files, testsPass, branch) { return "ready"; }',
      steps: [
        step(
          'Stop after a failed check',
          'Return stop:tests when testsPass is false.',
          'Check the result before considering the branch or files.',
          'function assessChange(files, testsPass, branch) {\n  if (!testsPass) return "stop:tests";\n  return "ready";\n}',
          ['tests', 'ready'],
        ),
        step(
          'Keep main separate',
          'Reject changes prepared directly on main or master. Use stop:main.',
          'Check both protected names after checking the tests.',
          'function assessChange(files, testsPass, branch) {\n  if (!testsPass) return "stop:tests";\n  if (branch === "main" || branch === "master") return "stop:main";\n  return "ready";\n}',
          ['main', 'master'],
        ),
        step(
          'Exclude private file names',
          'Reject .env files and .pem or .key files. A placeholder .env.example is allowed, but still needs content review.',
          'Use files.some with a filename condition. The provided pattern also catches .env.local in a subfolder.',
          'function assessChange(files, testsPass, branch) {\n  if (!testsPass) return "stop:tests";\n  if (branch === "main" || branch === "master") return "stop:main";\n  if (files.some(file => !file.endsWith(".env.example") && (/(^|\\/)\\.env($|\\.)/.test(file) || /\\.(pem|key)$/.test(file)))) return "stop:private";\n  return "ready";\n}',
          ['env', 'key', 'placeholder'],
        ),
      ],
      cases: [
        check(
          'tests',
          'A failing test suite',
          [['quote.js'], false, 'feature/quote'],
          'stop:tests',
          'Review-ready work must pass its intended checks.',
        ),
        check(
          'ready',
          'A small tested branch',
          [['quote.js'], true, 'feature/quote'],
          'ready',
          'A valid plan should be able to proceed.',
        ),
        check(
          'main',
          'Work prepared on main',
          [['quote.js'], true, 'main'],
          'stop:main',
          'A feature branch makes review and recovery clearer.',
        ),
        check(
          'master',
          'An alternative main branch name',
          [['quote.js'], true, 'master'],
          'stop:main',
          'The same policy should cover both stated protected names.',
        ),
        check(
          'env',
          'Private environment configuration',
          [['config/.env.local'], true, 'feature/quote'],
          'stop:private',
          'A nested private configuration file needs protection too.',
        ),
        check(
          'key',
          'A private key file',
          [['shop.key'], true, 'feature/quote'],
          'stop:private',
          'Private key material does not belong in a learning commit.',
        ),
        check(
          'placeholder',
          'A documented empty configuration template',
          [['.env.example', 'quote.js'], true, 'feature/quote'],
          'ready',
          'Placeholder configuration can be shared after reviewing its contents.',
        ),
      ],
    },
    project: project(
      'A reviewed shipping fix',
      'Create a real local Git repository containing your lesson 6 repair, its tests, and run instructions. Share a reviewable branch if you use GitHub.',
      [
        'The repaired program and check command.',
        'A feature branch with a focused commit.',
        'A README and short review description.',
      ],
      [
        [
          'Set up the folder',
          [
            'Check Node and Git versions.',
            'Download and unzip the exercise kit into a new folder.',
            'Run its check command and read the output.',
          ],
        ],
        [
          'Make the change',
          [
            'Initialise Git and record a starting version.',
            'Create feature/shipping-fix.',
            'Review git diff, stage the intended files, and commit.',
          ],
        ],
        [
          'Hand it to another person',
          [
            'Record the commit id and check result.',
            'Try the README in a clean second folder.',
            'Write the problem, behaviour, and validation in the review description.',
          ],
        ],
      ],
      [
        'The project runs using its README.',
        'The repair is on a feature branch.',
        'The diff contains only intended changes.',
        'The regression checks pass.',
        'No real credentials or private files are committed.',
      ],
      [
        ['Clean second folder', 'The documented command runs the checks.'],
        ['The original unpaid-order case', 'The repaired program holds it.'],
        ['Review of the staged diff', 'Only intended files and empty configuration placeholders.'],
      ],
      'Ask someone to review the change and address one concrete piece of feedback. Record what changed and why.',
      [
        'What is the difference between Git and GitHub?',
        'What did reviewing the diff reveal?',
        'Which instruction made the project reproducible?',
      ],
    ),
    references: [
      reference(
        'Git book: getting started',
        'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
      ),
      reference('Node.js downloads', 'https://nodejs.org/en/download'),
    ],
  },
  {
    day: 8,
    slug: 'accessible-form',
    title: 'Build a page people can use',
    chapter: 'Interfaces',
    concepts: ['HTML structure', 'Accessible forms'],
    prerequisites: [7],
    outcome: 'Create a labelled message form that works with a keyboard.',
    story:
      'Amina wants customers to send a message without needing to understand her software. Give them a page with clear words, a name field, and a message field.',
    demo: demo(
      'Make the form understandable',
      { field: 'Unlabelled box', customer: 'What goes here?' },
      [
        [
          'Give the field a label',
          { field: 'Your name', customer: 'I know what to enter' },
          'A visible label explains the field and can be connected to it for assistive technology.',
        ],
        [
          'Add the message field and action',
          { fields: 'Your name · Your message', action: 'Send message' },
          'The page makes its purpose and next action clear.',
        ],
      ],
    ),
    sections: [
      section(
        'HTML gives content a structure',
        'HTML describes the meaning of a page. A heading introduces its subject. A main element contains the page’s primary content. A form groups related inputs and an action.',
        'Use elements for their intended jobs. A button is already operable with a keyboard and exposes its role to assistive technology. A clickable div requires you to recreate those behaviours and is easy to get wrong.',
      ),
      section(
        'Connect a label to a field',
        'A label tells a person what to enter. Give the input an id and set the label’s for attribute to the same id. Clicking the label will focus its input, and assistive technology can use the label as the field’s accessible name.',
        'A placeholder is a hint inside an empty field. It disappears after typing and is not a replacement for a visible label. Choose clear names such as Your name and Your message rather than making the person guess.',
      ),
      section(
        'Use browser validation deliberately',
        'The required attribute marks a field as necessary. The browser can check whether required fields contain a value. A textarea is useful for a message that may span several lines.',
        'Browser validation helps people correct a form. It does not protect the backend: a request can be sent without this page. We will validate requests again at the service boundary in lesson 15.',
      ),
      section(
        'Try the page without a mouse',
        'Use Tab to move between the name field, message field, and button. A visible focus outline helps you know where you are. Keep the order of elements logical and avoid positive tabindex values that create a surprising order.',
        'This lesson builds the structure and checks the fields. It does not send a real customer message yet. Lesson 10 will add behaviour, and lesson 17 will connect an interface to a backend.',
      ),
    ],
    words: [
      { term: 'HTML', meaning: 'Markup that describes the meaning and structure of a web page.' },
      { term: 'Label', meaning: 'Visible text that identifies what a field is for.' },
      {
        term: 'Accessibility',
        meaning:
          'Making the interface usable by people with different abilities and ways of interacting.',
      },
    ],
    example: example(
      'html',
      html(
        '<main><h1>Contact Amina</h1><label for="customer">Your name</label><input id="customer" type="text"></main>',
      ),
      'A heading, a visible name label, and a text field.',
      [
        'main identifies the central content.',
        'The label’s for value matches the input id.',
        'The input supplies a native field with keyboard behaviour.',
      ],
    ),
    exercise: {
      title: 'A clear contact form',
      brief:
        'Build the form structure. Use the specified identifiers so the checks can inspect the real elements and their behaviour.',
      language: 'html',
      parameters: [],
      result: '',
      starter: html('<main></main>'),
      steps: [
        step(
          'Give the page a purpose',
          'Add an h1 saying Contact Amina and a form with id message-form inside main.',
          'Use semantic elements: <main>, <h1>, and <form>.',
          html('<main><h1>Contact Amina</h1><form id="message-form"></form></main>'),
          ['heading', 'form'],
        ),
        step(
          'Add connected fields',
          'Add a Your name label/input with id customer, and a Your message label/textarea with id message. Connect both labels using for.',
          'For each field, the label’s for attribute must exactly match the field id.',
          html(
            '<main><h1>Contact Amina</h1><form id="message-form"><label for="customer">Your name</label><input id="customer" name="customer" type="text"><label for="message">Your message</label><textarea id="message" name="message"></textarea></form></main>',
          ),
          ['name-label', 'message-label'],
        ),
        step(
          'Make the action and rules clear',
          'Mark both fields required and add a submit button saying Send message.',
          'Use the required attribute and a native button with type="submit".',
          html(formBody),
          ['button', 'empty', 'valid'],
        ),
      ],
      cases: [
        dom(
          'heading',
          'A clear main heading',
          'return document.querySelector("main h1")?.textContent;',
          'Contact Amina',
          'A person needs to know what this page does.',
        ),
        dom(
          'form',
          'Fields belong to a form',
          'return document.querySelector("main #message-form")?.tagName;',
          'FORM',
          'A form groups the task and supports native submission behaviour.',
        ),
        dom(
          'name-label',
          'The name field has a connected label',
          'const field=document.getElementById("customer"); return field?.tagName==="INPUT" && field.type==="text" && field.labels?.[0]?.textContent==="Your name";',
          true,
          'A visible connected label works after the person starts typing.',
        ),
        dom(
          'message-label',
          'The message field has a connected label',
          'const field=document.getElementById("message"); return field?.tagName==="TEXTAREA" && field.labels?.[0]?.textContent==="Your message";',
          true,
          'A message needs an identified multi-line field.',
        ),
        dom(
          'button',
          'A native submit button',
          'return document.querySelector("button[type=submit]")?.textContent;',
          'Send message',
          'The action must be clear and keyboard operable.',
        ),
        dom(
          'empty',
          'Empty required fields are rejected',
          'document.getElementById("customer").value=""; document.getElementById("message").value=""; return document.getElementById("message-form").checkValidity();',
          false,
          'Required fields need values.',
        ),
        dom(
          'valid',
          'Filled fields pass browser validation',
          'document.getElementById("customer").value="Amina"; document.getElementById("message").value="When do you open?"; return document.getElementById("message-form").checkValidity();',
          true,
          'Validation should also allow intended success.',
        ),
      ],
    },
    project: project(
      'A customer message page',
      'Create a standalone, semantic contact page with visible labels and a logical keyboard order. State that it is a practice form until a backend is connected.',
      [
        'An HTML page with the contact form.',
        'A keyboard walkthrough.',
        'A list of browser and backend validation responsibilities.',
      ],
      [
        [
          'Build the structure',
          ['Add main, a heading, and a form.', 'Use meaningful element types.'],
        ],
        [
          'Connect the fields',
          ['Associate labels with inputs.', 'Add required rules and the action button.'],
        ],
        [
          'Try another way to use it',
          [
            'Navigate with Tab and Enter.',
            'Click each label to focus its field.',
            'Check empty and valid input.',
          ],
        ],
      ],
      [
        'The purpose is clear from the heading.',
        'Both fields have visible connected labels.',
        'The action is a native button.',
        'Keyboard navigation and focus are usable.',
        'The page does not claim to send a real message yet.',
      ],
      [
        ['Tab through the page', 'Name, message, and action follow a logical order.'],
        ['Click Your name', 'The name input gains focus.'],
        ['Submit empty required fields', 'Browser validation asks for the missing values.'],
      ],
      'Add a labelled email field and explain what the browser can check versus what the backend must still verify.',
      [
        'Why is a placeholder not enough?',
        'How did you check keyboard use?',
        'Why will the backend still need validation?',
      ],
    ),
    references: [
      reference(
        'MDN forms',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms',
      ),
    ],
  },
  {
    day: 9,
    slug: 'responsive-inbox',
    title: 'Make the inbox fit a phone',
    chapter: 'Interfaces',
    concepts: ['CSS layout', 'Responsive design'],
    prerequisites: [8],
    outcome: 'Build a readable layout that adapts without horizontal scrolling.',
    story:
      'Amina checks messages on her phone. A page that looks fine on a laptop can still hide content or make buttons too small on a phone.',
    demo: demo(
      'Adapt to the available space',
      { screen: 'phone', layout: 'two squeezed columns' },
      [
        [
          'Use one column',
          { screen: 'phone', layout: 'one readable column' },
          'A narrow screen needs room for each item.',
        ],
        [
          'Use a wider screen',
          { screen: 'wide', layout: 'two columns' },
          'A media query can change the layout when there is enough space.',
        ],
      ],
    ),
    sections: [
      section(
        'CSS controls presentation',
        'CSS describes appearance and layout: spacing, colours, sizes, and where elements are placed. A selector chooses which elements receive a rule. For example, .grid chooses elements with class="grid".',
        'Keep the HTML meaning from lesson 8 while changing presentation. A page should remain understandable if its styles fail to load. Use enough contrast and space to make the content readable, rather than depending on decoration to explain the task.',
      ),
      section(
        'Start with the narrow layout',
        'A single column is a useful starting point for a small phone. CSS Grid can arrange the message cards with a consistent gap. grid-template-columns: 1fr makes one column that uses the available space.',
        'Avoid giving the entire page a fixed width such as 900px. A max-width can limit a wide layout while allowing it to shrink. Padding gives the text room at the edges. min-width: 0 lets a grid item shrink instead of forcing the page to overflow.',
      ),
      section(
        'Add a wider-screen rule',
        'A media query applies styles under a condition. @media (min-width: 600px) applies when the preview is at least 600 CSS pixels wide. At that size, two columns can be useful.',
        'The condition is about available layout space, not a particular phone model. Test both sides of the breakpoint. Also test long content and browser zoom: the page should adapt when text needs more room.',
      ),
      section(
        'Make actions comfortable',
        'A button needs enough area to press and a clear focus outline for keyboard use. In this project, give it a minimum height of 44px and readable text. Do not remove the browser’s focus indication without replacing it.',
        'The browser checks inspect the current preview width. Your project evidence should include both a small and a wide view. The course’s browser tests also exercise reference layouts at both widths.',
      ),
    ],
    words: [
      { term: 'CSS', meaning: 'Rules describing the presentation and layout of a page.' },
      { term: 'Responsive layout', meaning: 'A layout that adapts to the space available.' },
      { term: 'Media query', meaning: 'A condition that selects when some CSS rules apply.' },
    ],
    example: example(
      'html',
      html(
        cards,
        'body{font-family:system-ui}.grid{display:grid;grid-template-columns:1fr;gap:16px}@media(min-width:600px){.grid{grid-template-columns:repeat(2,1fr)}}',
      ),
      'One column in a narrow view; two columns when at least 600px wide.',
      [
        'The base rule works on a narrow screen.',
        'Grid creates columns with a consistent gap.',
        'The media query adds a wider layout without changing the content.',
      ],
    ),
    exercise: {
      title: 'A responsive message board',
      brief:
        'Style the supplied cards with a one-column narrow layout, two columns from 600px, and a comfortable button. Keep the page within the preview width.',
      language: 'html',
      parameters: [],
      result: '',
      starter: html(cards, 'body{font-family:system-ui}.grid{display:block}'),
      steps: [
        step(
          'Create a clear grid',
          'Use grid display, one column, and a gap of at least 12px.',
          'Set display: grid, grid-template-columns: 1fr, and gap: 16px on .grid.',
          html(
            cards,
            'body{font-family:system-ui}.grid{display:grid;grid-template-columns:1fr;gap:16px}',
          ),
          ['grid', 'gap'],
        ),
        step(
          'Adapt to the width',
          'Add two equal columns when the preview is at least 600px wide. Use padding and flexible widths so the page does not overflow.',
          'Use the media query in the worked example. Keep each card’s min-width at zero.',
          html(
            cards,
            layoutStyle.replace(
              'button{font:inherit;min-height:44px;padding:12px;margin-top:16px}',
              '',
            ),
          ),
          ['columns', 'overflow'],
        ),
        step(
          'Make the button usable',
          'Give the button a height of at least 44px and keep it within the page width.',
          'Use min-height: 44px and padding rather than a fixed page width.',
          html(cards, layoutStyle),
          ['button'],
        ),
      ],
      cases: [
        dom(
          'grid',
          'Cards use a grid',
          'return getComputedStyle(document.querySelector(".grid")).display;',
          'grid',
          'The cards need an explicit layout rule.',
        ),
        dom(
          'gap',
          'There is readable space between cards',
          'return parseFloat(getComputedStyle(document.querySelector(".grid")).gap)>=12;',
          true,
          'Adjacent cards should not appear as one cramped block.',
        ),
        dom(
          'columns',
          'The columns match the current preview width',
          'const columns=getComputedStyle(document.querySelector(".grid")).gridTemplateColumns.trim().split(/\\s+/).length; return columns===(innerWidth>=600?2:1);',
          true,
          'Check the layout on each side of the breakpoint.',
        ),
        dom(
          'overflow',
          'The page fits the preview',
          'return document.documentElement.scrollWidth<=innerWidth+1;',
          true,
          'Hidden horizontal content makes a phone layout hard to use.',
        ),
        dom(
          'button',
          'The action is large enough to press',
          'const box=document.querySelector("button").getBoundingClientRect(); return box.height>=44 && box.right<=innerWidth;',
          true,
          'An action needs a comfortable visible target.',
        ),
      ],
    },
    project: project(
      'An inbox for phones and laptops',
      'Deliver a message board that remains readable with long content and at different widths. Keep the semantic HTML intact.',
      [
        'Responsive HTML/CSS.',
        'Small and wide screenshots or a recorded walkthrough.',
        'A short explanation of the breakpoint.',
      ],
      [
        ['Start small', ['Use one column and edge padding.', 'Try a narrow phone viewport.']],
        [
          'Add space wisely',
          [
            'Use two columns when enough width is available.',
            'Limit the maximum width of long content.',
          ],
        ],
        [
          'Check awkward content',
          [
            'Try a long message and browser zoom.',
            'Check horizontal scrolling, focus, and button size.',
          ],
        ],
      ],
      [
        'A narrow view uses one column.',
        'A wide view uses two columns.',
        'There is no document-level horizontal scroll.',
        'Buttons and focus are comfortable to use.',
        'Long content and zoom are included in the evidence.',
      ],
      [
        ['A 320px-wide view', 'One column with readable content.'],
        ['A 900px-wide view', 'Two columns.'],
        ['A long message', 'Content wraps instead of hiding outside the page.'],
      ],
      'Add an empty-inbox state and check that its spacing remains clear on both layouts.',
      [
        'Why use available width rather than a device name?',
        'What caused an overflow during testing?',
        'How did zoom affect the layout?',
      ],
    ),
    references: [
      reference(
        'MDN responsive design',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design',
      ),
    ],
  },
  {
    day: 10,
    slug: 'working-message-interface',
    title: 'Connect buttons, events, and state',
    chapter: 'Interfaces',
    concepts: ['DOM events', 'State and rendering'],
    prerequisites: [9],
    outcome: 'Add a real message through a form and update the visible inbox.',
    story:
      'Amina’s page has fields and buttons, but they do not do anything yet. Connect the form to a list of messages and show what actually happened.',
    demo: demo(
      'Connect an action to a result',
      { action: 'Add message', state: 'one message', screen: 'one message' },
      [
        [
          'Submit a valid message',
          { state: 'two messages', screen: 'two messages' },
          'An event updates the data, then rendering updates the screen.',
        ],
        [
          'Submit a blank message',
          { state: 'still two messages', screen: 'Write a message first' },
          'An error explains the problem without adding an empty record.',
        ],
      ],
    ),
    sections: [
      section(
        'The DOM is the page as objects',
        'The browser turns HTML into a document object model, or DOM. JavaScript can find an element with document.getElementById and change its textContent. This connects the data in a program to the visible page.',
        'Use textContent when displaying a customer’s message. It treats the content as text. Setting innerHTML with untrusted text can create elements or scripts the person never intended to author for your page.',
      ),
      section(
        'An event tells you something happened',
        'Submitting a form or pressing a button creates an event. addEventListener connects an event type to a function. The function can read fields, validate input, change state, and show a result.',
        'Call event.preventDefault() when your JavaScript handles the form locally. Otherwise the browser’s default submission can navigate away from the page. Keep the native form and button so keyboard users can trigger the same behaviour.',
      ),
      section(
        'Keep state and rendering separate',
        'State is the data the application is keeping track of now. Our messages array is state. A render function reads that array and draws the count and list. It does not invent a second, conflicting source of truth.',
        'After adding a record to messages, call render again. Clear the list before recreating its items so old records do not appear twice. A stable identifier will help when later features answer or remove a particular message.',
      ),
      section(
        'Handle a failed action clearly',
        'Trim whitespace before deciding whether a message is empty. If it is empty, show Write a message first and leave the state unchanged. If it is valid, add it, clear the field, and show Added.',
        'Test the sequence a person actually uses, including keyboard submission and a second message. Also try text that looks like HTML. It should appear as text in the list, without being interpreted as a new element.',
      ),
    ],
    words: [
      { term: 'DOM', meaning: 'The browser’s object representation of the page.' },
      { term: 'Event', meaning: 'A notification that an interaction or another action happened.' },
      { term: 'State', meaning: 'The data an application is keeping track of now.' },
    ],
    example: example(
      'html',
      html(
        '<button id="add">Add 1 message</button><output id="count">10</output>',
        '',
        'let messages=10; document.getElementById("add").addEventListener("click",()=>{messages+=1;document.getElementById("count").textContent=messages;});',
      ),
      'Pressing Add 1 message changes the count from 10 to 11.',
      [
        'The program starts with state equal to 10.',
        'The listener responds when the button is activated.',
        'It changes the state and updates the output element.',
      ],
    ),
    exercise: {
      title: 'A working message form',
      brief:
        'Use the supplied form and list. Render the initial state, add a submitted message, then reject blank input. Show customer text safely.',
      language: 'html',
      parameters: [],
      result: '',
      starter: html(inboxBody, '', 'let messages=[{id:1,body:"Opening hours?"}];'),
      steps: [
        step(
          'Render the current state',
          'Create render() to show messages.length in count and one li per message in list. Call it once.',
          'Clear list.textContent, then create each li and set its textContent to message.body.',
          html(inboxBody, '', renderInbox),
          ['count', 'list'],
        ),
        step(
          'Handle a submission',
          'Listen for submit, prevent the default action, add a record, clear the field, and render again.',
          'Read document.getElementById("body").value.trim(). Add the record to messages before drawing the new list.',
          html(inboxBody, '', renderInbox + addMessage),
          ['add'],
        ),
        step(
          'Protect the state and text',
          'Reject whitespace-only messages with a helpful status. Keep customer content as text, including text that looks like HTML.',
          'Return early when the trimmed body is empty. The render function should still use textContent.',
          html(inboxBody, '', renderInbox + safeMessage),
          ['blank', 'literal'],
        ),
      ],
      cases: [
        dom(
          'count',
          'The initial count matches the state',
          'return document.getElementById("count").textContent;',
          '1',
          'The screen should be a view of the actual state.',
        ),
        dom(
          'list',
          'The initial message is visible',
          'return document.querySelector("#list li")?.textContent;',
          'Opening hours?',
          'Rendering must show the data, not only a number.',
        ),
        dom(
          'add',
          'A submitted message updates the inbox without navigation',
          'document.getElementById("body").value="My order is late"; const event=new Event("submit",{bubbles:true,cancelable:true}); document.getElementById("form").dispatchEvent(event); return event.defaultPrevented && document.getElementById("count").textContent==="2" && document.getElementById("list").textContent.includes("My order is late");',
          true,
          'The event must update state and the screen while preserving the page.',
        ),
        dom(
          'blank',
          'Blank input leaves the state unchanged',
          'const before=document.getElementById("count").textContent; document.getElementById("body").value="   "; document.getElementById("form").dispatchEvent(new Event("submit",{bubbles:true,cancelable:true})); return document.getElementById("count").textContent===before && document.getElementById("status").textContent==="Write a message first";',
          true,
          'A rejected action should explain the problem without changing the data.',
        ),
        dom(
          'literal',
          'HTML-looking customer text remains text',
          'document.getElementById("body").value="<img src=x onerror=alert(1)>"; document.getElementById("form").dispatchEvent(new Event("submit",{bubbles:true,cancelable:true})); return !document.querySelector("#list img") && document.getElementById("list").textContent.includes("<img src=x onerror=alert(1)>");',
          true,
          'Customer content must not become executable page markup.',
        ),
      ],
    },
    project: project(
      'A working shop inbox',
      'Build an interface that accepts messages, validates them, and displays an accurate list and count. This is a local practice inbox; backend integration comes later.',
      [
        'A functional form and inbox.',
        'A clear render function and state array.',
        'An interaction test record.',
      ],
      [
        [
          'Display the state',
          ['Render a list and matching count.', 'Use textContent for message bodies.'],
        ],
        [
          'Handle an action',
          ['Use a form submission listener.', 'Add a valid message and redraw the view.'],
        ],
        [
          'Check repeated and failed actions',
          [
            'Try two messages, a blank message, and HTML-looking text.',
            'Submit with a keyboard.',
            'Confirm no accidental page navigation.',
          ],
        ],
      ],
      [
        'The count matches the list.',
        'A valid submission adds one message.',
        'A blank submission preserves state and shows help.',
        'Customer text is rendered safely.',
        'Repeated actions and keyboard submission work.',
      ],
      [
        ['Submit a valid message', 'One new record appears and the count increases.'],
        ['Submit spaces', 'No new record; a helpful message appears.'],
        ['Submit HTML-looking text', 'Literal text appears without creating an element.'],
      ],
      'Add an Answer button for each stable id. Update the state first, then render the new view.',
      [
        'What is the source of truth?',
        'Why prevent the default submission?',
        'Why use textContent for customer content?',
      ],
    ),
    references: [
      reference(
        'MDN events',
        'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events',
      ),
    ],
  },
  {
    day: 11,
    slug: 'requests-and-failures',
    title: 'Load orders and handle request failures',
    chapter: 'Interfaces',
    concepts: ['HTTP requests', 'Async results and errors'],
    prerequisites: [10],
    outcome:
      'Return a useful result when order loading succeeds, fails, or returns the wrong shape.',
    story:
      'The inbox needs to load orders from a service. The network can be slow, a response can be an error, and a successful status can still contain unexpected data.',
    demo: demo('Wait for a request', { screen: 'Loading orders', request: 'waiting' }, [
      [
        'Receive a successful response',
        { status: 200, screen: 'Two orders' },
        'The interface waits for the response before using the result.',
      ],
      [
        'Receive a service error',
        { status: 503, screen: 'Could not load orders. Try again.' },
        'A failure should replace the loading state with a useful next action.',
      ],
    ]),
    sections: [
      section(
        'Programs can ask another program',
        'An HTTP request asks a server to do something. A GET request commonly reads information. The server returns a status, headers, and a body. JSON is one common format for the body.',
        'A URL identifies the destination. An endpoint is a particular operation exposed by the service, such as GET /orders. Agree on the response shape: our practice order list contains objects with an id and a totalCents value.',
      ),
      section(
        'A request finishes later',
        'An asynchronous operation returns a promise for a future result. async marks a function that can wait for promises. await waits for an operation inside that function without pretending its result is already available.',
        'A page can show Loading while a request is in progress. After it finishes, show the data, an empty state, or an error. Keep these states distinct so an empty order list is not mistaken for a broken service.',
      ),
      section(
        'Check status and data shape',
        'fetch does not automatically reject every HTTP error status. Check response.ok before reading the body. Then await response.json() and validate the data shape before handing it to the interface.',
        'A response with status 200 and a JSON object is still wrong if the contract requires an array. A row with a negative total or missing identifier also breaks the contract. Use the validation habits you already practised with saved baskets.',
      ),
      section(
        'Recover without hiding the problem',
        'Network failures and JSON parsing errors can throw. Catch them and return a useful error result. Avoid an infinite retry loop: give the person a deliberate Try again action and make operations safe to repeat.',
        'The exercise injects a prepared request function to test these outcomes reliably. It does not call a live service. The project connects the same adapter to real fetch and checks browser network behaviour against your local backend.',
      ),
    ],
    words: [
      { term: 'Endpoint', meaning: 'A specific operation offered by a service at a URL.' },
      {
        term: 'Promise',
        meaning: 'An object representing a result that may become available later.',
      },
      {
        term: 'HTTP status',
        meaning: 'A code describing the result of a request, such as success or a service error.',
      },
    ],
    example: example(
      'javascript',
      'async function loadExample() {\n  const response = { ok: true, json: async () => [{ id: 1, totalCents: 600 }] };\n  const orders = await response.json();\n  return orders.length;\n}\nreturn loadExample().then(count => console.log(count));',
      '1',
      [
        'The response here is a prepared example, not a live request.',
        'await waits for the promise returned by json().',
        'The function returns the count after the data is available.',
      ],
    ),
    exercise: {
      title: 'A reliable order adapter',
      brief:
        'Implement loadOrders(request). Return { ok: true, orders } for valid data, or { ok: false, error } using http, shape, or network. The exercise supplies a prepared request function.',
      language: 'javascript',
      parameters: ['scenario'],
      result: 'loadOrders(request)',
      starter:
        'const request = async () => {\n  if (scenario === "network") throw new Error("Connection failed");\n  if (scenario === "bad-json") return { ok: true, json: async () => { throw new Error("Bad JSON"); } };\n  return { ok: scenario !== "http", json: async () => scenario === "shape" ? {} : scenario === "bad-row" ? [{id:1,totalCents:-2}] : scenario === "empty" ? [] : [{id:1,totalCents:600}] };\n};\nasync function loadOrders(request) { return { ok: true, orders: [] }; }',
      steps: [
        step(
          'Wait for valid orders',
          'Call and await request(), then await response.json(). Return the orders in a success result.',
          'Keep the supplied request fixture. Write an async loadOrders function with two awaits.',
          'const request = async () => ({ ok: true, json: async () => scenario === "empty" ? [] : [{id:1,totalCents:600}] });\nasync function loadOrders(request) {\n  const response = await request();\n  const orders = await response.json();\n  return { ok: true, orders };\n}',
          ['valid', 'empty'],
        ),
        step(
          'Handle HTTP and network failures',
          'Preserve the complete supplied request fixture. Return http for !response.ok and network for thrown request or JSON errors.',
          'Put the request and body reading inside try/catch. An HTTP error should be handled before reading the body.',
          'const request = async () => {\n  if (scenario === "network") throw new Error("Connection failed");\n  if (scenario === "bad-json") return { ok: true, json: async () => { throw new Error("Bad JSON"); } };\n  return { ok: scenario !== "http", json: async () => scenario === "shape" ? {} : scenario === "bad-row" ? [{id:1,totalCents:-2}] : scenario === "empty" ? [] : [{id:1,totalCents:600}] };\n};\nasync function loadOrders(request) {\n  try {\n    const response = await request();\n    if (!response.ok) return { ok: false, error: "http" };\n    return { ok: true, orders: await response.json() };\n  } catch { return { ok: false, error: "network" }; }\n}',
          ['http', 'network', 'bad-json'],
        ),
        step(
          'Validate returned records',
          'Require an array. Every record needs an integer id and a non-negative integer totalCents. Return shape otherwise.',
          'Validate the array and every row after reading JSON. An empty array is valid.',
          'const request = async () => {\n  if (scenario === "network") throw new Error("Connection failed");\n  if (scenario === "bad-json") return { ok: true, json: async () => { throw new Error("Bad JSON"); } };\n  return { ok: scenario !== "http", json: async () => scenario === "shape" ? {} : scenario === "bad-row" ? [{id:1,totalCents:-2}] : scenario === "empty" ? [] : [{id:1,totalCents:600}] };\n};\nasync function loadOrders(request) {\n  try {\n    const response = await request();\n    if (!response.ok) return { ok: false, error: "http" };\n    const orders = await response.json();\n    if (!Array.isArray(orders) || !orders.every(order => order && Number.isInteger(order.id) && Number.isInteger(order.totalCents) && order.totalCents >= 0)) return { ok: false, error: "shape" };\n    return { ok: true, orders };\n  } catch { return { ok: false, error: "network" }; }\n}',
          ['shape', 'bad-row'],
        ),
      ],
      cases: [
        check(
          'valid',
          'A valid response',
          ['valid'],
          { ok: true, orders: [{ id: 1, totalCents: 600 }] },
          'The adapter must preserve intended success.',
        ),
        check(
          'empty',
          'An empty order list',
          ['empty'],
          { ok: true, orders: [] },
          'No orders is a valid result.',
        ),
        check(
          'http',
          'An HTTP failure',
          ['http'],
          { ok: false, error: 'http' },
          'A failed status must not become a successful empty list.',
        ),
        check(
          'network',
          'A failed connection',
          ['network'],
          { ok: false, error: 'network' },
          'A thrown request needs a deliberate error result.',
        ),
        check(
          'bad-json',
          'Unreadable response JSON',
          ['bad-json'],
          { ok: false, error: 'network' },
          'An unreadable body cannot be used as order data.',
        ),
        check(
          'shape',
          'The wrong JSON shape',
          ['shape'],
          { ok: false, error: 'shape' },
          'A successful status does not prove the response contract.',
        ),
        check(
          'bad-row',
          'A negative order total',
          ['bad-row'],
          { ok: false, error: 'shape' },
          'Validate records inside the list as well as the list itself.',
        ),
      ],
    },
    project: project(
      'A reliable order-loading screen',
      'Build a loading adapter and a view with loading, empty, success, and error states. Begin with prepared requests; connect it to your real service in lesson 17.',
      [
        'The adapter and its result contract.',
        'A view for each request state.',
        'A network inspection record after real integration.',
      ],
      [
        [
          'Agree on the result',
          ['Describe the order response shape.', 'Keep an empty list distinct from failure.'],
        ],
        [
          'Handle failures',
          ['Check HTTP status and body shape.', 'Catch request and parsing errors.'],
        ],
        [
          'Integrate and observe',
          [
            'Give the interface a deliberate retry action.',
            'After backend setup, inspect a real request and response in the browser.',
          ],
        ],
      ],
      [
        'Valid records load correctly.',
        'Empty data shows an empty state.',
        'HTTP, connection, and shape failures are handled.',
        'Loading always ends in a useful state.',
        'Fixture checks are distinguished from a real request check.',
      ],
      [
        ['Valid prepared response', 'Success with the supplied order.'],
        ['Failed connection', 'An error result with a retry action.'],
        ['A real service returns an invalid body', 'The interface rejects its shape.'],
      ],
      'Add a timeout using AbortController when connecting to fetch. Keep retries bounded and cancellation visible.',
      [
        'Why does response.ok matter?',
        'How is empty data different from failure?',
        'What evidence proves you made a real network request?',
      ],
    ),
    references: [
      reference(
        'MDN fetch',
        'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
      ),
    ],
  },
  {
    day: 12,
    slug: 'react-and-types',
    title: 'Use components, state, and types',
    chapter: 'Interfaces',
    concepts: ['React components and state', 'TypeScript contracts'],
    prerequisites: [11],
    outcome: 'Build an interactive typed component and explain what state controls.',
    story:
      'The shop interface is growing. Amina wants reusable pieces that stay in step with their data, and the team wants help catching inconsistent field names before running the app.',
    demo: demo(
      'Describe the interface from state',
      { state: '10 messages', screen: '10 messages' },
      [
        [
          'Change the state',
          { state: '11 messages', screen: '11 messages' },
          'A React component describes what to show from its current state.',
        ],
        [
          'Check a field type',
          { expected: 'number', supplied: 'text', result: 'type error in the project check' },
          'TypeScript can catch a mismatch before the app runs, when you run its type checker.',
        ],
      ],
    ),
    sections: [
      section(
        'A component describes one piece of a page',
        'A React component is a function that describes an interface. JSX lets that description look like markup inside JavaScript. A component can be reused and can receive inputs called props.',
        'In this exercise, App is the component rendered in the preview. The import brings in React, and export default makes App the component the project uses. The browser runner compiles JSX before rendering the real React interface.',
      ),
      section(
        'State belongs to the component',
        'React.useState starts a state value and returns a function for updating it. const [messages, setMessages] = React.useState<number>(10) starts the count at 10. Calling setMessages tells React to render using a new value.',
        'For an update based on the previous value, use setMessages(previous => previous + 1). This keeps repeated updates based on the latest state. Change the state rather than manually changing an unrelated DOM element.',
      ),
      section(
        'Types describe expectations',
        'TypeScript adds type information to JavaScript. The annotation number describes the expected kind of value. A type checker can catch mistakes such as treating a number as a message record or using a field that does not exist.',
        'Types do not validate data arriving from a network at runtime. Keep the validation from lesson 11. The browser preview checks behaviour and strips type annotations; run npm run typecheck in the project to get actual TypeScript diagnostics.',
      ),
      section(
        'Keep the boundary clear',
        'The component owns its visual state, while a pricing or order function owns its business rule. Props can pass information to a smaller component without making it read arbitrary global state.',
        'Test the behaviour a person sees: adding a message, answering one, resetting, and trying to answer below zero. The project extends this component into the inbox you already built, while retaining accessibility and error states.',
      ),
    ],
    words: [
      { term: 'Component', meaning: 'A reusable function describing one part of an interface.' },
      {
        term: 'State update',
        meaning: 'A change to component data that causes its interface to be rendered again.',
      },
      {
        term: 'Type check',
        meaning: 'A check of declared data expectations before running JavaScript.',
      },
    ],
    example: example(
      'react',
      reactCount,
      'A real React counter starts at 10 and increases when the button is pressed.',
      [
        'App is the component rendered by the project.',
        'useState keeps the count and supplies setMessages.',
        'The button updates state; JSX uses that state for the visible output.',
      ],
    ),
    exercise: {
      title: 'A typed inbox counter',
      brief:
        'Use the supplied React import and default App component. Build a counter that adds, answers, and resets messages. Answering below zero must keep the count at zero.',
      language: 'react',
      parameters: [],
      result: '',
      starter: 'import React from "react";\nexport default function App() { return <main />; }',
      steps: [
        step(
          'Describe the initial interface',
          'Render an h1 saying Amina’s inbox, an output with id count showing 10, and an Add 1 message button.',
          'Begin with the markup in the example, before adding state.',
          reactView,
          ['heading', 'initial'],
        ),
        step(
          'Connect state to the action',
          'Use useState<number>(10). Render the state in output and update it with the Add button.',
          'Use setMessages(previous => previous + 1) in an onClick handler.',
          reactCount,
          ['add'],
        ),
        step(
          'Answer safely and reset',
          'Add Answer 1 message and Start again buttons. Keep the count non-negative and reset it to 10.',
          'Use Math.max(0, previous - 1) for answering. Reset with setMessages(10).',
          reactComplete,
          ['answer', 'reset', 'zero'],
        ),
      ],
      cases: [
        dom(
          'heading',
          'A clear component heading',
          'return document.querySelector("main h1")?.textContent;',
          'Amina’s inbox',
          'The rendered component still needs meaningful structure.',
        ),
        dom(
          'initial',
          'The initial state is visible',
          'return document.getElementById("count")?.textContent;',
          '10',
          'The initial interface should reflect the initial state.',
        ),
        dom(
          'add',
          'Adding changes the visible state',
          'const button=[...document.querySelectorAll("button")].find(button=>button.textContent==="Add 1 message"); button.click(); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); return document.getElementById("count").textContent;',
          '11',
          'A real state update must change the rendered output.',
        ),
        dom(
          'answer',
          'Answering decreases the state',
          'const button=[...document.querySelectorAll("button")].find(button=>button.textContent==="Answer 1 message"); button.click(); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); return document.getElementById("count").textContent;',
          '10',
          'The same state owns both kinds of update.',
        ),
        dom(
          'reset',
          'Reset returns to the stated initial value',
          'const buttons=[...document.querySelectorAll("button")]; buttons.find(button=>button.textContent==="Add 1 message").click(); await new Promise(resolve=>requestAnimationFrame(resolve)); buttons.find(button=>button.textContent==="Start again").click(); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); return document.getElementById("count").textContent;',
          '10',
          'Reset should use the documented initial value.',
        ),
        dom(
          'zero',
          'Answering cannot make the count negative',
          'const button=[...document.querySelectorAll("button")].find(button=>button.textContent==="Answer 1 message"); for(let i=0;i<15;i++)button.click(); await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); return document.getElementById("count").textContent;',
          '0',
          'A boundary rule should hold across repeated updates.',
        ),
      ],
    },
    project: project(
      'A typed React inbox',
      'Rebuild the message inbox as components. Keep the business rules separate, validate external data, and run the TypeScript project check as well as the behaviour checks.',
      [
        'A React/TypeScript project.',
        'An inbox component and a message component.',
        'Type-check and interaction results.',
      ],
      [
        [
          'Build one component',
          ['Represent the inbox with state.', 'Keep labels, buttons, and output meaningful.'],
        ],
        [
          'Split a reusable piece',
          [
            'Pass a message record through typed props.',
            'Use stable message ids when rendering a list.',
          ],
        ],
        [
          'Verify both kinds of check',
          [
            'Run the project’s type checker.',
            'Check add, answer, empty, and reset interactions.',
            'Keep runtime validation for loaded data.',
          ],
        ],
      ],
      [
        'The interface is rendered from state.',
        'Repeated state updates use the current value.',
        'Typed props describe the message record.',
        'The local project type check passes.',
        'Runtime validation and accessibility remain intact.',
      ],
      [
        ['Add twice quickly', 'The count increases by two.'],
        ['Answer until the inbox is empty', 'The count stops at zero.'],
        [
          'Use an incorrect prop field in a scratch change',
          'The local type checker reports the mismatch.',
        ],
      ],
      'Add an asynchronous loading component that uses the adapter from lesson 11 and shows loading, empty, success, and error states.',
      [
        'What does React state replace in the DOM version?',
        'What does a type check catch?',
        'Why does external data still need runtime validation?',
      ],
    ),
    references: [
      reference('React: your first component', 'https://react.dev/learn/your-first-component'),
      reference('React with TypeScript', 'https://react.dev/learn/typescript'),
    ],
  },
];

// Keep the prepared request outside the editable adapter. The same outcomes are
// supplied at every step, including after a learner views an earlier solution.
const requests = lessons.find((lesson) => lesson.day === 11).exercise;
const fixtureEnd = requests.starter.indexOf('\nasync function loadOrders');
requests.setup = requests.starter.slice(0, fixtureEnd);
requests.starter = requests.starter.slice(fixtureEnd + 1);
for (const item of requests.steps)
  item.solution = item.solution.slice(item.solution.indexOf('async function loadOrders'));

const gitProject = lessons.find((lesson) => lesson.day === 7).project;
gitProject.files = {
  'project-shipping.mjs':
    'export default function decideShipment(amount, payment) {\n  if (payment = "paid") return amount > 5000 ? "ship" : "hold";\n  return "hold";\n}\n',
  'project-shipping-reference.mjs':
    'export default function decideShipment(amount, payment) {\n  if (!Number.isInteger(amount) || amount < 0) throw new RangeError("Invalid amount");\n  return payment === "paid" && amount >= 5000 ? "ship" : "hold";\n}\n',
  'project-check-shipping.mjs':
    'import assert from "node:assert/strict";\nimport decideShipment from "./project-shipping.mjs";\nassert.equal(decideShipment(6000,"unpaid"),"hold","Original unpaid-order regression");\nassert.equal(decideShipment(5000,"paid"),"ship","Exact threshold");\nassert.equal(decideShipment(4999,"paid"),"hold");\nassert.throws(()=>decideShipment(-1,"paid"),RangeError);\nconsole.log("Shipping regression checks passed.");\n',
  'SHIPPING-START-HERE.md':
    '# The real Git project\n\nThe readiness planner is only the browser warm-up. Run `node project-check-shipping.mjs`: it deliberately fails against project-shipping.mjs. Reproduce the failure, initialize Git, commit the starting version, create feature/shipping-fix, and repair that file using lesson 6. Run the command again, inspect git diff, and make a focused commit. The reference file is a learning aid; explain your repair before using it. Record your branch, commit, check output, and clean-folder setup test.\n',
};
gitProject.milestones[0].actions.push(
  'Run node project-check-shipping.mjs; the supplied project file intentionally reproduces the bug.',
);
export default lessons;
