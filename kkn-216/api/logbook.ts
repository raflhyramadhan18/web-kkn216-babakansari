import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const gasUrl = process.env.GAS_URL || 'https://script.google.com/macros/s/AKfycbyT7usvE6S-TXxuHV1cCGop-dYrxd10W03Bab57qOWV7IdZuJyv5cIRee5Vm7Z6XEku/exec';
  if (!gasUrl) {
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(200).json({ success: true, message: 'Logbook (Dev Mode)' });
  }

  try {
    if (req.method === 'GET') {
      const fetchRes = await fetch(`${gasUrl}?action=logbook`);
      const data = await fetchRes.json();
      return res.status(200).json(data);
    } 
    
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
      }
      const { nama, nim, tanggal, kegiatan, deskripsi, foto } = body || {};
      const fetchRes = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logbook', nama, nim, tanggal, kegiatan, deskripsi, foto })
      });
      const data = await fetchRes.json();
      return res.status(fetchRes.ok ? 200 : 400).json(data);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('GAS Error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menghubungi server' });
  }
}
