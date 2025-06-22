import requests
import random
import time
from datetime import datetime

API_URL = "http://127.0.0.1:5000/readings"


def generate_mock_data():
    return {
        "timestamp": datetime.now().isoformat(),
        "current":
        # random current between 0.5A and 5.0A
        round(random.uniform(0.5, 5.0), 2)
    }


def send_data():
    while True:
        data = generate_mock_data()
        try:
            response = requests.post(API_URL, json=data)
            print(f"sent: {data}|status:{response.status_code}")
        except Exception as e:
            print("Error sending data:", e)
        time.sleep(5)  # wait for 5 seconds before sending the next reading


if __name__ == "__main__":
    send_data()
