def view_stock():
    print("Showing stock... (your Day 6 loader plugs in here)")

def add_item():
    print("Adding an item... (your code goes here)")

choices = ["1", "9", "3"]
for choice in choices:
    print(f"Choose: {choice}")
    if choice == "1":
        view_stock()
    elif choice == "2":
        add_item()
    elif choice == "3":
        print("Goodbye!")
        break
    else:
        print("Please choose 1, 2, or 3.")
