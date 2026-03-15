# LearnStack - Professional Full-Stack LMS

LearnStack is a high-performance, full-stack Learning Management System (LMS) designed for a premium learning experience. Built with Next.js 14, Node.js, and MySQL.

## 🚀 Key Features
- **StackAI Assistant**: Global AI tutor powered by LearnStack-Engine for instant course guidance.
- **Secured Enrollment**: Integrated payment flow supporting Google Pay and PhonePe.
- **Professional Rebranding**: Modern dark-themed glassmorphism UI.
- **Java Full Stack**: Comprehensive new course track for enterprise development.
- **Progress Tracking**: Real-time video progress saving with sequential lesson unlocking.
- **Admin Suite**: Complete backend management for courses, videos, and analytics.

---

## Prerequisites
- Node.js (v18+)
- MySQL Server

## 🛠️ Quick Start (Monorepo)

1. **Install all dependencies** (from the root):
   ```bash
   npm run install-all
   ```

2. **Start both Frontend & Backend**:
   ```bash
   npm run dev
   ```
   *Frontend: http://localhost:3000 | Backend: http://localhost:5000*

---

## Step-by-Step Setup Instructions

### 1. Database Setup
1. Ensure your MySQL server (or SQLite for development) is running.
2. The backend will automatically create the tables when it starts.
3. Import initial demo data if needed using `backend/seed.sql`.

### 2. Manual Setup (Alternative)
If you prefer running them separately:
- **Backend**: `npm run backend`
- **Frontend**: `npm run frontend`

---
---

## Directory Structure
- `/backend`: Node.js + Express API server with TS.
  - `/src/controllers`: Request handlers for Auth, Course, Progress, Admin.
  - `/src/models`: DB Queries and schema structures.
  - `/src/routes`: API endpoints.
  - `/schema.sql`: Database schema definition.
  - `/seed.sql`: Initial seed data.
- `/frontend`: Next.js 14 App Router application.
  - `/src/app`: Pages (Login, Dashboard, Admin, Subjects).
  - `/src/store`: Zustand state management for Auth.
  - `/src/lib`: Utilities (Axios configure, Time format, YT extractor).

Enjoy your professional LMS!
