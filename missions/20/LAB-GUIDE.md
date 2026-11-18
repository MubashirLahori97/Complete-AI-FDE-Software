# Mission 20: interactive experiment

Which mistakes are you counting?

## Start here

Open mission 20 in the academy. Move the alert threshold and watch the same labelled cases change category.

First action: **Raise the alert threshold**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Precision asks how many alerts were correct. Recall asks how many real positive cases were found. A threshold changes which cases trigger an alert; it can trade one kind of error for another.

## Things you can change

- **Alert threshold:** starts at 30. Range: 0–100 points, step 1.
- **Actually positive cases:** starts at 10. Range: 1–50 cases, step 1.
- **Actually negative cases:** starts at 90. Range: 1–100 cases, step 1.

## A different situation

Can you increase precision by issuing almost no alerts? What happens to missed cases?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

Scores and labels are deterministic fictional fixtures. These counts do not establish the quality of an actual model or an overall reliability claim.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The helper flags urgent messages. The shop needs to inspect both false alerts and missed urgent cases.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Raise the threshold

Inspect the same labelled cases before and after the threshold changes.

Starting overrides (other controls use this lab's defaults):

```json
{
  "threshold": 30,
  "positives": 10,
  "negatives": 90
}
```

Change one control:

```json
{
  "threshold": 70
}
```

What to understand: A threshold can reduce alerts while increasing missed positive cases. Precision and recall describe different parts of that tradeoff.

### 2. Change the case mix

Keep the decision threshold. Add fictional positive cases to the evaluation sample.

Starting overrides (other controls use this lab's defaults):

```json
{
  "threshold": 70,
  "positives": 10,
  "negatives": 90
}
```

Change one control:

```json
{
  "positives": 50
}
```

What to understand: The sample composition affects aggregate results. Record the labels, sample definition and mistakes that matter instead of quoting a metric without context.
