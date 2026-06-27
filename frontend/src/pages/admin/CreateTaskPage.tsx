import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { usersApi, tasksApi } from '../../services/api';

interface Employee { id: number; name: string; email: string; role: string; department?: string; }

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [assignable, setAssignable] = useState<Employee[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    assigned_to: '', due_date: '',
  });

  useEffect(() => {
    usersApi.getAssignable().then((r) => setAssignable(r.data.users ?? r.data)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSubmitting(true);
    try {
      await tasksApi.create({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        priority: form.priority,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : undefined,
        due_date: form.due_date || undefined,
      });
      navigate('/admin/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Task">
      <div className="max-w-2xl mx-auto">
        <button className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1 mb-6 transition-colors"
          onClick={() => navigate(-1)}>← Back</button>

        <h1 className="text-2xl font-bold text-white mb-1">Create New Task</h1>
        <p className="text-gray-400 text-sm mb-7">Fill in the details below to create a new task.</p>

        <div className="glass-card p-6">
          {error && <div className="alert-error mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label" htmlFor="task-title">Task Title <span className="text-red-400">*</span></label>
              <input id="task-title" name="title" type="text" className="input"
                placeholder="e.g. Implement login feature"
                value={form.title} onChange={handleChange} required autoFocus />
            </div>

            <div>
              <label className="form-label" htmlFor="task-desc">Description</label>
              <textarea id="task-desc" name="description" className="textarea h-28"
                placeholder="Add a description..."
                value={form.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select id="task-priority" name="priority" className="select"
                  value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="task-assigned">Assign To</label>
                <select id="task-assigned" name="assigned_to" className="select"
                  value={form.assigned_to} onChange={handleChange}>
                  <option value="">— Unassigned —</option>
                  {assignable.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}{u.role === 'admin' ? ' (Admin)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="task-due">Due Date</label>
              <input id="task-due" name="due_date" type="date" className="input"
                value={form.due_date} onChange={handleChange} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button id="create-task-btn" type="submit" disabled={submitting} className="btn btn-primary">
                {submitting ? <><div className="spinner" />Creating…</> : '✓ Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
