# Mission 13: interactive experiment

Two requests. One last slot.

## Start here

Open mission 13 in the academy. Make simultaneous requests for fewer slots. Compare the reservation rules.

First action: **Use an atomic reservation**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Separate reads can both see an available slot before either write finishes. An atomic reservation rule checks and changes state together. An idempotency key identifies a retry of the same operation rather than a new booking.

## Things you can change

- **Available slots:** starts at 1. Range: 1–5 slots, step 1.
- **Distinct requests arriving together:** starts at 2. Range: 1–8 requests, step 1.
- **Check and reserve atomically:** starts at false.
- **Extra retry attempts:** starts at 0. Range: 0–5 attempts, step 1.
- **Retries keep their original key:** starts at false.

## A different situation

Add retries. What changes when they keep the same request key?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This executes a deterministic concurrency model. Separate reads all see the same initial snapshot; it is not a database load test.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

Two booking operations compete for the last slot. Retries can also repeat a single intended operation.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Protect the last slot

Inspect each operation's result. Accepted bookings must not exceed capacity.

Starting overrides (other controls use this lab's defaults):

```json
{
  "slots": 1,
  "requests": 2,
  "atomic": false,
  "retries": 0,
  "sameKey": false
}
```

Change one control:

```json
{
  "atomic": true
}
```

What to understand: A capacity check and reservation need a protected operation. Separate unprotected checks can both act on the same available slot.

### 2. A retry is not a new intention

Keep four attempts. Change whether they share one operation identifier.

Starting overrides (other controls use this lab's defaults):

```json
{
  "slots": 4,
  "requests": 1,
  "atomic": true,
  "retries": 3,
  "sameKey": false
}
```

Change one control:

```json
{
  "sameKey": true
}
```

What to understand: Stable retry identity lets repeated attempts refer to one intended operation instead of creating several reservations in this model.
