# Mission 5: Learn through experiments

Stage 1: Build with AI and understand the result

A generated service list with a reusable rule and a prediction log.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The service lists several repair options. Copying the same calculation for each one makes updates inconsistent. Use a collection and a reusable rule, then test how one change affects all results.

## Understand the concepts

### Collections and loops

A collection groups values. Each service record can contain an identifier, name and price. A loop repeats work for records in the collection. An empty collection needs a sensible result too; repetition does not guarantee there is anything to display.

**Example:** Three service records become three cards; an empty list shows No services available.

**Common wrong idea:** A loop automatically knows which records are valid or unique.

### Abstraction and numeric precision

An abstraction hides repeated detail behind a useful rule. One price-formatting function keeps displays consistent. Computers also use finite number representations; monetary calculations need an explicit rounding rule, often using integer minor units.

**Example:** Store 1250 cents for 12.50 and format the display consistently.

**Common wrong idea:** Displayed decimal places guarantee exact arithmetic.

## Predict, change, observe

Apply a shared display rule to a prepared collection.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **3 services:** 3 cards, each formatted using the same price rule. The loop applies the abstraction once per record.
- **0 services:** No services available. No price cards. An empty list is a valid boundary case, not three blank records.
- **Duplicate ID:** Two records share an identity; flag the conflict before accepting them. A repeated operation does not solve record identity or data correctness.

Flow: Service records (Local collection) → Repeat shared rule (Program loop + function) → Service cards (Browser)

## Worked example

**before:** Three copied price labels round amounts differently.

**action:** Ask AI for one collection and shared formatter; specify the minor unit and rounding policy.

**after:** Changing the formatter updates all three outputs consistently.

**lesson:** Predict the effect of a changed record and a changed shared rule separately. This makes the hidden repetition easier to understand.

Authored example; your project requires its own observations.

## Project: A reusable service catalogue

Generate service cards from records using one reusable formatting rule. Add empty-list and duplicate-identity handling.

1. Describe each record's fields and create three fictional examples.
2. Let AI implement the repeated display and shared price rule; inspect the data-to-interface path.
3. Predict then test a fourth record, no records and a duplicate identifier. Save the observations.

## Outcome checks

- [ ] Adding one valid record adds one correct card without copied layout work.
- [ ] No records produces an understandable empty state.
- [ ] Duplicate identities and the monetary rounding policy are handled as specified.

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

- **explain:** Explain a collection, a loop and an abstraction using this catalogue.
- **locate:** Identify the records, the repeated work and the shared formatting rule.
- **predict:** What changes if one price changes? What if the shared rule changes?
- **compare:** Compare copied cards with a generated list, including the risk of a shared mistake.
- **challenge:** AI says 0.1 + 0.2 always equals exactly 0.3 in every runtime. How would you investigate and choose a money representation?

## Reviewer guidance

Ask the learner to predict empty, added and duplicated records, then distinguish local data from persistent shared storage.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- Prices now have a currency per record. Explain the required data and rule changes.
- One record is missing its name. Predict a safe display or rejection policy.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 3](../../03_Day_Conditionals_Loops/README.md)
- [Original workshop 4](../../04_Day_Functions/README.md)
- [Original workshop 5](../../05_Day_Lists_Dictionaries/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
