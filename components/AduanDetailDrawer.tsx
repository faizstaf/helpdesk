'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, MapPin, Trash2, User, Wrench, X } from 'lucide-react';
import {
  KEUTAMAAN_LIST,
  STATUS_LIST,
  type Aduan,
  type StatusAduan,
  type TahapKeutamaan,
} from '@/lib/types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusControl';

interface AduanDetailDrawerProps {
  aduan: Aduan | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    patch: { status?: StatusAduan; tahap_keutamaan?: TahapKeutamaan }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatTarikh(iso: string) {
  try {
    return new Intl.DateTimeFormat('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AduanDetailDrawer({
  aduan,
  onClose,
  onUpdate,
  onDelete,
}: AduanDetailDrawerProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmDelete = Boolean(aduan && confirmDeleteId === aduan.id);

  useEffect(() => {
    if (!aduan) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aduan, onClose]);

  const handleStatusChange = async (status: StatusAduan) => {
    if (!aduan || busy) return;
    setBusy(true);
    try {
      await onUpdate(aduan.id, { status });
    } finally {
      setBusy(false);
    }
  };

  const handlePriorityChange = async (tahap_keutamaan: TahapKeutamaan) => {
    if (!aduan || busy) return;
    setBusy(true);
    try {
      await onUpdate(aduan.id, { tahap_keutamaan });
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!aduan || busy) return;
    setBusy(true);
    try {
      await onDelete(aduan.id);
      setConfirmDeleteId(null);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {aduan && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-aduan-id"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <span
                  id="drawer-aduan-id"
                  className="font-mono text-sm font-semibold text-slate-900 tabular-nums"
                >
                  {aduan.id}
                </span>
                <PriorityBadge keutamaan={aduan.tahap_keutamaan} />
                <StatusBadge status={aduan.status} />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup panel perincian"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {aduan.lokasi}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {aduan.penerangan}
                </p>
              </div>

              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <User className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Pengadu
                  </span>
                  <span className="font-medium text-slate-900">
                    {aduan.pengadu} ({aduan.peranan_pengadu})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Lokasi
                  </span>
                  <span className="text-right font-medium text-slate-900">
                    {aduan.lokasi}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Wrench className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Kategori
                  </span>
                  <span className="font-medium text-slate-900">
                    {aduan.kategori_kerosakan}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Tarikh Lapor
                  </span>
                  <span className="font-mono text-xs text-slate-700 tabular-nums">
                    {formatTarikh(aduan.tarikh_lapor)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="block text-xs font-semibold text-slate-700">
                  Kemas Kini Status Tindakan
                </span>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
                  {STATUS_LIST.map((st) => {
                    const active = aduan.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        disabled={busy}
                        onClick={() => handleStatusChange(st)}
                        className={`h-9 rounded-md px-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <span className="block text-xs font-semibold text-slate-700">
                  Laraskan Tahap Keutamaan
                </span>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1">
                  {KEUTAMAAN_LIST.map((lvl) => {
                    const active = aduan.tahap_keutamaan === lvl;
                    const activeStyle =
                      lvl === 'Kritikal'
                        ? 'bg-red-600 text-white shadow-sm'
                        : lvl === 'Sederhana'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white text-slate-900 shadow-sm';
                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={busy}
                        onClick={() => handlePriorityChange(lvl)}
                        className={`h-9 rounded-md px-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? activeStyle
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              {!confirmDelete ? (
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(aduan.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 whitespace-nowrap shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Padam Rekod
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5">
                  <span className="text-xs font-medium text-red-800">
                    Sahkan pemadaman rekod ini?
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmDeleteId(null)}
                      className="h-8 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleConfirmDelete}
                      className="h-8 rounded-md bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Ya, Padam
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
