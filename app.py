import os
import sqlite3
import threading
import time
from datetime import datetime

import cv2
import mediapipe as mp
from flask import Flask, Response, jsonify
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

os.makedirs("screenshots", exist_ok=True)
os.makedirs("database", exist_ok=True)

conn = sqlite3.connect("database/attention.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS attention(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        score INTEGER,
        status TEXT
    )
    """
)
conn.commit()

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

face_detector = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6,
)

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6,
)

model = YOLO("yolov8n.pt")

camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
camera.set(cv2.CAP_PROP_FPS, 30)
time.sleep(2)

if not camera.isOpened():
    raise RuntimeError("Unable to open webcam")

latest_frame = None
live_data = {
    "attentive_percentage": 0,
    "attentive_count": 0,
    "total_students": 0,
    "status": "No Face",
    "blink_count": 0,
    "yawn_count": 0,
    "head_direction": "Forward",
    "mobile_detected": False,
    "no_movement_frames": 0,
    "camera_status": "Offline",
    "liveness_status": "Unknown",
}

frame_lock = threading.Lock()
data_lock = threading.Lock()

EYE_THRESHOLD = 0.015
MOUTH_THRESHOLD = 0.025

blink_count = 0
yawn_count = 0
eye_was_closed = False
mouth_was_open = False
closed_start = None
previous_gray = None
no_movement_frames = 0
last_database_save = time.time()

# Screenshot settings: one image per event every 5 seconds
SCREENSHOT_COOLDOWN = 30
last_screenshot_times = {
    "phone": 0.0,
    "yawn": 0.0,
    "drowsy": 0.0,
    "looking_down": 0.0,
    "fake_face": 0.0,
}


def save_event_screenshot(frame, event_name):
    """Save one screenshot for an event, respecting a per-event cooldown."""
    current_time = time.time()
    previous_time = last_screenshot_times.get(event_name, 0.0)

    if current_time - previous_time < SCREENSHOT_COOLDOWN:
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = os.path.join(
        "screenshots",
        f"{event_name}_{timestamp}.jpg",
    )

    if cv2.imwrite(filename, frame):
        last_screenshot_times[event_name] = current_time
        print(f"Screenshot saved: {filename}")
    else:
        print(f"Unable to save screenshot: {filename}")


def process_frame(frame):
    global blink_count, yawn_count
    global eye_was_closed, mouth_was_open
    global closed_start, previous_gray
    global no_movement_frames, last_database_save

    frame = cv2.flip(frame, 1)
    frame = cv2.resize(frame, (900, 650))

    height, width = frame.shape[:2]
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    current_score = 100
    current_status = "Attentive"
    current_phone_detected = False
    current_head_direction = "Forward"

    if previous_gray is not None:
        difference = cv2.absdiff(previous_gray, gray_frame)
        movement_score = float(difference.mean())
        if movement_score < 1.2:
            no_movement_frames += 1
        else:
            no_movement_frames = 0

    previous_gray = gray_frame.copy()
    possible_fake_face = no_movement_frames > 150
    liveness_status = "Failed" if possible_fake_face else "Passed"

    yolo_results = model(
        frame,
        verbose=False,
        conf=0.15,
        imgsz=640,
    )

    for result in yolo_results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = str(model.names[class_id])
            confidence = float(box.conf[0])

            if class_name.lower() == "cell phone" and confidence >= 0.15:
                current_phone_detected = True

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 0, 255),
                    3,
                )

                cv2.putText(
                    frame,
                    f"Mobile Phone {confidence:.2f}",
                    (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 0, 255),
                    2,
                )

    face_results = face_detector.process(rgb_frame)
    detected_faces = len(face_results.detections) if face_results.detections else 0

    if face_results.detections:
        for detection in face_results.detections:
            mp_drawing.draw_detection(frame, detection)
    else:
        current_score = 0
        current_status = "No Face"
        eye_was_closed = False
        mouth_was_open = False
        closed_start = None

    mesh_results = face_mesh.process(rgb_frame)
    if mesh_results.multi_face_landmarks:
        face = mesh_results.multi_face_landmarks[0]

        eye_distance = abs(face.landmark[159].y - face.landmark[145].y)
        mouth_distance = abs(face.landmark[13].y - face.landmark[14].y)

        nose = face.landmark[1]
        nose_x = int(nose.x * width)
        nose_y = int(nose.y * height)

        for landmark in face.landmark:
            x = int(landmark.x * width)
            y = int(landmark.y * height)
            cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)

        if eye_distance < EYE_THRESHOLD:
            if not eye_was_closed:
                blink_count += 1
                eye_was_closed = True
            if closed_start is None:
                closed_start = time.time()
            if time.time() - closed_start > 2:
                current_score -= 35
                current_status = "Drowsy"
                save_event_screenshot(frame, "drowsy")
        else:
            eye_was_closed = False
            closed_start = None

        # Yawn detection
        if mouth_distance > MOUTH_THRESHOLD:
            if not mouth_was_open:
                yawn_count += 1
                mouth_was_open = True

            current_score -= 20
            current_status = "Yawning"
            save_event_screenshot(frame, "yawn")
        else:
            mouth_was_open = False

        center_x = width // 2
        center_y = height // 2

        if nose_x < center_x - 70:
            current_score -= 20
            current_status = "Looking Left"
            current_head_direction = "Left"
            save_event_screenshot(frame, "looking_left")
        elif nose_x > center_x + 70:
            current_score -= 20
            current_status = "Looking Right"
            current_head_direction = "Right"
            save_event_screenshot(frame, "looking_right")

        if nose_y < center_y - 80:
            current_score -= 15
            current_status = "Looking Up"
            current_head_direction = "Up"
            save_event_screenshot(frame, "looking_up")
        elif nose_y > center_y + 90:
            current_score -= 15
            current_status = "Looking Down"
            current_head_direction = "Down"
            save_event_screenshot(frame, "looking_down")

    if current_phone_detected:
        current_score -= 50
        current_status = "Using Phone"
        save_event_screenshot(frame, "phone")

    if possible_fake_face and detected_faces > 0:
        current_score = min(current_score, 20)
        current_status = "Possible Fake Face"
        save_event_screenshot(frame, "fake_face")

    current_score = max(0, min(100, int(current_score)))
    attentive_count = detected_faces if current_score >= 60 else 0

    cv2.rectangle(frame, (0, 0), (900, 100), (20, 20, 20), -1)
    cv2.putText(
        frame,
        f"Attention: {current_score}%",
        (20, 35),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 0) if current_score >= 60 else (0, 0, 255),
        2,
    )
    cv2.putText(
        frame,
        f"Status: {current_status}",
        (20, 72),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2,
    )
    cv2.putText(
        frame,
        f"Students: {detected_faces}",
        (650, 35),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2,
    )
    cv2.putText(
        frame,
        f"Head: {current_head_direction}",
        (650, 72),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 255, 255),
        2,
    )

    with data_lock:
        live_data["attentive_percentage"] = current_score
        live_data["attentive_count"] = int(attentive_count)
        live_data["total_students"] = int(detected_faces)
        live_data["status"] = current_status
        live_data["blink_count"] = int(blink_count)
        live_data["yawn_count"] = int(yawn_count)
        live_data["head_direction"] = current_head_direction
        live_data["mobile_detected"] = bool(current_phone_detected)
        live_data["no_movement_frames"] = int(no_movement_frames)
        live_data["camera_status"] = "Online"
        live_data["liveness_status"] = liveness_status

    if time.time() - last_database_save >= 10:
        now = datetime.now()
        cursor.execute(
            """
            INSERT INTO attention (date, time, score, status)
            VALUES (?, ?, ?, ?)
            """,
            (
                now.strftime("%Y-%m-%d"),
                now.strftime("%H:%M:%S"),
                current_score,
                current_status,
            ),
        )
        conn.commit()
        last_database_save = time.time()

    return frame


def camera_loop():
    global latest_frame

    while True:
        try:
            success, frame = camera.read()
            if not success:
                with data_lock:
                    live_data["camera_status"] = "Offline"
                print("Camera opened, but frame could not be read")
                time.sleep(0.1)
                continue

            processed_frame = process_frame(frame)
            encoded, buffer = cv2.imencode(".jpg", processed_frame)
            if not encoded:
                print("Could not encode camera frame")
                continue

            with frame_lock:
                latest_frame = buffer.tobytes()

        except Exception as error:
            print("CAMERA LOOP ERROR:", repr(error))
            with data_lock:
                live_data["camera_status"] = "Offline"
            time.sleep(0.2)


threading.Thread(target=camera_loop, daemon=True).start()


def generate_frames():
    while True:
        with frame_lock:
            frame = latest_frame

        if frame is None:
            time.sleep(0.05)
            continue

        try:
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + frame
                + b"\r\n"
            )
        except GeneratorExit:
            break
        except Exception as error:
            print("FRAME STREAM ERROR:", repr(error))
            break


@app.route("/video_feed")
def video_feed():
    return Response(
        generate_frames(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )


@app.route("/attentiveness")
def attentiveness():
    with data_lock:
        response_data = dict(live_data)

    response = jsonify(response_data)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route("/")
def home():
    return jsonify(
        {
            "message": "AttendEye ML server is running",
            "video_feed": "/video_feed",
            "attentiveness": "/attentiveness",
        }
    )


if __name__ == "__main__":
    print("=" * 45)
    print("AttendEye Flask Server Started")
    print("=" * 45)
    print("ML API: http://127.0.0.1:5000")
    print("Frontend video: /video_feed")
    print("Frontend data: /attentiveness")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        threaded=True,
        use_reloader=False,
    )