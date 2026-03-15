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

## Step-by-Step Setup Instructions

### 1. Database Setup
1. Ensure your MySQL server is running.
2. The backend will automatically create the `lms_db` and tables when it starts. Alternatively, you can run the `backend/schema.sql` file manually.
3. To seed initial data (Admin user, Student user, and demo subjects), import `backend/seed.sql` into your database.
   - Run: `mysql -u root -p lms_db < seed.sql`
   - *Demo Admin Login:* `admin@lms.com` / `password`
   - *Demo Student Login:* `student@lms.com` / `password`

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the example environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` if your MySQL password is not empty.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Make sure dependencies are installed (they should already be there if you ran `npm install` initially).
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The app runs on http://localhost:3000*

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
