# COSC 77 Study Tutor

An AI-powered study tool for Dartmouth's COSC 77. Pick a topic, get a deep lesson, take an adaptive quiz, and review your weak areas — all in one flow.

## Features

- **Deep lessons** — 4-section lessons built from first principles: intuition, mechanics, worked example, and common pitfalls
- **Drilldown explanations** — click any formula or key term for a 4-paragraph deep dive
- **Adaptive quizzing** — 5 questions across conceptual, computational, and synthesis types
- **Grading + feedback** — answers graded by Claude with specific per-question feedback
- **Targeted review** — weak areas get a fresh re-explanation from a different angle
- **Context-aware chat** — ask questions at any phase; the tutor knows exactly where you are and what you got wrong
- **YouTube recommendations** — top 2 videos by view count surface alongside each lesson

## Stack

- React 18 + Vite
- Anthropic API (`claude-sonnet-4-20250514`) called directly from the browser
- YouTube Data API v3 for video recommendations
- Deployed via GitHub Actions to GitHub Pages

## Local Development

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/kyliemckinleydemo/cstutor.git
cd cstutor
npm install
```

2. Create a `.env.local` file with your API keys:

```
VITE_API_KEY=your_anthropic_api_key
VITE_YOUTUBE_KEY=your_youtube_data_api_key
```

3. Start the dev server:

```bash
npm run dev
```

## Deployment

The app deploys automatically to GitHub Pages on every push to `main` via GitHub Actions.

**Required repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Description |
|---|---|
| `VITE_API_KEY` | Anthropic API key |
| `VITE_YOUTUBE_KEY` | YouTube Data API v3 key |

**Required Pages setting** (Settings → Pages):
Source → **GitHub Actions**

Live at: `https://kyliemckinleydemo.github.io/cstutor/`
