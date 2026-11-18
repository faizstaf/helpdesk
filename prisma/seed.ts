import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_ADUAN = [
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
    tarikh_lapor: new Date('2026-11-18T08:15:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-18T07:40:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-17T16:25:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-17T11:05:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-17T09:50:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-15T14:00:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-14T10:20:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-13T08:45:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-16T13:10:00.000Z'),
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
    tarikh_lapor: new Date('2026-11-12T19:30:00.000Z'),
  },
];

async function main() {
  for (const item of INITIAL_ADUAN) {
    await prisma.aduan.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log(`Seeded ${INITIAL_ADUAN.length} rekod aduan fasiliti.`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
