inventory = {"P001": {"name": "Notebook", "stock": 12}}

def dispatch(call):
    if call.get("name") != "get_stock":
        raise ValueError("Unsupported tool")
    arguments = call.get("arguments")
    if not isinstance(arguments, dict) or set(arguments) != {"product_id"}:
        raise ValueError("Invalid arguments")
    product_id = arguments["product_id"]
    if not isinstance(product_id, str) or not product_id.strip():
        raise ValueError("A product ID is required")
    return inventory.get(product_id, {"error": "Product not found"})

proposal = {"name": "get_stock", "arguments": {"product_id": "P001"}}
print(dispatch(proposal))
