import json
import os

FILENAME = "dukaan_stock.json"

stock = [
    {"name": "Rice", "price": 250, "qty": 40},
    {"name": "Sugar", "price": 180, "qty": 90},
]

with open(FILENAME, "w") as f:
    json.dump(stock, f)
print("Saved the stock book.")

try:
    with open(FILENAME) as f:
        loaded = json.load(f)
    print(f"Loaded {len(loaded)} items: {loaded[0]['name']} and {loaded[1]['name']}")
except FileNotFoundError:
    print("No saved file yet - starting fresh.")
    loaded = []

typed = "three"
try:
    qty = int(typed)
except ValueError:
    print(f"'{typed}' is not a number - using 0.")
    qty = 0
print(f"Quantity accepted: {qty}")

os.remove(FILENAME)
print("Demo file cleaned up.")
