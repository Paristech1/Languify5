import { Lesson, ScoringResult } from './types';
import { SCORE_EXAMPLES_THRESHOLD, SCORE_REVEAL_THRESHOLD, HINTS_MAX } from './constants';

export function scoreTranslation(
  userAnswer: string,
  correctAnswer: string,
  lesson: Lesson
): ScoringResult {
  let score = 0;
  const hints: string[] = [];

  // Step 1: Base punctuation (+10 if includes ¿, +10 if includes ?)
  if (userAnswer.includes('¿')) {
    score += 10;
  } else {
    hints.push("Missing opening question mark (¿)");
  }

  if (userAnswer.includes('?')) {
    score += 10;
  } else {
    hints.push("Missing closing question mark (?)");
  }

  // Step 2: Vocabulary coverage (40 total, equally divided by count of vocabulary)
  const vocabScore = 40 / lesson.vocabulary.length;
  let vocabFound = 0;

  lesson.vocabulary.forEach(vocab => {
    if (userAnswer.toLowerCase().includes(vocab.spanish.toLowerCase())) {
      score += vocabScore;
      vocabFound++;
    } else {
      hints.push(`Missing vocabulary: "${vocab.spanish}" (${vocab.english})`);
    }
  });

  // Step 3: Word order (compare token sequences sans ¿?, + up to 40 based on position matches)
  const userTokens = userAnswer
    .replace(/[¿?]/g, '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(token => token.length > 0);

  const correctTokens = correctAnswer
    .replace(/[¿?]/g, '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(token => token.length > 0);

  let orderScore = 0;
  const maxOrderScore = 40;
  const orderScorePerMatch = maxOrderScore / Math.max(correctTokens.length, 1);

  correctTokens.forEach((token, index) => {
    if (userTokens[index] === token) {
      orderScore += orderScorePerMatch;
    }
  });

  score += orderScore;

  // Clamp 0-100 and round to integer
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Limit hints to HINTS_MAX
  const limitedHints = hints.slice(0, HINTS_MAX);

  // Determine unlock states
  const examplesUnlocked = score > SCORE_EXAMPLES_THRESHOLD;
  const isAnswerRevealed = score >= SCORE_REVEAL_THRESHOLD;

  return {
    score,
    hints: limitedHints,
    examplesUnlocked,
    isAnswerRevealed
  };
}

// Dev test cases as specified in the PRD
export function runDevTests(): Array<{ name: string; result: ScoringResult }> {
  const testLesson: Lesson = {
    id: "test",
    english: "How are you today?",
    correctAnswer: "¿Cómo estás hoy?",
    vocabulary: [
      { english: "how", spanish: "cómo", notes: "question word" },
      { english: "are", spanish: "estás", notes: "you are (informal)" },
      { english: "today", spanish: "hoy", notes: "adverb of time" }
    ],
    structureClues: [],
    examples: []
  };

  const testCases = [
    { name: "perfect", input: "¿Cómo estás hoy?" },
    { name: "no-q-marks", input: "Cómo estás hoy" },
    { name: "partial", input: "¿Cómo hoy?" },
    { name: "lowercase", input: "¿cómo estás hoy?" },
    { name: "punct-only", input: "¿?" }
  ];

  return testCases.map(testCase => ({
    name: testCase.name,
    result: scoreTranslation(testCase.input, testLesson.correctAnswer, testLesson)
  }));
}
