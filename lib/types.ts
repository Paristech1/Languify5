export type Vocab = { 
  english: string; 
  spanish: string; 
  notes: string 
};

export type Lesson = {
  id: string;
  english: string;
  correctAnswer: string;
  vocabulary: Vocab[];
  structureClues: string[];
  examples: string[];
};

export type Attempt = {
  input: string;
  score: number;
  timestamp: Date;
};

export type ScoringResult = {
  score: number;
  hints: string[];
  examplesUnlocked: boolean;
  isAnswerRevealed: boolean;
};
