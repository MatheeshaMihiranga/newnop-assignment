import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { useAppSelector } from '../../store/hooks';
import { Task, TaskStats } from '../../types';
import { tasksApi } from '../../services/api';

export default function UserDashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [stats,   setStats]   = useState<TaskStats>({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [taskRes, statRes] = await Promise.all([
          tasksApi.getAll({ limit: 5 } as any),
          tasksApi.getStats(),
        ]);
        setTasks(taskRes.data.tasks ?? taskRes.data);
        setStats(statRes.data.stats ?? statRes.data);
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    })();
  }, []);

  const statCards = [
    { label: 'My Tasks',    value: stats.total,       color: 'text-accent-400',  bg: 'bg-accent/10',      icon: '📋' },
    { label: 'Open',        value: stats.pending,     color: 'text-amber-400',   bg: 'bg-amber-500/10',   icon: '📌' },
    { label: 'In Progress', value: stats.in_progress, color: 'text-primary-300', bg: 'bg-primary/10',     icon: '⚙️' },
    { label: 'Done',        value: stats.completed,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '✅' },
  ];

  return (
    <AppLayout title="My Dashboard">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your task overview for today.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 h-32 justify-center">
            <div className="spinner" /> Loading…
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className={`glass-card p-5 ${s.bg}`}>
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          <button className="btn btn-primary" onClick={() => navigate('/user/tasks')}>
            ☰ View My Tasks
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/profile')}>
            👤 My Profile
          </button>
        </div>

        {/* Recent tasks */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-gray-100">Recent Tasks</h2>
            <button className="text-xs text-primary-300 hover:text-primary transition-colors"
              onClick={() => navigate('/user/tasks')}>View all →</button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {tasks.length === 0 ? (
              <div className="py-12 text-center text-gray-500">No tasks assigned yet</div>
            ) : tasks.map((t) => (
              <div key={t.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors"
                onClick={() => navigate(`/user/tasks/${t.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-100 truncate">{t.title}</p>
                  {t.description && <p className="text-xs text-gray-500 truncate mt-0.5">{t.description}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                  {t.due_date && (
                    <span className="text-xs text-gray-500 hidden md:block">
                      {new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
