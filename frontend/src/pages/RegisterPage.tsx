import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerThunk, clearError } from '../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, error } = useAppSelector((s) => s.auth);

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [localErr, setLocalErr] = useState('');

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => { dispatch(clearError()); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr('');
    if (password !== confirm) { setLocalErr('Passwords do not match'); return; }
    if (password.length < 6)  { setLocalErr('Password must be at least 6 characters'); return; }
    dispatch(registerThunk({ name, email, password }));
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-page-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-btn-primary flex items-center justify-center text-white text-xl shadow-glow">
              ⚡
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
          <p className="text-gray-400 text-sm mb-7">Join your team workspace</p>

          {(localErr || error) && (
            <div className="alert-error">{localErr || error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="reg-name">Full name</label>
              <input id="reg-name" type="text" className="input" placeholder="Jane Smith"
                value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" type="email" className="input" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" className="input" placeholder="Min. 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
              <input id="reg-confirm" type="password" className="input" placeholder="Repeat password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full justify-center h-11 text-base mt-2"
            >
              {isLoading ? <><div className="spinner" />Creating…</> : 'Create account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-300 hover:text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
