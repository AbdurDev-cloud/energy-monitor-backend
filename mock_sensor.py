import requests
import random
import time
from datetime import datetime

url = 'http://127.0.0.1:5000/readings'

appliances = ['Fan', 'Light', 'AC', 'TV', 'Refrigerator']


def send_data():
    while True:
        data = {
            "appliance": random.choice(appliances),
            "timestamp": datetime.now().isoformat(),
            "watts": round(random.uniform(50, 500), 2)  # Simulating power
        }
        try:
            response = requests.post(url, json=data)
            print("Sent:", data, "Status:", response.status_code)
        except Exception as e:
            print("Error sending data:", e)
        time.sleep(5)


send_data()
