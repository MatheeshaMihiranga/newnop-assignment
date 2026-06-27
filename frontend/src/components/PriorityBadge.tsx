import React from 'react';
import { PRIORITY_LABELS } from '../types';

const styles: Record<string, string> = {
  high:   'bg-red-500/10 text-red-400 border border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  low:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};
const arrows: Record<string, string> = {
  high: '↑', medium: '→', low: '↓',
};

export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`badge ${styles[priority] ?? 'bg-gray-500/10 text-gray-400'}`}>
      <span className="font-bold">{arrows[priority] ?? '–'}</span>
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}
