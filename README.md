# Darby — Dartmouth CS Study Tutor

An AI-powered study tool for Dartmouth CS courses. Enter a topic, get a deep lesson, take an adaptive quiz, review weak areas, and build a personal formula/definition sheet — all in one flow.

**Live apps:**
- COSC 77 (Machine Learning): https://cstutor.vercel.app
- COSC 10 (Problem Solving via OOP): https://cstutor-cosc10.vercel.app

## Features

- **Deep lessons** — 4-section lessons built from first principles: intuition, mechanics, worked example, and common pitfalls
- **Drilldown explanations** — click any formula or key term for a 4-paragraph deep dive
- **On-demand code snippets** — show/hide a language-appropriate example (Python for COSC 77, Java for COSC 10) per lesson section, with a copy button
- **Adaptive quizzing** — 5 questions across conceptual, computational, and synthesis types with difficulty ratings
- **Grading + feedback** — answers graded by Claude with specific per-question feedback
- **Targeted follow-up** — weak areas get a fresh re-explanation from a different angle
- **Spaced repetition** — wrong/partial answers scheduled for daily review (1/3/30-day intervals); each review generates a fresh question on the same concept
- **Formula/Definition sheet** — auto-populated from every lesson; manually add your own entries; filterable by type; print/PDF with category-aware print CSS
- **Session history** — every completed session saved with score, strong areas, and weak areas
- **My Courses** — dropdown in the nav lists every topic you've studied; clicking one restores the full lesson instantly without re-generating
- **Lesson persistence** — in-progress and completed sessions survive page refresh; continue where you left off
- **Context-aware chat** — ask Darby questions at any phase; always knows where you are and what you got wrong
- **AI-generated quick prompts** — chat chips are generated per topic from actual lesson content, not generic suggestions
- **Code block rendering** — fenced code blocks in chat responses render with syntax highlighting, language label, and copy button
- **YouTube recommendations** — top 2 videos by view count surfaced alongside each lesson
- **Regen** — regenerate a fresh lesson and quiz on the same topic without wiping history or formulas
- **Magic link auth** — passwordless sign-in via Resend; sessions persist 1 year on device
- **Cloud sync** — study data (sessions, formulas, review queue) syncs across devices via Upstash KV
- **Admin analytics** — admin-only usage report showing sessions, unique students, top topics, avg scores, and weak areas per course (all-time + last 7 days)

## Stack

- React 18 + Vite
- Anthropic API (`claude-sonnet-4-20250514`) via Vercel serverless proxy (`api/proxy.js`) — key never exposed to the browser
- Upstash Redis REST API for cloud data storage (`api/sync/`, `api/admin/`)
- Resend for magic link auth emails (`api/auth/`)
- YouTube Data API v3 for video recommendations
- Deployed on Vercel (two projects from one repo, differentiated by `VITE_COURSE_ID`)

## Local Development

1. Clone and install:

```bash
git clone https://github.com/kyliemckinleydemo/cstutor.git
cd cstutor
npm install
```

2. Pull environment variables from Vercel (recommended):

```bash
vercel link --yes --project cstutor
vercel env pull .env.local
```

Or create `.env.local` manually:

```
ANTHROPIC_KEY=your_anthropic_api_key
VITE_YOUTUBE_KEY=your_youtube_data_api_key
VITE_COURSE_ID=cosc77
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token
RESEND_KEY=your_resend_api_key
```

3. Start the dev server:

```bash
npm run dev
```

## Deployment (Vercel)

Two Vercel projects (`cstutor` and `cstutor-cosc10`) are both linked to this repo. Deploy both after every change:

```bash
vercel link --yes --project cstutor && vercel --prod
vercel link --yes --project cstutor-cosc10 && vercel --prod
```

**Environment variables per project:**

| Variable | COSC 77 | COSC 10 |
|---|---|---|
| `ANTHROPIC_KEY` | your key | your key |
| `VITE_YOUTUBE_KEY` | your key | your key |
| `VITE_COURSE_ID` | `cosc77` | `cosc10` |
| `KV_REST_API_URL` | shared Upstash URL | shared Upstash URL |
| `KV_REST_API_TOKEN` | shared Upstash token | shared Upstash token |
| `RESEND_KEY` | your key | your key |

## Admin Access

Admins are defined in `ADMINS` at the top of `src/App.jsx`. Admins see an **Admin** tab in the nav with a usage report showing sessions, unique students, top topics by frequency, average scores, and most-struggled concepts — per course, all-time and last 7 days.

## Adding a New Course

1. Add a new entry to the `COURSES` object in `src/App.jsx` with `id`, `label`, `title`, `subtitle`, `codeLanguage`, `system` (tutor system prompt), and `suggested` (topic list).
2. Create a new Vercel project and set `VITE_COURSE_ID` to the new course id.
3. All data is automatically scoped per course id in both localStorage and Upstash KV.
