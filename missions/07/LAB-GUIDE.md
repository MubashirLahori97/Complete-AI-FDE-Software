# Mission 7: interactive experiment

Two missed visits out of how many?

## Start here

Open mission 7 in the academy. Keep two missed visits. Change the eligible total from ten to one hundred.

First action: **Change the denominator**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A count and a rate answer different questions. Divide the number of missed eligible visits by all eligible visits in the same period. A target needs the same definition and denominator as the baseline.

## Things you can change

- **Eligible visits:** starts at "10".
- **Missed visits:** starts at 2. Range: 0–100 visits, step 1.
- **Target missed-visit rate:** starts at 10. Range: 0–100 %, step 1.

## A different situation

Erase the denominator. Is zero percent an honest replacement for an unknown rate?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

These are fictional counts. The displayed rate is arithmetic, not evidence of a product's effectiveness.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

Two missed visits sound small, but the meaning depends on how many eligible visits there were.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Keep the count; change the whole

The missed count stays at two. Watch the fraction and percentage change.

Starting overrides (other controls use this lab's defaults):

```json
{
  "eligible": "10",
  "missed": 2
}
```

Change one control:

```json
{
  "eligible": "100"
}
```

What to understand: Two out of ten is 20%; two out of one hundred is 2%. The denominator changes the meaning of the same count.

### 2. Unknown is not zero percent

Remove the eligible total. Look for Unknown rather than a reassuring zero.

Starting overrides (other controls use this lab's defaults):

```json
{
  "eligible": "10",
  "missed": 2
}
```

Change one control:

```json
{
  "eligible": ""
}
```

What to understand: A rate needs a usable denominator. Missing information should remain visible instead of silently becoming a favourable result.
