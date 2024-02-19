#
from flask import Flask


# Create app instance
app = Flask(__name__)


# Members API Route
@app.route("/members")
def tasks():
    return {"tasks": ["task1", "task2", "task3"]}


if __name__ == "__main__":
    app.run(debug=True)
