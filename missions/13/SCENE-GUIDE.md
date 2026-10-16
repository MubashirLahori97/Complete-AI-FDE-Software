# Mission 13: learn through the scene

Protect correct state

## Why this lesson

Two people can ask for the last appointment at the same time. Checking and reserving together helps prevent both from claiming it.

## What to look for

An atomic rule means ‘check and reserve as one step’. Compare which requests fit and which are refused when there is only one slot.

## Start your project

Write the rule ‘accepted bookings must not exceed available slots’. Ask AI to demonstrate two competing requests and a retry of the same request.

## Explain your own result

Explain how your booking rule protects capacity and how it recognises a repeated attempt at the same booking.

## Your next steps

Use **Next: understand the idea**, explore the concepts, then **Build my project**. Copy the ready-to-use AI brief into your AI builder or coding assistant and ask how to open the result. Save your project observations, choose **Explain my system**, and then **Review my evidence**. Work through one question at a time. You can return later; a lesson can take more than one session.

## Try one change

Make simultaneous requests for fewer slots. Compare the reservation rules.

First action: **Use an atomic reservation**. The scene uses the same saved inputs and local rules as the original experiment. Changes appear immediately. Use either scene change, inspect a reading moment, or choose Follow the idea. Pause, restart and replay are available.

The illustration is a teaching view, not measured execution or real customer/provider evidence. This executes a deterministic concurrency model. Separate reads all see the same initial snapshot; it is not a database load test.

## Your own project: One slot, one reservation

Protect the stored appointment workflow against invalid requests, repeated submissions and competing reservations.

Start here: Define the invariant and duplicate policy with concrete examples.

Use Build this with AI to open the existing project. AI may implement everything. Explain the relevant input, rule and result in your own system; predict a changed case and check what actually happens. Keep your product observations separate from the teaching model.

Inputs and notes use the saved experiment and progress backup. Undo/reset remain available. Playback is temporary and never records mastery. Inspect the numbers and rules for full values. System/3D inspection and guided comparisons remain available.
