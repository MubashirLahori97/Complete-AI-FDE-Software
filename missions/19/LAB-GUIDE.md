# Mission 19: interactive experiment

A relevant source can still be the wrong source.

## Start here

Open mission 19 in the academy. Bring the policy within the freshness limit, then inspect an instruction embedded in it.

First action: **Use a current policy**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Retrieval can find information related to a question, but relevance alone does not establish freshness or authority. Text inside a retrieved document is information, not permission to perform an action.

## Things you can change

- **Question:** starts at "Can I cancel my visit?".
- **Age of the policy:** starts at 20. Range: 0–30 days, step 1.
- **Maximum allowed source age:** starts at 7. Range: 0–30 days, step 1.
- **Document asks to cancel a visit:** starts at false.
- **Separate user and policy authority allows cancellation:** starts at false.

## A different situation

A document says cancel the visit. Does reading that document authorize the application to cancel it?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is a small keyword-matching source model, not semantic embeddings or a live retrieval service. Its policy and freshness limit are fictional.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.
