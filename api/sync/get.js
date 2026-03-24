import { kv } from "../_kv.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { sessionToken, courseId } = req.body;
  if (!sessionToken) return res.status(400).json({ error: "Missing token" });

  const email = await kv("GET", `session:${sessionToken}`);
  if (!email) return res.status(401).json({ error: "Session expired" });

  const raw = await kv("GET", `user:${email}:${courseId}`);
  const data = raw ? JSON.parse(raw) : null;
  res.json({ email, data });
}
