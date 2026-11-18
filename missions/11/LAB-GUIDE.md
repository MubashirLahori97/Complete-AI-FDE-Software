# Mission 11: interactive experiment

A request has a journey.

## Start here

Open mission 11 in the academy. Make the response slower than the client's timeout.

First action: **Delay the response**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

The browser sends a request, a server handles it, and a response returns. A client timeout means the client stopped waiting. It does not prove that the server stopped working or that nothing was stored.

## Things you can change

- **Response delay:** starts at 800. Range: 0–3000 ms, step 100.
- **Client stops waiting after:** starts at 1000. Range: 100–5000 ms, step 100.
- **Request passes validation:** starts at true.

## A different situation

What could go wrong if you retry a timed-out booking with a new request identifier?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

The timings are controlled teaching inputs. No network request or backend write is performed by this model.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A customer submits a visit request. What should the browser say if it stops waiting before the response arrives?

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. The response arrives too late

Compare the response delay with the client's waiting limit.

Starting overrides (other controls use this lab's defaults):

```json
{
  "latency": 800,
  "timeout": 1000,
  "valid": true
}
```

Change one control:

```json
{
  "latency": 1800
}
```

What to understand: A timeout means the client stopped waiting. It does not establish whether the server stopped or whether a write happened.

### 2. Give the client time to receive the response

Keep the server timing fixed and change only the waiting limit.

Starting overrides (other controls use this lab's defaults):

```json
{
  "latency": 1800,
  "timeout": 1000,
  "valid": true
}
```

Change one control:

```json
{
  "timeout": 2000
}
```

What to understand: The response can now arrive within the model's waiting period. Real retries still need stable identity and evidence of the final state.
