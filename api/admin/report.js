import { kv } from "../_kv.js";
import { ADMINS } from "../_admins.js";

const COURSE_IDS = ["cosc77", "cosc10", "cosc50", "cosc31"];

function aggregate(events) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekly = events.filter(e => e.ts >= weekAgo);

  const summarize = (evts) => {
    const topics = {};
    const weakMap = {};
    const uids = new Set();

    for (const e of evts) {
      uids.add(e.uid);

      if (!topics[e.topic]) topics[e.topic] = { count: 0, totalPct: 0, lowCount: 0 };
      topics[e.topic].count++;
      if (e.pct != null) {
        topics[e.topic].totalPct += e.pct;
        if (e.pct < 70) topics[e.topic].lowCount++;
      }

      for (const w of (e.weakAreas || [])) {
        if (w) weakMap[w] = (weakMap[w] || 0) + 1;
      }
    }

    const topTopics = Object.entries(topics)
      .map(([topic, s]) => ({
        topic,
        count: s.count,
        avgScore: s.count ? Math.round(s.totalPct / s.count) : null,
        lowCount: s.lowCount,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);

    const topWeakAreas = Object.entries(weakMap)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);

    return {
      sessions: evts.length,
      uniqueStudents: uids.size,
      topTopics,
      topWeakAreas,
    };
  };

  return {
    total: summarize(events),
    weekly: summarize(weekly),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { sessionToken } = req.body;
  if (!sessionToken) return res.status(400).json({ error: "Missing token" });

  const email = await kv("GET", `session:${sessionToken}`);
  if (!email) return res.status(401).json({ error: "Session expired" });
  if (!ADMINS.includes(email.toLowerCase())) return res.status(403).json({ error: "Not authorized" });

  const results = {};
  for (const courseId of COURSE_IDS) {
    const raw = await kv("LRANGE", `analytics:${courseId}`, 0, -1);
    const events = (raw || [])
      .map(e => { try { return JSON.parse(e); } catch { return null; } })
      .filter(Boolean);
    results[courseId] = aggregate(events);
  }

  res.json(results);
}
