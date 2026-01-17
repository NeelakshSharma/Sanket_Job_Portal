# Sanket Job Portal

A lightweight Job Portal application built with **Node.js/Express** and **Preact/Vite**, fully dockerized for easy deployment.

## 🚀 Getting Started

This project is designed to run entirely within Docker containers. You do **not** need Node.js installed locally.

### Prerequisites
- Docker
- Docker Compose

### 🛠️ Start the Application
To build and start the application:

```bash
docker compose up --build -d
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 🛑 Stop the Application
To stop the running containers:

```bash
docker compose down
```

To stop and **remove volumes** (resets the database):
```bash
docker compose down -v
```

## 📂 Project Structure

```
Sanket_Job_Portal/
├── backend/                # Express.js Backend
│   ├── routes/             # API Routes (auth, jobs, applications)
│   ├── server.js           # Entry point
│   ├── init_db.js          # SQLite setup
│   └── database.sqlite     # Persisted DB file (gitignored)
├── frontend/               # Preact + Vite Frontend
│   ├── src/
│   │   ├── pages/          # Route components (Home, Jobs, Applications)
│   │   └── app.jsx         # Main Layout & Auth State
│   └── vite.config.js      # Proxy configuration
├── docker-compose.yml      # Orchestration
└── README.md               # Documentation
```

## ✨ Features
- **Authentication**: User registration and login (Seeker vs Poster roles).
- **Job Posting**: Employers can post new job openings.
- **Job Search**: Seekers can browse available jobs.
- **Applications**: Seekers can apply to jobs; Employers can view applicants.
- **Responsive UI**: Built with pure CSS and Preact.

## 🔧 Technical Details
- **Backend**: Node.js (Alpine), SQLite, Express.
- **Frontend**: Vite, Preact, Preact Router.
- **Infrastructure**: Docker Compose with Bind Mounts for hot-reloading.
- **Persistence**: SQLite database is persisted via Docker volumes/bind mounts.

## 🧪 Verification
Run the verification script to test the full flow automatedly:

```bash
chmod +x verify_setup.sh
./verify_setup.sh
```
