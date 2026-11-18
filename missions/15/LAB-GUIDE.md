# Mission 15: interactive experiment

Accepted does not mean delivered.

## Start here

Open mission 15 in the academy. Add a credential, then change the provider's response.

First action: **Configure the credential**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

An external service has its own configuration and availability. An acceptance response can acknowledge a request without proving delivery. After an ambiguous timeout, reconciliation or a stable request identifier may be safer than blindly sending again.

## Things you can change

- **Required credential is configured:** starts at false.
- **Provider response:** starts at "accepted". Choices: Request accepted; Unavailable; Timed out; acceptance unknown.
- **Extra send attempts:** starts at 0. Range: 0–5 attempts, step 1.

## A different situation

Choose an unknown response and add retries. Can you honestly report that exactly one message was delivered?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

No credentials are entered and no messages are sent. The switch represents configuration being present, not a secret value.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The shop wants to send a reminder through a provider. Configuration, acceptance and delivery are different facts.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Configure before attempting

Compare zero provider attempts with an acknowledged attempt. No secret value is requested.

Starting overrides (other controls use this lab's defaults):

```json
{
  "credential": false,
  "provider": "accepted",
  "retries": 0
}
```

Change one control:

```json
{
  "credential": true
}
```

What to understand: Required configuration permits an attempt in this model. Provider acceptance still does not establish delivery to a person.

### 2. A timeout leaves uncertainty

Read the acceptance and delivery evidence separately after the response becomes ambiguous.

Starting overrides (other controls use this lab's defaults):

```json
{
  "credential": true,
  "provider": "accepted",
  "retries": 0
}
```

Change one control:

```json
{
  "provider": "unknown"
}
```

What to understand: An ambiguous response is not a known failure or a verified delivery. A real system needs reconciliation rather than an invented success count.
