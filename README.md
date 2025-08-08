# Langu-ify

A web app that teaches translation through a tight "Translate → Rate → Teach" loop with immediate scoring, targeted hints, unlockable examples, and a growing library of lesson prompts.

## Features

### Core Functionality
- **Translate & Score**: Type Spanish translations and get immediate scoring (0-100)
- **Actionable Hints**: Get targeted feedback on missing punctuation, vocabulary, and structure
- **Unlockable Examples**: Examples unlock at >60% score, target answer reveals at ≥80%
- **Custom Lessons**: Create your own lessons with English prompts and expected Spanish translations
- **Dev Test Panel**: Built-in test cases to validate scoring logic

### User Experience
- **Fast & Deterministic**: Offline scoring in <50ms
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Modern UI with cyan highlights
- **Keyboard Support**: Enter key triggers scoring
- **Accessible**: WCAG AA compliant with proper ARIA labels

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### Basic Translation
1. Select an example from the dropdown or use "Next Example"
2. Type your Spanish translation in the input field
3. Press Enter or click "Check Answer"
4. View your score and hints
5. Unlock examples at >60% score
6. Reveal target answer at ≥80% score

### Custom Lessons
1. Click "Custom sentence" to expand the section
2. Enter English prompt and expected Spanish translation
3. Click "Save as Lesson" to create and activate the lesson
4. Vocabulary is auto-generated from the Spanish text

### Dev Test Panel
1. Click "Dev Test Panel" to expand
2. View test cases: perfect, no-q-marks, partial, lowercase, punct-only
3. Each test shows the calculated score

## Technical Architecture

### Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS with dark theme
- **Icons**: Lucide React
- **State**: Local component state (v1)

### Key Components
- `TranslationApp.tsx`: Main application component
- `lib/scoring.ts`: Deterministic scoring algorithm
- `lib/types.ts`: TypeScript type definitions
- `lib/constants.ts`: Configuration and sample lessons
- `app/api/translate-and-teach/route.ts`: Optional LLM backend API

### Scoring Algorithm
1. **Punctuation**: +10 for ¿, +10 for ?
2. **Vocabulary**: 40 points divided equally among lesson vocabulary
3. **Word Order**: Up to 40 points for correct token positioning
4. **Thresholds**: Examples unlock at >60, answer reveals at ≥80

## API Contract (Optional LLM Mode)

### Endpoint
`POST /api/translate-and-teach`

### Request
```json
{
  "text": "When do we get to eat the lunch that Susan made?",
  "from": "en",
  "to": "es",
  "lessonId": "optional-string"
}
```

### Response
```json
{
  "translation": "¿Cuándo vamos a comer el almuerzo que hizo Susan?",
  "rating": {
    "score": 87,
    "reasons": ["Good verb tense", "Minor word choice"]
  },
  "teaching": {
    "explanation": "Short rationale...",
    "miniLesson": [
      { "title": "Word order", "tip": "Spanish prefers S–V–O..." }
    ],
    "drills": [
      { "type": "fillBlank", "prompt": "Yo ___ al mercado", "answer": "voy" }
    ]
  }
}
```

## Success Metrics (v1)
- **TTE (Time to Explanation)**: < 1s after "Check Answer"
- **Attempt completion rate**: ≥ 70% of sessions include one scored attempt
- **Hint engagement**: ≥ 60% of scored attempts show at least one hint

## Accessibility
- All interactive controls are keyboard-operable
- Visible focus states
- Color contrast meets WCAG AA standards
- ARIA labels for tabs and collapsible sections
- Text labels for locked states (not color-only)

## Performance & Security
- **Offline mode**: Scoring in < 50ms
- **LLM mode**: API roundtrip < 2.0s p95
- Input validation: Reject > 500 chars
- Rate limiting on API endpoints

## Future Roadmap
- Spaced-repetition queue based on attempts
- Progress page with history of scores
- Better hints (conjugation checks, agreement detection)
- Backend pipeline with real LLM integration
- Internationalization of UI copy

## Development

### Build
```bash
npm run build
```

### Start Production
```bash
npm run start
```

### Lint
```bash
npm run lint
```

## License
MIT License - see LICENSE file for details

---

**Built with ❤️ using Next.js, React, TypeScript, and TailwindCSS**
