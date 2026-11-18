tickets = [
    {"id": "T1", "severity": "critical", "age_hours": 2},
    {"id": "T2", "severity": "normal", "age_hours": 24},
    {"id": "T3", "severity": "normal", "age_hours": 3},
]
for ticket in tickets:
    if ticket["severity"] == "critical":
        priority = "urgent"
    elif ticket["age_hours"] >= 24:
        priority = "review"
    else:
        priority = "standard"
    print(ticket["id"], priority)
