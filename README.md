# EduPulse — Enterprise-Grade Learning Management System (LMS)

EduPulse is a complete, professional, production-ready Learning Management System architected with a high-performance **Python FastAPI** backend and a modern **React + TypeScript + Vite** frontend.

---

## 🏛️ System Architecture

```
LMS/
├── backend/                  # Python FastAPI RESTful Service
│   ├── app/
│   │   ├── core/             # Configuration, Database Engine, Security (Bcrypt/JWT), RBAC Guards
│   │   ├── models/           # Relational SQLAlchemy Models (Users, Courses, Curriculum, Quizzes, Assignments, Certificates, Audit)
│   │   ├── schemas/          # Pydantic v2 Request & Response Schemas
│   │   ├── services/         # Business Logic (Progress Tracking, Instant Quiz Scoring, Grading, Storage, Certificates)
│   │   ├── api/v1/           # Modular REST API Routers
│   │   ├── seed.py           # Rich demo dataset generator (Admin, Instructors, Students, Courses, Quizzes, Progress)
│   │   └── main.py           # FastAPI ASGI entrypoint & CORS middleware
│   ├── tests/                # Pytest unit & integration test suite (Auth, RBAC, Courses, Quizzes, Certificates)
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                 # React 18 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── api/              # Axios API layer with JWT interceptor & auto error handling
│   │   ├── context/          # AuthContext, ThemeContext (Dark/Light), NotificationContext (Toasts)
│   │   ├── components/       # Reusable Design System (Navbar, Sidebar, Modals, VideoPlayer, QuizTaker, CertificateCard, StatCard)
│   │   ├── pages/
│   │   │   ├── public/       # Home, Course Catalog, Course Detail, Verify Certificate, Login, Register
│   │   │   ├── student/      # Student Dashboard, My Courses, Classroom Learn Room (Split Player), My Certificates, Profile
│   │   │   ├── instructor/   # Instructor Dashboard, Course Management, Curriculum Editor, Grade Submissions, Analytics
│   │   │   └── admin/        # Admin Dashboard, User Management, Course Moderation, Categories, Audit Trail
│   │   ├── routes/           # Role-based Route Protection & Layout routing
│   │   ├── styles/           # Custom CSS Design System, tokens, glassmorphism, responsive grid
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml        # Multi-container orchestration
└── README.md
```

---

## 🔑 Pre-Seeded Demo Accounts

The system comes pre-populated with realistic courses, curriculum, quizzes, assignments, and certificates. You can test all roles immediately:

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@lms.com` | `Admin@123456` | `/admin` (Full system moderation, users, categories, audit logs) |
| **Instructor** | `sarah.instructor@lms.com` | `Instructor@123` | `/instructor` (Course creation, curriculum builder, assignment grading) |
| **Instructor** | `alex.dev@lms.com` | `Instructor@123` | `/instructor` (AI & Data Science courses) |
| **Student** | `emma.student@lms.com` | `Student@123` | `/dashboard` (Active courses, classroom player, quiz taker, earned certificates) |
| **Student** | `michael.student@lms.com` | `Student@123` | `/dashboard` (Enrolled student) |

> **Sample Verification Code:** `CERT-8F3A-92D1` (Try verifying this code on `/verify-certificate`)

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Populate database with demo dataset
PYTHONPATH=. python app/seed.py

# Run FastAPI development server
PYTHONPATH=. uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Backend API: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/api/v1/docs`

### 2. Run Backend Tests

```bash
cd backend
PYTHONPATH=. pytest tests/ -v
```

### 3. Frontend Setup & Run

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

- Frontend Application: `http://localhost:5173`

---

## 📦 Production Build

```bash
# Build frontend production bundle
cd frontend
npm run build
```

---

## 🐳 Docker Deployment

To launch the full stack with Docker Compose:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
