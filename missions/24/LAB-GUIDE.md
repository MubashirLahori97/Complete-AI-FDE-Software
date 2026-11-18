# Mission 24: interactive experiment

Doing less work can mean older information.

## Start here

Open mission 24 in the academy. Compare repeated fresh reads with a cached result, then change its age and lifetime.

First action: **Reuse a cached read**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A cache can reuse a recent result instead of repeating a read. Its freshness policy matters when the source changes. A queue moves work to another time; it does not inherently remove that work.

## Things you can change

- **Read strategy:** starts at "fresh". Choices: Read the source every time; Reuse until expiry; Queue every read.
- **Repeated reads:** starts at 20. Range: 1–100 reads, step 1.
- **Work per source read:** starts at 200. Range: 0–2000 ms, step 50.
- **Cached copy age:** starts at 15. Range: 0–60 minutes, step 1.
- **Cache lifetime:** starts at 10. Range: 0–60 minutes, step 1.
- **Source changed after the cached copy:** starts at true.

## A different situation

Mark the policy as changed after the cached copy. Which displayed results can now be stale?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

Requests target the same key at the same instant. Latency is a fictional sequential-work estimate. This is not a benchmark of a database or cache service.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The shop repeats the same read. Reuse can reduce source work, but the freshness rule affects what people receive.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Refresh once, then reuse

The cached copy starts expired. Inspect the first source read and the later cache hits.

Starting overrides (other controls use this lab's defaults):

```json
{
  "mode": "fresh",
  "reads": 20,
  "age": 15,
  "ttl": 10,
  "changed": true
}
```

Change one control:

```json
{
  "mode": "cache"
}
```

What to understand: For these same-key, same-instant requests, the first read refreshes the copy and later reads reuse it. This is a model, not a service benchmark.

### 2. Within its lifetime, already stale

The copy now passes the age rule even though the source changed after it was stored.

Starting overrides (other controls use this lab's defaults):

```json
{
  "mode": "cache",
  "reads": 20,
  "age": 15,
  "ttl": 10,
  "changed": true
}
```

Change one control:

```json
{
  "age": 2
}
```

What to understand: A cache lifetime is a reuse policy, not proof that a copy equals the current source. The model now returns stale cached answers.
