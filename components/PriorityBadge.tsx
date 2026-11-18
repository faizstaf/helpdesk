import { AlertCircle, AlertOctagon, ArrowDownCircle } from 'lucide-react';
import type { TahapKeutamaan } from '@/lib/types';

interface PriorityBadgeProps {
  keutamaan: TahapKeutamaan;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ keutamaan, size = 'sm' }: PriorityBadgeProps) {
  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  if (keutamaan === 'Kritikal') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 font-semibold text-red-700 whitespace-nowrap shrink-0 ${sizeClasses}`}
      >
        <AlertOctagon className="h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden="true" />
        <span>Kritikal</span>
      </span>
    );
  }

  if (keutamaan === 'Sederhana') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 font-semibold text-amber-800 whitespace-nowrap shrink-0 ${sizeClasses}`}
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <span>Sederhana</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 font-medium text-slate-700 whitespace-nowrap shrink-0 ${sizeClasses}`}
    >
      <ArrowDownCircle className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span>Rendah</span>
    </span>
  );
}
