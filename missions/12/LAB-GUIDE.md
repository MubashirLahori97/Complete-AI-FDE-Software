# Mission 12: interactive experiment

A name is not an identifier.

## Start here

Open mission 12 in the academy. Restart the model with memory storage, then choose persistent storage.

First action: **Restart the process**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Two visits can belong to people with the same name. Stable identifiers allow exact lookup. Process memory disappears when that process restarts; persistent storage has a separate lifetime and needs its own protection and recovery.

## Things you can change

- **Process has restarted:** starts at false.
- **Where records were stored:** starts at "memory". Choices: Process memory; Persistent store.
- **Look up a name or identifier:** starts at "Alex".

## A different situation

Both records are named Alex. Which identifier selects one visit unambiguously?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is an explicit storage-lifetime model with fictional records. It is not a running database. Your experiment settings, separately, save in this browser.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

Two customers are named Alex. After a restart, the shop also needs its records to remain available.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. A separate storage lifetime

Compare the retained records after the same process restart.

Starting overrides (other controls use this lab's defaults):

```json
{
  "restart": true,
  "storage": "memory",
  "lookup": "Alex"
}
```

Change one control:

```json
{
  "storage": "persistent"
}
```

What to understand: Process memory and persistent storage have different lifetimes. Persistence still needs its own protection, backup and recovery.

### 2. One name, two identities

Compare two name matches with one exact identifier match.

Starting overrides (other controls use this lab's defaults):

```json
{
  "restart": true,
  "storage": "persistent",
  "lookup": "Alex"
}
```

Change one control:

```json
{
  "lookup": "V-42"
}
```

What to understand: A person's name may not uniquely select a record. A stable identifier can target the intended visit.
