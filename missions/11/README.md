# Mission 11: Follow an action through the system

Stage 3: Understand how the complete system works

A traceable request journey and one diagnosed failed response.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

A staff member presses Confirm but the stored appointment does not change. Follow the action through the browser, network, server and response instead of guessing which screen to redesign.

## Understand the concepts

### Client, server and HTTP contract

A client requests work from a server. HTTP carries a request method, destination, headers and sometimes a body; the response has a status and data. DNS resolves a name to a destination. TLS protects transport when correctly used; it does not decide who is allowed to edit a visit.

**Example:** A browser sends a visit identifier and new status to an API endpoint.

**Common wrong idea:** An HTTPS address means every action is authorized.

### Asynchronous work and failure

Network work takes time and can fail independently of the page. The interface needs pending, success and failure states. A timeout means a response was not received in time; the server may still have performed the action.

**Example:** A confirmation write succeeds but its response is lost, so the browser must avoid blindly duplicating it.

**Common wrong idea:** No response always means no change occurred.

### Files, processes and runtimes

Source files describe the program. A running process executes work using memory and a runtime. Interpreters execute a language through a runtime; compilers translate source into another form. Builds may bundle and transform modules before the browser or server runs them. Dependencies, versions and configuration affect execution. Sequential work follows an order; concurrent work can overlap and share state.

**Example:** A TypeScript build produces browser JavaScript, while a separately configured server process handles API requests. Inspect your actual project rather than assuming this stack.

**Common wrong idea:** A source file in a repository is already a running service, or a local memory value automatically survives process exit.

## Predict, change, observe

Change the prepared response from the confirmation API.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **200 with confirmation:** Show confirmed only after matching the response to this visit. Response identity and payload matter as well as status.
- **400 invalid request:** Show a correctable error; do not claim the visit changed. The server rejected this request contract.
- **Timeout:** Outcome is unknown. Check state before deciding how to retry. The write and the reply are separate events.

Flow: Click + request (Browser client) → Validate + handle (Application server) → Response + display (Server → browser)

## Worked example

**before:** The UI says Confirmed immediately when clicked.

**action:** Ask AI to trace the actual request, handle pending and error states, and correlate the response to the visit.

**after:** The interface reports the server's observed result instead of assuming success.

**lesson:** Use the real network observation or logs. A prepared response is a teaching fixture, not a request to a deployed service.

Authored example; your project requires its own observations.

## Project: A connected confirmation journey

Use AI to implement or connect a small confirmation API for fictional visits. Trace one actual action and one failed request through the real stack.

1. Give AI your expected-result table. Ask it to connect the browser and server, define the messages they exchange, and provide instructions to run both parts.
2. With AI's help, inspect one actual network request. Identify its action, address, sent data and response code, and explain which parts run in the browser and on the server.
3. Try invalid input and a service that is unavailable. Save the feedback you observed and say when the final outcome is still unknown.

## Outcome checks

- [ ] A real valid action reaches the intended handler and returns the correct visit identity.
- [ ] An invalid request produces the specified status and useful feedback.
- [ ] The diagram accurately separates browser, application server and any external service; a failed call is recorded.

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

- **explain:** Explain the request and response, DNS, TLS and asynchronous waiting in this journey.
- **locate:** Identify the actual endpoint, runtime, dependencies and relevant configuration.
- **predict:** What if the server changes state but the reply is lost?
- **compare:** Compare a local browser calculation with a server request for shared data.
- **challenge:** AI says a timeout proves the appointment is unchanged. What observation would resolve this?

## Reviewer guidance

Ask the learner to trace a fresh action and distinguish a rejected request from an unknown outcome.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- The API returns a different visit's ID. Decide how the client should respond.
- The server is reachable by address but its hostname fails. Locate a plausible boundary.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 9](../../09_Day_HTTP_APIs_JSON/README.md)
- [Original workshop 10](../../10_Day_Environments_Packages/README.md)
- [Original workshop 24](../../24_Day_FastAPI_Databases/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
