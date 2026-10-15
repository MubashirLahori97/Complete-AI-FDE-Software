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
