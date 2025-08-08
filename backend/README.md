# Langu-ify Backend

Backend server for the Langu-ify translation learning app with MyMemory translation API and Gemini AI integration.

## Features

- **Translation API**: Uses MyMemory API for English to Spanish translation
- **AI Explanations**: Uses Google Gemini API for vocabulary, grammar, and examples
- **Serverless**: Deployed as Netlify Functions
- **CORS Enabled**: Works with frontend applications

## API Endpoints

### Health Check
```
GET /api/health
```

### Translation
```
POST /api/translate
Body: { "text": "Hello world" }
```

### Create Lesson
```
POST /api/create-lesson
Body: { "englishText": "Hello world" }
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Gemini API Key
GEMINI_API_KEY=your-gemini-api-key

# MyMemory API Key  
MYMEMORY_API_KEY=your-mymemory-api-key

# MyMemory Email
MYMEMORY_EMAIL=your-email@example.com
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev
```

3. Server will run on `http://localhost:3001`

## Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `npm install`
   - Publish directory: `backend`
3. Add environment variables in Netlify dashboard
4. Deploy!

## API Keys Setup

### MyMemory API
- Free translation service
- Get API key from: https://mymemory.translated.net/
- Email required for rate limiting

### Gemini API  
- Google's AI model for explanations
- Get API key from: https://makersuite.google.com/app/apikey
- Free tier available
