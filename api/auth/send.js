import { randomBytes } from "crypto";
import { kv } from "../_kv.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email" });

  const token = randomBytes(32).toString("hex");
  await kv("SET", `magic:${token}`, email, "EX", 900); // 15 min TTL

  const host = req.headers.host;
  const proto = host.includes("localhost") ? "http" : "https";
  const loginUrl = `${proto}://${host}?token=${token}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Tutor Agent <onboarding@resend.dev>",
      to: email,
      subject: "Your Tutor Agent sign-in link",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:2rem">
          <div style="margin-bottom:1.5rem">
            <span style="display:inline-flex;align-items:center;gap:6px">
              <span style="width:8px;height:8px;border-radius:50%;background:#00693e;display:inline-block"></span>
              <strong style="font-size:14px">Tutor Agent</strong>
            </span>
          </div>
          <p style="font-size:15px;margin:0 0 1.5rem">Click below to sign in. This link expires in 15 minutes.</p>
          <a href="${loginUrl}" style="display:inline-block;background:#00693e;color:white;padding:11px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px">Sign in →</a>
          <p style="margin-top:1.5rem;font-size:12px;color:#888">Or copy: ${loginUrl}</p>
          <p style="font-size:12px;color:#bbb;margin-top:2rem">If you didn't request this, you can ignore it.</p>
        </div>
      `,
    }),
  });

  res.json({ ok: true });
}
