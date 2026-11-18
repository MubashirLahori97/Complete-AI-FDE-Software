import json

contacts = {"C001": {"name": "Ali", "city": "Lahore"}}
saved_text = json.dumps(contacts)
loaded = json.loads(saved_text)
if not isinstance(loaded, dict):
    raise ValueError("Expected a contact directory")
assert loaded == contacts
print("Round trip preserved 1 contact")

try:
    json.loads("not valid JSON")
except json.JSONDecodeError:
    print("Stored data is not valid JSON; keep the original for investigation")
