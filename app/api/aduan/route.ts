import { NextRequest, NextResponse } from 'next/server';
import { createAduan, getAllAduan } from '@/lib/aduan-store';
import {
  KATEGORI_LIST,
  KEUTAMAAN_LIST,
  type KategoriKerosakan,
  type TahapKeutamaan,
} from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const lokasiQuery = (searchParams.get('lokasi') || '').trim().toLowerCase();
    const statusFilter = searchParams.get('status');
    const keutamaanFilter = searchParams.get('keutamaan');

    let items = await getAllAduan();

    if (lokasiQuery) {
      items = items.filter((item) =>
        item.lokasi.toLowerCase().includes(lokasiQuery)
      );
    }

    if (statusFilter && statusFilter !== 'Semua') {
      items = items.filter((item) => item.status === statusFilter);
    }

    if (keutamaanFilter && keutamaanFilter !== 'Semua') {
      items = items.filter((item) => item.tahap_keutamaan === keutamaanFilter);
    }

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error('GET /api/aduan error:', error);
    return NextResponse.json(
      { error: 'Gagal memuatkan senarai aduan fasiliti.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pengadu = typeof body.pengadu === 'string' ? body.pengadu.trim() : '';
    const peranan_pengadu =
      body.peranan_pengadu === 'Staf' ? 'Staf' : 'Pelajar';
    const lokasi = typeof body.lokasi === 'string' ? body.lokasi.trim() : '';
    const kategori_kerosakan = body.kategori_kerosakan as KategoriKerosakan;
    const tahap_keutamaan = body.tahap_keutamaan as TahapKeutamaan;
    const penerangan =
      typeof body.penerangan === 'string' ? body.penerangan.trim() : '';

    if (!pengadu || !lokasi) {
      return NextResponse.json(
        { error: 'Nama pengadu dan lokasi bilik atau bangunan diperlukan.' },
        { status: 400 }
      );
    }

    if (!KATEGORI_LIST.includes(kategori_kerosakan)) {
      return NextResponse.json(
        { error: 'Kategori kerosakan tidak sah.' },
        { status: 400 }
      );
    }

    if (!KEUTAMAAN_LIST.includes(tahap_keutamaan)) {
      return NextResponse.json(
        { error: 'Tahap keutamaan tidak sah.' },
        { status: 400 }
      );
    }

    const created = await createAduan({
      pengadu,
      peranan_pengadu,
      lokasi,
      kategori_kerosakan,
      tahap_keutamaan,
      penerangan: penerangan || 'Tiada catatan tambahan.',
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/aduan error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan aduan baharu.' },
      { status: 500 }
    );
  }
}
