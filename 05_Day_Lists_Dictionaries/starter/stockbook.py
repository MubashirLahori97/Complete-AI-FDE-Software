stock = [
    {"name": "Rice", "price": 250, "qty": 40},
    {"name": "Sugar", "price": 180, "qty": 90},
    {"name": "Tea", "price": 950, "qty": 25},
]

stock.append({"name": "Flour", "price": 120, "qty": 60})

for item in stock:
    if item["name"] == "Tea":
        print(f"Found Tea: Rs {item['price']}, qty {item['qty']}")

print(f"Items in the stock book: {len(stock)}")
