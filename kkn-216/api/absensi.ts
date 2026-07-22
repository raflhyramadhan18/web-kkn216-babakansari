import type { VercelRequest, VercelResponse } from '@vercel/node';

/* ────────────────────────────────────────
   Helper: get WIB time from UTC
──────────────────────────────────────── */
function getWIB(): Date {
  const now = new Date();
  return new Date(now.getTime() + 7 * 3600 * 1000);
}

function isWindowOpen(wib: Date): boolean {
  const h = wib.getUTCHours();
  const m = wib.getUTCMinutes();
  const t = h * 60 + m;
  return t >= 6 * 60 && t < 7 * 60; // 06:00–07:00 WIB
}

function isKKNPeriod(wib: Date): boolean {
  const start = new Date('2026-07-21T00:00:00Z'); // UTC midnight
  const end   = new Date('2026-08-25T17:00:00Z'); // 25 Aug 23:59 WIB = 16:59 UTC
  return wib >= start && wib <= end;
}

/* ────────────────────────────────────────
   POST /api/absensi
──────────────────────────────────────── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { nama, nim, tanggal, waktu, hariKe } = req.body as {
    nama: string; nim: string; tanggal: string; waktu: string; hariKe: number;
  };

  if (!nama || !nim) {
    return res.status(400).json({ success: false, message: 'Nama dan NIM wajib diisi' });
  }

  const wib = getWIB();

  // Period check
  if (!isKKNPeriod(wib)) {
    return res.status(400).json({ success: false, message: 'Di luar periode KKN (21 Jul – 25 Agt 2026)' });
  }

  // Time window check
  if (!isWindowOpen(wib)) {
    return res.status(400).json({
      success: false,
      message: `Absensi hanya dibuka pukul 06:00–07:00 WIB. Sekarang ${wib.getUTCHours() + 7}:${String(wib.getUTCMinutes()).padStart(2,'0')} WIB`,
    });
  }

  // Forward to Google Apps Script (which handles duplicate check & Sheet write)
  const gasUrl = process.env.GAS_URL;
  if (!gasUrl) {
    // If GAS_URL not configured, return success so UI works in dev/testing
    console.warn('GAS_URL not set — absensi not written to Sheets');
    return res.status(200).json({ success: true, message: 'Absensi diterima (mode dev)' });
  }

  try {
    const gasRes = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, nim, tanggal, waktu, hariKe }),
    });

    const gasData = await gasRes.json() as { success: boolean; message: string; code?: string };

    if (!gasData.success) {
      return res.status(400).json({ ...gasData });
    }

    return res.status(200).json({ success: true, message: 'Absensi berhasil dicatat!' });
  } catch (err) {
    console.error('GAS error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghubungi server pencatat. Coba lagi.' });
  }
}
