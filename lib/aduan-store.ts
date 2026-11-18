import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from './prisma';
import type {
  Aduan,
  CreateAduanPayload,
  KategoriKerosakan,
  StatusAduan,
  TahapKeutamaan,
  UpdateAduanPayload,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'aduan.json');

const SEED_ADUAN: Aduan[] = [
  {
    id: 'ADU-2026-001',
    pengadu: 'Ahmad Hakim bin Razak',
    peranan_pengadu: 'Pelajar',
    lokasi: 'Bangunan FTMK · Makmal AI-2',
    kategori_kerosakan: 'Penyaman Udara',
    tahap_keutamaan: 'Kritikal',
    status: 'Baru',
    penerangan:
      'Dua unit penyaman udara siling di Makmal AI-2 tidak mengeluarkan udara sejuk dan menitis air berhampiran rak pelayan.',
    tarikh_lapor: '2026-11-18T08:15:00.000Z',
    dikemaskini_pada: '2026-11-18T08:15:00.000Z',
  },
  {
    id: 'ADU-2026-002',
    pengadu: 'Dr. Nurul Huda binti Ismail',
    peranan_pengadu: 'Staf',
    lokasi: 'Dewan Kuliah Utama · DK-1',
    kategori_kerosakan: 'Rangkaian & Wi-Fi',
    tahap_keutamaan: 'Kritikal',
    status: 'Dalam Tindakan',
    penerangan:
      'Titik akses Wi-Fi kampus di Dewan Kuliah 1 terputus-putus menyebabkan sistem kehadiran dan projektor tanpa wayar gagal disambung.',
    tarikh_lapor: '2026-11-18T07:40:00.000Z',
    dikemaskini_pada: '2026-11-18T09:10:00.000Z',
  },
  {
    id: 'ADU-2026-003',
    pengadu: 'Siti Aisyah binti Mansor',
    peranan_pengadu: 'Pelajar',
    lokasi: 'Perpustakaan Laman Hikmah · Aras 2 (Zon Senyap)',
    kategori_kerosakan: 'Lampu & Elektrik',
    tahap_keutamaan: 'Sederhana',
    status: 'Baru',
    penerangan:
      'Empat batang lampu LED di baris meja bacaan timur berkelip dan terpadam sepenuhnya sejak semalam.',
    tarikh_lapor: '2026-11-17T16:25:00.000Z',
    dikemaskini_pada: '2026-11-17T16:25:00.000Z',
  },
  {
    id: 'ADU-2026-004',
    pengadu: 'Muhammad Arif bin Zulkifli',
    peranan_pengadu: 'Pelajar',
    lokasi: 'Kolej Kediaman Lestari · Bilik B-304',
    kategori_kerosakan: 'Paip & Sanitari',
    tahap_keutamaan: 'Sederhana',
    status: 'Dalam Tindakan',
    penerangan:
      'Paip sinki bilik air aras 3 Blok B mengalami kebocoran perlahan pada injap penutup utama.',
    tarikh_lapor: '2026-11-17T11:05:00.000Z',
    dikemaskini_pada: '2026-11-18T08:30:00.000Z',
  },
  {
    id: 'ADU-2026-005',
    pengadu: 'Ir. Tan Wei Ming',
    peranan_pengadu: 'Staf',
    lokasi: 'Bangunan FKE · Makmal Kawalan & Automasi',
    kategori_kerosakan: 'Lampu & Elektrik',
    tahap_keutamaan: 'Kritikal',
    status: 'Dalam Tindakan',
    penerangan:
      'Soket kuasa 3-fasa di meja ujian No. 4 mengalami tripping pemutus litar (MCB) apabila peralatan dihidupkan.',
    tarikh_lapor: '2026-11-17T09:50:00.000Z',
    dikemaskini_pada: '2026-11-17T14:20:00.000Z',
  },
  {
    id: 'ADU-2026-006',
    pengadu: 'Nurul Ain binti Azman',
    peranan_pengadu: 'Pelajar',
    lokasi: 'Pusat Pelajar · Ruang Aktiviti 1',
    kategori_kerosakan: 'Perabot & Struktur',
    tahap_keutamaan: 'Rendah',
    status: 'Selesai',
    penerangan:
      'Engsel pintu utama Ruang Aktiviti 1 longgar dan berbunyi kuat ketika dibuka.',
    tarikh_lapor: '2026-11-15T14:00:00.000Z',
    dikemaskini_pada: '2026-11-16T15:45:00.000Z',
  },
  {
    id: 'ADU-2026-007',
    pengadu: 'Mohd Faizal bin Hashim',
    peranan_pengadu: 'Staf',
    lokasi: 'Bangunan Canselori · Bilik Mesyuarat Utama',
    kategori_kerosakan: 'Penyaman Udara',
    tahap_keutamaan: 'Sederhana',
    status: 'Selesai',
    penerangan:
      'Suhu bilik tidak stabil dan alat kawalan jauh penyaman udara gagal bertindak balas.',
    tarikh_lapor: '2026-11-14T10:20:00.000Z',
    dikemaskini_pada: '2026-11-15T11:30:00.000Z',
  },
  {
    id: 'ADU-2026-008',
    pengadu: 'Kavitha a/p Subramaniam',
    peranan_pengadu: 'Pelajar',
    lokasi: 'Dewan Seminar Kejuruteraan · Bilik DS-3',
    kategori_kerosakan: 'Rangkaian & Wi-Fi',
    tahap_keutamaan: 'Sederhana',
    status: 'Selesai',
    penerangan:
      'Port LAN di podium pensyarah tiada sambungan internet untuk pembentangan projek tahun akhir.',
    tarikh_lapor: '2026-11-13T08:45:00.000Z',
    dikemaskini_pada: '2026-11-14T16:10:00.000Z',
  },
  {
    id: 'ADU-2026-009',
    pengadu: 'Hafizuddin bin Omar',
    peranan_pengadu: 'Staf',
    lokasi: 'Bangunan FTMK · Bilik Tutorial T-08',
    kategori_kerosakan: 'Perabot & Struktur',
    tahap_keutamaan: 'Rendah',
    status: 'Baru',
    penerangan:
      'Tiga buah kerusi pelajar mempunyai skru sandaran yang longgar dan papan putih sedikit tercalar.',
    tarikh_lapor: '2026-11-16T13:10:00.000Z',
    dikemaskini_pada: '2026-11-16T13:10:00.000Z',
  },
  {
    id: 'ADU-2026-010',
    pengadu: 'Farah Nadia binti Kamal',
    peranan_pengadu: 'Pelajar',
    lokasi: 'Kolej Kediaman Satria · Aras 1 Blok Tuah',
    kategori_kerosakan: 'Lampu & Elektrik',
    tahap_keutamaan: 'Rendah',
    status: 'Selesai',
    penerangan:
      'Lampu koridor berhampiran tangga kecemasan terbakar dan perlu diganti.',
    tarikh_lapor: '2026-11-12T19:30:00.000Z',
    dikemaskini_pada: '2026-11-13T10:15:00.000Z',
  },
];

function isConfiguredPostgresUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (
    !trimmed.startsWith('postgresql://') &&
    !trimmed.startsWith('postgres://')
  ) {
    return false;
  }
  if (trimmed.includes('USER:PASSWORD@HOST')) {
    return false;
  }
  return true;
}

const hasDatabaseUrl = isConfiguredPostgresUrl(process.env.DATABASE_URL);

function mapDbRecord(record: {
  id: string;
  pengadu: string;
  peranan_pengadu: string;
  lokasi: string;
  kategori_kerosakan: string;
  tahap_keutamaan: string;
  status: string;
  penerangan: string;
  tarikh_lapor: Date;
  dikemaskini_pada: Date;
}): Aduan {
  return {
    id: record.id,
    pengadu: record.pengadu,
    peranan_pengadu: record.peranan_pengadu === 'Staf' ? 'Staf' : 'Pelajar',
    lokasi: record.lokasi,
    kategori_kerosakan: record.kategori_kerosakan as KategoriKerosakan,
    tahap_keutamaan: record.tahap_keutamaan as TahapKeutamaan,
    status: record.status as StatusAduan,
    penerangan: record.penerangan,
    tarikh_lapor: record.tarikh_lapor.toISOString(),
    dikemaskini_pada: record.dikemaskini_pada.toISOString(),
  };
}

// Global in-memory fallback when DATABASE_URL is not configured or schema is not pushed yet
const globalForAduan = globalThis as typeof globalThis & {
  __aduanMemoryStore?: Aduan[];
};

async function ensureStore(): Promise<Aduan[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Aduan[];
    globalForAduan.__aduanMemoryStore = parsed;
    return parsed;
  } catch {
    if (!globalForAduan.__aduanMemoryStore) {
      globalForAduan.__aduanMemoryStore = [...SEED_ADUAN];
    }
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(
        DATA_FILE,
        JSON.stringify(globalForAduan.__aduanMemoryStore, null, 2),
        'utf-8'
      );
    } catch {
      // Ignore write error in read-only environments; memory store remains active
    }
    return globalForAduan.__aduanMemoryStore;
  }
}

async function persistStore(items: Aduan[]): Promise<void> {
  globalForAduan.__aduanMemoryStore = items;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch {
    // Fallback gracefully to in-memory store
  }
}

function nextTicketId(existingIds: string[]): string {
  const maxNumber = existingIds.reduce((max, id) => {
    const match = id.match(/ADU-\d+-(\d+)/);
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  return `ADU-2026-${String(maxNumber + 1).padStart(3, '0')}`;
}

export async function getAllAduan(): Promise<Aduan[]> {
  if (hasDatabaseUrl) {
    try {
      const rows = await prisma.aduan.findMany({
        orderBy: { tarikh_lapor: 'desc' },
      });
      return rows.map(mapDbRecord);
    } catch {
      // Fallback if table is not pushed yet or DB is unreachable in preview
    }
  }

  const items = await ensureStore();
  return [...items];
}

export async function createAduan(payload: CreateAduanPayload): Promise<Aduan> {
  if (hasDatabaseUrl) {
    try {
      const existing = await prisma.aduan.findMany({ select: { id: true } });
      const id = nextTicketId(existing.map((r) => r.id));

      const created = await prisma.aduan.create({
        data: {
          id,
          pengadu: payload.pengadu.trim(),
          peranan_pengadu: payload.peranan_pengadu,
          lokasi: payload.lokasi.trim(),
          kategori_kerosakan: payload.kategori_kerosakan,
          tahap_keutamaan: payload.tahap_keutamaan,
          status: 'Baru',
          penerangan: payload.penerangan.trim(),
        },
      });
      return mapDbRecord(created);
    } catch {
      // Fallback if table is not pushed yet or DB is unreachable in preview
    }
  }

  const items = await ensureStore();
  const nextId = nextTicketId(items.map((item) => item.id));
  const now = new Date().toISOString();

  const newAduan: Aduan = {
    id: nextId,
    pengadu: payload.pengadu.trim(),
    peranan_pengadu: payload.peranan_pengadu,
    lokasi: payload.lokasi.trim(),
    kategori_kerosakan: payload.kategori_kerosakan,
    tahap_keutamaan: payload.tahap_keutamaan,
    status: 'Baru',
    penerangan: payload.penerangan.trim(),
    tarikh_lapor: now,
    dikemaskini_pada: now,
  };

  const updated = [newAduan, ...items];
  await persistStore(updated);
  return newAduan;
}

export async function updateAduan(
  id: string,
  payload: UpdateAduanPayload
): Promise<Aduan | null> {
  if (hasDatabaseUrl) {
    try {
      const existing = await prisma.aduan.findUnique({ where: { id } });
      if (!existing) return null;

      const updated = await prisma.aduan.update({
        where: { id },
        data: {
          ...(payload.status !== undefined ? { status: payload.status } : {}),
          ...(payload.tahap_keutamaan !== undefined
            ? { tahap_keutamaan: payload.tahap_keutamaan }
            : {}),
          ...(payload.lokasi !== undefined
            ? { lokasi: payload.lokasi.trim() }
            : {}),
          ...(payload.kategori_kerosakan !== undefined
            ? { kategori_kerosakan: payload.kategori_kerosakan }
            : {}),
          ...(payload.penerangan !== undefined
            ? { penerangan: payload.penerangan.trim() }
            : {}),
        },
      });
      return mapDbRecord(updated);
    } catch {
      // Fallback if table is not pushed yet or DB is unreachable in preview
    }
  }

  const items = await ensureStore();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const existing = items[idx];
  const updatedItem: Aduan = {
    ...existing,
    ...(payload.status !== undefined ? { status: payload.status } : {}),
    ...(payload.tahap_keutamaan !== undefined
      ? { tahap_keutamaan: payload.tahap_keutamaan }
      : {}),
    ...(payload.lokasi !== undefined ? { lokasi: payload.lokasi.trim() } : {}),
    ...(payload.kategori_kerosakan !== undefined
      ? { kategori_kerosakan: payload.kategori_kerosakan }
      : {}),
    ...(payload.penerangan !== undefined
      ? { penerangan: payload.penerangan.trim() }
      : {}),
    dikemaskini_pada: new Date().toISOString(),
  };

  const nextItems = [...items];
  nextItems[idx] = updatedItem;
  await persistStore(nextItems);
  return updatedItem;
}

export async function deleteAduan(id: string): Promise<boolean> {
  if (hasDatabaseUrl) {
    try {
      const existing = await prisma.aduan.findUnique({ where: { id } });
      if (!existing) return false;
      await prisma.aduan.delete({ where: { id } });
      return true;
    } catch {
      // Fallback if table is not pushed yet or DB is unreachable in preview
    }
  }

  const items = await ensureStore();
  const nextItems = items.filter((item) => item.id !== id);
  if (nextItems.length === items.length) return false;
  await persistStore(nextItems);
  return true;
}
