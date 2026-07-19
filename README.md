# AttendEye – Real-Time Student Attentiveness Monitoring System

AttendEye is a real-time student attentiveness monitoring system that uses Computer Vision and Deep Learning to monitor student engagement during online classes. The system detects behaviors such as blinking, yawning, head direction, mobile phone usage, and face presence to calculate an overall attentiveness score. It provides a live dashboard with statistics and stores session information for future analysis.

---

## 🚀 Features

- 🔐 Secure User Authentication (Signup/Login)
- 🎥 Live Webcam Monitoring
- 👤 Face Detection
- 😊 Face Mesh Tracking
- 👁️ Blink Detection
- 🥱 Yawn Detection
- 📱 Mobile Phone Detection using YOLOv8
- 🧭 Head Direction Detection
- 🚫 No Face / Absence Detection
- 📊 Real-Time Attentiveness Percentage
- 📈 Live Attention Graph
- 📷 Automatic Screenshot Capture on Mobile Detection
- 💾 Session Data Storage in MongoDB
- 🚪 Secure Logout

---

# 📷 System Workflow

```
                 User
                   │
                   ▼
        ┌─────────────────────┐
        │   Landing Page      │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Login / Signup      │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Workspace Dashboard │
        └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Start Camera        │
        └─────────────────────┘
                   │
                   ▼
      ┌────────────────────────────┐
      │ Python Flask AI Backend    │
      └────────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
 Face Detection  Face Mesh    YOLOv8 Detection
     │             │             │
     ▼             ▼             ▼
 Blink      Yawn Detection   Mobile Detection
 Detection
     │
     ▼
 Head Direction
 Detection
     │
     ▼
 Attentiveness Calculation
     │
     ▼
 Live Dashboard
     │
     ▼
 MongoDB Storage
```

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
- Fetch API

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- CORS

---

## AI Backend

- Python
- Flask
- Flask-CORS
- OpenCV
- MediaPipe Face Detection
- MediaPipe Face Mesh
- YOLOv8
- NumPy

---

## Database

- MongoDB
- Mongoose

---

# 🧠 AI Modules

### 👤 Face Detection
Detects whether the student is present in front of the camera.

---

### 👁️ Blink Detection
Uses MediaPipe Face Mesh eye landmarks to detect eye closure and estimate attentiveness.

---

### 🥱 Yawn Detection
Detects mouth opening using facial landmarks to identify drowsiness.

---

### 📱 Mobile Phone Detection
Uses YOLOv8 object detection model to detect mobile phone usage during class.

---

### 🧭 Head Direction Detection
Determines whether the student is looking forward, left, right, up, or down.

---

### 📊 Attentiveness Calculation

The attentiveness score is dynamically calculated using detected behaviors including:

- Face Presence
- Eye State
- Yawning
- Head Position
- Mobile Usage

The score is continuously updated and displayed on the dashboard.

---

# 📊 Dashboard

The dashboard provides:

- Live Camera Feed
- Current Attentiveness Percentage
- Number of Students
- Live Attention Graph
- Student Behaviour Statistics
- Session Summary

---

# 💾 Database

MongoDB stores:

- User Information
- Login Credentials
- Session Details
- Average Attentiveness
- Last Session Attentiveness
- Class History

Screenshots are stored locally inside the project directory.

---

# 📂 Project Structure

```
AttendEye
│
├── Backend
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── Frontend
│   ├── src
│   ├── components
│   ├── hooks
│   ├── api
│   └── package.json
│
├── app.py
├── database.py
├── yolov8n.pt
├── screenshots
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/srujana59/AttendEye.git
```

---

## Backend

```bash
cd Backend
npm install
npm start
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## AI Backend

```bash
pip install -r requirements.txt
python app.py
```

---

# 📸 Screenshots

> Add your screenshots here.

Example:

```
Landing Page

Login Page

Live Dashboard

Behaviour Analysis

Attention Graph
```

---

# 🔮 Future Enhancements

- Multi-student classroom monitoring
- Emotion Recognition
- Attendance Generation
- Teacher Analytics Dashboard
- Email Notifications
- Performance Reports
- Cloud Deployment
- Mobile Application

---

# 👨‍💻 Author

**Vadapalli Vikhani Sai Srujana**

B.Tech Computer Science and Engineering

Shri Vishnu Engineering College for Women

