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
