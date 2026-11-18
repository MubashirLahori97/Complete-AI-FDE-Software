import { lessonTeaching } from './lesson-content';
export type Language = 'python' | 'javascript' | 'html';
export interface Lab {
  id: string;
  title: string;
  language: Language;
  day: number;
  task: string;
  hint: string;
  code: string;
}
export const labs: Lab[] = [
  {
    id: 'hello',
    title: 'Your first program',
    language: 'python',
    day: 1,
    task: 'Change the name, add a city, and print a single welcome sentence containing both.',
    hint: 'Create a city variable. An f-string can include variables inside braces.',
    code: 'name = "Future engineer"\nprint(f"Hello, {name}! Welcome to FDE Academy.")\n',
  },
  {
    id: 'types',
    title: 'Numbers or text?',
    language: 'python',
    day: 2,
    task: 'The total prints 22. Convert the values to numbers so it prints 4. Explain why your change works.',
    hint: 'int("2") converts the text "2" into the integer 2.',
    code: 'first = "2"\nsecond = "2"\nprint(first + second)\n',
  },
  {
    id: 'conditions',
    title: 'The boundary case',
    language: 'python',
    day: 3,
    task: 'Make exactly 10 tickets count as busy. Test 9, 10, and 11 before deciding the fix works.',
    hint: '> excludes equality. >= includes equality.',
    code: 'open_tickets = 10\nif open_tickets > 10:\n    print("Busy")\nelse:\n    print("Manageable")\n',
  },
  {
    id: 'functions',
    title: 'A clear contract',
    language: 'python',
    day: 4,
    task: 'Add a check that rejects negative quantities. Test zero, a normal quantity, and a negative quantity.',
    hint: 'Raise ValueError when quantity < 0. Keep the normal return behavior.',
    code: 'def total_cost(price, quantity):\n    return price * quantity\n\nprint(total_cost(5, 3))\nprint(total_cost(5, 0))\n',
  },
  {
    id: 'collections',
    title: 'Model a support queue',
    language: 'python',
    day: 5,
    task: 'Add a second ticket with a different ID. Print only the IDs of tickets whose status is open.',
    hint: 'Loop through tickets.items() and check ticket["status"].',
    code: 'tickets = {\n    "T-001": {"customer": "Ali", "status": "open"},\n}\nfor ticket_id, ticket in tickets.items():\n    print(ticket_id, ticket["status"])\n',
  },
  {
    id: 'json',
    title: 'Read an API response',
    language: 'python',
    day: 9,
    task: 'Change the payload to omit temperature. Handle the missing value with a useful message instead of a crash.',
    hint: 'Dictionary.get("temperature") can return None. Check it before displaying a temperature.',
    code: 'import json\n\npayload = \'{"city": "Lahore", "temperature": 28}\'\ndata = json.loads(payload)\nprint(f"{data[\'city\']}: {data[\'temperature\']} C")\n',
  },
  {
    id: 'tests',
    title: 'Catch a regression',
    language: 'python',
    day: 12,
    task: 'The test fails. Fix the function without changing the expected result, then add a zero-quantity test.',
    hint: 'A total is price multiplied by quantity, not price plus quantity.',
    code: 'def total_cost(price, quantity):\n    return price + quantity\n\nassert total_cost(5, 3) == 15, "Expected a total of 15"\nprint("All tests passed")\n',
  },
  {
    id: 'tokens',
    title: 'Estimate an AI budget',
    language: 'python',
    day: 15,
    task: 'Using these fictional prices, include 500 output tokens per request at $4 per million. Print the total monthly estimate.',
    hint: 'Calculate input and output costs separately, then add them. These are exercise assumptions, not current model prices.',
    code: '# Fictional exercise prices, not a provider quote\nrequests = 10000\ninput_tokens = 1000\ninput_price_per_million = 1.00\ninput_cost = requests * input_tokens / 1000000 * input_price_per_million\nprint(f"Input estimate: ${input_cost:.2f}")\n',
  },
  {
    id: 'evals',
    title: 'Score an evaluation',
    language: 'python',
    day: 22,
    task: 'Print accuracy as a percentage. Add a case where an unsupported answer should be rejected.',
    hint: 'Count equal expected/predicted pairs, divide by the number of cases, then multiply by 100.',
    code: 'cases = [\n    {"expected": "billing", "predicted": "billing"},\n    {"expected": "technical", "predicted": "billing"},\n    {"expected": "general", "predicted": "general"},\n]\ncorrect = sum(case["expected"] == case["predicted"] for case in cases)\nprint(f"Correct: {correct}/{len(cases)}")\n',
  },
  {
    id: 'javascript',
    title: 'Update a ticket count',
    language: 'javascript',
    day: 3,
    task: 'Start with 10 tickets, add 2, then close 3. Print the final count and explain each change.',
    hint: 'Use openTickets = openTickets - 3 to close three tickets.',
    code: 'let openTickets = 10;\nopenTickets = openTickets + 2;\nconsole.log(openTickets);\n',
  },
  {
    id: 'frontend',
    title: 'Build a tiny interface',
    language: 'html',
    day: 13,
    task: 'Add a labelled text input for the customer name. Change the button so it welcomes that customer.',
    hint: 'Use a label with for="name" and an input with id="name". Read its value in the click handler.',
    code: '<!doctype html>\n<html lang="en">\n<head>\n<style>\nbody { font-family: system-ui; padding: 24px; color: #254b3e; }\nbutton { background: #254b3e; color: white; padding: 12px 20px; border: 0; border-radius: 8px; cursor: pointer; }\n</style>\n</head>\n<body>\n<h1>Your first interface</h1>\n<p id="message">Ready to build something useful?</p>\n<button onclick="document.getElementById(\'message\').textContent = \'Hello, engineer!\'">Say hello</button>\n</body>\n</html>\n',
  },
];
export const lessonLab = (day: number): Lab => {
  const { guide, teaching } = lessonTeaching(day);
  if (!['python', 'html'].includes(teaching.example.language))
    throw new Error(`Lesson ${day} is a local terminal or document exercise.`);
  return {
    id: `lesson-${day}-practice`,
    day,
    title: guide.title,
    language: teaching.example.language as Language,
    code: teaching.example.code + '\n',
    task: guide.codeTask,
    hint: teaching.exercises[0].hint,
  };
};
