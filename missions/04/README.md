# Mission 4: Make an interaction work

Stage 1: Build with AI and understand the result

A small estimator with explainable rules and invalid-input behaviour.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

Visitors want an estimated repair price before contacting the business. A calculator must distinguish a number from text and reject impossible quantities.

## Understand the concepts

### Input, types and conditions

Input is information entering the program. A type describes what kind it is: text, number or a true/false value. A condition chooses a path. Text '2' must be interpreted appropriately before numeric work; a blank field is not automatically a sensible zero.

**Example:** If quantity is a whole number from 0 to 20, calculate; otherwise explain how to correct it. This example deliberately allows zero items.

**Common wrong idea:** A number-looking field guarantees valid input. Validation must check the actual value.

### Functions and state

A function applies a named rule to inputs and produces a result. State is information the program currently remembers. A calculator's current quantity can be temporary browser state; reloading may reset it unless persistence was added.

**Example:** quote(2, 25) returns 50. Changing the quantity replaces the displayed estimate.

**Common wrong idea:** Anything visible on screen is permanently saved.

## Predict, change, observe

The prepared estimator charges 25 units per item. Change the quantity.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **2 items:** Estimate: 50 units. Two valid items × 25 = 50. This is an estimate, not a payment.
- **Blank input:** Enter a quantity from 1 to 10. No estimate is shown. Missing information needs a useful error, not an invented value.
- **−1 item:** Quantity must be at least 1. No estimate is shown. The value is numeric but violates the business rule.

Flow: Quantity input (Browser state) → Validate and multiply (Browser function) → Estimate or error (Browser display)

## Worked example

**before:** The form displays −25 for −1 item.

**action:** Ask AI to validate the permitted range before calculating, and show a useful error without losing other input.

**after:** 2 gives 50; blank and −1 produce explanations.

**lesson:** The expected outcomes come from the business rule. A test copied from the broken calculation would preserve the defect.

Authored example; your project requires its own observations.

## Project: A reliable service estimator

Add a small estimator to the service site. Define units, valid range and an honest estimate label. AI may produce the implementation and tests.

1. Write three input/expected-result pairs before asking AI to build.
2. Ask AI to implement the rule, validation and accessible feedback.
3. Try normal, missing and invalid input; explain where the calculation runs and whether values survive reload.

## Outcome checks

- [ ] A valid example produces the expected amount and units.
- [ ] Missing and invalid quantities produce useful errors without a misleading estimate.
- [ ] A changed valid input updates the result; reload behaviour matches my system explanation.

Record starting state, action, expected result, observed result, environment and evidence location. Leave unrun checks unticked.

## System explanation

1. Purpose and success
2. Actual technologies
3. How the parts fit
4. Choices and alternatives
5. Where it runs
6. One action, end to end
7. Information, access and AI
8. Changes and failures

Explain the actual project; mark absent components as absent. Use your own words and a diagram where useful. Update after meaningful changes.

## Understanding, separately from output

- **explain:** Explain input, type, condition, function and state through the estimator.
- **locate:** Show where the actual rule runs and where current input lives.
- **predict:** Predict the result for a new boundary input before running it.
- **compare:** Compare calculating in the browser with checking a final price on a server.
- **challenge:** AI says negative input is safe because it is a number. Explain and demonstrate the missing rule.

## Reviewer guidance

Give a new price or range. Ask for a prediction and an explanation of the validation boundary with AI available.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The first item costs 25 and each extra item costs 15. Predict two examples.
- The owner allows half-hour units. Which validation rule must change?

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 2](../../02_Day_Python_Variables_Types/README.md)
- [Original workshop 3](../../03_Day_Conditionals_Loops/README.md)
- [Original workshop 4](../../04_Day_Functions/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
