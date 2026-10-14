export interface Decision {
  text: string;
  points: number;
  feedback: string;
}
export interface ScenarioStep {
  situation: string;
  question: string;
  choices: Decision[];
}
export interface Scenario {
  id: string;
  title: string;
  role: string;
  summary: string;
  skill: string;
  steps: ScenarioStep[];
}
export const scenarios: Scenario[] = [
  {
    id: 'discovery',
    title: 'The customer says “we need AI.”',
    role: 'A small retailer · First discovery meeting',
    summary: 'Find the workflow worth fixing before choosing a model or a framework.',
    skill: 'Discovery',
    steps: [
      {
        situation:
          'The owner says: “Staff keep asking me about stock. I think an AI chatbot would solve it.”',
        question: 'How do you begin?',
        choices: [
          {
            text: 'Ask them to walk through the last stock question, step by step.',
            points: 2,
            feedback:
              'You start with an observable workflow. You learn who asks, where they look, and what actually slows them down.',
          },
          {
            text: 'Select a language model and promise a chatbot by Friday.',
            points: 0,
            feedback:
              'You have committed before understanding the problem, data, or constraints. Start with a concrete example of the current workflow.',
          },
          {
            text: 'Ask which chatbot interface they prefer.',
            points: 1,
            feedback:
              'Preferences matter later. First find out whether a chatbot addresses the real cause of the problem.',
          },
        ],
      },
      {
        situation:
          'The owner explains: “Eight staff spend about 20 minutes a day checking three spreadsheets. The spreadsheets sometimes disagree.”',
        question: 'What do you investigate next?',
        choices: [
          {
            text: 'Ignore the spreadsheets and discuss the chatbot personality.',
            points: 0,
            feedback:
              'A polished interface cannot resolve conflicting source data. Understand the data owner, freshness, and workflow.',
          },
          {
            text: 'Identify the authoritative data source, update frequency, and permitted users.',
            points: 2,
            feedback:
              'You uncovered a data problem. Establishing source ownership and access is necessary before automating answers.',
          },
          {
            text: 'Estimate the time spent, but assume every spreadsheet is correct.',
            points: 1,
            feedback:
              'Quantifying time helps, but inconsistent data can still produce wrong stock answers. Verify source ownership too.',
          },
        ],
      },
      {
        situation:
          'The inventory system can export stock hourly. The owner will allow a read-only pilot for one shop. Some staff should not see purchase prices.',
        question: 'What do you propose?',
        choices: [
          {
            text: 'Upload all inventory and pricing to a public demo.',
            points: 0,
            feedback:
              'A public demo violates the access constraints. Minimize the data and enforce permissions in the application.',
          },
          {
            text: 'Build an autonomous agent that orders stock immediately.',
            points: 0,
            feedback:
              'You expanded the scope from information lookup to financial actions. The approved pilot is read-only.',
          },
          {
            text: 'Pilot a read-only stock lookup with source timestamps and server-enforced permissions.',
            points: 2,
            feedback:
              'The proposal fits the actual constraints. Start with the simplest useful lookup; assess whether natural-language AI adds enough value.',
          },
        ],
      },
      {
        situation:
          'The owner asks how you will know the pilot worked. The 20-minute estimate has not been measured yet.',
        question: 'What success criteria do you agree on?',
        choices: [
          {
            text: 'Measure a baseline, agree on a handling-time target, and track answer correctness and access failures.',
            points: 2,
            feedback:
              'A measured baseline and quality guardrails make the pilot assessable. Agree on sample size and measurement method before building.',
          },
          {
            text: 'Promise a 90% time saving without collecting evidence.',
            points: 0,
            feedback:
              'The number is unsupported. Separate estimates from measured outcomes and agree on a realistic evaluation method.',
          },
          {
            text: 'Use the number of chatbot messages as the only metric.',
            points: 1,
            feedback:
              'Usage can help you understand adoption, but more messages do not necessarily mean faster or better work.',
          },
        ],
      },
    ],
  },
  {
    id: 'incident',
    title: 'Your demo becomes an incident.',
    role: 'An internal support assistant · After a release',
    summary: 'Investigate a production failure, limit the impact, and recover with evidence.',
    skill: 'Operations',
    steps: [
      {
        situation:
          'A new release went out 15 minutes ago. Users now see frequent timeout errors. Support asks you to fix it immediately.',
        question: 'What is your first move?',
        choices: [
          {
            text: 'Change random settings until the errors disappear.',
            points: 0,
            feedback:
              'Untracked changes obscure the cause. Check impact, recent changes, and request traces while choosing a safe recovery action.',
          },
          {
            text: 'Check impact and recent changes, inspect request traces, and consider rollback.',
            points: 2,
            feedback:
              'You combine diagnosis with impact reduction. Use the runbook and communicate observed facts to the people involved.',
          },
          {
            text: 'Read every log before telling anyone the service is failing.',
            points: 1,
            feedback:
              'Logs matter, but keep users informed and consider mitigation while investigating rather than waiting for perfect certainty.',
          },
        ],
      },
      {
        situation:
          'The logs show provider rate-limit responses. A new retry loop retries every failed model call immediately, without a maximum.',
        question: 'How do you address it?',
        choices: [
          {
            text: 'Add bounded retries with backoff and a timeout; handle rate limits explicitly.',
            points: 2,
            feedback:
              'The retry loop amplifies traffic. Limit attempts and time, honor provider retry guidance, and provide a useful fallback.',
          },
          {
            text: 'Increase the retry rate to beat the limit.',
            points: 0,
            feedback:
              'That intensifies the failure. Reduce amplification and enforce a retry budget.',
          },
          {
            text: 'Hide all errors from the user and return a made-up answer.',
            points: 0,
            feedback:
              'An invented answer conceals a reliability failure. Return a clear fallback or explain temporary unavailability.',
          },
        ],
      },
      {
        situation:
          'Rollback restores service. A developer asks whether you can deploy the retry fix immediately because it “looks right.”',
        question: 'What evidence do you require?',
        choices: [
          {
            text: 'Only a successful happy-path request.',
            points: 1,
            feedback:
              'You also need to simulate rate limits, timeouts, and repeated failures—the paths that caused the incident.',
          },
          {
            text: 'Tests for rate limits and timeouts, then a monitored staged rollout.',
            points: 2,
            feedback:
              'The validation targets the actual failure. A staged rollout and rollback plan limit the impact of an incomplete fix.',
          },
          {
            text: 'No tests; the code came from an AI assistant.',
            points: 0,
            feedback:
              'Code authorship does not establish correctness. Review and test behavior against the incident’s failure cases.',
          },
        ],
      },
      {
        situation:
          'The service is stable again. The customer wants to know what happened and how you will prevent a repeat.',
        question: 'What do you deliver?',
        choices: [
          {
            text: 'Say it was a mysterious model issue and close the ticket.',
            points: 0,
            feedback:
              'That misses the application’s retry failure and gives no plan for improvement.',
          },
          {
            text: 'Promise it will never fail again.',
            points: 0,
            feedback:
              'That promise cannot be supported. Explain the cause, mitigation, verification, and remaining risks.',
          },
          {
            text: 'A factual incident summary, regression tests, and an updated alert and runbook.',
            points: 2,
            feedback:
              'You leave both the system and the team better prepared, while distinguishing observations from assumptions.',
          },
        ],
      },
    ],
  },
  {
    id: 'scope',
    title: '“Can we add just one more thing?”',
    role: 'A delivery team · Two days before handoff',
    summary: 'Protect the agreed outcome while handling a customer’s new request.',
    skill: 'Delivery',
    steps: [
      {
        situation:
          'Your scoped document-search pilot is nearly ready. The customer asks for email integration, automatic replies, and multilingual answers before Friday.',
        question: 'How do you respond?',
        choices: [
          {
            text: 'Say yes to everything without changing the plan.',
            points: 0,
            feedback:
              'New integrations and actions change risk, effort, and testing. Make those changes visible before committing.',
          },
          {
            text: 'Ask which outcome is most urgent and explain the scope, time, and risk tradeoffs.',
            points: 2,
            feedback:
              'You acknowledge the need and make a concrete decision possible. Compare the request against the agreed pilot criteria.',
          },
          {
            text: 'Refuse to discuss any new request.',
            points: 1,
            feedback:
              'Protecting scope matters, but discovery can reveal a truly necessary change. Discuss priorities and document a decision.',
          },
        ],
      },
      {
        situation:
          'Automatic replies are the customer’s highest priority. They could send inaccurate or private information to external recipients.',
        question: 'What first version do you recommend?',
        choices: [
          {
            text: 'Draft replies for human review, with restricted data access and an audit trail.',
            points: 2,
            feedback:
              'A reviewed draft can test usefulness while containing the impact of errors. Agree on quality criteria and approval responsibility.',
          },
          {
            text: 'Send every reply automatically with no review.',
            points: 0,
            feedback:
              'You added external actions without establishing correctness, permissions, or accountability.',
          },
          {
            text: 'Add a disclaimer and keep unrestricted automatic sending.',
            points: 0,
            feedback:
              'A disclaimer does not enforce permissions or prevent incorrect actions. Controls belong in the workflow and application.',
          },
        ],
      },
      {
        situation:
          'The reviewed-draft feature needs another week. The original pilot can still be handed over Friday.',
        question: 'What do you agree on?',
        choices: [
          {
            text: 'Quietly delay everything and hope no one notices.',
            points: 0,
            feedback:
              'Unexpected delays erode trust. Communicate the options while the customer can still choose.',
          },
          {
            text: 'Write down a phased handoff, revised scope, cost assumptions, and acceptance criteria.',
            points: 2,
            feedback:
              'Both parties can now review the decision and its impact. Keep the original and added commitments clear.',
          },
          {
            text: 'Tell the team to work faster without adjusting anything.',
            points: 0,
            feedback:
              'Pressure does not remove integration work or testing requirements. Revisit scope, resources, or timing explicitly.',
          },
        ],
      },
      {
        situation:
          'The pilot is delivered. The customer’s team will operate it while you begin the next phase.',
        question: 'What belongs in the handoff?',
        choices: [
          {
            text: 'Only a repository URL.',
            points: 1,
            feedback:
              'Code is useful, but the team also needs setup, ownership, operational checks, and known limitations.',
          },
          {
            text: 'Only a screenshot of the successful demo.',
            points: 0,
            feedback:
              'A screenshot cannot operate or recover the system. Provide actionable documentation and a walkthrough.',
          },
          {
            text: 'A walkthrough, runbook, access ownership, limitations, and verification results.',
            points: 2,
            feedback:
              'A strong handoff makes the customer capable of using and operating the solution after you leave.',
          },
        ],
      },
    ],
  },
];
