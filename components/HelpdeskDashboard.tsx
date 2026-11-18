'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  KATEGORI_LIST,
  KEUTAMAAN_LIST,
  STATUS_LIST,
  type Aduan,
  type KategoriKerosakan,
  type StatusAduan,
  type TahapKeutamaan,
} from '@/lib/types';
import { AduanDetailDrawer } from './AduanDetailDrawer';
import { LocationSummaryView } from './LocationSummaryView';
import { NewAduanModal } from './NewAduanModal';
import { PriorityBadge } from './PriorityBadge';
import { StatsCards } from './StatsCards';
import { StatusSelect } from './StatusControl';

type NavTab = 'semua' | 'terbuka' | 'selesai' | 'lokasi';
type SortMode = 'keutamaan' | 'terkini' | 'id';

const PRIORITY_WEIGHT: Record<TahapKeutamaan, number> = {
  Kritikal: 3,
  Sederhana: 2,
  Rendah: 1,
};

interface HelpdeskDashboardProps {
  initialAduan: Aduan[];
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;
  const lower = text.toLowerCase();
  const qLower = trimmed.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + trimmed.length);
  const after = text.slice(idx + trimmed.length);

  return (
    <>
      {before}
      <mark className="rounded bg-blue-100 px-0.5 text-blue-900">{match}</mark>
      {after}
    </>
  );
}

export function HelpdeskDashboard({ initialAduan }: HelpdeskDashboardProps) {
  const [aduanList, setAduanList] = useState<Aduan[]>(initialAduan);
  const [activeTab, setActiveTab] = useState<NavTab>('semua');
  const [lokasiQuery, setLokasiQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusAduan | 'Semua'>('Semua');
  const [keutamaanFilter, setKeutamaanFilter] = useState<TahapKeutamaan | 'Semua'>('Semua');
  const [kategoriFilter, setKategoriFilter] = useState<KategoriKerosakan | 'Semua'>('Semua');
  const [sortMode, setSortMode] = useState<SortMode>('keutamaan');

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAduanId, setSelectedAduanId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const selectedAduan = useMemo(
    () => aduanList.find((item) => item.id === selectedAduanId) ?? null,
    [aduanList, selectedAduanId]
  );

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'semua') {
      setStatusFilter('Semua');
    } else if (tab === 'terbuka') {
      setStatusFilter('Semua');
    } else if (tab === 'selesai') {
      setStatusFilter('Selesai');
    }
  };

  const filteredList = useMemo(() => {
    const q = lokasiQuery.trim().toLowerCase();

    const matched = aduanList.filter((item) => {
      if (activeTab === 'terbuka' && item.status === 'Selesai') {
        return false;
      }
      if (activeTab === 'selesai' && item.status !== 'Selesai') {
        return false;
      }
      if (statusFilter !== 'Semua' && item.status !== statusFilter) {
        return false;
      }
      if (
        keutamaanFilter !== 'Semua' &&
        item.tahap_keutamaan !== keutamaanFilter
      ) {
        return false;
      }
      if (
        kategoriFilter !== 'Semua' &&
        item.kategori_kerosakan !== kategoriFilter
      ) {
        return false;
      }
      if (q && !item.lokasi.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    return [...matched].sort((a, b) => {
      if (sortMode === 'keutamaan') {
        const diff =
          PRIORITY_WEIGHT[b.tahap_keutamaan] -
          PRIORITY_WEIGHT[a.tahap_keutamaan];
        if (diff !== 0) return diff;
        return (
          new Date(b.tarikh_lapor).getTime() -
          new Date(a.tarikh_lapor).getTime()
        );
      }
      if (sortMode === 'terkini') {
        return (
          new Date(b.tarikh_lapor).getTime() -
          new Date(a.tarikh_lapor).getTime()
        );
      }
      return a.id.localeCompare(b.id);
    });
  }, [
    aduanList,
    activeTab,
    lokasiQuery,
    statusFilter,
    keutamaanFilter,
    kategoriFilter,
    sortMode,
  ]);

  const hasActiveFilters =
    lokasiQuery.trim().length > 0 ||
    statusFilter !== 'Semua' ||
    keutamaanFilter !== 'Semua' ||
    kategoriFilter !== 'Semua' ||
    activeTab === 'terbuka' ||
    activeTab === 'selesai';

  const resetFilters = () => {
    setLokasiQuery('');
    setStatusFilter('Semua');
    setKeutamaanFilter('Semua');
    setKategoriFilter('Semua');
    setActiveTab('semua');
  };

  const handleCreated = (created: Aduan) => {
    setAduanList((prev) => [created, ...prev]);
    setErrorBanner(null);
    if (activeTab === 'selesai' || activeTab === 'lokasi') {
      setActiveTab('semua');
      setStatusFilter('Semua');
    }
  };

  const handleUpdateAduan = async (
    id: string,
    patch: { status?: StatusAduan; tahap_keutamaan?: TahapKeutamaan }
  ) => {
    setErrorBanner(null);
    setUpdatingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/aduan/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorBanner(json.error || 'Gagal mengemas kini status aduan.');
        return;
      }
      const updated = json.data as Aduan;
      setAduanList((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch {
      setErrorBanner('Ralat sambungan semasa mengemas kini aduan.');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteAduan = async (id: string) => {
    setErrorBanner(null);
    setUpdatingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/aduan/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const json = await res.json();
        setErrorBanner(json.error || 'Gagal memadam rekod aduan.');
        return;
      }
      setAduanList((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setErrorBanner('Ralat sambungan semasa memadam rekod.');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4 single-line nav links) - Zone 3 (1 primary CTA) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          <a
            href="#atas"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('semua');
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            AduanFasiliti
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-6 md:flex"
          >
            <button
              type="button"
              onClick={() => handleNavClick('semua')}
              className={`border-b-2 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'semua'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Aduan
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('terbuka')}
              className={`border-b-2 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'terbuka'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Aduan Terbuka
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('selesai')}
              className={`border-b-2 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'selesai'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Telah Selesai
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('lokasi')}
              className={`border-b-2 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'lokasi'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Ringkasan Lokasi
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Lapor Kerosakan</span>
            </button>
          </div>
        </div>
      </header>

      <main
        id="atas"
        className="mx-auto max-w-[1440px] space-y-6 px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Page Heading */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
              Pusat Aduan Kerosakan Fasiliti
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Pantau dan urus laporan kerosakan penyaman udara, lampu, Wi-Fi serta fasiliti bangunan oleh pelajar dan staf.
            </p>
          </div>

          {/* Mobile View Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-slate-200/70 p-1 md:hidden">
            {(
              [
                { key: 'semua', label: 'Semua' },
                { key: 'terbuka', label: 'Terbuka' },
                { key: 'selesai', label: 'Selesai' },
                { key: 'lokasi', label: 'Lokasi' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === item.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {errorBanner && (
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{errorBanner}</span>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              aria-label="Tutup amaran"
              className="rounded-md p-1 text-red-600 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Automatic Statistics Cards */}
        <StatsCards aduanList={aduanList} />

        {activeTab === 'lokasi' ? (
          <LocationSummaryView
            aduanList={aduanList}
            onSelectLocation={(buildingName) => {
              setLokasiQuery(buildingName);
              setActiveTab('semua');
              setStatusFilter('Semua');
            }}
          />
        ) : (
          <section
            aria-label="Senarai aduan kerosakan fasiliti"
            className="rounded-xl border border-slate-200 bg-white"
          >
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search by location or room name */}
                <div className="relative flex-1 lg:max-w-md">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    aria-label="Cari mengikut nama lokasi bangunan atau bilik"
                    value={lokasiQuery}
                    onChange={(e) => setLokasiQuery(e.target.value)}
                    placeholder="Cari nama lokasi bangunan atau bilik (cth. FTMK, Makmal AI-2, DK-1)..."
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-9 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  {lokasiQuery && (
                    <button
                      type="button"
                      onClick={() => setLokasiQuery('')}
                      aria-label="Kosongkan carian lokasi"
                      className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters & Sort */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    aria-label="Tapis mengikut tahap keutamaan"
                    value={keutamaanFilter}
                    onChange={(e) =>
                      setKeutamaanFilter(
                        e.target.value as TahapKeutamaan | 'Semua'
                      )
                    }
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Semua">Semua Keutamaan</option>
                    {KEUTAMAAN_LIST.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Keutamaan: {lvl}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Tapis mengikut kategori kerosakan"
                    value={kategoriFilter}
                    onChange={(e) =>
                      setKategoriFilter(
                        e.target.value as KategoriKerosakan | 'Semua'
                      )
                    }
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="Semua">Semua Kategori</option>
                    {KATEGORI_LIST.map((kat) => (
                      <option key={kat} value={kat}>
                        {kat}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex items-center">
                    <ArrowUpDown
                      className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400"
                      aria-hidden="true"
                    />
                    <select
                      aria-label="Susun senarai aduan"
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as SortMode)}
                      className="h-10 rounded-lg border border-slate-300 bg-white pr-3 pl-8 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    >
                      <option value="keutamaan">Susun: Keutamaan Tertinggi</option>
                      <option value="terkini">Susun: Terkini</option>
                      <option value="id">Susun: ID Rekod</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status segmented controls & active match count */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="Tapis status aduan"
                  className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
                >
                  {(['Semua', ...STATUS_LIST] as const).map((st) => {
                    const active =
                      activeTab === 'terbuka' && st === 'Semua'
                        ? false
                        : activeTab === 'selesai' && st === 'Selesai'
                          ? true
                          : statusFilter === st && activeTab === 'semua';

                    return (
                      <button
                        key={st}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                          setActiveTab('semua');
                          setStatusFilter(st);
                        }}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
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

                <div className="flex items-center gap-3 text-xs text-slate-500 tabular-nums">
                  <span>
                    Menunjukkan <strong className="font-semibold text-slate-900">{filteredList.length}</strong> daripada {aduanList.length} rekod
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Set Semula
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredList.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <MapPin
                  className="mx-auto h-8 w-8 text-slate-300"
                  aria-hidden="true"
                />
                <h2 className="mt-3 text-base font-semibold text-slate-900">
                  Tiada aduan dijumpai
                </h2>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  {lokasiQuery.trim()
                    ? `Tiada rekod kerosakan yang sepadan dengan carian lokasi "${lokasiQuery.trim()}".`
                    : 'Tiada rekod kerosakan yang sepadan dengan penapis yang dipilih.'}
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="h-9 rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Set Semula Penapis
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsNewModalOpen(true)}
                      className="h-9 rounded-lg bg-blue-700 px-4 text-xs font-semibold text-white hover:bg-blue-800"
                    >
                      Lapor Kerosakan Pertama
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop High-Density Data Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500">
                        <th className="px-5 py-3.5 whitespace-nowrap">ID</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Pengadu</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">Lokasi</th>
                        <th className="px-5 py-3.5 whitespace-nowrap">
                          Kategori Kerosakan
                        </th>
                        <th className="px-5 py-3.5 whitespace-nowrap">
                          Tahap Keutamaan
                        </th>
                        <th className="px-5 py-3.5 text-right whitespace-nowrap">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredList.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedAduanId(item.id)}
                          className="cursor-pointer transition-colors hover:bg-slate-50"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                            {item.id}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-slate-900">
                              {item.pengadu}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.peranan_pengadu}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            <HighlightMatch
                              text={item.lokasi}
                              query={lokasiQuery}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                            {item.kategori_kerosakan}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <PriorityBadge keutamaan={item.tahap_keutamaan} />
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <StatusSelect
                              value={item.status}
                              disabled={Boolean(updatingIds[item.id])}
                              onChange={(nextStatus) =>
                                handleUpdateAduan(item.id, {
                                  status: nextStatus,
                                })
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List View */}
                <div className="divide-y divide-slate-200 md:hidden">
                  {filteredList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAduanId(item.id)}
                      className="space-y-3 p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                          {item.id}
                        </span>
                        <PriorityBadge keutamaan={item.tahap_keutamaan} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          <HighlightMatch
                            text={item.lokasi}
                            query={lokasiQuery}
                          />
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.pengadu} ({item.peranan_pengadu}) ·{' '}
                          {item.kategori_kerosakan}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-xs font-medium text-blue-700">
                          Lihat Perincian
                        </span>
                        <StatusSelect
                          value={item.status}
                          disabled={Boolean(updatingIds[item.id])}
                          onChange={(nextStatus) =>
                            handleUpdateAduan(item.id, { status: nextStatus })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <NewAduanModal
        open={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={handleCreated}
      />

      <AduanDetailDrawer
        aduan={selectedAduan}
        onClose={() => setSelectedAduanId(null)}
        onUpdate={handleUpdateAduan}
        onDelete={handleDeleteAduan}
      />
    </div>
  );
}
