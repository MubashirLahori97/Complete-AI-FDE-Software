# Mission 9: interactive experiment

Compare a decision, not a headline price.

## Start here

Open mission 9 in the academy. Change the number of months and the export requirement.

First action: **Look two years ahead**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A recurring fee and an initial build cost accumulate differently. Compare the same period and required capabilities. A cheap option that cannot export required records may fail the need regardless of its arithmetic cost.

## Things you can change

- **Comparison period:** starts at 12. Range: 1–24 months, step 1.
- **Monthly licence:** starts at 20. Range: 0–200 units, step 5.
- **Setup cost:** starts at 120. Range: 0–500 units, step 20.
- **Build cost:** starts at 600. Range: 0–2000 units, step 50.
- **Record export is required:** starts at false.
- **The package supports export:** starts at false.

## A different situation

When would the cheaper arithmetic total still be the wrong choice?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

All costs and capabilities are fictional. Maintenance, risk, taxes and financing are excluded; this is not a provider recommendation.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The shop is choosing between a package and a custom build. Compare the same period and required capabilities.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. A repeating fee accumulates

Compare the growing package line with the fixed stated build cost.

Starting overrides (other controls use this lab's defaults):

```json
{
  "months": 1,
  "license": 20,
  "setup": 120,
  "build": 600
}
```

Change one control:

```json
{
  "months": 24
}
```

What to understand: The package's stated total reaches 600 units after two years in this example. This arithmetic excludes maintenance and other costs.

### 2. A cheaper option can miss the need

The totals stay the same. The package now lacks a capability the shop requires.

Starting overrides (other controls use this lab's defaults):

```json
{
  "months": 1,
  "needExport": false,
  "vendorExport": false
}
```

Change one control:

```json
{
  "needExport": true
}
```

What to understand: A lower price does not supply a missing requirement. Capability, omitted costs and risks belong in the decision too.
