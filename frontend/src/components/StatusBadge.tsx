import React from 'react';
import { STATUS_LABELS } from '../types';

const styles: Record<string, string> = {
  pending:     'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  in_progress: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  completed:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};
const dot: Record<string, string> = {
  pending: 'bg-amber-400', in_progress: 'bg-indigo-400', completed: 'bg-emerald-400',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${styles[status] ?? 'bg-gray-500/10 text-gray-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot[status] ?? 'bg-gray-400'}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
