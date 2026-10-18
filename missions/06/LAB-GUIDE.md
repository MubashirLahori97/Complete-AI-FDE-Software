# Mission 6: interactive experiment

What supports the claim?

## Start here

Open mission 6 in the academy. Change the source and the sample size. Keep the number of missed visits consistent with the sample.

First action: **Inspect checked records**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

An invented example, a person's recollection and checked records support different statements. Counts need a defined sample. Even a checked association does not by itself show why appointments were missed.

## Things you can change

- **Source of the claim:** starts at "invented". Choices: AI-invented example; Owner's recollection; Checked visit records.
- **Visits in the sample:** starts at 10. Range: 1–50 visits, step 1.
- **Missed visits:** starts at 2. Range: 0–50 visits, step 1.

## A different situation

Can ten missed visits come from a sample of five? What evidence would you request before choosing a solution?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

All people and counts here are fictional teaching inputs. This is not an interview, field study or causal finding.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The owner says customers miss visits. Before building a reminder, you need to know what supports that claim.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. An example or an observation?

The numbers stay identical. Inspect how the source changes what can be said about them.

Starting overrides (other controls use this lab's defaults):

```json
{
  "source": "invented",
  "sample": 10,
  "missed": 2
}
```

Change one control:

```json
{
  "source": "records"
}
```

What to understand: An invented example shows a possibility. Checked fictional records describe this model sample, but still do not identify the cause of missed visits.

### 2. Can the counts fit?

Try fitting two missed visits inside a sample containing only one visit.

Starting overrides (other controls use this lab's defaults):

```json
{
  "source": "records",
  "sample": 10,
  "missed": 2
}
```

Change one control:

```json
{
  "sample": 1
}
```

What to understand: Conflicting counts need investigation before calculating or interpreting a rate. A precise-looking percentage cannot repair inconsistent inputs.
