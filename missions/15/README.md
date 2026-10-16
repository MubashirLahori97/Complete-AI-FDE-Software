# Mission 15: Connect another service

Stage 3: Understand how the complete system works

A bounded integration with configuration and failure evidence.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

The owner wants appointment reminders. A messaging provider is a dependency with credentials, a contract, cost and possible failure. Sending a reminder also requires appropriate authority and recipient consent.

## Understand the concepts

### Contracts, configuration and secrets

An integration contract defines accepted requests and responses. Configuration selects the environment, destination and behaviour. A secret is a credential granting access; keep server secrets out of browser bundles and logs. Versions and capabilities must match the actual provider.

**Example:** A server adapter sends an authorized reminder using a configured test provider.

**Common wrong idea:** An environment variable is secret even when bundled into public browser JavaScript.

### Dependencies and safe failure

A dependency can be unavailable or return an ambiguous result. Use timeouts, explicit status and suitable retry rules. External actions may need idempotency or reconciliation; repeating a message request can otherwise contact someone twice.

**Example:** A failed provider call leaves the reminder pending, not falsely delivered.

**Common wrong idea:** A simulated provider response proves a real message was delivered.

## Predict, change, observe

Change the prepared provider response. No messages are sent here.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **Accepted by provider:** Record provider acceptance, not necessarily delivery to the person. Accepted and delivered are different contract states.
- **Provider unavailable:** Keep an explicit pending/failed state and an appropriate recovery path. Do not invent successful delivery.
- **Missing credential:** Fail configuration validation without exposing the secret. Credentials belong at the trusted integration boundary.

Flow: Authorized reminder request (Application server) → Configured provider adapter (Server → external service) → Status + reconciliation (Application records)

## Worked example

**before:** The UI says Reminder delivered whenever the request is submitted.

**action:** Ask AI to model accepted, delivered, failed and unknown states according to the provider contract.

**after:** The record reflects observed provider evidence and a bounded retry policy.

**lesson:** Use a test inbox or authorized recipient. A local double checks your boundary, not external deliverability.

Authored example; your project requires its own observations.

## Project: A reminder integration with honest status

Connect a test messaging service or a clearly labelled local provider double. Keep credentials server-side and demonstrate unavailable-provider behaviour. Record which external claims remain untested.

1. With AI, check what the reminder provider expects, how its test mode works, what it costs and which actions are allowed.
2. Ask AI to build a small connection to the provider. Check required settings, limit how long it waits, and recognise retries of the same intended reminder.
3. Try accepted, rejected and unavailable responses. Clearly distinguish a local simulated provider from an actual delivery in the provider's test mode.

## Outcome checks

- [ ] The configuration and secret boundary are documented and secrets are absent from public output.
- [ ] A successful boundary check records the contract's actual status without exaggerating delivery.
- [ ] Provider failure produces an honest state and bounded recovery; no unintended contact occurs.

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

- **explain:** Explain the provider contract, dependency and secret boundary.
- **locate:** Identify actual adapter configuration and whether tests use a double or real service.
- **predict:** If a reply is lost after acceptance, what might a blind retry do?
- **compare:** Compare a provider double, test mode and an authorized real delivery.
- **challenge:** AI says a passing mock test proves the customer received a message. Explain the gap.

## Reviewer guidance

Ask for the exact authority, environment and evidence behind the claimed external effect.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The provider changes its response schema. Explain the impact and investigation.
- The recipient withdraws permission for reminders. Adapt the workflow.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 9](../../09_Day_HTTP_APIs_JSON/README.md)
- [Original workshop 10](../../10_Day_Environments_Packages/README.md)
- [Original workshop 17](../../17_Day_Structured_Outputs_Tools/README.md)
- [Original workshop 23](../../23_Day_Guardrails_Cost/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
