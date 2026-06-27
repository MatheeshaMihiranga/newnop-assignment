# ⚡ TaskFlow — Team Task Management System

> A full-stack task management application with role-based access control, built for teams to create, assign, track, and manage tasks efficiently.

![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![React](https://img.shields.io/badge/react-18-61DAFB)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![Tailwind](https://img.shields.io/badge/tailwindcss-v3-38BDF8)
![Redux](https://img.shields.io/badge/redux--toolkit-latest-764ABC)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **🖥️ Frontend (Vercel)** | [https://newnop-assignment-lemon.vercel.app](https://newnop-assignment-lemon.vercel.app) |
| **⚙️ Backend API (Railway)** | [https://newnop-assignment-production.up.railway.app/api/health](https://newnop-assignment-production.up.railway.app/api/health) |

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| **Admin** | admin@company.com | admin123 |
| **Employee** | john@company.com | password123 |

---

## 📸 Preview

| Login Page | Admin Dashboard | Task Detail |
|---|---|---|
| Dark glassmorphism design | Real-time stats cards | Full task info with badges |

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + **Vite 4** | SPA framework + dev server |
| **TypeScript** | Type safety across all components |
| **Tailwind CSS v3** | Utility-first styling with custom dark theme |
| **Redux Toolkit** | Global state management (auth, session) |
| **React Router v6** | Client-side routing with protected routes |
| **Axios** | HTTP client with JWT interceptors |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** + **Express.js** | REST API server |
| **MySQL 8** | Relational database |
| **mysql2** | Async MySQL driver with connection pooling |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variable management |
| **nodemon** | Hot reload in development |

---

## 🗂️ Project Structure

```
Newop/
├── backend/                        # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js   # Login, Register, Profile
│   │   │   ├── taskController.js   # Full CRUD + stats
│   │   │   └── userController.js   # Employees + profile update
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT verify + Admin guard
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth/*
│   │   │   ├── taskRoutes.js       # /api/tasks/*
│   │   │   └── userRoutes.js       # /api/users/*
│   │   └── server.js               # Express app entry point
│   ├── schema.sql                  # Database schema + seed data
│   ├── .env                        # Environment variables
│   └── package.json
│
└── frontend/                       # React + Vite + TypeScript SPA
    ├── src/
    │   ├── store/                  # Redux Toolkit
    │   │   ├── store.ts            # Redux store config
    │   │   ├── hooks.ts            # Typed useAppDispatch / useAppSelector
    │   │   └── slices/
    │   │       └── authSlice.ts    # Auth state + async thunks
    │   ├── services/
    │   │   └── api.ts              # Axios instance + API helpers
    │   ├── types/
    │   │   └── index.ts            # TypeScript interfaces
    │   ├── components/
    │   │   ├── AppLayout.tsx       # Sidebar + Navbar shell
    │   │   ├── Sidebar.tsx         # Role-aware navigation
    │   │   ├── Navbar.tsx          # Top bar + avatar dropdown
    │   │   ├── TaskCard.tsx        # Task card (grid view)
    │   │   ├── StatusBadge.tsx     # Open / In Progress / Done
    │   │   ├── PriorityBadge.tsx   # Low / Medium / High
    │   │   ├── SearchFilterBar.tsx # Search + filters + view toggle
    │   │   └── ConfirmModal.tsx    # Delete confirmation overlay
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.tsx  # Stats + recent tasks
    │   │   │   ├── TaskListPage.tsx    # All tasks (grid/table)
    │   │   │   ├── CreateTaskPage.tsx  # New task form
    │   │   │   ├── TaskDetailPage.tsx  # Task details + delete
    │   │   │   ├── EditTaskPage.tsx    # Edit all task fields
    │   │   │   └── EmployeesPage.tsx   # Team overview + progress
    │   │   └── user/
    │   │       ├── UserDashboard.tsx   # Personal stats
    │   │       ├── MyTasksPage.tsx     # Assigned tasks only
    │   │       ├── UserTaskDetailPage.tsx # Mark as Done/In Progress
    │   │       └── ProfilePage.tsx     # Edit profile + change password
    │   ├── App.tsx                 # Routes + Redux Provider
    │   ├── main.tsx                # React root + Redux store
    │   └── index.css               # Tailwind directives + @layer
    ├── tailwind.config.js          # Custom dark theme tokens
    ├── postcss.config.js           # Tailwind PostCSS
    ├── vite.config.ts
    └── package.json
```

---

## ✅ Assignment Requirements

### Core Functionality

#### Task Management
| Requirement | Status | Implementation |
|---|---|---|
| Create task with Title | ✅ | `POST /api/tasks` → `CreateTaskPage.tsx` |
| Create task with Description | ✅ | Optional textarea field |
| Priority (Low / Medium / High) | ✅ | ENUM in DB, dropdown in UI |
| Due Date | ✅ | DATE column, date picker in forms |
| Status (Open / In Progress / Done) | ✅ | Mapped from `pending/in_progress/completed` |
| View all tasks (list/card view) | ✅ | Grid cards + sortable table toggle |
| View task detail page | ✅ | `/admin/tasks/:id` + `/user/tasks/:id` |
| Edit, Update, Delete tasks | ✅ | Full CRUD with confirmation modal |

#### User Management
| Requirement | Status | Implementation |
|---|---|---|
| Register users | ✅ | `POST /api/auth/register` → `RegisterPage.tsx` |
| Login users | ✅ | `POST /api/auth/login` → `LoginPage.tsx` |
| Task linked to `createdBy` | ✅ | `created_by` FK in tasks table |
| Task linked to `assignedTo` | ✅ | `assigned_to` FK in tasks table |
| Users see only their own tasks | ✅ | Backend filters: `assigned_to = user.id OR created_by = user.id` |

#### Role System
| Requirement | Status | Implementation |
|---|---|---|
| Admin role | ✅ | `role = 'admin'` in users table |
| User / Employee role | ✅ | `role = 'employee'` in users table |
| Admin sees all tasks | ✅ | No WHERE filter for admin in `getAllTasks` |
| Users see only assigned/created tasks | ✅ | `WHERE assigned_to = req.user.id` for employees |
| Role-based route protection | ✅ | `ProtectedRoute` + `requireAdmin` middleware |

### Bonus Features
| Feature | Status | Notes |
|---|---|---|
| JWT Authentication | ✅ | 7-day tokens, auto-refresh via interceptor |
| Search by title/description | ✅ | Debounced, server-side LIKE query |
| Filter by status | ✅ | Dropdown in `SearchFilterBar` |
| Filter by priority | ✅ | Dropdown in `SearchFilterBar` |
| Grid + Table view toggle | ✅ | Persisted per session |
| Profile management | ✅ | Name, phone, department + password change |
| Employee overview page | ✅ | Task stats + progress bars per employee |
| Overdue task indicators | ✅ | ⚠️ badge when due_date < today |
| Responsive design | ✅ | Mobile sidebar overlay + responsive grid |
| Premium dark UI | ✅ | Glassmorphism, gradients, animations |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MySQL 8
- npm ≥ 9

### 1. Clone the repository
```bash
git clone <repository-url>
cd Newop
```

### 2. Database Setup
```sql
-- Run in MySQL Workbench or mysql CLI
source backend/schema.sql
```

The schema creates the `employee_task_db` database with `users` and `tasks` tables, and seeds demo users.

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_task_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev        # Development with nodemon
# or
npm start          # Production
```

Backend runs at: `http://localhost:5000`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Development server
```

Frontend runs at: `http://localhost:5173`

---

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Register new employee |
| `POST` | `/api/auth/login` | None | Login and get JWT token |
| `GET` | `/api/auth/profile` | JWT | Get current user profile |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | JWT | Get all tasks (role-filtered) |
| `GET` | `/api/tasks/stats` | JWT | Get task count statistics |
| `GET` | `/api/tasks/:id` | JWT | Get single task |
| `POST` | `/api/tasks` | Admin | Create new task |
| `PUT` | `/api/tasks/:id` | JWT | Update task (admin: all fields; user: status only) |
| `DELETE` | `/api/tasks/:id` | Admin | Delete task |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/employees` | Admin | Get all employees with task stats |
| `GET` | `/api/users/:id` | JWT | Get user by ID |
| `PUT` | `/api/users/:id` | JWT (own) | Update profile / change password |

### Query Parameters (GET /api/tasks)
| Param | Values | Description |
|---|---|---|
| `status` | `pending`, `in_progress`, `completed` | Filter by status |
| `priority` | `low`, `medium`, `high` | Filter by priority |
| `search` | string | Search title and description |

---

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────┐         ┌──────────────┐
│   React Frontend    │─────────│   Express.js API     │─────────│   MySQL DB   │
│                     │ HTTP/   │                      │ mysql2/ │              │
│  Redux Toolkit      │  CORS   │  JWT Middleware       │  pool   │  users       │
│  Tailwind CSS v3    │         │  Role Guards          │         │  tasks       │
│  React Router v6    │         │  REST Controllers     │         │              │
│  Axios + Interceptors│        │  bcrypt / JWT         │         │              │
└─────────────────────┘         └──────────────────────┘         └──────────────┘
         :5173                           :5000
```

### State Management (Redux Toolkit)
- **`authSlice`** — Manages `user`, `token`, `isLoading`, and `error`
- **`loginThunk`** / **`registerThunk`** — Async thunks for auth API calls
- **`restoreSession`** — Sync action that hydrates state from localStorage on app start
- **`logout`** — Clears state and localStorage
- **Typed hooks** — `useAppSelector` and `useAppDispatch` for type-safe usage

### Security
- Passwords are hashed with **bcrypt** (10 salt rounds)
- JWT tokens expire after **7 days**
- Employees cannot access admin endpoints (`requireAdmin` middleware)
- Employees cannot view or modify other users' tasks (enforced in controllers)
- CORS configured to allow only trusted origins

---

## 🔧 Development Scripts

### Backend
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start with node (production)
```

### Frontend
```bash
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript compile + Vite production build
npm run preview  # Preview production build
```

---

## 🎨 Design System

The UI uses a custom **Tailwind CSS v3** dark theme configuration:

| Token | Value | Usage |
|---|---|---|
| `dark-900` | `#0a0a1f` | Page background |
| `dark-700` | `#141432` | Card background |
| `primary` | `#6366f1` | Interactive elements |
| `accent` | `#8b5cf6` | Gradients, accents |
| `.glass-card` | `@layer` component | Glassmorphism cards |
| `.btn-primary` | `@layer` component | Primary action buttons |
| `.input` | `@layer` component | Form inputs |

---

## 📋 Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,      -- bcrypt hash
  role        ENUM('admin', 'employee') DEFAULT 'employee',
  department  VARCHAR(255),
  phone       VARCHAR(20),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE tasks (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  priority    ENUM('low', 'medium', 'high') DEFAULT 'medium',
  assigned_to INT,                        -- FK → users.id
  created_by  INT NOT NULL,               -- FK → users.id
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🧪 Integration Test Results

All features verified with live end-to-end testing (14/14 steps):

| # | Test | Result |
|---|---|---|
| 1 | Login page loads with dark theme | ✅ Pass |
| 2 | Admin login → Admin Dashboard with real stats | ✅ Pass |
| 3 | All Tasks page shows task grid | ✅ Pass |
| 4 | Create new task with all fields | ✅ Pass |
| 5 | View task detail page | ✅ Pass |
| 6 | Edit task status → saved to DB | ✅ Pass |
| 7 | Employees page shows stats + progress bars | ✅ Pass |
| 8 | Logout clears session, redirects to login | ✅ Pass |
| 9 | Employee login → User Dashboard | ✅ Pass |
| 10 | My Tasks shows only assigned tasks | ✅ Pass |
| 11 | Task detail shows "Mark as Done" / "Start Task" | ✅ Pass |
| 12 | Profile page with editable fields | ✅ Pass |
| 13 | Register page accessible when logged out | ✅ Pass |
| 14 | Route guard: employee blocked from admin routes | ✅ Pass |

---

## 📄 License

This project was built as a SLIIT assignment submission.

---

*Built with ⚡ by TaskFlow — SLIIT Web Application Development Assignment*