import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { restoreSession } from './store/slices/authSlice';

// Auth pages
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TaskListPage   from './pages/admin/TaskListPage';
import CreateTaskPage from './pages/admin/CreateTaskPage';
import TaskDetailPage from './pages/admin/TaskDetailPage';
import EditTaskPage   from './pages/admin/EditTaskPage';
import EmployeesPage  from './pages/admin/EmployeesPage';

// User pages
import UserDashboard      from './pages/user/UserDashboard';
import MyTasksPage        from './pages/user/MyTasksPage';
import UserTaskDetailPage from './pages/user/UserTaskDetailPage';
import ProfilePage        from './pages/user/ProfilePage';

// ── Protected Route ────────────────────────────────────────────
function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: 'admin' | 'employee';
}) {
  const { user, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center gap-3 text-gray-400">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return <>{children}</>;
}

// ── Root Redirect ──────────────────────────────────────────────
function RootRedirect() {
  const { user, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center gap-3 text-gray-400">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
}

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const dispatch = useAppDispatch();

  // Restore session from localStorage on first mount
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Root */}
        <Route path="/" element={<RootRedirect />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/tasks"     element={<ProtectedRoute role="admin"><TaskListPage /></ProtectedRoute>} />
        <Route path="/admin/tasks/new" element={<ProtectedRoute role="admin"><CreateTaskPage /></ProtectedRoute>} />
        <Route path="/admin/tasks/:id" element={<ProtectedRoute role="admin"><TaskDetailPage /></ProtectedRoute>} />
        <Route path="/admin/tasks/:id/edit" element={<ProtectedRoute role="admin"><EditTaskPage /></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute role="admin"><EmployeesPage /></ProtectedRoute>} />

        {/* User */}
        <Route path="/user/dashboard" element={<ProtectedRoute role="employee"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/tasks"     element={<ProtectedRoute role="employee"><MyTasksPage /></ProtectedRoute>} />
        <Route path="/user/tasks/:id" element={<ProtectedRoute role="employee"><UserTaskDetailPage /></ProtectedRoute>} />
        <Route path="/user/profile"   element={<ProtectedRoute role="employee"><ProfilePage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
