acceptance_plan = [
    {"id": "A1", "behavior": "Permitted policy answer has a supporting passage", "verified": False},
    {"id": "A2", "behavior": "Missing evidence produces abstention", "verified": False},
    {"id": "A3", "behavior": "Forbidden source never enters context", "verified": False},
]
for item in acceptance_plan:
    print(item["id"], "pending" if not item["verified"] else "verified")
print("Mark results only after executing the corresponding checks")
