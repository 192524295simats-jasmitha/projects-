from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Create database
def init_db():

    conn = sqlite3.connect("bank.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        amount INTEGER
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------------- LOGIN PAGE ----------------

@app.route("/login", methods=["GET", "POST"])
def login():

    error = ""

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        # Simple Login
        if username == "admin" and password == "1234":

            return redirect(url_for("index"))

        else:
            error = "Invalid Username or Password"

    return render_template("login.html", error=error)

# ---------------- HOME PAGE ----------------

@app.route("/", methods=["GET", "POST"])
def index():

    message = ""

    if request.method == "POST":

        username = request.form["username"]
        amount = request.form["amount"]

        conn = sqlite3.connect("bank.db")
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO transactions (username, amount) VALUES (?, ?)",
            (username, amount)
        )

        conn.commit()
        conn.close()

        message = "Transaction Stored Successfully"

    return render_template("index.html", message=message)

# ---------------- TRANSACTION HISTORY ----------------

@app.route("/transactions")
def transactions():

    conn = sqlite3.connect("bank.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM transactions")

    data = cursor.fetchall()

    conn.close()

    return render_template("transactions.html", data=data)

# ---------------- RUN APP ----------------

if __name__ == "__main__":
    app.run(debug=True)