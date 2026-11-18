import json

request_id = "REQ-001"
events = [
    {"request_id": request_id, "event": "retrieval_completed", "source_count": 2},
    {"request_id": request_id, "event": "response_completed", "status": "answered", "fixture_latency_ms": 120},
]
for event in events:
    print(json.dumps(event, sort_keys=True))
