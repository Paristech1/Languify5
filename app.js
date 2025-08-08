// Constants
const SCORE_EXAMPLES_THRESHOLD = 61;  // >60
const SCORE_REVEAL_THRESHOLD = 80;    // >=80
const HINTS_MAX = 3;

// Sample lessons
const SAMPLE_LESSONS = [
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

// App state
let currentLesson = SAMPLE_LESSONS[0];
let userInput = '';
let score = null;
let hints = [];
let examplesUnlocked = false;
let isAnswerRevealed = false;
let activeTab = 'vocabulary';
let customLessons = [];

// Scoring algorithm
function scoreTranslation(userAnswer, correctAnswer, lesson) {
  let score = 0;
  const hints = [];

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

  lesson.vocabulary.forEach(vocab => {
    if (userAnswer.toLowerCase().includes(vocab.spanish.toLowerCase())) {
      score += vocabScore;
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

// Dev test cases
function runDevTests() {
  const testLesson = {
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

// UI Functions
function updateUserInputDisplay() {
  const display = document.getElementById('userInputDisplay');
  if (userInput) {
    display.innerHTML = `<span>${userInput}</span>`;
  } else {
    display.innerHTML = '<span class="text-gray-500">Type your translation...</span>';
  }
}

function updateTargetDisplay() {
  const display = document.getElementById('targetDisplay');
  if (isAnswerRevealed) {
    display.innerHTML = `<span class="text-green-400">${currentLesson.correctAnswer}</span>`;
  } else {
    display.innerHTML = `
      <div class="flex items-center space-x-2 text-gray-500">
        <i data-lucide="eye-off" class="w-4 h-4"></i>
        <span>Score ≥ 80 to reveal</span>
      </div>
    `;
    lucide.createIcons();
  }
}

function updatePerformanceSection() {
  const section = document.getElementById('performanceSection');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const scoreBar = document.getElementById('scoreBar');
  
  if (score !== null) {
    section.classList.remove('hidden');
    scoreDisplay.textContent = score;
    scoreBar.style.width = `${score}%`;
  } else {
    section.classList.add('hidden');
  }
}

function updateInlineHints() {
  const container = document.getElementById('inlineHints');
  if (score !== null && hints.length > 0) {
    container.classList.remove('hidden');
    container.innerHTML = hints.map(hint => 
      `<div class="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm">💡 ${hint}</div>`
    ).join('');
  } else {
    container.classList.add('hidden');
  }
}

function updateTabContent() {
  const container = document.getElementById('tabContent');
  
  switch (activeTab) {
    case 'vocabulary':
      container.innerHTML = `
        <div class="space-y-3">
          <h4 class="font-semibold text-cyan-400">Vocabulary</h4>
          <div class="space-y-2">
            ${currentLesson.vocabulary.map(vocab => `
              <div class="flex justify-between items-center p-2 bg-gray-800 rounded">
                <span class="text-cyan-300">${vocab.spanish}</span>
                <span class="text-gray-400">${vocab.english}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
      
    case 'structure':
      container.innerHTML = `
        <div class="space-y-3">
          <h4 class="font-semibold text-cyan-400">Structure Clues</h4>
          <div class="space-y-2">
            ${currentLesson.structureClues.map(clue => `
              <div class="p-2 bg-gray-800 rounded text-sm">${clue}</div>
            `).join('')}
          </div>
        </div>
      `;
      break;
      
    case 'hints':
      if (score !== null) {
        if (hints.length > 0) {
          container.innerHTML = `
            <div class="space-y-3">
              <h4 class="font-semibold text-cyan-400">Hints</h4>
              <div class="space-y-2">
                ${hints.map(hint => `
                  <div class="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-sm">💡 ${hint}</div>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="space-y-3">
              <h4 class="font-semibold text-cyan-400">Hints</h4>
              <div class="p-2 bg-green-900/20 border border-green-500/30 rounded text-sm">✅ No issues detected. Nice work!</div>
            </div>
          `;
        }
      } else {
        container.innerHTML = `
          <div class="space-y-3">
            <h4 class="font-semibold text-cyan-400">Hints</h4>
            <div class="text-gray-500 text-sm">Submit your answer to see hints</div>
          </div>
        `;
      }
      break;
      
    case 'examples':
      container.innerHTML = `
        <div class="space-y-3">
          <h4 class="font-semibold text-cyan-400">Examples</h4>
          ${examplesUnlocked ? `
            <div class="space-y-2">
              ${currentLesson.examples.map(example => `
                <div class="p-2 bg-gray-800 rounded text-sm">${example}</div>
              `).join('')}
            </div>
          ` : `
            <div class="flex items-center space-x-2 text-gray-500 text-sm">
              <i data-lucide="lock" class="w-4 h-4"></i>
              <span>Score > 60 unlocks examples. Score ≥ 80 reveals the target answer.</span>
            </div>
          `}
        </div>
      `;
      lucide.createIcons();
      break;
  }
}

function updateTabButtons() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const tab = btn.getAttribute('data-tab');
    if (tab === activeTab) {
      btn.className = 'tab-btn flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-cyan-600 text-white';
    } else {
      btn.className = 'tab-btn flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-gray-600';
    }
  });
}

function updateLessonSelect() {
  const select = document.getElementById('lessonSelect');
  select.innerHTML = '';
  
  // Add sample lessons
  SAMPLE_LESSONS.forEach(lesson => {
    const option = document.createElement('option');
    option.value = lesson.id;
    option.textContent = lesson.english;
    select.appendChild(option);
  });
  
  // Add custom lessons
  customLessons.forEach(lesson => {
    const option = document.createElement('option');
    option.value = lesson.id;
    option.textContent = lesson.english;
    select.appendChild(option);
  });
  
  select.value = currentLesson.id;
}

function resetState() {
  userInput = '';
  score = null;
  hints = [];
  examplesUnlocked = false;
  isAnswerRevealed = false;
  activeTab = 'vocabulary';
  
  document.getElementById('userInput').value = '';
  updateUserInputDisplay();
  updateTargetDisplay();
  updatePerformanceSection();
  updateInlineHints();
  updateTabContent();
  updateTabButtons();
}

function handleSubmit() {
  if (!userInput.trim()) return;
  
  const result = scoreTranslation(userInput, currentLesson.correctAnswer, currentLesson);
  score = result.score;
  hints = result.hints;
  examplesUnlocked = result.examplesUnlocked;
  isAnswerRevealed = result.isAnswerRevealed;
  
  updateUserInputDisplay();
  updateTargetDisplay();
  updatePerformanceSection();
  updateInlineHints();
  updateTabContent();
}

function handleTryAgain() {
  resetState();
}

function handleNextSentence() {
  const allLessons = [...SAMPLE_LESSONS, ...customLessons];
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
  const nextIndex = (currentIndex + 1) % allLessons.length;
  currentLesson = allLessons[nextIndex];
  resetState();
  updateLessonSelect();
}

function handleLessonChange(lessonId) {
  const allLessons = [...SAMPLE_LESSONS, ...customLessons];
  const lesson = allLessons.find(l => l.id === lessonId);
  if (lesson) {
    currentLesson = lesson;
    resetState();
  }
}

async function handleCustomLessonSave() {
  const english = document.getElementById('customEnglish').value.trim();
  
  if (!english) return;

  try {
    // Show loading state
    const saveBtn = document.getElementById('saveCustomBtn');
    saveBtn.textContent = 'Generating...';
    saveBtn.disabled = true;

    // Call our backend to create a lesson
    // Note: Replace 'your-netlify-app' with your actual Netlify app name
    const response = await fetch('https://langu51.netlify.app/.netlify/functions/api/create-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ englishText: english })
    });

    if (!response.ok) {
      throw new Error('Failed to create lesson');
    }

    const newLesson = await response.json();

    customLessons.push(newLesson);
    currentLesson = newLesson;
    
    document.getElementById('customEnglish').value = '';
    document.getElementById('customSpanish').value = '';
    document.getElementById('customLessonSection').classList.add('hidden');
    
    resetState();
    updateLessonSelect();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create lesson. Please try again.');
  } finally {
    // Reset button
    const saveBtn = document.getElementById('saveCustomBtn');
    saveBtn.textContent = 'Save as Lesson';
    saveBtn.disabled = false;
  }
}

function handleDevTests() {
  const results = runDevTests();
  const container = document.getElementById('devTestResults');
  
  container.innerHTML = results.map(test => `
    <div class="flex justify-between items-center p-2 bg-gray-700 rounded">
      <span class="text-sm">${test.name}</span>
      <span class="text-cyan-400 font-mono">${test.result.score}</span>
    </div>
  `).join('');
  
  container.classList.remove('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize icons
  lucide.createIcons();
  
  // Set up event listeners
  document.getElementById('userInput').addEventListener('input', function(e) {
    userInput = e.target.value;
    updateUserInputDisplay();
  });
  
  document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });
  
  document.getElementById('checkAnswerBtn').addEventListener('click', handleSubmit);
  document.getElementById('tryAgainBtn').addEventListener('click', handleTryAgain);
  document.getElementById('nextSentenceBtn').addEventListener('click', handleNextSentence);
  document.getElementById('nextSentenceBtn2').addEventListener('click', handleNextSentence);
  
  document.getElementById('lessonSelect').addEventListener('change', function(e) {
    handleLessonChange(e.target.value);
  });
  
  document.getElementById('customToggleBtn').addEventListener('click', function() {
    const section = document.getElementById('customLessonSection');
    const icon = this.querySelector('i');
    
    if (section.classList.contains('hidden')) {
      section.classList.remove('hidden');
      icon.setAttribute('data-lucide', 'chevron-up');
    } else {
      section.classList.add('hidden');
      icon.setAttribute('data-lucide', 'chevron-down');
    }
    lucide.createIcons();
  });
  
  document.getElementById('saveCustomBtn').addEventListener('click', handleCustomLessonSave);
  
  document.getElementById('devTestToggleBtn').addEventListener('click', function() {
    const results = document.getElementById('devTestResults');
    const icon = this.querySelector('i');
    
    if (results.classList.contains('hidden')) {
      handleDevTests();
      icon.setAttribute('data-lucide', 'chevron-up');
    } else {
      results.classList.add('hidden');
      icon.setAttribute('data-lucide', 'chevron-down');
    }
    lucide.createIcons();
  });
  
  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      activeTab = this.getAttribute('data-tab');
      updateTabContent();
      updateTabButtons();
    });
  });
  
  // Initialize the app
  updateLessonSelect();
  updateTabContent();
});
