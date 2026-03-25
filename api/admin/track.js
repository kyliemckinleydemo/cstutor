import { kv } from "../_kv.js";

const MAX_EVENTS = 50000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { sessionToken, courseId, topic, pct, weakAreas, strongAreas } = req.body;
  if (!sessionToken || !courseId || !topic) return res.status(400).json({ error: "Missing fields" });

  const email = await kv("GET", `session:${sessionToken}`);
  if (!email) return res.status(401).json({ error: "Session expired" });

  const event = JSON.stringify({
    topic,
    pct: pct ?? null,
    weakAreas: weakAreas || [],
    strongAreas: strongAreas || [],
    ts: Date.now(),
    uid: email,
  });

  await kv("RPUSH", `analytics:${courseId}`, event);
  await kv("LTRIM", `analytics:${courseId}`, -MAX_EVENTS, -1);

  res.json({ ok: true });
}
