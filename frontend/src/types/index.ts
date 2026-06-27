// TypeScript interfaces for the Task Management System

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department?: string;
  phone?: string;
  created_at?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: number;
  created_by: number;
  due_date?: string;
  created_at: string;
  updated_at?: string;
  // Joined fields
  assigned_to_name?: string;
  assigned_to_email?: string;
  created_by_name?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

export interface EmployeeWithStats extends User {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assigned_to?: number;
  due_date?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: number;
  due_date?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  department?: string;
  currentPassword?: string;
  newPassword?: string;
}

// UI helpers
export const STATUS_LABELS: Record<string, string> = {
  pending:     'Open',
  in_progress: 'In Progress',
  completed:   'Done',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low:    'Low',
  medium: 'Medium',
  high:   'High',
};
