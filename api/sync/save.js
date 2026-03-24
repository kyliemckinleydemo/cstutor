import { kv } from "../_kv.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { sessionToken, courseId, data } = req.body;
  if (!sessionToken) return res.status(400).json({ error: "Missing token" });

  const email = await kv("GET", `session:${sessionToken}`);
  if (!email) return res.status(401).json({ error: "Session expired" });

  await kv("SET", `user:${email}:${courseId}`, JSON.stringify(data));
  res.json({ ok: true });
}
