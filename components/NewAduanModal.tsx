'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import {
  CADANGAN_LOKASI,
  KATEGORI_LIST,
  KEUTAMAAN_LIST,
  type Aduan,
  type KategoriKerosakan,
  type TahapKeutamaan,
} from '@/lib/types';

interface NewAduanModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (aduan: Aduan) => void;
}

export function NewAduanModal({ open, onClose, onCreated }: NewAduanModalProps) {
  const [pengadu, setPengadu] = useState('');
  const [peranan, setPeranan] = useState<'Pelajar' | 'Staf'>('Pelajar');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState<KategoriKerosakan>('Penyaman Udara');
  const [keutamaan, setKeutamaan] = useState<TahapKeutamaan>('Sederhana');
  const [penerangan, setPenerangan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pengadu.trim() || !lokasi.trim()) {
      setError('Sila lengkapkan nama pengadu serta lokasi bangunan atau bilik.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/aduan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pengadu: pengadu.trim(),
          peranan_pengadu: peranan,
          lokasi: lokasi.trim(),
          kategori_kerosakan: kategori,
          tahap_keutamaan: keutamaan,
          penerangan: penerangan.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal menghantar aduan.');
        return;
      }

      onCreated(json.data as Aduan);
      setPengadu('');
      setPeranan('Pelajar');
      setLokasi('');
      setKategori('Penyaman Udara');
      setKeutamaan('Sederhana');
      setPenerangan('');
      onClose();
    } catch {
      setError('Ralat rangkaian berlaku semasa menghantar aduan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-aduan-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2
                  id="new-aduan-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Lapor Kerosakan Fasiliti
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Isi maklumat kerosakan mengikut lokasi bangunan atau bilik.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup borang"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="pengadu-input"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Nama Pengadu
                  </label>
                  <input
                    id="pengadu-input"
                    type="text"
                    required
                    value={pengadu}
                    onChange={(e) => setPengadu(e.target.value)}
                    placeholder="cth. Amirul Haziq bin Roslan"
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="peranan-select"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Kategori Pengadu
                  </label>
                  <select
                    id="peranan-select"
                    value={peranan}
                    onChange={(e) =>
                      setPeranan(e.target.value as 'Pelajar' | 'Staf')
                    }
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Pelajar">Pelajar</option>
                    <option value="Staf">Staf</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="lokasi-input"
                  className="block text-xs font-medium text-slate-700"
                >
                  Lokasi Bangunan & Bilik
                </label>
                <input
                  id="lokasi-input"
                  type="text"
                  required
                  list="cadangan-lokasi-list"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="cth. Bangunan FTMK · Makmal AI-2"
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
                <datalist id="cadangan-lokasi-list">
                  {CADANGAN_LOKASI.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="kategori-select"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Kategori Kerosakan
                  </label>
                  <select
                    id="kategori-select"
                    value={kategori}
                    onChange={(e) =>
                      setKategori(e.target.value as KategoriKerosakan)
                    }
                    className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    {KATEGORI_LIST.map((kat) => (
                      <option key={kat} value={kat}>
                        {kat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-medium text-slate-700">
                    Tahap Keutamaan
                  </span>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 p-1">
                    {KEUTAMAAN_LIST.map((lvl) => {
                      const active = keutamaan === lvl;
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
                          onClick={() => setKeutamaan(lvl)}
                          className={`h-8 rounded-md px-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
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

              <div>
                <label
                  htmlFor="penerangan-input"
                  className="block text-xs font-medium text-slate-700"
                >
                  Penerangan Kerosakan
                </label>
                <textarea
                  id="penerangan-input"
                  rows={3}
                  value={penerangan}
                  onChange={(e) => setPenerangan(e.target.value)}
                  placeholder="Terangkan simptom kerosakan secara ringkas (cth. penyaman udara berbunyi bising dan tidak sejuk)."
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
                >
                  {submitting ? 'Menghantar...' : 'Hantar Aduan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
