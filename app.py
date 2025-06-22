from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
app = Flask(__name__)
CORS(app)

# Health check route


@app.route("/")
def index():
    return "Energy Monitor Backend is running!"
# POST route to receive readings


@app.route("/readings", methods=["POST"])
def add_readings():
    data = request.get_json()
    print("Received readings:", data)
    return jsonify({"status": "successs"}), 201


if __name__ == "__main__":
    app.run(debug=True)
