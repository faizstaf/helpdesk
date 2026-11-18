export type TahapKeutamaan = 'Rendah' | 'Sederhana' | 'Kritikal';

export type StatusAduan = 'Baru' | 'Dalam Tindakan' | 'Selesai';

export type KategoriKerosakan =
  | 'Penyaman Udara'
  | 'Lampu & Elektrik'
  | 'Rangkaian & Wi-Fi'
  | 'Paip & Sanitari'
  | 'Perabot & Struktur';

export interface Aduan {
  id: string;
  pengadu: string;
  peranan_pengadu: 'Pelajar' | 'Staf';
  lokasi: string;
  kategori_kerosakan: KategoriKerosakan;
  tahap_keutamaan: TahapKeutamaan;
  status: StatusAduan;
  penerangan: string;
  tarikh_lapor: string;
  dikemaskini_pada: string;
}

export interface CreateAduanPayload {
  pengadu: string;
  peranan_pengadu: 'Pelajar' | 'Staf';
  lokasi: string;
  kategori_kerosakan: KategoriKerosakan;
  tahap_keutamaan: TahapKeutamaan;
  penerangan: string;
}

export interface UpdateAduanPayload {
  status?: StatusAduan;
  tahap_keutamaan?: TahapKeutamaan;
  lokasi?: string;
  kategori_kerosakan?: KategoriKerosakan;
  penerangan?: string;
}

export const KATEGORI_LIST: KategoriKerosakan[] = [
  'Penyaman Udara',
  'Lampu & Elektrik',
  'Rangkaian & Wi-Fi',
  'Paip & Sanitari',
  'Perabot & Struktur',
];

export const KEUTAMAAN_LIST: TahapKeutamaan[] = [
  'Kritikal',
  'Sederhana',
  'Rendah',
];

export const STATUS_LIST: StatusAduan[] = [
  'Baru',
  'Dalam Tindakan',
  'Selesai',
];

export const CADANGAN_LOKASI: string[] = [
  'Bangunan FTMK · Makmal AI-2',
  'Dewan Kuliah Utama · DK-1',
  'Perpustakaan Laman Hikmah · Aras 2',
  'Kolej Kediaman Lestari · Bilik B-304',
  'Bangunan FKE · Makmal Kawalan',
  'Pusat Pelajar · Ruang Aktiviti 1',
  'Bangunan Canselori · Bilik Mesyuarat Utama',
  'Dewan Seminar Kejuruteraan · DS-3',
];
