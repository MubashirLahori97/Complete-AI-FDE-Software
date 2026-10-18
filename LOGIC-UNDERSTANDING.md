# Why blank is not zero

Open **Mission 4 → Understand**. The repair estimator is the same local calculation used in Explore, with the same saved quantity, price and notebook. All amounts use fictional units. This is an estimate, not a payment.

## First idea: follow an input through its conditions

Start with **Try a blank quantity**. The function stops before converting or multiplying. Try **Zero**, **Two items**, **Half an item** and **Too many**. You may also type your own text or change the price.

The checks run in this order, returning immediately when one refuses the input:

1. Was anything other than spaces entered?
2. Does JavaScript's `Number` conversion produce a finite number?
3. Is that number whole?
4. Is it between 0 and 20, including both ends?

Only an accepted quantity reaches multiplication. Each check shows Passed, Stopped here or Not reached. Select one to inspect its meaning. These statuses come from the executed function, not from a separate animation or inferred code-execution trace.

| Input | What happens | Why |
| --- | --- | --- |
| Blank or spaces | No estimate | Missing information stops before conversion. |
| `0` | 0 units | Zero is a supplied, permitted whole quantity. |
| `2`, at 25 units each | 50 units | All four checks pass. |
| `2.5` | No estimate | The whole-item condition refuses it. |
| `-1` or `21` | No estimate | The range condition refuses it. |
| `two` or `Infinity` | No estimate | Finite-number conversion check fails. |

This explicitly preserves the existing JavaScript numeric conversion: `2e0`, `0x2` and text with surrounding spaces can convert to 2. It is not a strict decimal-text parser. The prepared price control is validated separately by `labValues`: 10–100 units, in steps of five. The exported `quote` helper assumes that price precondition.

**Try a changed situation:** the owner starts selling half-hour blocks. Explain which condition needs to change, and which should remain. AI may implement it; predict several outcomes before checking your actual project.

## Second idea: separate a function from state

Choose **Next: functions and memory**. This scene calls the same `quote(quantityText, price)` function only when you press **Calculate this estimate**.

1. Calculate two items at 25 units each. The function returns 50, and the program remembers that successful result.
2. Change the quantity or price without calculating. The input state changes; the earlier call and remembered result do not. Earlier values are explicitly labelled.
3. Try blank and calculate. The latest call returns a correction. The previous successful result stays labelled as an earlier result, not a new estimate for blank input.
4. Restore a valid input and calculate. The latest successful result replaces the previous one.

A **function** applies a named rule to inputs and returns a result. **State** is what the program currently remembers. The function does not decide by itself when it runs or which returned values an interface should remember; the caller does.

Explore deliberately recalculates immediately after changes. The second scene uses an explicit button so the learner can distinguish editing input, calling the rule and remembering a result. Both are interface choices. Your own project must explain its actual choice.

The academy saves input values and notes in local browser storage and progress backups. The call counter, latest call and last successful result are temporary component state. Leaving Understand or reloading clears that calculation memory; inputs remain. **Clear calculation memory** clears these temporary boxes without changing inputs. **Undo input change** restores up to twenty grouped input edits, not calculation memory. Reset inputs can be undone. Neither scene records mastery or project completion.

## Apply it to your own estimator

Continue to **Apply it to my estimator** for the existing Mission 4 project. Define valid inputs, units, missing-input behaviour and whether a result updates immediately or after a button. Ask AI to implement those choices. Check normal, missing, invalid and boundary inputs. Change one requirement and explain which rules and observations need to change. Document where inputs and results live and what survives reload.

## Research and verification

Reviewed 16 October 2026. The [ECMAScript conversion specification](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-stringtonumber) defines numeric-string conversion, including empty/whitespace strings producing zero. The estimator checks presence first so that language behaviour does not silently choose the shop's missing-input policy. [Learnable Programming](https://worrydream.com/LearnableProgramming/) informs our design interpretation: make current values and their consequences understandable in context. The lesson's diagrams, copy and implementation are authored for the academy.

The UI/UX skill's verified Forms/Accessibility guidance informed the inline correction, programmatic field description and focus after an explicitly refused call. Typing does not move focus or scroll. On tall smaller screens, explicit examples/calculation reveal the result below the sticky input controls. Short screens keep normal scrolling. Reduced motion removes the finite input-path entrance transition; no animation runs indefinitely.

Implementation: `web/src/estimate-model.ts`, `LogicUnderstanding.tsx` and `logic-understanding.css`. Explore uses the same `quote` helper. The older prepared scenario and shared static example now agree on 0–20 whole quantities. The guide and exact TypeScript model source are included in the Mission 4 repository folder and kit. The static worked example is a separate runnable page, with temporary input/results and the same quantity rule.

Checks establish the implemented rules, actual calls, saved-input continuity, refusals, reversible edits, responsive/keyboard behaviour and project handoff. They do not establish independent comprehension, enjoyment, retention, professional equivalence or worldwide novelty. The broader experience goal remains active.
