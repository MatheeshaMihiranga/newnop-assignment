import React from 'react';
import { Task, STATUS_LABELS, PRIORITY_LABELS } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  task: Task;
  basePath: string;
}

const priorityStyles: Record<string, string> = {
  high:   'bg-red-500/10 text-red-400 border border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  low:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};
const priorityDot: Record<string, string> = {
  high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-emerald-400',
};

const statusStyles: Record<string, string> = {
  pending:     'bg-amber-500/10 text-amber-400',
  in_progress: 'bg-primary/10 text-primary-300',
  completed:   'bg-emerald-500/10 text-emerald-400',
};
const statusDot: Record<string, string> = {
  pending: 'bg-amber-400', in_progress: 'bg-primary-400', completed: 'bg-emerald-400',
};

export default function TaskCard({ task, basePath }: Props) {
  const navigate = useNavigate();
  const isOverdue = task.status !== 'completed' && task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      className="glass-card p-5 cursor-pointer hover:border-white/[0.12] hover:shadow-glow-sm hover:-translate-y-0.5 transition-all duration-200 group"
      onClick={() => navigate(`${basePath}/tasks/${task.id}`)}
      id={`task-card-${task.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-100 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span className={`badge text-xs flex-shrink-0 ${priorityStyles[task.priority]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`} />
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        <span className={`badge text-xs ${statusStyles[task.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusDot[task.status]}`} />
          {STATUS_LABELS[task.status]}
        </span>

        {task.due_date && (
          <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
            📅 {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {isOverdue && <span>⚠️</span>}
          </span>
        )}

        {task.assigned_to_name && (
          <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            👤 <span className="truncate max-w-[80px]">{task.assigned_to_name}</span>
          </span>
        )}
      </div>
    </div>
  );
}
