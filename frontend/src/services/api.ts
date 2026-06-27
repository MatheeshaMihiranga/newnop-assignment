import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  getProfile: () => api.get('/auth/profile'),
};

// ── Tasks ─────────────────────────────────────────────────────
export const tasksApi = {
  getAll: (params?: { status?: string; priority?: string; search?: string }) =>
    api.get('/tasks', { params }),

  getStats: () => api.get('/tasks/stats'),

  getById: (id: number) => api.get(`/tasks/${id}`),

  create: (data: object) => api.post('/tasks', data),

  update: (id: number, data: object) => api.put(`/tasks/${id}`, data),

  delete: (id: number) => api.delete(`/tasks/${id}`),
};

// ── Users ─────────────────────────────────────────────────────
export const usersApi = {
  getEmployees: () => api.get('/users/employees'),

  getAssignable: () => api.get('/users/assignable'), // All users for assign dropdown

  getById: (id: number) => api.get(`/users/${id}`),

  update: (id: number, data: object) => api.put(`/users/${id}`, data),
};

export default api;
