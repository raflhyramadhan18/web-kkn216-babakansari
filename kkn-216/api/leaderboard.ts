import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const gasUrl = process.env.GAS_URL;
  if (!gasUrl) {
    return res.status(200).json([]);
  }

  try {
    const fetchRes = await fetch(`${gasUrl}?action=leaderboard`);
    const data = await fetchRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('GAS Leaderboard Error:', err);
    return res.status(500).json([]);
  }
}
