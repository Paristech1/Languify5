export const SCORE_EXAMPLES_THRESHOLD = 50;  // ≥50
export const SCORE_REVEAL_THRESHOLD = 80;    // >=80
export const HINTS_MAX = 3;

import { Lesson } from './types';

// Sample lessons for demonstration
export const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "basic-greeting",
    english: "How are you today?",
    correctAnswer: "¿Cómo estás hoy?",
    vocabulary: [
      { english: "how", spanish: "cómo", notes: "question word" },
      { english: "are", spanish: "estás", notes: "you are (informal)" },
      { english: "today", spanish: "hoy", notes: "adverb of time" }
    ],
    structureClues: [
      "Spanish questions often start with ¿",
      "Use informal 'tú' form for friends",
      "Time expressions usually go at the end"
    ],
    examples: [
      "¿Cómo estás tú?",
      "¿Cómo te va?",
      "¿Qué tal estás?"
    ]
  },
  {
    id: "food-question",
    english: "What do you want to eat for lunch?",
    correctAnswer: "¿Qué quieres comer para el almuerzo?",
    vocabulary: [
      { english: "what", spanish: "qué", notes: "question word" },
      { english: "want", spanish: "quieres", notes: "you want (informal)" },
      { english: "eat", spanish: "comer", notes: "infinitive verb" },
      { english: "for", spanish: "para", notes: "preposition" },
      { english: "lunch", spanish: "almuerzo", notes: "meal" }
    ],
    structureClues: [
      "Qué + verb + subject is common question structure",
      "Para + article + noun for purpose",
      "Infinitive after querer"
    ],
    examples: [
      "¿Qué quieres comer?",
      "¿Qué te gustaría comer?",
      "¿Qué hay para comer?"
    ]
  },
  {
    id: "time-question",
    english: "When do we leave for the airport?",
    correctAnswer: "¿Cuándo salimos para el aeropuerto?",
    vocabulary: [
      { english: "when", spanish: "cuándo", notes: "question word" },
      { english: "leave", spanish: "salimos", notes: "we leave" },
      { english: "for", spanish: "para", notes: "preposition" },
      { english: "airport", spanish: "aeropuerto", notes: "transportation" }
    ],
    structureClues: [
      "Cuándo for time questions",
      "Nosotros form: salimos",
      "Para + el + noun for destination"
    ],
    examples: [
      "¿Cuándo salimos?",
      "¿A qué hora salimos?",
      "¿Cuándo es el vuelo?"
    ]
  }
];
