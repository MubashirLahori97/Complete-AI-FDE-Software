contacts = {
    "C001": {"name": "Ali", "city": "Lahore"},
    "C002": {"name": "Ali", "city": "Karachi"},
}
for contact_id, contact in contacts.items():
    print(contact_id, contact["name"], contact["city"])

match = contacts.get("C003")
print("Found" if match is not None else "Contact not found")
