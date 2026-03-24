# User Guide — Dartmouth CS Tutor Agent

## Overview

The Tutor Agent is an AI study tool for Dartmouth CS courses. It generates deep, structured lessons on any topic, quizzes you on the material, tracks your weak areas over time, and builds a personal reference sheet as you study.

---

## The Study Flow

### 1. Pick a Topic
Type any topic in the input box or click a suggested topic chip. Hit Enter or click **Start Lesson**.

### 2. Read the Lesson
Every lesson has 4 sections:
- **Intuition** — why the concept matters and how to think about it
- **Mechanics** — how it actually works, step by step
- **Worked Example** — a concrete walkthrough
- **Common Pitfalls** — mistakes to avoid

**Drilldown:** Click the arrow next to any bolded formula or key term to get a 4-paragraph deep dive on just that idea.

**Code snippets:** Click **Show example code** under any section to generate a runnable code example (Python for COSC 77, Java for COSC 10). Click **Copy** to copy it to your clipboard.

**YouTube videos:** Two highly-viewed videos related to your topic appear below the lesson.

**Chat:** Ask any question in the chat box at the bottom. The tutor knows what lesson you're reading and where you are in the flow.

### 3. Take the Quiz
Click **Ready — Take Quiz** when you've finished the lesson. You'll get 5 questions:
- Mix of conceptual, computational, and synthesis types
- Easy, medium, and hard difficulties

Write out your answers in the text boxes. Show your work for computational questions.

### 4. Review Results
After submitting, you'll see:
- A score and per-question feedback
- Strong and weak areas identified
- A **Review Weak Areas** button that generates a targeted re-explanation of anything you missed

Partially correct or wrong answers are automatically added to your **spaced repetition queue** for daily review.

### 5. Session Complete
Your session is saved to History with your score and weak/strong area tags. The lesson persists — if you close the tab and come back, you'll land back on the completed lesson.

Click **Study Another Topic** to start fresh, or navigate to History, Formulas/Definitions, or Review from the top nav.

---

## Navigation

### History
A log of every completed session with date, topic, score, and strong/weak area tags.

### Formulas/Definitions
A personal reference sheet auto-populated from every lesson you complete. Formulas and definitions are collected automatically — you don't have to do anything.

- **Filter** (All / Formulas / Definitions) — show only the type you want
- **Print / Save PDF** — prints only the currently selected category
- **×** button — delete any entry you don't want to keep

### Review
Spaced repetition for questions you got wrong or partially right.

- Questions that were **wrong** come back after 1 day
- **Partial** answers come back after 3 days
- **Correct** answers in review come back after 30 days

Each time a card is due, a **fresh question** is generated that targets the same concept from a different angle — you're always practicing understanding, not memorization.

The nav badge shows how many questions are due today.

---

## Regen

On any lesson, click **↺ Regen** (next to "Change Topic") to regenerate a fresh lesson and quiz on the same topic. Confirm in the prompt that appears. Your session history, formula sheet, and spaced repetition queue are unaffected.

---

## Tips

- The formula sheet fills up fast — do a few lessons and you'll have a printable cheat sheet
- Check Review daily before studying new material; it only takes a few minutes
- Use the chat freely — ask "explain that differently" or "give me another example" at any point
- If a lesson doesn't cover something you needed, use the chat to ask about it directly
