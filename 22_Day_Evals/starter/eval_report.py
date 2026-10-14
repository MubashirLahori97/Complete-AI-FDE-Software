cases = [
    {"id": "Q1", "category": "supported", "passed": True},
    {"id": "Q2", "category": "supported", "passed": True},
    {"id": "Q3", "category": "abstention", "passed": False},
]
for category in sorted({case["category"] for case in cases}):
    group = [case for case in cases if case["category"] == category]
    passed = sum(case["passed"] for case in group)
    print(f"{category}: {passed}/{len(group)}")
print("Failed IDs:", ', '.join(case["id"] for case in cases if not case["passed"]))
