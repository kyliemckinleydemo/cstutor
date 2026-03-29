import { kv } from "./_kv.js";

const MODEL = "claude-sonnet-4-6";
const RATE_LIMIT = 20; // requests per minute per IP

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Rate limit per IP
  try {
    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    const bucket = Math.floor(Date.now() / 60000);
    const count = await kv("INCR", `rl:${ip}:${bucket}`);
    if (count === 1) await kv("EXPIRE", `rl:${ip}:${bucket}`, 60);
    if (count > RATE_LIMIT) return res.status(429).json({ error: "Rate limit exceeded" });
  } catch {}

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ ...req.body, model: MODEL }),
  });

  const data = await upstream.json();
  res.status(upstream.status).json(data);
}
