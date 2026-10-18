# Mission 21: interactive experiment

Does the test notice the defect?

## Start here

Open mission 21 in the academy. Run the record assertion with the wrong-record defect present, then remove the defect.

First action: **Inspect the changed records**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A test is useful when it can expose a relevant mistake. Checking a success toast misses an updater that changes the wrong record. Compare both the intended change and the state that must remain unchanged.

## Things you can change

- **Assertion to run:** starts at "toast". Choices: Toast says Saved; Only the selected visit changed.
- **Wrong-record defect present:** starts at true.
- **Selected visit:** starts at "V-42". Choices: V-42; V-43.

## A different situation

Choose the other visit. Can a hard-coded assertion still be trusted?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

The updater and assertions execute on two local fictional visits. This is a controlled defect, not a test of your real application.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A regression check needs to notice a wrong-record update, including when the selected visit changes.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Does the assertion see the defect?

Keep the updater faulty. Change the evidence the assertion inspects.

Starting overrides (other controls use this lab's defaults):

```json
{
  "check": "toast",
  "defect": true,
  "selected": "V-42"
}
```

Change one control:

```json
{
  "check": "records"
}
```

What to understand: A passing weak check is not evidence that the relevant behaviour works. The record assertion exposes the deliberately faulty updater.

### 2. Select the other record

The intended record changes. Does the assertion still identify the incorrect update?

Starting overrides (other controls use this lab's defaults):

```json
{
  "check": "records",
  "defect": true,
  "selected": "V-42"
}
```

Change one control:

```json
{
  "selected": "V-43"
}
```

What to understand: A check should follow the selected record and protect the other one, rather than hard-coding one convenient identifier.
