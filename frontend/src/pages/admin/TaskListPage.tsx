import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import TaskCard from '../../components/TaskCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SearchFilterBar from '../../components/SearchFilterBar';
import { Task } from '../../types';
import { tasksApi } from '../../services/api';

type View = 'grid' | 'table';

export default function TaskListPage() {
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
    <AppLayout title="All Tasks">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">{tasks.length} tasks found</p>
          </div>
          <button
            id="new-task-btn"
            className="btn btn-primary"
            onClick={() => navigate('/admin/tasks/new')}
          >
            ＋ New Task
          </button>
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
            <p className="text-sm">Try adjusting your filters or create a new task</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((t) => (
              <TaskCard key={t.id} task={t} basePath="/admin" />
            ))}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Task</th><th>Status</th><th>Priority</th><th>Assigned To</th><th>Due Date</th><th></th></tr>
                </thead>
                <tbody>
                  {tasks.map((t) => {
                    const isOverdue = t.status !== 'completed' && t.due_date && new Date(t.due_date) < new Date();
                    return (
                      <tr key={t.id} className="cursor-pointer" onClick={() => navigate(`/admin/tasks/${t.id}`)}>
                        <td>
                          <p className="font-medium text-gray-100 truncate max-w-[220px]">{t.title}</p>
                          {t.description && <p className="text-xs text-gray-500 truncate max-w-[220px]">{t.description}</p>}
                        </td>
                        <td><StatusBadge status={t.status} /></td>
                        <td><PriorityBadge priority={t.priority} /></td>
                        <td className="text-gray-300">{t.assigned_to_name ?? '—'}</td>
                        <td>
                          <span className={`text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                            {t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            {isOverdue && ' ⚠️'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="text-xs text-primary-300 hover:text-primary"
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/tasks/${t.id}/edit`); }}
                          >Edit</button>
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
