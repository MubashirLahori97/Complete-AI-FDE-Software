# Mission 25: interactive experiment

Can you get the records back?

## Start here

Open mission 25 in the academy. Restore the snapshot, then query the expected identifiers.

First action: **Restore the snapshot**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A backup's existence is different from a successful restore. Recovery requires the relevant information, a compatible application and checks that the restored state is usable. Reverting a code revision alone does not replace lost records.

## Things you can change

- **Restore the saved snapshot:** starts at false.
- **Original records:** starts at 4. Range: 1–10 records, step 1.
- **Records removed by the change:** starts at 2. Range: 0–10 records, step 1.
- **A snapshot was taken before the change:** starts at true.
- **Query every expected identifier after recovery:** starts at false.

## A different situation

Remove the backup and retry recovery. Which evidence is now missing?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This operates on generated arrays in a local model. No real records are deleted, and it is not evidence that a production backup can be restored.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A change removed visit records. Having a snapshot, restoring it and checking the result are separate steps.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Restore the snapshot

Compare the expected identifiers with the records after the chosen recovery.

Starting overrides (other controls use this lab's defaults):

```json
{
  "restore": false,
  "count": 4,
  "dropped": 2,
  "backup": true,
  "verify": false
}
```

Change one control:

```json
{
  "restore": true
}
```

What to understand: A snapshot can supply the missing records in this local model. The restore label alone is still weaker than querying the recovered state.

### 2. Check the recovered identifiers

The records stay present. Inspect the difference between an unrun check and completed identifier queries.

Starting overrides (other controls use this lab's defaults):

```json
{
  "restore": true,
  "count": 4,
  "dropped": 2,
  "backup": true,
  "verify": false
}
```

Change one control:

```json
{
  "verify": true
}
```

What to understand: Recovery evidence includes whether the restored information is usable. Run the relevant checks instead of assuming a backup guarantees recovery.
