# Langu-ify Setup Guide

## Prerequisites

Before running this project, you need to install Node.js (version 18 or higher).

### Installing Node.js

1. **Download Node.js:**
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS version (recommended)
   - Run the installer and follow the setup wizard

2. **Verify Installation:**
   ```bash
   node --version
   npm --version
   ```

## Project Setup

Once Node.js is installed, follow these steps:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Alternative Package Managers

If you prefer other package managers:

### Using Yarn:
```bash
yarn install
yarn dev
```

### Using pnpm:
```bash
pnpm install
pnpm dev
```

## Project Structure

```
g5t/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── TranslationApp.tsx # Main app component
├── lib/                   # Utility functions
│   ├── constants.ts       # Configuration & sample lessons
│   ├── scoring.ts         # Scoring algorithm
│   └── types.ts           # TypeScript types
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # TailwindCSS config
├── tsconfig.json          # TypeScript config
└── README.md              # Project documentation
```

## Features Implemented

✅ **Core Translation & Scoring**
- Immediate scoring (0-100)
- Deterministic algorithm
- Punctuation, vocabulary, and word order scoring

✅ **Hints System**
- Missing punctuation hints
- Missing vocabulary hints
- Maximum 3 hints per attempt

✅ **Unlockable Content**
- Examples unlock at >60% score
- Target answer reveals at ≥80% score

✅ **Custom Lessons**
- Collapsible custom lesson section
- Auto-generated vocabulary from Spanish text
- Save and activate custom lessons

✅ **Dev Test Panel**
- Built-in test cases
- Score validation
- Collapsible interface

✅ **Responsive Design**
- Dark theme with cyan highlights
- Mobile-friendly layout
- Keyboard navigation support

✅ **API Ready**
- Optional LLM backend route
- Mock response implementation
- Error handling and validation

## Next Steps

1. Install Node.js if not already installed
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) in your browser
5. Test the features:
   - Try translating the sample sentences
   - Create custom lessons
   - Check the dev test panel
   - Test the responsive design on mobile

## Troubleshooting

If you encounter issues:

1. **Node.js not found:** Install Node.js from [nodejs.org](https://nodejs.org/)
2. **Port 3000 in use:** The app will automatically try the next available port
3. **Build errors:** Check that all dependencies are installed with `npm install`
4. **TypeScript errors:** Ensure you're using Node.js 18+ and TypeScript 5+

## Support

For questions or issues, refer to the main README.md file or check the project documentation.
