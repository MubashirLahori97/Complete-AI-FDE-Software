# Mission 23: interactive experiment

Find where the time went.

## Start here

Open mission 23 in the academy. Select the provider span, then change its duration in this controlled trace.

First action: **Inspect the provider**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A trace divides a journey into observed spans. A slow total does not tell you which component to change. Inspect the relevant span, form a hypothesis, then verify the effect of an intervention.

## Things you can change

- **Provider time:** starts at 1900. Range: 0–3000 ms, step 50.
- **Database time:** starts at 80. Range: 0–1000 ms, step 20.
- **Validation time:** starts at 20. Range: 0–100 ms, step 5.
- **Investigate this component:** starts at "css". Choices: CSS; Validation; Database; Provider.

## A different situation

Make the database the slowest span. Should the same investigation still come first?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

These durations are synthetic inputs. Changing a slider is an intervention in this model, not a verified diagnosis of an external service.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.
