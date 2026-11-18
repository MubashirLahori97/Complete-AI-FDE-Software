import json

payload = '{"city": "Lahore", "current": {"temperature_c": 28}}'
data = json.loads(payload)
temperature = data.get("current", {}).get("temperature_c")
if not isinstance(temperature, (int, float)):
    raise ValueError("Weather response is missing a numeric temperature")
result = {"city": data["city"], "temperature": temperature, "unit": "C"}
print(f"Fixture: {result['city']} {result['temperature']} {result['unit']}")
