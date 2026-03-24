# Dartmouth CS Tutor Agent

An AI-powered study tool for Dartmouth CS courses. Pick a topic, get a deep lesson, take an adaptive quiz, review weak areas, and build a personal formula/definition sheet — all in one flow.

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
- **Spaced repetition** — wrong/partial answers get scheduled for daily review (1/3/30-day intervals); each review generates a fresh question on the same concept
- **Formula/Definition sheet** — auto-populated from every lesson; filterable by type; print/PDF with category-aware print CSS
- **Session history** — every completed session saved with score, strong areas, and weak areas
- **Lesson persistence** — completed lessons survive page refresh; pick up where you left off
- **Context-aware chat** — ask questions at any phase; the tutor knows exactly where you are and what you got wrong
- **YouTube recommendations** — top 2 videos by view count surface alongside each lesson
- **Regen** — regenerate a fresh lesson and quiz for the same topic without wiping your history or formula sheet

## Stack

- React 18 + Vite
- Anthropic API (`claude-sonnet-4-20250514`) via a Vercel serverless proxy (`api/proxy.js`) — API key never exposed to the browser
- YouTube Data API v3 for video recommendations
- Deployed on Vercel (two projects from one repo, differentiated by `VITE_COURSE_ID` env var)

## Local Development

1. Clone and install:

```bash
git clone https://github.com/kyliemckinleydemo/cstutor.git
cd cstutor
npm install
```

2. Create a `.env.local` file:

```
VITE_YOUTUBE_KEY=your_youtube_data_api_key
VITE_COURSE_ID=cosc77
```

3. For the Anthropic key, set it as an environment variable (it's read server-side by the proxy):

```bash
export ANTHROPIC_KEY=your_anthropic_api_key
```

Or add it to `.env.local` — Vite will expose it to the local dev server.

4. Start the dev server:

```bash
npm run dev
```

## Deployment (Vercel)

Two Vercel projects (`cstutor` and `cstutor-cosc10`) are both linked to this repo.

**Environment variables per project:**

| Variable | COSC 77 | COSC 10 |
|---|---|---|
| `ANTHROPIC_KEY` | your key | your key |
| `VITE_YOUTUBE_KEY` | your key | your key |
| `VITE_COURSE_ID` | `cosc77` | `cosc10` |

To deploy manually:

```bash
# COSC 77
vercel link --yes --project cstutor
vercel --prod

# COSC 10
vercel link --yes --project cstutor-cosc10
vercel --prod
```

Vercel auto-deploys on every push to `main` if the GitHub repo is connected.

## Adding a New Course

1. Add a new entry to the `COURSES` object in `src/App.jsx` with `id`, `label`, `title`, `subtitle`, `codeLanguage`, `system` (tutor system prompt), and `suggested` (topic list).
2. Create a new Vercel project and set `VITE_COURSE_ID` to the new course id.
3. All localStorage data is automatically scoped per course id.
