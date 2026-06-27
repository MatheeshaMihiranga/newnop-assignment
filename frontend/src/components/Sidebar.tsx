import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem { label: string; to: string; icon: string; }

const adminNav: NavItem[] = [
  { label: 'Dashboard',   to: '/admin/dashboard',  icon: '⊞' },
  { label: 'All Tasks',   to: '/admin/tasks',      icon: '✓' },
  { label: 'Create Task', to: '/admin/tasks/new',  icon: '+' },
  { label: 'Employees',   to: '/admin/employees',  icon: '👥' },
];

const userNav: NavItem[] = [
  { label: 'Dashboard', to: '/user/dashboard', icon: '⊞' },
  { label: 'My Tasks',  to: '/user/tasks',     icon: '✓' },
  { label: 'Profile',   to: '/user/profile',   icon: '👤' },
];

export default function Sidebar({ isOpen, onClose }: Props) {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { user }  = useAppSelector((s) => s.auth);
  const navItems  = user?.role === 'admin' ? adminNav : userNav;
  const section   = user?.role === 'admin' ? 'ADMINISTRATION' : 'WORKSPACE';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <aside className="flex flex-col h-full w-56 bg-dark-800 border-r border-white/[0.06] shadow-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-btn-primary flex items-center justify-center text-white font-bold text-lg shadow-glow-sm">
          ⚡
        </div>
        <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-2 mb-3">
          {section}
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/15 text-primary-300 shadow-glow-sm'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.05]'
                  }`
                }
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-avatar-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="relative z-50 animate-slide-up">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
