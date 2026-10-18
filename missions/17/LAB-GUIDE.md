# Mission 17: interactive experiment

Parallel work still needs an agreement.

## Start here

Open mission 17 in the academy. Make the interface field names agree. Then vary worker count.

First action: **Agree on the field name**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Two workstreams must agree on their interface. More workers can reduce some parallel work, but coordination and integration still cost time. A fast incompatible component does not create a working journey.

## Things you can change

- **Field the interface expects:** starts at "status".
- **Field the server returns:** starts at "accessStatus".
- **Workers:** starts at 2. Range: 1–6 workers, step 1.
- **Independent tasks:** starts at 4. Range: 1–10 tasks, step 1.
- **Time per task:** starts at 5. Range: 1–20 minutes, step 1.

## A different situation

With only one small task, can adding workers increase the model's total time?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

The time model assumes equal independent tasks plus two coordination minutes per extra worker. It is a stated toy assumption, not an estimate of real AI-agent productivity.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

Two workstreams are building connected parts. They need a shared interface as well as time to coordinate.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Agree on the field

Compare the key the interface expects with the key in the supplied payload.

Starting overrides (other controls use this lab's defaults):

```json
{
  "uiField": "status",
  "serverField": "accessStatus"
}
```

Change one control:

```json
{
  "uiField": "accessStatus"
}
```

What to understand: Compatible field names let this local interface check fit. Speed elsewhere cannot repair a broken agreement between parts.

### 2. More workers, one small task

Look for idle workers and additional coordination time.

Starting overrides (other controls use this lab's defaults):

```json
{
  "uiField": "accessStatus",
  "serverField": "accessStatus",
  "workers": 1,
  "tasks": 1,
  "minutes": 5
}
```

Change one control:

```json
{
  "workers": 6
}
```

What to understand: One five-minute task still needs one work round. Extra workers add coordination in this model, so the total increases rather than decreases.
