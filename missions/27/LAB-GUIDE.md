# Mission 27: interactive experiment

What does this product actually need?

## Start here

Open mission 27 in the academy. Add a private-record requirement and compare it with the chosen architecture.

First action: **Require shared private records**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A public information page can be delivered as static files. Shared private records need suitable connected storage and access control. Choose components because of the required behaviour, and account for their operating responsibilities.

## Things you can change

- **Shared private records are required:** starts at false.
- **User accounts are required:** starts at false.
- **Chosen architecture:** starts at "static". Choices: Static files only; Site plus suitable connected services.
- **Independently operated components:** starts at 5. Range: 1–8 components, step 1.

## A different situation

Choose a connected design. What new data and permission explanations does the project need?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This checks a deliberately simplified capability model. It does not choose a real provider or prove an implementation is secure.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A public page is working. A new requirement asks it to share private customer records between users.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Change the need

The static design stays the same while the required capability changes.

Starting overrides (other controls use this lab's defaults):

```json
{
  "privateRecords": false,
  "accounts": false,
  "design": "static"
}
```

Change one control:

```json
{
  "privateRecords": true
}
```

What to understand: Files alone do not supply shared private records and trusted access control. The architecture needs suitable connected capabilities.

### 2. Add a suitable connected design

Inspect the missing capability after the model design includes connected services.

Starting overrides (other controls use this lab's defaults):

```json
{
  "privateRecords": true,
  "accounts": false,
  "design": "static"
}
```

Change one control:

```json
{
  "design": "connected"
}
```

What to understand: The declared capabilities can now fit this simplified need. Actual security, implementation and operating responsibilities still need evidence.
