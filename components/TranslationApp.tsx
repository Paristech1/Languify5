'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { Lesson, ScoringResult } from '../lib/types';
import { SAMPLE_LESSONS } from '../lib/constants';
import { scoreTranslation, runDevTests } from '../lib/scoring';

type TabType = 'vocabulary' | 'structure' | 'hints' | 'examples';

export default function TranslationApp() {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(SAMPLE_LESSONS[0]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [examplesUnlocked, setExamplesUnlocked] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('vocabulary');
  const [customLessonOpen, setCustomLessonOpen] = useState(false);
  const [customEnglish, setCustomEnglish] = useState('');
  const [customSpanish, setCustomSpanish] = useState('');
  const [devTestsOpen, setDevTestsOpen] = useState(false);
  const [devTestResults, setDevTestResults] = useState<Array<{ name: string; result: ScoringResult }>>([]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    
    const result = scoreTranslation(userInput, currentLesson.correctAnswer, currentLesson);
    setScore(result.score);
    setHints(result.hints);
    setExamplesUnlocked(result.examplesUnlocked);
    setIsAnswerRevealed(result.isAnswerRevealed);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleTryAgain = () => {
    setUserInput('');
    setScore(null);
    setHints([]);
    setExamplesUnlocked(false);
    setIsAnswerRevealed(false);
    setActiveTab('vocabulary');
  };

  const handleNextSentence = () => {
    const currentIndex = SAMPLE_LESSONS.findIndex(lesson => lesson.id === currentLesson.id);
    const nextIndex = (currentIndex + 1) % SAMPLE_LESSONS.length;
    setCurrentLesson(SAMPLE_LESSONS[nextIndex]);
    handleTryAgain();
  };

  const handleLessonChange = (lessonId: string) => {
    const lesson = SAMPLE_LESSONS.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      handleTryAgain();
    }
  };

  const handleCustomLessonSave = () => {
    if (!customEnglish.trim() || !customSpanish.trim()) return;

    // Auto-seed vocabulary from expected Spanish (first ≤8 tokens, normalized)
    const spanishTokens = customSpanish
      .replace(/[¿?]/g, '')
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .slice(0, 8);

    const autoVocabulary = spanishTokens.map((token, index) => ({
      english: `word ${index + 1}`,
      spanish: token,
      notes: 'Auto-generated'
    }));

    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      english: customEnglish,
      correctAnswer: customSpanish,
      vocabulary: autoVocabulary,
      structureClues: ['Auto lesson created from custom input'],
      examples: []
    };

    setCurrentLesson(newLesson);
    setCustomEnglish('');
    setCustomSpanish('');
    setCustomLessonOpen(false);
    handleTryAgain();
  };

  const runDevTests = () => {
    const results = runDevTests();
    setDevTestResults(results);
    setDevTestsOpen(true);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'vocabulary':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400">Vocabulary</h4>
            <div className="space-y-2">
              {currentLesson.vocabulary.map((vocab, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                  <span className="text-cyan-300">{vocab.spanish}</span>
                  <span className="text-gray-400">{vocab.english}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'structure':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400">Structure Clues</h4>
            <div className="space-y-2">
              {currentLesson.structureClues.map((clue, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded text-sm">
                  {clue}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'hints':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400">Hints</h4>
            {score !== null ? (
              hints.length > 0 ? (
                <div className="space-y-2">
                  {hints.map((hint, index) => (
                    <div key={index} className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm">
                      💡 {hint}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 bg-green-900/20 border border-green-500/30 rounded text-sm">
                  ✅ No issues detected. Nice work!
                </div>
              )
            ) : (
              <div className="text-gray-500 text-sm">Submit your answer to see hints</div>
            )}
          </div>
        );
      
      case 'examples':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-400">Examples</h4>
            {examplesUnlocked ? (
              <div className="space-y-2">
                {currentLesson.examples.map((example, index) => (
                  <div key={index} className="p-2 bg-gray-800 rounded text-sm">
                    {example}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <Lock className="w-4 h-4" />
                <span>Score > 60 unlocks examples. Score ≥ 80 reveals the target answer.</span>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400">Langu-ify</h1>
          <p className="text-gray-400 mt-2">Learn translation through a tight "Translate → Rate → Teach" loop</p>
        </header>

        {/* Example Picker */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <select
            value={currentLesson.id}
            onChange={(e) => handleLessonChange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {SAMPLE_LESSONS.map(lesson => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.english}
              </option>
            ))}
          </select>
          <button
            onClick={handleNextSentence}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            Next Example
          </button>
        </div>

        {/* Custom Lesson Section */}
        <div className="bg-gray-800 rounded-lg p-4">
          <button
            onClick={() => setCustomLessonOpen(!customLessonOpen)}
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {customLessonOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Custom sentence</span>
          </button>
          
          {customLessonOpen && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">English:</label>
                <input
                  type="text"
                  value={customEnglish}
                  onChange={(e) => setCustomEnglish(e.target.value)}
                  placeholder="Enter English sentence"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Spanish:</label>
                <input
                  type="text"
                  value={customSpanish}
                  onChange={(e) => setCustomSpanish(e.target.value)}
                  placeholder="Enter expected Spanish translation"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={handleCustomLessonSave}
                disabled={!customEnglish.trim() || !customSpanish.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
              >
                Save as Lesson
              </button>
            </div>
          )}
        </div>

        {/* Translation Result Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          {/* Top row: Your input | Target translation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Your input</h3>
              <div className="p-3 bg-gray-700 rounded min-h-[60px] flex items-center">
                {userInput || <span className="text-gray-500">Type your translation...</span>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Target translation</h3>
              <div className="p-3 bg-gray-700 rounded min-h-[60px] flex items-center">
                {isAnswerRevealed ? (
                  <span className="text-green-400">{currentLesson.correctAnswer}</span>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <EyeOff className="w-4 h-4" />
                    <span>Score ≥ 80 to reveal</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submission input + inline hints + Check Answer */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your Spanish translation..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Check Answer
              </button>
            </div>
            
            {/* Inline hints */}
            {score !== null && hints.length > 0 && (
              <div className="space-y-2">
                {hints.map((hint, index) => (
                  <div key={index} className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm">
                    💡 {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
              {(['vocabulary', 'structure', 'hints', 'examples'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="mb-6">
            {getTabContent()}
          </div>

          {/* Performance bar + numeric score */}
          {score !== null && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Your Performance</span>
                <span className="text-2xl font-bold text-cyan-400">{score}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTryAgain}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleNextSentence}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
            >
              Next Sentence
            </button>
          </div>
        </div>

        {/* Dev Test Panel */}
        <div className="bg-gray-800 rounded-lg p-4">
          <button
            onClick={() => {
              if (!devTestsOpen) {
                runDevTests();
              }
              setDevTestsOpen(!devTestsOpen);
            }}
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {devTestsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Dev Test Panel</span>
          </button>
          
          {devTestsOpen && (
            <div className="mt-4 space-y-2">
              {devTestResults.map((test, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-sm">{test.name}</span>
                  <span className="text-cyan-400 font-mono">{test.result.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
