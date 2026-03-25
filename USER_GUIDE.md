# User Guide — Darby

## Overview

Darby is an AI study tool for Dartmouth CS courses. It generates deep, structured lessons on any topic, quizzes you on the material, tracks your weak areas over time, and builds a personal reference sheet as you study. Your data syncs across devices when you're signed in.

---

## Signing In

Darby uses passwordless sign-in. Enter your email and click **Send sign-in link**. Click the link in the email to sign in — it expires in 15 minutes. Check your spam folder if you don't see it.

Once signed in, your session persists for a year on that device. Your sessions, formula sheet, and review queue sync automatically to the cloud and are available on any device you sign into.

---

## The Study Flow

### 1. Enter a Topic

Type any topic in the input box or click a suggested topic chip. Hit Enter or click **Start Lesson**.

If you have a session in progress, a **Continue** card appears at the top — click it to pick up where you left off, or enter a new topic to start fresh.

### 2. Read the Lesson

Every lesson has 4 sections:

- **Intuition** — why the concept matters and how to think about it
- **Mechanics** — how it actually works, step by step
- **Worked Example** — a concrete walkthrough
- **Common Pitfalls** — mistakes to avoid

**Drilldown:** Click the arrow next to any bolded formula or key term to get a 4-paragraph deep dive on just that idea.

**Code snippets:** Click **Show example code** under any section to generate a runnable code example (Python for COSC 77, Java for COSC 10). Click **Copy** to copy it to your clipboard.

**YouTube videos:** Two highly-viewed videos related to your topic appear below the lesson.

**Chat:** Ask Darby anything in the chat box below the lesson. It knows exactly what you're reading and where you are in the flow. Quick-prompt chips are generated from your specific lesson content — they'll reference actual terms and concepts covered. Code blocks in responses are rendered with syntax highlighting and a copy button.

**Regen:** Click **↺ Regen** in the lesson header to regenerate a fresh lesson and quiz for the same topic. A confirmation shows what will happen — your history, formula sheet, and review queue are not affected.

### 3. Take the Quiz

Click **Ready — Take Quiz** when you've finished the lesson. You'll get 5 questions — a mix of conceptual, computational, and synthesis types at varying difficulties.

Write out your answers. Show your work for computational questions.

### 4. Review Results

After submitting you'll see:

- Your score and per-question feedback
- Strong and weak areas identified
- A **Review Weak Areas** button that generates a targeted re-explanation of what you missed

Partially correct or wrong answers are automatically added to your **spaced repetition queue** for daily review.

### 5. Session Complete

Your session is saved to History with your score and strong/weak tags. The lesson persists — if you close the tab and return, you'll have the option to continue.

Click **Study Another Topic** to start fresh.

---

## Navigation

### My Courses

A dropdown listing every topic you've generated a lesson for, most recent first. Click any topic to instantly restore the full saved lesson and jump straight to reading — no re-generation needed.

### History

A log of every completed session with date, topic, score, and strong/weak area tags.

### Formulas/Definitions

A personal reference sheet auto-populated from every lesson you complete.

- **Filter** (All / Formulas / Definitions) — show only the type you want
- **+ Add entry** — manually add your own formula or definition with a topic, label, and explanation. The Topic field autocompletes from your existing topics.
- **Print / PDF** — prints only the currently selected category
- **×** button — delete any entry

### Review

Spaced repetition for questions you got wrong or partially right.

- **Wrong** answers come back after 1 day
- **Partial** answers come back after 3 days
- **Correct** answers in review come back after 30 days

Each time a card is due, a fresh question is generated that targets the same concept from a different angle — you're always practicing understanding, not memorization.

The nav badge shows how many questions are due today.

### Help

This guide, accessible from the **Help** button in the nav.

---

## Tips

- The formula sheet fills up fast — a few lessons gives you a printable cheat sheet
- Check Review daily before studying new material; it only takes a few minutes
- Use **My Courses** to jump back into any topic you've studied — the lesson loads instantly
- Use the chat freely — ask "explain that differently" or "give me another example" at any point
- If a lesson skips something you needed, ask Darby directly in the chat
- You can add your own formulas and definitions manually — useful for lecture notes or textbook terms
