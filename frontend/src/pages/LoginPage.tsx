import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginThunk, clearError } from '../store/slices/authSlice';

export default function LoginPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, error } = useAppSelector((s) => s.auth);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => { dispatch(clearError()); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-page-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-btn-primary flex items-center justify-center text-white text-xl shadow-glow">
              ⚡
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-7">Sign in to your workspace</p>

          {error && (
            <div className="alert-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full justify-center h-11 text-base mt-2"
            >
              {isLoading ? <><div className="spinner" />Signing in…</> : 'Sign in →'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary-300 font-semibold mb-1">🔑 Demo Credentials</p>
            <p className="text-xs text-gray-400">Admin: admin@company.com / admin123</p>
            <p className="text-xs text-gray-400">User: john@company.com / password123</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-300 hover:text-primary font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
