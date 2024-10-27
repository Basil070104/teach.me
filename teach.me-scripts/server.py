from flask import Flask, request, jsonify
from flask_cors import CORS
from deck import Deck
from gem import Gem
import threading
import sys
import time
import itertools


global_id_value = None

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "Hello, This Is The Root Directory!"


@app.route("/hello")
def hello():
    name = request.args.get(
        "name", "World"
    )  # Get 'name' from query string, default to 'World'
    return f"Hello, {name}!"


@app.route("/get_transcript", methods=["POST"])
def get_transcript():
    MODEL_NAME = "claude-3-opus-20240229"
    data = request.get_json()
    # print(data["url"])
    path = data["url"]
    # id_value = data.get("id")  
    obj = Deck(model=MODEL_NAME, pdf_path=path, id_value=global_id_value)
    

    print("\n=== Started An Event ===")
    event = threading.Event()
    stop_animation = threading.Event()  # New event to control animation thread

    def transcription_fetch():
        try:
            obj.store_id()
            success, audio = obj.run()
            # print("Here\n")
            # pass
        finally:
            event.set()
            stop_animation.set()  # Signal animation to stop

    def loading_animation():
        animation = itertools.cycle(["|", "/", "-", "\\"])
        while not stop_animation.is_set():  # Check if we should stop
            sys.stdout.write(f"\rLoading... {next(animation)}")
            sys.stdout.flush()
            time.sleep(0.1)
        # Clear the loading animation line
        sys.stdout.write("\r" + " " * 20 + "\r")
        sys.stdout.flush()

    t1 = threading.Thread(target=transcription_fetch)
    t2 = threading.Thread(target=loading_animation)

    t1.start()
    t2.start()

    # Wait for transcription to complete
    t1.join()

    # Make sure animation thread is stopped
    stop_animation.set()
    t2.join()

    # Only read the file after both threads are complete
    with open("transcripts/lecture_test.txt", "r") as f:
        text = f.read()

    data = {"message": text, "file_name": path, "status": True}
    return jsonify(data)


@app.route("/store_id", methods=["POST"])
def store_id():
    global global_id_value
    data = request.get_json()
    id_value = data.get("id")
    
    if id_value:
        # Here, you can implement the logic to store the id (e.g., save it to a database)
        global_id_value = id_value
        print(f"Received ID: {id_value}")  # For demonstration purposes
        return jsonify({"status": True, "message": "ID stored successfully!"}), 200
    else:
        return jsonify({"status": False, "message": "No ID provided!"}), 400


if __name__ == "__main__":
    app.run(debug=True)
