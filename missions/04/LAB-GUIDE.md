# Mission 4: interactive experiment

Can a number be wrong?

## Start here

Open mission 4 in the academy. Try a blank quantity, then zero, then two. Compare the results.

First action: **Try a blank quantity**. Change the controls and observe the result. The browser executes a local teaching model; it does not contact a customer system or an AI provider.

## The idea

An input starts as text. Before multiplying, the program must decide whether that text represents an allowed quantity. Blank, negative and fractional values can mean different things from zero. Validation makes that rule explicit.

## Things you can change

- **Number of items:** starts at "2".
- **Price per item:** starts at 25. Range: 10–100 units, step 5.

## A different situation

Change the price per item. Which inputs should still be rejected?

Predict the result before trying it. Record the value you changed, what actually happened and why. Inspect the system parts in 3D or use the equivalent flat diagram. Rotation and separation change your view; the lesson controls change the model.

## What this experiment establishes

This estimator runs locally and uses fictional units. Its explicit rule allows whole quantities from zero to twenty.

Your controls and notebook are saved in this browser and included in a progress backup. The experiment JSON export records the model inputs and output. It is separate from real project evidence and understanding review. Continue to Understand, then Build with AI to create your own project using MISSION.md and AI-BRIEF.txt.

Authored source: web/src/mission-labs.json; executable rules: web/src/mission-labs.ts.

## Two guided comparisons

A visitor wants an estimate. The shop must decide which quantities are allowed before calculating a total.

Each pair loads fictional example inputs and changes one control. Compare the result, then try your own variation. Undo restores earlier values during the current lesson visit; it does not certify understanding.

### 1. Blank is different from zero

Compare a zero total with a withheld total. Those results mean different things.

Starting overrides (other controls use this lab's defaults):

```json
{
  "quantity": "0",
  "price": 25
}
```

Change one control:

```json
{
  "quantity": ""
}
```

What to understand: Zero is an allowed quantity in this rule. Blank means the visitor has not supplied an allowed quantity, so the model withholds the total.

### 2. One more item

Count the item chips. One additional item adds one more unit price to the receipt.

Starting overrides (other controls use this lab's defaults):

```json
{
  "quantity": "2",
  "price": 25
}
```

Change one control:

```json
{
  "quantity": "3"
}
```

What to understand: The same multiplication rule works for each allowed whole quantity: quantity times price per item.
