import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { tasksApi, usersApi } from '../../services/api';
import { Task } from '../../types';

interface Employee { id: number; name: string; role?: string; }

export default function EditTaskPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task,      setTask]      = useState<Task | null>(null);
  const [assignable, setAssignable] = useState<Employee[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState('');

  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', status: 'pending',
    assigned_to: '', due_date: '',
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      tasksApi.getById(Number(id)),
      usersApi.getAssignable(),
    ]).then(([taskRes, empRes]) => {
      const t: Task = taskRes.data.task ?? taskRes.data;
      setTask(t);
      setForm({
        title:       t.title,
        description: t.description ?? '',
        priority:    t.priority,
        status:      t.status,
        assigned_to: t.assigned_to ? String(t.assigned_to) : '',
        due_date:    t.due_date ? t.due_date.slice(0, 10) : '',
      });
      setAssignable(empRes.data.users ?? empRes.data);
    }).catch(() => navigate('/admin/tasks'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSubmitting(true);
    try {
      await tasksApi.update(Number(id), {
        title:       form.title.trim(),
        description: form.description.trim() || undefined,
        priority:    form.priority,
        status:      form.status,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : undefined,
        due_date:    form.due_date || undefined,
      });
      navigate(`/admin/tasks/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <AppLayout title="Edit Task">
      <div className="flex items-center justify-center h-48 text-gray-500 gap-2">
        <div className="spinner" /> Loading…
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title="Edit Task">
      <div className="max-w-2xl mx-auto">
        <button className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1 mb-6 transition-colors"
          onClick={() => navigate(-1)}>← Back</button>

        <h1 className="text-2xl font-bold text-white mb-1">Edit Task</h1>
        <p className="text-gray-400 text-sm mb-7">Update the task details below.</p>

        <div className="glass-card p-6">
          {error && <div className="alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label" htmlFor="edit-title">Task Title <span className="text-red-400">*</span></label>
              <input id="edit-title" name="title" type="text" className="input"
                value={form.title} onChange={handleChange} required />
            </div>

            <div>
              <label className="form-label" htmlFor="edit-desc">Description</label>
              <textarea id="edit-desc" name="description" className="textarea h-28"
                value={form.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="edit-priority">Priority</label>
                <select id="edit-priority" name="priority" className="select"
                  value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="edit-status">Status</label>
                <select id="edit-status" name="status" className="select"
                  value={form.status} onChange={handleChange}>
                  <option value="pending">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Done</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="edit-assigned">Assign To</label>
                <select id="edit-assigned" name="assigned_to" className="select"
                  value={form.assigned_to} onChange={handleChange}>
                  <option value="">— Unassigned —</option>
                  {assignable.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}{u.role === 'admin' ? ' (Admin)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="edit-due">Due Date</label>
                <input id="edit-due" name="due_date" type="date" className="input"
                  value={form.due_date} onChange={handleChange} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button id="save-task-btn" type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? <><div className="spinner" />Saving…</> : '✓ Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
