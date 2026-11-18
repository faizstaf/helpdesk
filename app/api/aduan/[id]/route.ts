import { NextRequest, NextResponse } from 'next/server';
import { deleteAduan, updateAduan } from '@/lib/aduan-store';
import {
  KATEGORI_LIST,
  KEUTAMAAN_LIST,
  STATUS_LIST,
  type KategoriKerosakan,
  type StatusAduan,
  type TahapKeutamaan,
} from '@/lib/types';

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    if (body.status !== undefined && !STATUS_LIST.includes(body.status as StatusAduan)) {
      return NextResponse.json(
        { error: 'Status aduan tidak sah.' },
        { status: 400 }
      );
    }

    if (
      body.tahap_keutamaan !== undefined &&
      !KEUTAMAAN_LIST.includes(body.tahap_keutamaan as TahapKeutamaan)
    ) {
      return NextResponse.json(
        { error: 'Tahap keutamaan tidak sah.' },
        { status: 400 }
      );
    }

    if (
      body.kategori_kerosakan !== undefined &&
      !KATEGORI_LIST.includes(body.kategori_kerosakan as KategoriKerosakan)
    ) {
      return NextResponse.json(
        { error: 'Kategori kerosakan tidak sah.' },
        { status: 400 }
      );
    }

    const updated = await updateAduan(id, {
      status: body.status,
      tahap_keutamaan: body.tahap_keutamaan,
      lokasi: body.lokasi,
      kategori_kerosakan: body.kategori_kerosakan,
      penerangan: body.penerangan,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Rekod aduan tidak dijumpai.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/aduan/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal mengemas kini rekod aduan.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const deleted = await deleteAduan(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Rekod aduan tidak dijumpai.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/aduan/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal memadam rekod aduan.' },
      { status: 500 }
    );
  }
}
