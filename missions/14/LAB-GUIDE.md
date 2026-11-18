# Mission 14: interactive experiment

Being signed in is not enough.

## Start here

Open mission 14 in the academy. Keep customer C7 signed in and ask for C8's visit.

First action: **Request another customer's visit**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Authentication establishes an identity. Authorization decides whether that identity may access this record. Hiding a button cannot replace a trusted permission check on the request.

## Things you can change

- **Requesting identity:** starts at "C7". Choices: Customer C7; Customer C8; No valid session.
- **Record belongs to:** starts at "C7". Choices: Customer C7; Customer C8.
- **Trusted boundary checks the record owner:** starts at true.

## A different situation

Remove the server check. Does the interface's sign-in badge prevent the model from leaking a record?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

These are fictional identities and a locally executed policy. No real account, session or private record is accessed.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

Customer C7 is signed in. That does not automatically allow access to C8's private visit.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Signed in, different owner

The requesting identity stays signed in while the record owner changes.

Starting overrides (other controls use this lab's defaults):

```json
{
  "caller": "C7",
  "owner": "C7",
  "serverCheck": true
}
```

Change one control:

```json
{
  "owner": "C8"
}
```

What to understand: Authentication identifies the caller. Authorization separately decides whether that caller may access this record.

### 2. Remove the trusted check

Inspect whether a refused record becomes returned without permission.

Starting overrides (other controls use this lab's defaults):

```json
{
  "caller": "C7",
  "owner": "C8",
  "serverCheck": true
}
```

Change one control:

```json
{
  "serverCheck": false
}
```

What to understand: A sign-in badge or hidden button cannot enforce the trusted record boundary. Removing the check can leak the fictional record.
