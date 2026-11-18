expenses = [
    {"id": "E1", "label": "Lunch", "amount_cents": 500},
    {"id": "E2", "label": "Bus", "amount_cents": 200},
]
total_cents = sum(expense["amount_cents"] for expense in expenses)
for expense in expenses:
    print(expense["id"], expense["label"], expense["amount_cents"])
print(f"Total: {total_cents} cents")
