# Mission 8: interactive experiment

A journey includes the awkward parts.

## Start here

Open mission 8 in the academy. Enter a visit identifier, then disconnect the model's connection.

First action: **Fill the visit identifier**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A form must help someone act and understand the result. Missing input should produce a useful correction. A lost connection should preserve the draft rather than pretend that a visit was confirmed.

## Things you can change

- **Visit identifier:** starts at "".
- **Connection available:** starts at true.

## A different situation

Reconnect. What evidence would distinguish a submitted request from a confirmed appointment?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is a local form-state model. No appointment is sent or saved in a shared service.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A customer is trying to request a visit. The form must help them recover when input or connectivity is missing.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Give the form its required input

Follow the draft, connection and result steps before and after an identifier is present.

Starting overrides (other controls use this lab's defaults):

```json
{
  "visit": "",
  "connected": true
}
```

Change one control:

```json
{
  "visit": "V-42"
}
```

What to understand: Required input is checked before the request proceeds in this model. A real confirmation still needs a real service response.

### 2. Keep the draft when the connection fails

Read the draft after the connection fails. It should still contain V-42.

Starting overrides (other controls use this lab's defaults):

```json
{
  "visit": "V-42",
  "connected": true
}
```

Change one control:

```json
{
  "connected": false
}
```

What to understand: Keeping useful input and explaining the failure helps a person recover. A lost connection must not turn into an invented confirmation.
