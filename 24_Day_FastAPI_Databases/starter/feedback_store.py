import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE feedback (id INTEGER PRIMARY KEY, note TEXT NOT NULL)")
note = "The source passage helped me check the answer."
with connection:
    connection.execute("INSERT INTO feedback (note) VALUES (?)", (note,))
row = connection.execute("SELECT id, note FROM feedback WHERE id = ?", (1,)).fetchone()
print("Stored feedback:", row[0])
print(row[1])
connection.close()
