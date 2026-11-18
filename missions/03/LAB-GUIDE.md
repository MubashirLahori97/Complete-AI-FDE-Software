# Mission 3: interactive experiment

Same words. Different appearance.

## Start here

Open mission 3 in the academy. Change the heading size. Notice what stays the same.

First action: **Make the heading bigger**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

HTML describes content, CSS describes its appearance, and JavaScript can define an action. These are roles in this small page. A framework may generate or coordinate these instructions in a larger project.

## Things you can change

- **Heading size:** starts at 26. Range: 22–38 px, step 1.
- **The page heading:** starts at "Repairs near you.".
- **Contact button has a click rule:** starts at true.

## A different situation

Remove the click rule. Can the page still look exactly the same? Try its Contact button.

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This is a real local browser page. Changing its heading or style sends no request to an AI service.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

The shop wants a bigger heading. That is a different request from changing its words or its button's action.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Appearance changes, words stay

Watch the heading grow. Read its words again; they have not changed.

Starting overrides (other controls use this lab's defaults):

```json
{
  "size": 26,
  "heading": "Repairs near you.",
  "rule": true
}
```

Change one control:

```json
{
  "size": 38
}
```

What to understand: Presentation and content have different jobs. Changing the CSS size need not change the HTML content.

### 2. A button can look ready and do nothing

Try Contact in both cases. Compare its appearance with what actually happens.

Starting overrides (other controls use this lab's defaults):

```json
{
  "size": 26,
  "heading": "Repairs near you.",
  "rule": true
}
```

Change one control:

```json
{
  "rule": false
}
```

What to understand: A visible button does not prove that an action rule is present. Behaviour needs its own check.
