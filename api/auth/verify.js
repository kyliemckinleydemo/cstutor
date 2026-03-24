import { randomBytes } from "crypto";
import { kv } from "../_kv.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token" });

  const email = await kv("GET", `magic:${token}`);
  if (!email) return res.status(401).json({ error: "Link is invalid or has expired. Please request a new one." });

  await kv("DEL", `magic:${token}`);

  const sessionToken = randomBytes(32).toString("hex");
  await kv("SET", `session:${sessionToken}`, email, "EX", 31536000); // 1 year

  res.json({ email, sessionToken });
}
