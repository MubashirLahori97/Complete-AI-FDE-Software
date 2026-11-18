price_rice = 250
price_sugar = 180

typed_rice_qty = "3"
typed_sugar_qty = "2"

qty_rice = int(typed_rice_qty)
qty_sugar = int(typed_sugar_qty)

rice_total = price_rice * qty_rice
sugar_total = price_sugar * qty_sugar
total = rice_total + sugar_total

paid = 2000
change = paid - total

print(f"Rice: {qty_rice} x Rs {price_rice} = Rs {rice_total}")
print(f"Sugar: {qty_sugar} x Rs {price_sugar} = Rs {sugar_total}")
print(f"Total: Rs {total}")
print(f"Paid Rs {paid}, change Rs {change}")
