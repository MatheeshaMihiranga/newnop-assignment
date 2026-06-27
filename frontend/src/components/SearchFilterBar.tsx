import React from 'react';

type View = 'grid' | 'table';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  priorityFilter: string;
  onPriorityFilter: (v: string) => void;
  view: View;
  onViewToggle: (v: View) => void;
}

export default function SearchFilterBar({
  search, onSearch,
  statusFilter, onStatusFilter,
  priorityFilter, onPriorityFilter,
  view, onViewToggle,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          id="task-search"
          type="search"
          className="input pl-9 h-10"
          placeholder="Search tasks by title or description..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <select
        id="status-filter"
        className="select h-10 w-40"
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="pending">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Done</option>
      </select>

      {/* Priority filter */}
      <select
        id="priority-filter"
        className="select h-10 w-40"
        value={priorityFilter}
        onChange={(e) => onPriorityFilter(e.target.value)}
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* View toggle */}
      <div className="flex items-center bg-dark-800 border border-white/[0.06] rounded-lg overflow-hidden">
        <button
          className={`px-3 py-2 text-sm flex items-center gap-1 transition-all ${
            view === 'grid'
              ? 'bg-primary/20 text-primary-300 font-semibold'
              : 'text-gray-500 hover:text-gray-300'
          }`}
          onClick={() => onViewToggle('grid')}
          title="Grid view"
        >
          ⊞ Grid
        </button>
        <div className="w-px h-6 bg-white/[0.06]" />
        <button
          className={`px-3 py-2 text-sm flex items-center gap-1 transition-all ${
            view === 'table'
              ? 'bg-primary/20 text-primary-300 font-semibold'
              : 'text-gray-500 hover:text-gray-300'
          }`}
          onClick={() => onViewToggle('table')}
          title="Table view"
        >
          ≡ Table
        </button>
      </div>
    </div>
  );
}
