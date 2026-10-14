def line_total_cents(price_cents, quantity):
    if price_cents < 0 or quantity < 0:
        raise ValueError("Price and quantity must be non-negative")
    return price_cents * quantity

subtotal = line_total_cents(250, 3)
assert subtotal == 750
print(f"Subtotal: {subtotal} cents")
