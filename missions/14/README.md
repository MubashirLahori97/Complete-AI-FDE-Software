# Mission 14: Give people the right access

Stage 3: Understand how the complete system works

A two-user permission demonstration with server-enforced boundaries.

AI can perform all implementation, research, planning, tests and diagnosis. Concepts are compulsory. This is a mission, not a one-day guarantee.

## The problem

Customers may see their own visits; dispatchers may schedule assigned work. Hiding a button does not stop someone calling an endpoint directly.

## Understand the concepts

### Authentication and sessions

Authentication establishes an identity. A session lets later requests refer to an authenticated interaction through an appropriate credential. Credentials and session configuration need protection. Use a well-supported identity mechanism rather than inventing a password system for practice.

**Example:** The server associates a request with customer C7 using its validated session.

**Common wrong idea:** A customer ID supplied by the browser proves that person's identity.

### Authorization and trust boundaries

Authorization decides whether an identity may perform this action on this record. Enforce it at the server or trusted service boundary for every relevant request. Least privilege grants only the needed authority. Validation and transport encryption solve different problems.

**Example:** C7 cannot retrieve C8's private appointment by changing the URL.

**Common wrong idea:** A hidden admin button is an access-control rule.

## Predict, change, observe

Choose the prepared identity and record requested.

Prepared teaching simulation, not live provider or business evidence. Predict before selecting.

- **C7 requests C7 visit:** Allowed when the session and action are valid. Identity and ownership match the policy.
- **C7 requests C8 visit:** Refused without disclosing private visit details. An authenticated person is not authorized for every record.
- **No valid session:** No private record returned; require appropriate sign-in. A supplied record identifier does not establish identity.

Flow: Authenticated request (Client + identity service) → Permission on this record (Trusted server boundary) → Allowed result or refusal (API response)

## Worked example

**before:** The API accepts any customerId sent by the page.

**action:** Ask AI to derive identity from the trusted session and check ownership before returning a visit.

**after:** Separate customers receive their own records and cross-customer access is denied.

**lesson:** Use separate identities in actual checks. Do not infer enforcement from what one screen shows.

Authored example; your project requires its own observations.

## Project: The right visit for the right person

Add a supported identity mechanism and an explicit permission policy to fictional visit data. Avoid real personal data in the learning project.

1. Define customer and staff actions and which records each may access.
2. Ask AI to implement trusted identity/session handling and enforce permissions at the data/API boundary.
3. Use two separate users and an unauthenticated request; directly try permitted and forbidden actions.

## Outcome checks

- [ ] Each test user can perform the intended action on the permitted records.
- [ ] A direct cross-user request cannot read or modify another user's private record.
- [ ] An unauthenticated request is refused and useful diagnostics omit secrets and private payloads.

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

- **explain:** Explain authentication, authorization and trust boundaries in this product.
- **locate:** Find the actual identity mechanism and enforcement point.
- **predict:** What happens if a customer changes a visit ID in a request?
- **compare:** Compare client-side hiding with trusted server enforcement.
- **challenge:** AI says HTTPS proves a request is authorized. Show what TLS does and which permission check remains.

## Reviewer guidance

Try a fresh record/action combination with two identities. A good-looking login page is insufficient evidence.

AI stays available. A working output plus generated prose does not establish understanding if the learner cannot apply the concept. Practise these variations, then ask a reviewer for a fresh relevant variation:

- A dispatcher should see only one region. Extend the policy.
- A session expires while a form is open. Explain safe recovery.

Record who or what reviewed, the learner's predictions and reasoning, observed results, gaps and next practice. Local review records are not authenticated qualifications.

## Optional implementation source material

- [Original workshop 23](../../23_Day_Guardrails_Cost/README.md)
- [Original workshop 24](../../24_Day_FastAPI_Databases/README.md)

Use relevant material; manual coding and the old sequence are not core gates.

<!-- Generated from web/src/missions.json by web/scripts/pack-missions.mjs. -->
