import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import TaskCard from '../../components/TaskCard';
import SearchFilterBar from '../../components/SearchFilterBar';
import { Task } from '../../types';
import { tasksApi } from '../../services/api';

type View = 'grid' | 'table';

export default function MyTasksPage() {
  const navigate = useNavigate();
  const [tasks,    setTasks]    = useState<Task[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [priority, setPriority] = useState('');
  const [view,     setView]     = useState<View>('grid');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksApi.getAll({
        ...(search   ? { search }   : {}),
        ...(status   ? { status }   : {}),
        ...(priority ? { priority } : {}),
      } as any);
      setTasks(res.data.tasks ?? res.data);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, [search, status, priority]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  return (
    <AppLayout title="My Tasks">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-sm text-gray-400 mt-0.5">{tasks.length} tasks found</p>
          </div>
        </div>

        <SearchFilterBar
          search={search} onSearch={setSearch}
          statusFilter={status} onStatusFilter={setStatus}
          priorityFilter={priority} onPriorityFilter={setPriority}
          view={view} onViewToggle={setView}
        />

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 gap-2">
            <div className="spinner" /> Loading tasks…
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-gray-300 mb-1">No tasks found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} basePath="/user" />
            ))}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Task</th><th>Status</th><th>Priority</th><th>Due Date</th></tr>
                </thead>
                <tbody>
                  {tasks.map((t) => {
                    const isOverdue = t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date();
                    return (
                      <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/user/tasks/${t.id}`)}>
                        <td>
                          <p className="font-medium text-gray-100 truncate max-w-[220px]">{t.title}</p>
                          {t.description && <p className="text-xs text-gray-500 truncate max-w-[220px]">{t.description}</p>}
                        </td>
                        <td>
                          <span className={`badge text-xs ${
                            t.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                            t.status === 'in_progress' ? 'bg-primary/10 text-primary-300' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {t.status === 'pending' ? 'Open' : t.status === 'in_progress' ? 'In Progress' : 'Done'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge text-xs ${
                            t.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                            t.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>{t.priority}</span>
                        </td>
                        <td className={`text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                          {t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          {isOverdue && ' ⚠️'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
