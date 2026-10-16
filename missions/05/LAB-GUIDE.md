# Mission 5: interactive experiment

One rule. Many records.

## Start here

Open mission 5 in the academy. Grow the collection. Then introduce a repeated identifier.

First action: **Add three more services**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A collection holds several records. A loop can apply the same function to each record. A stable identifier distinguishes one record from another; a repeated name is not automatically a repeated identity.

## Things you can change

- **Number of services:** starts at 3. Range: 0–12 records, step 1.
- **Repeat the last identifier:** starts at false.
- **Service label:** starts at "Repair".

## A different situation

Set the collection to zero. Should the page invent a service to fill the space?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

The records are generated fictional services. The duplicate check executes in your browser; this is not a database constraint.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The shop adds services. The page should create a card for each record using one display rule.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Grow the collection

Count the records and cards. The display rule stays the same as the collection grows.

Starting overrides (other controls use this lab's defaults):

```json
{
  "count": 3,
  "duplicate": false,
  "prefix": "Repair"
}
```

Change one control:

```json
{
  "count": 6
}
```

What to understand: A loop applies the same rule to each record. More records do not require a separately written card for each one.

### 2. Different cards, repeated identity

Inspect the cards marked Repeated ID. Their display labels cannot repair their repeated identifier.

Starting overrides (other controls use this lab's defaults):

```json
{
  "count": 3,
  "duplicate": false
}
```

Change one control:

```json
{
  "duplicate": true
}
```

What to understand: Names and labels describe records. Stable, distinct identifiers let the system tell those records apart.
