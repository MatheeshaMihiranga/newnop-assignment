import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { usersApi } from '../../services/api';
import { EmployeeWithStats } from '../../types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithStats[]>([]);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    usersApi.getEmployees()
      .then((r) => setEmployees(r.data.employees ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter((e) =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
               e.email.toLowerCase().includes(search.toLowerCase()) ||
               (e.department ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="Employees">
      <div className="max-w-5xl mx-auto">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">Team Overview</h1>
          <p className="text-gray-400 text-sm mt-1">{employees.length} employees in your organization</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="search"
            className="input pl-9 h-10"
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 gap-2">
            <div className="spinner" /> Loading team…
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="text-5xl mb-4">👥</div>
            <p className="font-semibold text-gray-300">No employees found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((emp) => {
              const total     = emp.total_tasks      ?? 0;
              const done      = emp.completed_tasks  ?? 0;
              const progress  = emp.in_progress_tasks ?? 0;
              const pending   = emp.pending_tasks    ?? 0;
              const pct       = total > 0 ? Math.round((done / total) * 100) : 0;
              const initials  = emp.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

              return (
                <div key={emp.id} className="glass-card p-5 hover:border-white/[0.12] transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-avatar-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-100 truncate">{emp.name}</p>
                      <p className="text-xs text-gray-500 truncate">{emp.email}</p>
                      {emp.department && (
                        <span className="text-xs text-primary-300 bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                          {emp.department}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Task stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'Open', value: pending, color: 'text-amber-400' },
                      { label: 'In Progress', value: progress, color: 'text-primary-300' },
                      { label: 'Done', value: done, color: 'text-emerald-400' },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Progress ({total} tasks)</span>
                      <span className="text-emerald-400 font-semibold">{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
