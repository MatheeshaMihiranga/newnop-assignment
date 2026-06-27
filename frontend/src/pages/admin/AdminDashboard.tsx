import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { useAppSelector } from '../../store/hooks';
import { Task, TaskStats } from '../../types';
import { tasksApi, usersApi } from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [stats,   setStats]   = useState<TaskStats>({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [teamSz,  setTeamSz]  = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [taskRes, statRes, empRes] = await Promise.all([
          tasksApi.getAll({ limit: 5 } as any),
          tasksApi.getStats(),
          usersApi.getEmployees(),
        ]);
        const taskList: Task[] = taskRes.data.tasks ?? taskRes.data;
        const statsData = statRes.data.stats ?? statRes.data;
        setTasks(taskList);
        setStats(statsData);
        const emps = empRes.data.employees ?? empRes.data;
        setTeamSz(Array.isArray(emps) ? emps.length : 0);
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    })();
  }, []);

  const statCards = [
    { label: 'Total Tasks',  value: stats.total,       color: 'text-accent-400',  bg: 'bg-accent/10',   icon: '📋' },
    { label: 'Open',         value: stats.pending,     color: 'text-amber-400',   bg: 'bg-amber-500/10', icon: '📌' },
    { label: 'In Progress',  value: stats.in_progress, color: 'text-primary-300', bg: 'bg-primary/10',  icon: '⚙️' },
    { label: 'Done',         value: stats.completed,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '✅' },
    { label: 'Team Size',    value: teamSz,            color: 'text-sky-400',     bg: 'bg-sky-500/10',  icon: '👥' },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your team today.</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 h-32 justify-center">
            <div className="spinner" /> Loading stats…
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className={`glass-card p-5 ${s.bg}`}>
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="btn btn-primary" onClick={() => navigate('/admin/tasks/new')}>
            ＋ Create Task
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/tasks')}>
            ☰ View All Tasks
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/employees')}>
            👥 Team Overview
          </button>
        </div>

        {/* Recent tasks table */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-gray-100">Recent Tasks</h2>
            <button className="text-xs text-primary-300 hover:text-primary transition-colors"
              onClick={() => navigate('/admin/tasks')}>View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th><th>Status</th><th>Priority</th><th>Assigned To</th><th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0
                  ? <tr><td colSpan={5} className="text-center text-gray-500 py-10">No tasks yet</td></tr>
                  : tasks.map((t) => (
                  <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/admin/tasks/${t.id}`)}>
                    <td>
                      <p className="font-medium text-gray-100 truncate max-w-[220px]">{t.title}</p>
                      {t.description && <p className="text-xs text-gray-500 truncate max-w-[220px]">{t.description}</p>}
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td className="text-gray-300">{t.assigned_to_name ?? '—'}</td>
                    <td className="text-gray-400">
                      {t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
