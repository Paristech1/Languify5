# Langu-ify - Standalone Version

🎉 **No Node.js Required!** This version runs directly in your browser.

## Quick Start

1. **Open the file:**
   - Double-click `index.html` 
   - OR drag `index.html` into your browser
   - OR right-click `index.html` → "Open with" → Your browser

2. **That's it!** The app will load immediately.

## Features

✅ **Complete Langu-ify Experience:**
- Translate & Score: Immediate scoring (0-100)
- Actionable Hints: Missing punctuation, vocabulary, structure
- Unlockable Examples: Unlocks at >60% score
- Target Answer: Reveals at ≥80% score
- Custom Lessons: Create your own English→Spanish lessons
- Dev Test Panel: Built-in test cases
- Responsive Design: Works on desktop and mobile
- Dark Theme: Modern UI with cyan highlights

## How to Use

### Basic Translation
1. Select an example from the dropdown
2. Type your Spanish translation
3. Press Enter or click "Check Answer"
4. View your score and hints
5. Unlock examples at >60% score
6. Reveal target answer at ≥80% score

### Custom Lessons
1. Click "Custom sentence" to expand
2. Enter English prompt and expected Spanish
3. Click "Save as Lesson" to create and activate
4. Vocabulary auto-generates from Spanish text

### Dev Test Panel
1. Click "Dev Test Panel" to expand
2. View test cases: perfect, no-q-marks, partial, lowercase, punct-only
3. Each test shows the calculated score

## Files

- `index.html` - Main application (open this file)
- `app.js` - All functionality and logic
- `README-standalone.md` - This file

## Technical Details

- **No Installation Required** - Pure HTML/CSS/JavaScript
- **CDN Dependencies** - TailwindCSS and Lucide icons loaded from CDN
- **Offline Scoring** - Deterministic algorithm runs in browser
- **Local Storage** - Custom lessons persist in browser session
- **Responsive** - Works on all screen sizes

## Scoring Algorithm

1. **Punctuation**: +10 for ¿, +10 for ?
2. **Vocabulary**: 40 points divided equally among lesson vocabulary
3. **Word Order**: Up to 40 points for correct token positioning
4. **Thresholds**: Examples unlock at >60, answer reveals at ≥80

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Troubleshooting

- **Page not loading**: Make sure you're opening `index.html` directly
- **Icons not showing**: Check internet connection (icons load from CDN)
- **Styling issues**: Try refreshing the page
- **Not working**: Try a different browser

---

**Ready to use! Just open `index.html` in your browser.**
