import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import ConfirmModal from '../../components/ConfirmModal';
import { Task } from '../../types';
import { tasksApi } from '../../services/api';

export default function TaskDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task,    setTask]    = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    tasksApi.getById(Number(id))
      .then((r) => setTask(r.data.task ?? r.data))
      .catch(() => navigate('/admin/tasks'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await tasksApi.delete(Number(id));
      navigate('/admin/tasks');
    } catch {
      setDeleting(false);
      setConfirm(false);
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
        {/* Breadcrumb + actions */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1 transition-colors"
            onClick={() => navigate('/admin/tasks')}>← All Tasks</button>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={() => navigate(`/admin/tasks/${id}/edit`)}>
              ✏️ Edit
            </button>
            <button className="btn btn-danger" onClick={() => setConfirm(true)}>
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Title card */}
        <div className="glass-card p-6 mb-4">
          <h1 className="text-2xl font-bold text-white mb-3">{task.title}</h1>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {isOverdue && <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">⚠️ Overdue</span>}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Assigned To</p>
            {task.assigned_to_name ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-avatar-gradient flex items-center justify-center text-white text-xs font-bold">
                  {task.assigned_to_name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-100">{task.assigned_to_name}</span>
              </div>
            ) : <span className="text-sm text-gray-500">—</span>}
          </div>

          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created By</p>
            <p className="text-sm font-medium text-gray-100">{task.created_by_name ?? '—'}</p>
          </div>

          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Due Date</p>
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-gray-100'}`}>
              {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created At</p>
          <p className="text-sm text-gray-100">{new Date(task.created_at).toLocaleString()}</p>
        </div>

        {task.description && (
          <div className="glass-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-gray-200 leading-relaxed">{task.description}</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete Task'}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(false)}
        danger
      />
    </AppLayout>
  );
}
