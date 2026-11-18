actions = ["search policy", "read evidence", "search again", "search again"]
max_steps = 3
completed = False
for step, action in enumerate(actions, start=1):
    if step > max_steps:
        print("Stopped: step budget exhausted")
        break
    print(f"Step {step}: {action}")
    if action == "finish":
        completed = True
        break
print("Completed:", completed)
