import { useMemo } from 'react';
import type { Aduan } from '@/lib/types';

interface StatsCardsProps {
  aduanList: Aduan[];
}

export function StatsCards({ aduanList }: StatsCardsProps) {
  const stats = useMemo(() => {
    const jumlah = aduanList.length;
    const baru = aduanList.filter((a) => a.status === 'Baru').length;
    const dalamTindakan = aduanList.filter(
      (a) => a.status === 'Dalam Tindakan'
    ).length;
    const terbuka = baru + dalamTindakan;
    const selesai = aduanList.filter((a) => a.status === 'Selesai').length;
    const kritikalTerbuka = aduanList.filter(
      (a) => a.tahap_keutamaan === 'Kritikal' && a.status !== 'Selesai'
    ).length;

    const kadarSelesai = jumlah > 0 ? Math.round((selesai / jumlah) * 100) : 0;
    const kadarTerbuka = jumlah > 0 ? Math.round((terbuka / jumlah) * 100) : 0;

    return {
      jumlah,
      baru,
      dalamTindakan,
      terbuka,
      selesai,
      kritikalTerbuka,
      kadarSelesai,
      kadarTerbuka,
    };
  }, [aduanList]);

  return (
    <section aria-label="Statistik aduan kerosakan" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Jumlah Aduan</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <p className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {stats.jumlah}
            </p>
            <span className="text-xs text-slate-500">Keseluruhan rekod</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Aduan Terbuka</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <p className="font-mono text-3xl font-semibold tracking-tight text-blue-700 tabular-nums">
              {stats.terbuka}
            </p>
            <span className="text-xs font-medium text-slate-600 tabular-nums">
              {stats.baru} Baru · {stats.dalamTindakan} Tindakan
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">Telah Selesai</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <p className="font-mono text-3xl font-semibold tracking-tight text-emerald-700 tabular-nums">
              {stats.selesai}
            </p>
            <span className="text-xs font-medium text-emerald-700 tabular-nums">
              {stats.kadarSelesai}% kadar selesai
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium text-slate-500">
            Kes Kritikal Terbuka
          </p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <p
              className={`font-mono text-3xl font-semibold tracking-tight tabular-nums ${
                stats.kritikalTerbuka > 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {stats.kritikalTerbuka}
            </p>
            <span
              className={`text-xs font-medium ${
                stats.kritikalTerbuka > 0 ? 'text-red-600' : 'text-slate-500'
              }`}
            >
              {stats.kritikalTerbuka > 0
                ? 'Perlu tindakan segera'
                : 'Tiada kes kritikal'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Nisbah Aduan Terbuka berbanding Selesai
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="tabular-nums">
              Terbuka: <strong className="font-semibold text-blue-700">{stats.terbuka}</strong> ({stats.kadarTerbuka}%)
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="tabular-nums">
              Selesai: <strong className="font-semibold text-emerald-700">{stats.selesai}</strong> ({stats.kadarSelesai}%)
            </span>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            Dikira secara automatik daripada {stats.jumlah} aduan
          </span>
        </div>

        <div
          className="mt-3 flex h-2.5 w-full overflow-hidden rounded-md bg-slate-100"
          role="progressbar"
          aria-valuenow={stats.kadarSelesai}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Peratus aduan telah selesai berbanding terbuka"
        >
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${stats.kadarSelesai}%` }}
          />
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${stats.kadarTerbuka}%` }}
          />
        </div>
      </div>
    </section>
  );
}
