import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

interface Props {
  title?: string;
  onMenuToggle: () => void;
}

export default function Navbar({ title, onMenuToggle }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <header className="h-14 border-b border-white/[0.06] bg-dark-800/70 backdrop-blur-glass flex items-center justify-between px-5 gap-4 sticky top-0 z-30">
      {/* Left: menu toggle + title */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/[0.06] transition-colors"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        {title && (
          <h1 className="text-sm font-semibold text-gray-200">{title}</h1>
        )}
      </div>

      {/* Right: role badge + avatar dropdown */}
      <div className="flex items-center gap-3" ref={menuRef}>
        <span className={`badge text-xs hidden sm:inline-flex ${
          user?.role === 'admin'
            ? 'bg-primary/15 text-primary-300 border border-primary/20'
            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
        }`}>
          {user?.role === 'admin' ? '🔑 Admin' : '👤 User'}
        </span>

        {/* Avatar button */}
        <div className="relative">
          <button
            id="navbar-avatar-btn"
            className="w-8 h-8 rounded-full bg-avatar-gradient flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => setMenuOpen((p) => !p)}
          >
            {initials}
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 glass-card py-1 animate-fade-in z-50">
              <div className="px-4 py-2 border-b border-white/[0.06]">
                <p className="text-sm font-semibold text-gray-100 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              {user?.role === 'employee' && (
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                  onClick={() => { navigate('/user/profile'); setMenuOpen(false); }}
                >
                  👤 My Profile
                </button>
              )}
              <button
                id="navbar-logout-btn"
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                onClick={handleLogout}
              >
                🚪 Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
