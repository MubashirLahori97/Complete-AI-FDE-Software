# Mission 12: Keep meaningful information

Stage 3: Understand how the complete system works

A stored workflow with an accurate data model and source-quality notes.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The appointment vanishes after the server restarts. Staff also have two people with the same name. Introduce persistent records, stable identifiers and information provenance.

## Understand the concepts

### Persistence, identifiers and relationships

Memory belongs to a running process; persistent storage survives the intended restart when configured correctly. A stable identifier distinguishes records even when names match. Relationships connect records, such as one customer with several visits. Constraints protect rules at the storage boundary.

**Example:** Visit V12 refers to customer C7 rather than identifying a person only by name.

**Common wrong idea:** An in-memory database is automatically durable.

### Queries, SQL and provenance

A query asks for selected data; SQL is a language for relational data operations. A model defines fields and relationships. Record where values came from and what is missing: an empty access field differs from access denied.

**Example:** Query pending visits while keeping unknown access status separate from refused access.

**Common wrong idea:** Importing a spreadsheet makes all its contents trustworthy.

## Predict, change, observe

Choose the storage and data situation in this prepared model.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Process memory + restart:** The temporary visit disappears. No persistent write was made.
- **Persistent store + restart:** The saved visit can be queried after restarting with the same store. Persistence depends on the actual storage path, volume or managed service.
- **Two identical names:** Names are ambiguous; stable customer IDs preserve the correct relationship. A label is not necessarily a unique identity.

Flow: Validated visit (Application server) → Records + relationships (Configured persistent store) → Query after restart (Server → browser)

## Worked example

**before:** Visits store only a customer's name and an empty access string.

**action:** Ask AI for stable identifiers, a customer relationship and explicit unknown access status; retain the source of imported information.

**after:** The correct customer's visit survives a restart and unknown data remains visible.

**lesson:** Inspect the actual storage configuration and perform the restart test. A database-shaped object in a demo is not proof of durability.

Authored example; your project requires its own observations.

## Project: An appointment register that survives

Persist fictional customers and visits with stable IDs, a relationship and explicit missing-data handling. Record where imported or entered information came from.

1. Ask AI what information each appointment needs, which values must be unique or valid, how records can be looked up, and where they should be stored.
2. Save two fictional customers with the same name. Give them different identifiers and attach each visit to the correct customer.
3. Restart using the project's instructions and look up the records again. Investigate any missing information or a value whose source you cannot support.

## Outcome checks

- [ ] Saved visits remain after the intended process restart using the same storage configuration.
- [ ] Same-name customers remain distinguishable and visits connect to the correct identity.
- [ ] Missing information has an explicit meaning and an important value has recorded provenance.

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

- **explain:** Explain memory, persistence, model, identifier, relationship and query.
- **locate:** Find the actual data store, its configuration and one query with AI's help.
- **predict:** What happens if a deployment uses a temporary disk or a different database URL?
- **compare:** Compare one flat record list with related customer and visit records.
- **challenge:** AI says every blank access value means refused access. What source evidence and data change are needed?

## Reviewer guidance

Ask the learner to identify a real saved record after restart and explain an unfamiliar missing-data case.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- A customer's displayed name changes. Explain which identifiers should remain stable.
- An import has no source date. Explain what claims you cannot make.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 5](../../05_Day_Lists_Dictionaries/README.md)
- [Original workshop 6](../../06_Day_Files_Errors_Debugging/README.md)
- [Original workshop 24](../../24_Day_FastAPI_Databases/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
