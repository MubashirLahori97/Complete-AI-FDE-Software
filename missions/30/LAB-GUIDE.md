# Mission 30: interactive experiment

A new requirement reveals your system.

## Start here

Open mission 30 in the academy. Change the requirement. Add only the components needed for that journey.

First action: **Try private customer information**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

An unfamiliar change tests whether the system and its explanation still fit the need. Trace the changed journey, identify a missing component or boundary, and direct a correction. A simulated success or polished explanation is not a professional capability certificate.

## Things you can change

- **Changed requirement:** starts at "public". Choices: Public information; Private customer information; Grounded AI helper.
- **Suitable connected application and storage:** starts at false.
- **Trusted record permission check:** starts at false.
- **Permitted supporting knowledge source:** starts at false.

## A different situation

Switch to a grounded AI helper. What does a permitted source add that a database alone does not?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is a compositional teaching model. Graduation still requires your own useful product, explanation, fresh variation and reviewer observations.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

Your product faces a changed requirement. Trace what the new journey needs before adding components.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. A public page becomes a private journey

The existing components stay fixed. Inspect the capabilities the changed requirement now needs.

Starting overrides (other controls use this lab's defaults):

```json
{
  "need": "public",
  "server": false,
  "permissions": false,
  "source": false
}
```

Change one control:

```json
{
  "need": "private"
}
```

What to understand: A previously adequate public-page design can miss a new private-record need. Identify the connected and permission boundaries instead of assuming the old path still fits.

### 2. Give the helper a supporting source

The connected application is already present. Add the permitted supporting source and inspect the changed path.

Starting overrides (other controls use this lab's defaults):

```json
{
  "need": "ai",
  "server": true,
  "permissions": false,
  "source": false
}
```

Change one control:

```json
{
  "source": true
}
```

What to understand: A data store is not automatically supporting knowledge for an AI answer. This model fit still needs transfer to your own product and an independent review.
