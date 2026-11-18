# Day 17 — Structured outputs, validated tools, and safe execution boundaries

<!-- beginner-path:begin -->
## Start here — one idea at a time

**Your goal:** An allowlisted inventory tool service. You can take several study sessions.

**The situation:** An assistant can request an inventory lookup. It must not gain permission to delete stock records.

### One idea: A model can propose; your app decides

A tool is a function your app makes available to a model-driven workflow. The model can propose a tool name and arguments, but your application must validate them and decide whether the action is allowed. Structured output makes information easier to check; it does not make it trustworthy. Start with a small list of read-only tools and explicit input rules.

**New words:**

- **Tool call:** A proposed request to run an application function.
- **Schema:** A description of the fields and types data should have.
- **Allowlist:** An explicit list of permitted choices or actions.

### Follow the example below

1. The dispatcher looks up a requested tool in a fixed allowlist.
2. It validates arguments before calling application code.
3. Unknown tool names are rejected. The saved request demonstrates dispatch; it is not a live model deciding to call a tool.

### Try one small decision

The model proposes delete_inventory, which is not in your allowlist. What should the app do?

1. Reject the request before executing a tool
2. Run it because the model suggested it
3. Rename it to a permitted tool and guess the arguments

<details>
<summary>A small hint</summary>

The application owns the execution boundary.

</details>

<details>
<summary>Another hint</summary>

Only explicitly allowed tool names with validated arguments should reach functions.

</details>

<details>
<summary>Answer and explanation</summary>

**Reject the request before executing a tool** Yes. The model's proposal does not expand your app's permissions.

</details>

**Then practise:** Replace the requested tool name with an unknown name. Run the dispatcher and check that it rejects the request without running a different action.

**Your project's first action:** Write two read-only inventory tools in plain English: their names, required inputs, and possible results. List one action they must never perform.

**How it connects:** Combine Day 4 function contracts with Day 16 output validation. You will reuse the permission boundary in later agent and capstone work.

Use the app's **Learn → Practise → Project → Record your build** flow, or continue below for the detailed explanation and worked example. The app remembers your reading step and activity in this browser.

<!-- beginner-path:end -->

Tool use connects a model's proposed action to code that can perform it. The crucial engineering boundary is the application's decision to accept, reject, or require review of that proposal. Today you will build a small allowlisted dispatcher and learn why a tool schema, validation, authorization, and actual execution are separate concerns.

**Your project:** [An allowlisted inventory tool service](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Describe the loop from model proposal to tool result and final response.
- Validate tool names and argument types before execution.
- Keep authorization and consequential actions outside model control.

## Understand the concept

### A proposal is not an authorized action

A model may return a tool name and arguments. Your program decides whether the name exists, the arguments are valid, and the user is allowed to perform the action. A schema helps communicate the contract but does not replace application checks. Never pass arbitrary model-proposed text into eval, a shell, or unrestricted SQL. Use a small dispatcher that maps recognized names to specific functions and handles unsupported proposals visibly.

### Validate before calling

Check outer shape, required fields, types, ranges, and unexpected fields before passing values to a tool. An integer-looking string is not automatically an integer argument. Decide whether additional fields are rejected or ignored, and keep the policy consistent. Authorization depends on trusted identity and resource policy, not a role field supplied inside model arguments. A successful tool call returns structured data that the application can inspect before it is presented to the user.

### Side effects add operational requirements

A read-only lookup has a different impact from sending an email or charging a card. For consequential actions, define approval, idempotency, logging, and recovery responsibilities. A repeated request should not accidentally repeat a financial or external action. Tool timeouts and errors must have explicit results rather than being transformed into invented success messages. Begin with a read-only tool while learning the contract and observation loop.

## A worked example, step by step

Only one tool exists. Its contract accepts exactly one non-blank product ID.

```python
inventory = {"P001": {"name": "Notebook", "stock": 12}}

def dispatch(call):
    if call.get("name") != "get_stock":
        raise ValueError("Unsupported tool")
    arguments = call.get("arguments")
    if not isinstance(arguments, dict) or set(arguments) != {"product_id"}:
        raise ValueError("Invalid arguments")
    product_id = arguments["product_id"]
    if not isinstance(product_id, str) or not product_id.strip():
        raise ValueError("A product ID is required")
    return inventory.get(product_id, {"error": "Product not found"})

proposal = {"name": "get_stock", "arguments": {"product_id": "P001"}}
print(dispatch(proposal))
```

**Expected result**

```text
{'name': 'Notebook', 'stock': 12}
```

The dispatcher checks the recognized operation before considering arguments. It verifies the argument shape and product-ID type before lookup. The data is a fictional read-only inventory, so the example has no payment or messaging side effect. A complete dispatcher should first validate that the proposal itself is a dictionary, enforce resource access using trusted identity, and record a safe tool result. This fixture validates the application boundary, not a model's ability to choose tools.

## Practise before building

### Exercise 1: Draw the action loop

Show the user request, model proposal, application checks, tool result, and final response as separate steps.

**Hint:** Put authorization before execution.

**Check your result:** You can identify which component can reject a proposal.

### Exercise 2: Reject unsupported proposals

Test an unknown tool, an array as arguments, an extra field, and an empty product ID.

**Hint:** Validate structure before operations that assume a dictionary or string.

**Check your result:** None of the invalid proposals executes a different tool.

### Exercise 3: Discuss a side-effect tool

Write the additional controls required before a hypothetical send-email tool could be used.

**Hint:** Include permission, approval, repeated requests, and failure reporting.

**Check your result:** A model cannot authorize itself by supplying a role or approval argument.

## Common mistakes and how to debug them

- Executing a tool proposal merely because the model emitted it.
- Using eval or unrestricted command strings as a tool implementation.
- Checking argument shape but omitting trusted user and resource authorization.

## The FDE connection

The most valuable customer integrations often touch existing records and workflows. An FDE defines the exact allowed operations and their trust boundaries, so natural-language convenience does not silently widen the customer's permissions.

## Build your lesson project

**An allowlisted inventory tool service**

A shop assistant needs read-only stock lookup and product search over fictional inventory. Build a dispatcher with two named tools, argument validation, not-found results, and a trusted-user access policy. Demonstrate invalid proposals and resource restrictions with fixtures before optionally connecting a model that proposes tool calls.

- Two documented read-only tool contracts and a dispatcher.
- A fictional inventory dataset and trusted-user policy fixtures.
- Tests for invalid names, arguments, and forbidden resources.
- A trace of proposal, validation, execution, and tool result.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- Who decides whether the tool is authorized?
- What changes when a tool has external side effects?
- Which trace fields are useful without exposing private content?

## References and next steps

- [Anthropic: building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OWASP: prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

[← Lesson 16](../16_Day_Prompt_Engineering/) · [Lesson 18 →](../18_Day_Embeddings_Semantic_Search/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** **Tool calling** = the model decides *what* to do, your code does *how*. You give the model a menu of functions (with strict contracts — names, parameters, descriptions); it replies "call `calculate` with these arguments"; your code executes and returns the result; the model writes the final answer. The contract between them — the schema — is the engineering.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The loop, drawn

```
User: "What's 15% of 2400?"
  → Model thinks: "I need calculate(2400 * 0.15). I have that tool."
  → Model replies: {tool: "calculate", args: {expression: "2400*0.15"}}
  → YOUR code runs calculate("2400*0.15") → 360.0
  → Model writes: "15% of 2400 is 360."
```

The model never does math — it **delegates** to your code. This is the whole trick behind AI that "does things": the model is the brain, your functions are the hands.

### The contract (function schema)

```python
tools = [{
    "type": "function",
    "function": {
        "name": "calculate",
        "description": "Evaluate a math expression safely.",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {"type": "string",
                               "description": "e.g. '2400*0.15'"}
            },
            "required": ["expression"],
        },
    },
}]
```

The `description` fields are **read by the model** — they're part of your spec (day 16). Vague descriptions → wrong tool choices. This is prompt engineering applied to APIs.

### The three laws of tools

1. **Validate everything.** The model can send bad arguments. Check types, ranges, and safety *before* executing — never `eval()` raw model output.
2. **Tools do, models decide.** Keep tools small and honest: one job, clear name, predictable output.
3. **Log every call.** In production, "the AI called what with what?" must be answerable (day 25).

---

## 2. Specify — direct the AI

> "Build tool_calling_demo.py: 1) two tools — calculate(expression) using safe evaluation (ast module, NOT eval) and get_weather(city) calling the Open-Meteo API from day 9, 2) a loop: send user message + tool schemas to the model, if it requests a tool call, validate the arguments, execute, feed the result back, get the final answer, 3) print every step (model's tool request, your validation, the result) so the loop is visible, 4) max 3 tool calls per user message, then stop gracefully."

You specified the **protocol**, the **safety rules**, and the **stop condition**. That's the engineering.

## 3. Evaluate — be the senior

- Ask: "What's 15% of 2400?" → trace: did the model call `calculate` with the right expression? Did your validator accept it?
- Ask: "Weather in Lahore and Karachi?" → does it call the tool **twice** (parallel) or once? Either can be correct — understand which happened and why.
- **Attack your own validator:** get the model (or yourself, manually) to request `calculate` with `__import__('os').system('rm -rf /')`. Does your safe-evaluator refuse? If you used raw `eval`, you just learned why law #1 exists — fix it with `ast`.
- Break one link: make `get_weather` return an error. Does the loop handle it gracefully or crash? (Day 6's failure thinking, now in AI systems.)
- Ask the AI: "Quiz me — draw the full loop from memory. Who validates? Who executes? What stops infinite tool loops?"

## 4. Business lens 💼

Tools are how AI **touches real business systems** — databases, bookings, payments, inventory. "Chat with our data" demos are cute; "AI that checks stock, books the slot, and confirms by SMS" is what businesses pay for. Every tool you add is a new capability you can sell — and every tool is also a new thing to secure, which is why day 23 exists.

---

## 🧠 Quick check — do you own today?

<details>
<summary><b>Q1.</b> Who does the math in "What's 15% of 2400?" — the model or your code?</summary>

Your code. The model only decides *that* math is needed and *which* arguments to pass. Models predict text; tools do work.
</details>

<details>
<summary><b>Q2.</b> Why are the description fields in the schema so important?</summary>

The model reads them to decide when to call each tool. A vague description is a vague spec — the model will misroute calls, exactly like a human given unclear docs.
</details>

<details>
<summary><b>Q3.</b> What's the worst thing that happens if you skip argument validation?</summary>

The model can be tricked (or just mistaken) into destructive arguments — e.g., expression strings that execute system commands if you eval them raw. Validate before executing, always.
</details>

---

## ✅ Done when

- [ ] You can draw the full tool loop from memory and explain each arrow
- [ ] Your validator refuses a malicious expression (tested, not assumed)
- [ ] Every tool call is logged with arguments and results
- [ ] Committed to GitHub

## 📎 The one link

[OpenAI — Function Calling Guide](https://platform.openai.com/docs/guides/function-calling) — the protocol reference; concepts transfer to every provider.

---

[← Day 16](../16_Day_Prompt_Engineering/) · [Day 18 →](../18_Day_Embeddings_Semantic_Search/)
<!-- original-workshop:end -->

</details>
