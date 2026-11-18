'use client';

import { useMemo } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import type { Aduan } from '@/lib/types';

interface LocationSummaryViewProps {
  aduanList: Aduan[];
  onSelectLocation: (buildingName: string) => void;
}

export function LocationSummaryView({
  aduanList,
  onSelectLocation,
}: LocationSummaryViewProps) {
  const grouped = useMemo(() => {
    const map = new Map<
      string,
      {
        bangunan: string;
        jumlah: number;
        terbuka: number;
        selesai: number;
        kritikal: number;
        bilikList: string[];
      }
    >();

    for (const item of aduanList) {
      const parts = item.lokasi.split('·');
      const bangunan = parts[0]?.trim() || item.lokasi;
      const bilik = parts[1]?.trim() || item.lokasi;

      const current = map.get(bangunan) ?? {
        bangunan,
        jumlah: 0,
        terbuka: 0,
        selesai: 0,
        kritikal: 0,
        bilikList: [],
      };

      current.jumlah += 1;
      if (item.status === 'Selesai') {
        current.selesai += 1;
      } else {
        current.terbuka += 1;
        if (item.tahap_keutamaan === 'Kritikal') {
          current.kritikal += 1;
        }
      }

      if (!current.bilikList.includes(bilik)) {
        current.bilikList.push(bilik);
      }

      map.set(bangunan, current);
    }

    return Array.from(map.values()).sort((a, b) => {
      if (b.kritikal !== a.kritikal) return b.kritikal - a.kritikal;
      return b.terbuka - a.terbuka;
    });
  }, [aduanList]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Ringkasan Kerosakan Mengikut Bangunan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Klik mana-mana bangunan untuk menapis senarai aduan berdasarkan lokasi tersebut.
        </p>
      </div>

      {grouped.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          Tiada rekod lokasi untuk dipaparkan.
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {grouped.map((row) => (
            <button
              key={row.bangunan}
              type="button"
              onClick={() => onSelectLocation(row.bangunan)}
              className="flex w-full flex-col gap-3 px-6 py-4 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate font-semibold text-slate-900">
                    {row.bangunan}
                  </span>
                  {row.kritikal > 0 && (
                    <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 tabular-nums whitespace-nowrap shrink-0">
                      {row.kritikal} Kritikal
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-500">
                  Bilik terlibat: {row.bilikList.join(' · ')}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-4 text-xs tabular-nums">
                  <span className="text-slate-600">
                    Terbuka: <strong className="font-semibold text-blue-700">{row.terbuka}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">
                    /
                  </span>
                  <span className="text-slate-600">
                    Selesai: <strong className="font-semibold text-emerald-700">{row.selesai}</strong>
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
