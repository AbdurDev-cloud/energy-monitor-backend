from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from pymongo import MongoClient  # type: ignore
from bson import ObjectId  # type: ignore
import os

app = Flask(__name__)
CORS(app)

# MongoDB setup
# replace with actual MongoDB URI
client = MongoClient(
    "mongodb+srv://energy-database:Ab%40629662%402425@energy-cluster.xms2gg8.mongodb.net/?retryWrites=true&w=majority&appName=energy-cluster")
db = client["energy_database"]
collection = db["readings"]

# Health check


@app.route("/")
def index():
    return "Energy Monitor Backend is running!"

# POST route to receive readings


@app.route("/readings", methods=["POST"])
def add_reading():
    data = request.get_json()
    print("Received:", data)
    collection.insert_one(data)
    return jsonify({"status": "success"}), 201

# GET route to send readings


@app.route("/readings", methods=["GET"])
def get_readings():
    readings = list(collection.find({}, {"_id": 0}))
    return jsonify(readings[::-1])  # reverse to show latest first


if __name__ == "__main__":
    app.run(debug=True)
