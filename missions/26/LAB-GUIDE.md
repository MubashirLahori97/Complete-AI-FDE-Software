# Mission 26: interactive experiment

The fastest route may still be blocked.

## Start here

Open mission 26 in the academy. Make preparation faster. Does that give the van permission to leave? Try the visit and find what still blocks it.

First action: **Try one-minute preparation**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

An unfamiliar domain can contain a prerequisite that a proposed solution ignored. Improving dispatch speed cannot make an unapproved site visit eligible. Investigate the real workflow and separate observations from assumptions.

## Things you can change

- **Dispatch preparation time:** starts at 15. Range: 1–60 minutes, step 1.
- **Access approval is recorded:** starts at false.
- **The visit requires access approval:** starts at true.

## A different situation

Remove the access requirement. Does approval remain the relevant bottleneck?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is an authored maintenance scenario, not an observation about a real organisation. A real project needs authorised investigation.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A maintenance team is preparing a site visit. The site needs approval before anyone can enter.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Faster preparation, still blocked

Preparation gets faster. Watch whether the access gate opens.

Starting overrides (other controls use this lab's defaults):

```json
{
  "approval": false,
  "needsAccess": true,
  "dispatch": 15
}
```

Change one control:

```json
{
  "dispatch": 1
}
```

What to understand: Optimising a later step cannot satisfy a missing prerequisite. The approval requirement still blocks this model journey.

### 2. Resolve the actual prerequisite

Keep preparation at one minute. Record the required approval and inspect the gate.

Starting overrides (other controls use this lab's defaults):

```json
{
  "approval": false,
  "needsAccess": true,
  "dispatch": 1
}
```

Change one control:

```json
{
  "approval": true
}
```

What to understand: The journey can now proceed in the fictional scenario. A real investigation must establish who grants approval and how it is recorded.
