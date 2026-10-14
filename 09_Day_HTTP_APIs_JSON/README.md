# Day 9 — HTTP requests, API contracts, and JSON boundaries

When one program asks another for information, both sides need an agreed contract. HTTP carries the request and response; JSON is a common representation for the data inside them. Today you will trace that round trip, distinguish transport errors from invalid payloads, and build an adapter that turns an external-style weather response into a dependable internal result.

**Your project:** [Weather-service adapter with offline fixtures](PROJECT.md). Read the lesson, run the worked example, then build the project in stages. Projects may take more than one study session.

## What you will be able to do

- Describe the method, URL, headers, status, and body of an HTTP exchange.
- Parse and validate a JSON response before using its fields.
- Design explicit behavior for timeouts, missing data, and service errors.

## Understand the concept

### Requests ask for a defined operation

An HTTP request identifies a resource through its URL and a method such as GET or POST. Headers carry metadata, while a body can carry input data. The response includes a status code and may include a body. A successful connection does not guarantee a successful operation; inspect the status and the endpoint contract. GET generally retrieves a representation, while POST submits data for processing according to the service's definition. Know whether a retry could repeat a side effect before retrying an operation.

### JSON is packaging, not a guarantee

Parsing JSON converts a text representation into values. It does not establish that expected fields exist, units are correct, or the service supplied current data. Map the provider's payload into a small internal shape so the rest of your application is not coupled to every external field. Preserve an explicit unit and source timestamp when they matter. A missing temperature should remain missing; silently replacing it with zero can turn an integration failure into a plausible weather report.

### Failure categories guide recovery

An invalid city, a rate limit, an authentication failure, and a temporary outage call for different actions. A timeout needs a finite waiting policy. Retrying invalid input usually wastes time, while unbounded retries during an outage can worsen it. Return a useful error category to the caller and retain safe request context for diagnosis. During learning, local fixtures let you test these cases repeatably without relying on a live provider's uptime or consuming API credits.

## A worked example, step by step

The provider-style response uses a nested field. The adapter exposes a simpler shape with explicit units.

```python
import json

payload = '{"city": "Lahore", "current": {"temperature_c": 28}}'
data = json.loads(payload)
temperature = data.get("current", {}).get("temperature_c")
if not isinstance(temperature, (int, float)):
    raise ValueError("Weather response is missing a numeric temperature")
result = {"city": data["city"], "temperature": temperature, "unit": "C"}
print(f"Fixture: {result['city']} {result['temperature']} {result['unit']}")
```

**Expected result**

```text
Fixture: Lahore 28 C
```

The example begins with a deliberately labelled fixture, not a real network result. loads parses it, and the adapter inspects the field it actually needs. The numeric check prevents unsupported data from entering the internal result. The mapping separates provider names from application names and retains the unit. A fuller adapter must also check object shapes before calling get, inspect HTTP status before parsing success data, and avoid accepting booleans as temperatures if its contract excludes them.

## Practise before building

### Exercise 1: Draw the round trip

Label the request method, destination, response status, payload parsing, and internal mapping.

**Hint:** Keep the network operation separate from the data conversion.

**Check your result:** You can explain where each category of failure occurs.

### Exercise 2: Break the response shape

Try malformed JSON, an array instead of an object, a missing current object, and a text temperature.

**Hint:** Validate outer shape before nested lookup.

**Check your result:** Each invalid response produces a clear adapter failure rather than a fabricated measurement.

### Exercise 3: Define a retry policy

State what happens for a timeout, invalid city, and rate limit.

**Hint:** Specify attempt count and wait limits for failures you choose to retry.

**Check your result:** No policy retries indefinitely or treats invalid input as transient success.

## Common mistakes and how to debug them

- Treating any response body as successful data without checking status.
- Assuming parsed JSON has the right shape and units.
- Retrying every error indefinitely or displaying a fixture as live information.

## The FDE connection

An FDE often connects a customer's existing services rather than replacing them. An adapter creates a manageable boundary: provider details and failures are translated into a stable application contract that can be tested independently.

## Build your lesson project

**Weather-service adapter with offline fixtures**

A travel dashboard needs a city and clearly labelled temperature, but its provider can return incomplete data or fail. Build an adapter with a fixture transport for repeatable tests and an optional live transport based on a provider's current documentation. Keep the UI independent of the provider's payload shape and distinguish offline demonstration data from live results.

- A documented request/response and internal-result contract.
- Fixture cases for valid data, missing data, timeout, and service error.
- A validated adapter and a thin display layer.
- An explicit retry policy and optional live-provider setup notes.

Open [the complete project guide](PROJECT.md) for milestones, acceptance checks, a test matrix, extension challenges, and a review rubric. The app's Project tab includes a starter-kit download and a checklist that saves your progress.

## Explain it back

- What is transport failure versus payload failure?
- Which provider details should the rest of the app not depend on?
- How does retrying a read differ from retrying an operation with side effects?

## References and next steps

- [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [Python: urllib.request](https://docs.python.org/3/library/urllib.request.html)

[← Lesson 8](../08_Day_Git_GitHub/) · [Lesson 10 →](../10_Day_Environments_Packages/)

<details>
<summary>Optional original workshop and alternative exercises</summary>

<!-- original-workshop:begin -->
**Concept:** The internet is **programs talking to programs**. HTTP is the language they speak. An API is a **contract**: "ask me this way, I'll answer that way." JSON is the **packaging** data travels in. Learn this once and every "integration" you'll ever do is the same shape.

**Time:** ~60–90 minutes. **Rule:** explain the concept in plain words, or the day doesn't count.

---

## 1. Learn — the concept

### The conversation

Every time software uses the internet, this happens:

```
Your program                          Their server
     |                                      |
     |---  REQUEST  ----------------------->|
     |     "GET /weather?city=Lahore"       |
     |     (plus headers: who I am)         |
     |                                      |
     |<--  RESPONSE  ------------------------|
     |     Status: 200 OK                   |
     |     Body: { "temp": 34, ... }         |
```

- **Request**: what you want, and any data the server needs.
- **Response**: a **status code** (did it work?) + a **body** (the data).
- Status codes: `200` = OK, `404` = not found, `500` = their server broke, `401` = who are you? (auth needed).

### JSON: the packaging

```json
{
  "city": "Lahore",
  "temperature_c": 34,
  "conditions": "sunny",
  "forecast": [
    {"day": "Tue", "temp_c": 35},
    {"day": "Wed", "temp_c": 33}
  ]
}
```

Look familiar? **It's a dict containing a list of dicts** — day 5's data modeling, traveling over the network. JSON is just text formatted so every language can read it. `requests.get(url).json()` turns that text back into Python dicts you already know.

### APIs: the contract

An API says: "call *this* URL with *these* parameters, you'll get *that* shape back." The docs are the contract. Your job: **read the contract, then write code that honors it** — exactly like honoring a function contract (day 4), but across the internet.

---

## 2. Specify — direct the AI

> "Build a weather CLI using the Open-Meteo API (no key needed — https://api.open-meteo.com/v1/forecast?latitude=31.57&longitude=74.36&current=temperature_2m). It should: 1) ask for a city name, 2) convert city → coordinates using their geocoding API (https://geocoding-api.open-meteo.com/v1/search?name=Lahore&count=1), 3) fetch and display current temperature + conditions, 4) handle: city not found (show 'City not found'), network failure (show 'Could not reach the weather service'), 5) print the raw JSON too, so I can see the packaging. Use the requests library."

Two APIs chained (geocode → forecast) — that's a real integration pattern.

## 3. Evaluate — be the senior

- **Draw the round trip** for one city lookup: how many HTTP requests happen? What does each request contain? What does each response contain? (Answer: 2 — geocode, then forecast.)
- Disconnect your internet (or turn on airplane mode) and run it. Which of your error handlers fires? Is the message human-friendly?
- Search for a nonsense city (`asdfgh`). Then a real one. Compare the two responses — status codes, bodies.
- Ask the AI: "Quiz me — what travels in the request vs the response? What's a status code *for*? Why is JSON text and not Python dicts?"

## 4. Business lens 💼

Almost every paid AI product is **"our system + someone else's API"** — weather data, payments (Stripe), maps, SMS, WhatsApp. Integration work is where enormous freelance money lives, because every business needs *their* systems connected and nobody else will do it. Today you learned the universal shape of all of it: **read the contract, honor the contract, handle the failures.**

---

## 💻 Exercises

### Level 1
Print the raw JSON of a weather response, formatted nicely (`json.dumps(data, indent=2)`). Point at each part and name it: "this is a dict, this is a list of dicts…"

### Level 2
Add a **5-day forecast** display. Spec first: which API parameter gives daily data? (Read the Open-Meteo docs — *you* find it, that's the skill.)

### Level 3
**Cache it:** if the user asks for the same city twice within 10 minutes, don't call the API again — serve the saved answer. Specify: where does the cached data live? How do you know it's stale? (This is day-6 persistence + a real production pattern. API calls cost money and time — caching is business.)

---

## ✅ Done when

- [ ] You can draw and narrate the full request/response round trip without notes
- [ ] You can explain what status codes are *for* and name the big four
- [ ] Your CLI handles: unknown city, no network, garbage input — all gracefully
- [ ] Committed to GitHub

## 📎 The one link

[MDN — HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — the clearest HTTP explainer anywhere.

---

[← Day 8](../08_Day_Git_GitHub/) · [Day 10 →](../10_Day_Environments_Packages/)
<!-- original-workshop:end -->

</details>
