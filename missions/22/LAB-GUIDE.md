# Mission 22: interactive experiment

Code rollback is not data rollback.

## Start here

Open mission 22 in the academy. Make configuration complete, then compare rollback with and without a data migration.

First action: **Supply the required configuration**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A release needs a compatible build, configuration and data. Reverting code can recover a code-only regression. It cannot automatically undo an incompatible change to stored information.

## Things you can change

- **Required configuration is present:** starts at false.
- **Build and required checks pass:** starts at true.
- **Data migrated to an incompatible v2 schema:** starts at false.
- **Roll code back to v1:** starts at false.

## A different situation

Turn on the incompatible migration and roll code back. Which version can still understand the data?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is a release-compatibility model. It does not build, deploy or migrate an external application.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A release changes code, configuration and possibly stored information. Those parts do not roll back together automatically.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. A release needs its configuration

The build passes in both cases. Inspect whether the required configuration is also present.

Starting overrides (other controls use this lab's defaults):

```json
{
  "credential": false,
  "build": true,
  "migration": false,
  "rollback": false
}
```

Change one control:

```json
{
  "credential": true
}
```

What to understand: A passing build is one release condition. The running journey also needs its declared configuration and compatible data.

### 2. Rollback only the code

Watch code change from v2 to v1 while the data schema remains v2.

Starting overrides (other controls use this lab's defaults):

```json
{
  "credential": true,
  "build": true,
  "migration": true,
  "rollback": false
}
```

Change one control:

```json
{
  "rollback": true
}
```

What to understand: Reverting code does not restore stored data. Under these declared rules, old code cannot read the migrated schema.
