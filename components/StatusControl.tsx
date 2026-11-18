'use client';

import { CheckCircle2, Clock, Inbox } from 'lucide-react';
import { STATUS_LIST, type StatusAduan } from '@/lib/types';

export function StatusBadge({ status }: { status: StatusAduan }) {
  if (status === 'Selesai') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap shrink-0">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
        <span>Selesai</span>
      </span>
    );
  }

  if (status === 'Dalam Tindakan') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 whitespace-nowrap shrink-0">
        <Clock className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden="true" />
        <span>Dalam Tindakan</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0">
      <Inbox className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden="true" />
      <span>Baru</span>
    </span>
  );
}

interface StatusSelectProps {
  value: StatusAduan;
  disabled?: boolean;
  onChange: (nextStatus: StatusAduan) => void;
}

export function StatusSelect({ value, disabled, onChange }: StatusSelectProps) {
  const toneClass =
    value === 'Selesai'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 focus:border-emerald-500 focus:ring-emerald-500/20'
      : value === 'Dalam Tindakan'
        ? 'border-blue-200 bg-blue-50 text-blue-800 focus:border-blue-500 focus:ring-blue-500/20'
        : 'border-slate-200 bg-white text-slate-800 focus:border-blue-600 focus:ring-blue-600/20';

  return (
    <select
      aria-label="Tukar status aduan"
      value={value}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as StatusAduan)}
      className={`h-8 rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      {STATUS_LIST.map((st) => (
        <option key={st} value={st} className="bg-white text-slate-900">
          {st}
        </option>
      ))}
    </select>
  );
}
