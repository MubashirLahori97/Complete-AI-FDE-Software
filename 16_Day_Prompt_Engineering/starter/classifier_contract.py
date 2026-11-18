import json

allowed_labels = {"billing", "technical", "general"}
prompt = "Classify the ticket. Return JSON with one label: billing, technical, or general."
response_fixture = '{"label": "billing"}'
parsed = json.loads(response_fixture)
if not isinstance(parsed, dict) or set(parsed) != {"label"}:
    raise ValueError("Invalid response shape")
if parsed["label"] not in allowed_labels:
    raise ValueError("Unsupported label")
print("Validated fixture label:", parsed["label"])
