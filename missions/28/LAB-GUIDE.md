# Mission 28: interactive experiment

A local improvement can cost the whole workflow.

## Start here

Open mission 28 in the academy. Keep the dispatch saving fixed. Reduce downstream rework and change adoption.

First action: **Reduce correction work**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Saving time at one step is not the same as a net benefit. Include extra correction work and actual adoption. A faster tool that is not used does not deliver that proposed saving to the workflow.

## Things you can change

- **Extra correction work per person:** starts at 20. Range: 0–30 min/day, step 1.
- **Dispatch time saved per person:** starts at 10. Range: 0–30 min/day, step 1.
- **Adoption in the scenario:** starts at 60. Range: 0–100 %, step 1.
- **Eligible people:** starts at 5. Range: 1–20 people, step 1.

## A different situation

Set adoption to zero. What would you investigate before building more features?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

These are fictional scenario inputs, with adoption rounded to whole people. The total is arithmetic, not a measured pilot result or a financial return claim.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A dispatch tool saves one step, but creates correction work later. Only people who use it can experience either effect.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Include the correction work

Keep the local saving and adoption fixed. Compare the whole workflow's net time.

Starting overrides (other controls use this lab's defaults):

```json
{
  "rework": 20,
  "saved": 10,
  "adoption": 60,
  "people": 5
}
```

Change one control:

```json
{
  "rework": 3
}
```

What to understand: Three scenario users now save 30 minutes and incur 9 correction minutes: 21 net minutes. These are assumptions, not measured benefits.

### 2. What if nobody uses it?

The tool's stated per-person saving stays the same, but the active-person count changes.

Starting overrides (other controls use this lab's defaults):

```json
{
  "rework": 3,
  "saved": 10,
  "adoption": 60,
  "people": 5
}
```

Change one control:

```json
{
  "adoption": 0
}
```

What to understand: With zero adoption, this model delivers zero net time saving. Investigate actual use before treating a feature's proposed saving as a result.
