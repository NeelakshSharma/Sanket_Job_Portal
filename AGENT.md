# Project Overview

A lightweight Job Portal built with a focus on performance and minimal dependencies.

Frontend: Preact + Vite (JavaScript)
Backend: Node.js + Express
Database: SQLite (Stored as a local file)
Infrastructure: Docker Compose

## Core Constraints (Strict):
No Heavy Libraries: * Use native Fetch API instead of Axios.
Use Vanilla CSS or CSS Modules instead of Tailwind/Bootstrap.
Avoid large state management libraries; use Preact hooks.
Docker-First: All commands must be compatible with the Dockerized environment. Database persistence must use volumes.
Language: Write all backend and frontend code in JavaScript (ES Modules).

## Technical Specifications
Backend Port: 5000
Frontend Port: 5173
Database File: backend/database.sqlite
API Pattern: RESTful (JSON)

## Common Commands
Start Project: docker-compose up --build
Stop Project: docker-compose down
Backend Logs: docker logs -f job-portal-backend-1
Database Reset: rm backend/database.sqlite && touch backend/database.sqlite

## Suggested Step-by-Step Workflow for your AI Session
The Schema:


-- Enable Foreign Key support in SQLite
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('SEEKER', 'POSTER')) NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poster_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    salary TEXT,
    FOREIGN KEY (poster_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    seeker_id INTEGER NOT NULL,
    status TEXT DEFAULT 'PENDING',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE
);

The API:

1. POST /api/register : Create a new account
2. POST	/api/login : Log in to existing account
3. GET	/api/jobs : View all available jobs
4. GET /api/jobs/my-posts : View jobs posted by user
5. POST	/api/jobs : Create a new job listing
6. DELETE /api/jobs/:id : Remove a job listing
7. POST /api/apply : Apply to a job listing
8. GET	/api/my-applications : View applications made by user
9. GET	/api/jobs/:id/applicants : View applicants for a job listing

## Notes:
Request Identification: For simplicity, the frontend will send userId in the body of POST requests or as a query parameter in GET requests (e.g., /api/jobs/my-posts?posterId=1).

Logic Checks: * Before POST /api/apply, the backend should check if a record already exists in the applications table for that jobId and seekerId to prevent duplicate applications.

Before POST /api/jobs, the backend should verify that the posterId provided belongs to a user with the role: 'POSTER'.