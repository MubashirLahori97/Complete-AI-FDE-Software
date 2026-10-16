# Mission 1: interactive experiment

Give a visitor something useful.

## Start here

Open mission 1 in the academy. Replace Welcome with a heading that tells a visitor what the shop does.

First action: **Give it a useful heading**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

Your browser turns page instructions into a visible website. A useful heading tells a visitor what you do. Changing those words happens in this browser; it does not require a database or a live AI call.

## Things you can change

- **The page heading:** starts at "Welcome.".
- **Show the service-area line:** starts at true.
- **Page colour:** starts at "teal". Choices: Teal; Coral; Violet.
- **Contact button has a click rule:** starts at true.

## A different situation

Keep the heading useful when the shop changes from appliance repairs to bicycle repairs.

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

The page runs real HTML, CSS and JavaScript. Its shop and contact details are fictional; no messages are sent.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A repair shop needs a page that helps a visitor decide whether to contact it.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. A greeting or a useful message?

Read the page as someone looking for a repair. Which heading gives you useful information?

Starting overrides (other controls use this lab's defaults):

```json
{
  "heading": "Welcome."
}
```

Change one control:

```json
{
  "heading": "Repairs near you."
}
```

What to understand: The browser displays the words you supply. A useful result starts with the visitor's need, even when AI writes the page.

### 2. A different shop

Only the heading changes. The page still opens and its Contact action still works.

Starting overrides (other controls use this lab's defaults):

```json
{
  "heading": "Repairs near you."
}
```

Change one control:

```json
{
  "heading": "Bicycle repairs near you."
}
```

What to understand: A change in the business can require different content without requiring a new database or a live AI call.
