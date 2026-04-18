# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A single-page TOEIC 950 vocabulary & grammar study app. Pure HTML/CSS/JS with no build tools or frameworks — open `index.html` directly in a browser.

## Development

No build step. To develop, open `index.html` in a browser and refresh after edits. All state is persisted in `localStorage`.

## Architecture

### File Structure

- **`index.html`** (~3200 lines) — The entire app: HTML structure, all CSS (`<style>` block), and all JS (`<script>` block). Contains 6 views controlled by `showView()`/`switchTab()`.
- **`words.js`** — `TOEIC_WORDS` array: 300 words across 30 days (day 1–30, ~10 words/day). Each entry: `{day, word, meaning, partOfSpeech, exampleSentence, exampleTranslation, situationEmoji}`.
- **`grammar.js`** — `GRAMMAR_TOPICS` array: 10 grammar topics, each with 3 difficulty levels (easy/medium/hard), each level having 3 rules + 10 quiz questions with 4 choices and explanations.
- **`meanings-overlay.js`** — `MEANINGS_OVERLAY` object: polysemous word data `{ "word": [{pos, kr}, ...] }` merged into `TOEIC_WORDS` at runtime via `initWordData()`.

### Views (tabs)

| View ID | Tab | Description |
|---|---|---|
| `viewWordStudy` | 단어 학습 | Flashcard-style word study with day navigation (Day 1–30), swipe gestures, and "memorized" toggle |
| `viewWordTest` | 단어 테스트 | Quiz mode for vocabulary (day-selectable) |
| `viewGrammarStudy` | 어법 학습 | Grammar rules organized by topic and difficulty |
| `viewGrammarTest` | 어법 테스트 | Grammar quiz mode |
| `viewTest` / `viewResult` | (internal) | Shared test-taking and result screens (nav hidden during test) |
| `viewNotes` | 오답노트 | Wrong answer notebook for both words and grammar |

### State & Storage

All persistence is via `localStorage`:
- `toeic950_progress_v1` — `{ "word": true/false }` for memorization status
- `toeic950_wrongnotes_v1` — `{ "word": true }` for word wrong-answer notes
- `toeic950_grammar_notes_v1` — `[{ topicId, level, q, choices, explanation, savedAt }]` for grammar wrong-answer notes

### Data Flow

`TOEIC_WORDS` entries get their `meanings` array populated at startup: if `MEANINGS_OVERLAY` has multi-meaning data for a word, it's merged in; otherwise a single `{pos, kr}` is generated from the base fields. A fast lookup map `WORD_LOOKUP[word.toLowerCase()]` is also built at init.

### Styling

Neo-pastel warm cream/blush theme targeting 20s female aesthetic. All styles in the `<style>` block using CSS custom properties (`:root` design tokens). Key palette: `--cream`, `--blush`, `--sage`, `--lavender`, `--ink` (charcoal, never pure black). Fonts: Pretendard Variable (body), Fraunces (headings).

### Interaction

Flashcards support touch swipe (left/right to navigate words) with configurable thresholds. Card click toggles meaning reveal.
