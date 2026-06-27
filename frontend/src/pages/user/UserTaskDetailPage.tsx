import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { Task } from '../../types';
import { tasksApi } from '../../services/api';

export default function UserTaskDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const [task,    setTask]    = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!id) return;
    tasksApi.getById(Number(id))
      .then((r) => setTask(r.data.task ?? r.data))
      .catch(() => navigate('/user/tasks'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleMarkDone = async () => {
    setMarking(true);
    setError('');
    try {
      const res = await tasksApi.update(Number(id), { status: 'completed' });
      setTask(res.data.task ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setMarking(false);
    }
  };

  const handleMarkInProgress = async () => {
    setMarking(true);
    setError('');
    try {
      const res = await tasksApi.update(Number(id), { status: 'in_progress' });
      setTask(res.data.task ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return (
    <AppLayout title="Task Detail">
      <div className="flex items-center justify-center h-48 text-gray-500 gap-2">
        <div className="spinner" /> Loading task…
      </div>
    </AppLayout>
  );

  if (!task) return null;

  const isOverdue = task.status !== 'completed' && task.due_date && new Date(task.due_date) < new Date();

  return (
    <AppLayout title="Task Detail">
      <div className="max-w-3xl mx-auto">
        <button className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1 mb-6 transition-colors"
          onClick={() => navigate('/user/tasks')}>← My Tasks</button>

        {error && <div className="alert-error mb-4">{error}</div>}

        {/* Title + status action */}
        <div className="glass-card p-6 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-3">{task.title}</h1>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {isOverdue && <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">⚠️ Overdue</span>}
              </div>
            </div>

            {/* Status action button */}
            {task.status !== 'completed' && (
              <div className="flex gap-2 flex-shrink-0">
                {task.status === 'pending' && (
                  <button
                    className="btn btn-secondary text-sm"
                    disabled={marking}
                    onClick={handleMarkInProgress}
                  >
                    {marking ? <><div className="spinner" />Updating…</> : '▶ Start Task'}
                  </button>
                )}
                <button
                  id="mark-done-btn"
                  className="btn btn-primary text-sm"
                  disabled={marking}
                  onClick={handleMarkDone}
                >
                  {marking ? <><div className="spinner" />Updating…</> : '✓ Mark as Done'}
                </button>
              </div>
            )}
            {task.status === 'completed' && (
              <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-4 py-2 text-sm">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Due Date</p>
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-gray-100'}`}>
              {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created By</p>
            <p className="text-sm font-medium text-gray-100">{task.created_by_name ?? '—'}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created At</p>
            <p className="text-sm font-medium text-gray-100">{new Date(task.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {task.description && (
          <div className="glass-card p-4 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-gray-200 leading-relaxed">{task.description}</p>
          </div>
        )}

        <div className="glass-card p-4 bg-primary/5 border-primary/15">
          <p className="text-sm text-gray-400">
            💡 <strong className="text-primary-300">Tip:</strong> Use the status button above to update your progress on this task.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
