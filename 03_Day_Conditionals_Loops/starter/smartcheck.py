names = ["Rice", "Sugar", "Tea"]
prices = [250, 180, 950]
stocks = [40, 90, 25]

print("Morning stock check:")
for i in range(3):
    if stocks[i] < 50:
        print(f"{names[i]}: Rs {prices[i]} - LOW STOCK, order more!")
    else:
        print(f"{names[i]}: Rs {prices[i]} - OK")

total = 1200
if total > 1000:
    discount = total / 10
else:
    discount = 0
print(f"Bill: Rs {total}, discount: Rs {discount}, to pay: Rs {total - discount}")
