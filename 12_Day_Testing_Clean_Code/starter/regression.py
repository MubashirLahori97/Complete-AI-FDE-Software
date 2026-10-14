def total_cents(price_cents, quantity):
    if price_cents < 0 or quantity < 0:
        raise ValueError("Negative input")
    return price_cents * quantity

assert total_cents(250, 3) == 750
assert total_cents(250, 0) == 0
try:
    total_cents(250, -1)
except ValueError:
    print("Invalid-input case passed")
else:
    raise AssertionError("Negative quantity should be rejected")
print("3 regression cases passed")
