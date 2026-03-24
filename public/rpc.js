// api/rpc.js — Vercel serverless function
// Proxies Solana RPC requests from the browser, bypassing CORS
// Uses Helius free tier (100k req/mo, no credit card)
// Set HELIUS_KEY env var in Vercel dashboard

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.HELIUS_KEY;
  if (!key) return res.status(500).json({ error: 'HELIUS_KEY not set' });

  try {
    const upstream = await fetch(
      `https://mainnet.helius-rpc.com/?api-key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
}
