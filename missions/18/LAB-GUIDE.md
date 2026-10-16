# Mission 18: interactive experiment

Correct JSON can still invent a fact.

## Start here

Open mission 18 in the academy. Replace the invented date with null. Keep a non-empty summary.

First action: **Keep the unknown date unknown**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A structured response can be valid JSON and still contradict its source. Parsing, checking the schema and checking factual support are separate operations. An unknown date should remain unknown when the source does not supply one.

## Things you can change

- **Proposed structured output:** starts at "{\"date\":\"2026-10-20\",\"summary\":\"Customer called about a repair.\"}".
- **Date explicitly present in the source (blank means unknown):** starts at "".

## A different situation

Enter a source date, then provide a different output date. Which check should reject it?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

You are running a real JSON parser and a small source-checking rule on fictional input. No model is called and this does not measure general factual accuracy.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

An example response contains a neat date field, but the source never supplied a date.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Keep an unknown fact unknown

The JSON can parse in both cases. Inspect the separate check for date support.

Starting overrides (other controls use this lab's defaults):

```json
{
  "output": "{\"summary\":\"Customer called about a repair.\",\"date\":\"2026-10-20\"}",
  "sourceDate": ""
}
```

Change one control:

```json
{
  "output": "{\"summary\":\"Customer called about a repair.\",\"date\":null}"
}
```

What to understand: A valid shape does not establish a fact. Null can represent an unknown date without inventing certainty.

### 2. Support must come from a source

Keep the response identical. Supply the matching date as fictional source evidence.

Starting overrides (other controls use this lab's defaults):

```json
{
  "output": "{\"summary\":\"Customer called about a repair.\",\"date\":\"2026-10-20\"}",
  "sourceDate": ""
}
```

Change one control:

```json
{
  "sourceDate": "2026-10-20"
}
```

What to understand: The source changes what the date check can support. This small rule still does not verify every claim in the summary or evaluate a real AI model.
