def total_value(price, qty):
    return price * qty

def is_low_stock(stock):
    return stock < 50

rice_value = total_value(250, 40)
sugar_value = total_value(180, 90)

print(f"Rice stock value: Rs {rice_value}")
print(f"Sugar stock value: Rs {sugar_value}")
print(f"Rice low? {is_low_stock(40)}")
print(f"Sugar low? {is_low_stock(90)}")
