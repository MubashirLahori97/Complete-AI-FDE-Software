import json

response = {
    "status": "answered",
    "mode": "extractive-fixture",
    "answer": "Standard shipping takes 3 to 5 business days.",
    "sources": [{"id": "FAQ-01", "passage": "Standard shipping takes 3 to 5 business days."}],
}
print("Status:", response["status"])
print("Mode:", response["mode"])
print("Sources:", len(response["sources"]))
assert json.loads(json.dumps(response)) == response
