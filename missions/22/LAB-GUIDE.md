# Mission 22: interactive experiment

Code rollback is not data rollback.

## Start here

Open mission 22 in the academy. Make configuration complete, then compare rollback with and without a data migration.

First action: **Supply the required configuration**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

A release needs a compatible build, configuration and data. Reverting code can recover a code-only regression. It cannot automatically undo an incompatible change to stored information.

## Things you can change

- **Required configuration is present:** starts at false.
- **Build and required checks pass:** starts at true.
- **Data migrated to an incompatible v2 schema:** starts at false.
- **Roll code back to v1:** starts at false.

## A different situation

Turn on the incompatible migration and roll code back. Which version can still understand the data?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is a release-compatibility model. It does not build, deploy or migrate an external application.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.
