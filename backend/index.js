const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables (no hardcoded defaults; configure via env)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MYMEMORY_API_KEY = process.env.MYMEMORY_API_KEY; // RapidAPI key (optional)
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || '';

// Helper: Translate with MyMemory (prefers RapidAPI if key is set)
async function translateWithMyMemory(text, source = 'en', target = 'es') {
  const query = encodeURIComponent(text);
  if (MYMEMORY_API_KEY) {
    // Use RapidAPI endpoint
    const url = `https://translated-mymemory---translation-memory.p.rapidapi.com/get?q=${query}&langpair=${source}|${target}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': MYMEMORY_API_KEY,
        'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com',
      },
    });
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('MyMemory RapidAPI translation failed');
  }

  // Fallback: direct MyMemory API (optional email for rate limiting)
  const deParam = MYMEMORY_EMAIL ? `&de=${encodeURIComponent(MYMEMORY_EMAIL)}` : '';
  const directUrl = `https://api.mymemory.translated.net/get?q=${query}&langpair=${source}|${target}${deParam}`;
  const res = await fetch(directUrl);
  const json = await res.json();
  if (json && json.responseStatus === 200 && json.responseData) {
    return json.responseData.translatedText;
  }
  throw new Error('MyMemory direct translation failed');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Langu-ify backend is running!' });
});

// Translation endpoint using MyMemory API
app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // MyMemory API call
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es&de=${encodeURIComponent(MYMEMORY_EMAIL)}`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      res.json({ 
        translation: data.responseData.translatedText,
        source: 'MyMemory API'
      });
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// AI explanation endpoint using Gemini API
app.post('/api/explain', async (req, res) => {
  try {
    const { englishText, spanishText } = req.body;
    
    if (!englishText || !spanishText) {
      return res.status(400).json({ error: 'Both English and Spanish text are required' });
    }

    const prompt = `Analyze this English to Spanish translation and provide a JSON response with:
1. Key vocabulary words with their meanings
2. Grammar structure notes
3. 3 similar example sentences

English: "${englishText}"
Spanish: "${spanishText}"

Respond ONLY with valid JSON in this exact format:
{
  "vocabulary": [
    {"english": "word", "spanish": "palabra", "notes": "explanation"}
  ],
  "structureClues": [
    "grammar note 1",
    "grammar note 2"
  ],
  "examples": [
    "example sentence 1",
    "example sentence 2", 
    "example sentence 3"
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      const content = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const analysis = JSON.parse(jsonMatch[0]);
          res.json(analysis);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          res.status(500).json({ error: 'Failed to parse AI response' });
        }
      } else {
        res.status(500).json({ error: 'Invalid AI response format' });
      }
    } else {
      res.status(500).json({ error: 'AI service unavailable' });
    }
  } catch (error) {
    console.error('AI explanation error:', error);
    res.status(500).json({ error: 'AI explanation failed', details: error.message });
  }
});

// Combined endpoint for creating lessons
app.post('/api/create-lesson', async (req, res) => {
  try {
    const { englishText } = req.body;
    
    if (!englishText) {
      return res.status(400).json({ error: 'English text is required' });
    }

    // Step 1: Translate
    const translateResponse = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|es&de=${encodeURIComponent(MYMEMORY_EMAIL)}`
    );
    const translateData = await translateResponse.json();
    
    if (translateData.responseStatus !== 200) {
      throw new Error('Translation failed');
    }
    
    const spanishTranslation = translateData.responseData.translatedText;

    // Step 2: Get AI explanation
    const prompt = `Analyze this English to Spanish translation and provide a JSON response with:
1. Key vocabulary words with their meanings
2. Grammar structure notes
3. 3 similar example sentences

English: "${englishText}"
Spanish: "${spanishTranslation}"

Respond ONLY with valid JSON in this exact format:
{
  "vocabulary": [
    {"english": "word", "spanish": "palabra", "notes": "explanation"}
  ],
  "structureClues": [
    "grammar note 1",
    "grammar note 2"
  ],
  "examples": [
    "example sentence 1",
    "example sentence 2", 
    "example sentence 3"
  ]
}`;

    const explainResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );
    
    const explainData = await explainResponse.json();
    
    let analysis = {
      vocabulary: [],
      structureClues: ['Auto-generated lesson'],
      examples: []
    };
    
    if (explainData.candidates && explainData.candidates[0]) {
      const content = explainData.candidates[0].content.parts[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
    }

    // Step 3: Create lesson object
    const lesson = {
      id: `dynamic-${Date.now()}`,
      english: englishText,
      correctAnswer: spanishTranslation,
      vocabulary: analysis.vocabulary || [],
      structureClues: analysis.structureClues || ['Auto-generated lesson'],
      examples: analysis.examples || []
    };

    res.json(lesson);
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Failed to create lesson', details: error.message });
  }
});

// Netlify serverless function handler
exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Route the request
  const path = event.path.replace('/.netlify/functions/api', '');
  
  try {
    if (path === '/health' && event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'OK', message: 'Langu-ify backend is running!' })
      };
    }
    
    if (path === '/translate' && event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { text } = body;
      
      if (!text) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Text is required' })
        };
      }

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es&de=${encodeURIComponent(MYMEMORY_EMAIL)}`
      );
      
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            translation: data.responseData.translatedText,
            source: 'MyMemory API'
          })
        };
      } else {
        throw new Error('Translation failed');
      }
    }
    
    if (path === '/create-lesson' && event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { englishText } = body;
      
      if (!englishText) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'English text is required' })
        };
      }

      // Translate
      const translateResponse = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|es&de=${encodeURIComponent(MYMEMORY_EMAIL)}`
      );
      const translateData = await translateResponse.json();
      
      if (translateData.responseStatus !== 200) {
        throw new Error('Translation failed');
      }
      
      const spanishTranslation = translateData.responseData.translatedText;

      // Get AI explanation
      const prompt = `Analyze this English to Spanish translation and provide a JSON response with:
1. Key vocabulary words with their meanings
2. Grammar structure notes
3. 3 similar example sentences

English: "${englishText}"
Spanish: "${spanishTranslation}"

Respond ONLY with valid JSON in this exact format:
{
  "vocabulary": [
    {"english": "word", "spanish": "palabra", "notes": "explanation"}
  ],
  "structureClues": [
    "grammar note 1",
    "grammar note 2"
  ],
  "examples": [
    "example sentence 1",
    "example sentence 2", 
    "example sentence 3"
  ]
}`;

      const explainResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );
      
      const explainData = await explainResponse.json();
      
      let analysis = {
        vocabulary: [],
        structureClues: ['Auto-generated lesson'],
        examples: []
      };
      
      if (explainData.candidates && explainData.candidates[0]) {
        const content = explainData.candidates[0].content.parts[0].text;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysis = JSON.parse(jsonMatch[0]);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
          }
        }
      }

      const lesson = {
        id: `dynamic-${Date.now()}`,
        english: englishText,
        correctAnswer: spanishTranslation,
        vocabulary: analysis.vocabulary || [],
        structureClues: analysis.structureClues || ['Auto-generated lesson'],
        examples: analysis.examples || []
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(lesson)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Langu-ify backend running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Translation: http://localhost:${PORT}/api/translate`);
    console.log(`🤖 Create lesson: http://localhost:${PORT}/api/create-lesson`);
  });
}
