requests = 2000
input_tokens_per_request = 1000
output_tokens_per_request = 500
input_price_per_million = 1.0
output_price_per_million = 4.0
input_cost = requests * input_tokens_per_request / 1_000_000 * input_price_per_million
output_cost = requests * output_tokens_per_request / 1_000_000 * output_price_per_million
print(f"Fictional estimate: ${input_cost + output_cost:.2f}")
print("Includes text input/output only; verify provider usage and prices separately")
