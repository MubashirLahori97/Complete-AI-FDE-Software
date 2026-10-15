# Mission 10: interactive experiment

What would a useful check actually inspect?

## Start here

Open mission 10 in the academy. Inspect the records instead of only the toast.

First action: **Check before and after records**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A success message describes what an interface says. It does not prove which record changed. An acceptance check should compare the selected record and records that must stay unchanged.

## Things you can change

- **Evidence inspected:** starts at "toast". Choices: Success message only; Selected and other records.
- **The updater changes the wrong record:** starts at true.
- **Selected visit:** starts at "V-42". Choices: V-42; V-43.

## A different situation

Switch the selected visit. Does the check still catch a change to the wrong record?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

The updater and assertions run on fictional records in this browser. A passing check here is not a check of your own application.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The interface says Saved, but the shop needs to know whether the intended visit actually changed.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Inspect more than the toast

Keep the defect. Compare the message-only check with a check of both records.

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

What to understand: The same defect can hide behind a passing toast check. A useful assertion inspects the intended change and the state that must stay unchanged.

### 2. Correct the updater

Watch which record becomes confirmed. The other record should remain pending.

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
  "defect": false
}
```

What to understand: A relevant check should distinguish the faulty updater from the corrected one. A success message alone cannot do that.
