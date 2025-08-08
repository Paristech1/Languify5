# 🚀 Langu-ify Backend Deployment Guide

## Step 1: Upload to GitHub Repository

Your backend files are now ready! Here's how to upload them to your GitHub repository at [https://github.com/Paristech1/Languify5.git](https://github.com/Paristech1/Languify5.git):

### Option A: Using GitHub Desktop (Recommended for beginners)

1. **Download GitHub Desktop** from [https://desktop.github.com/](https://desktop.github.com/)
2. **Clone your repository:**
   - Open GitHub Desktop
   - Click "Clone a repository from the Internet"
   - Select your repository: `Paristech1/Languify5`
   - Choose a local path
   - Click "Clone"

3. **Copy backend files:**
   - Copy all files from the `backend/` folder in your project
   - Paste them into the cloned repository folder

4. **Commit and push:**
   - In GitHub Desktop, you'll see all the new files
   - Add a commit message like "Add Langu-ify backend with API integration"
   - Click "Commit to main"
   - Click "Push origin"

### Option B: Using Git Commands

If you have Git installed:

```bash
# Clone the repository
git clone https://github.com/Paristech1/Languify5.git
cd Languify5

# Copy backend files to the repository
# (Copy all files from your backend/ folder to this directory)

# Add and commit files
git add .
git commit -m "Add Langu-ify backend with API integration"
git push origin main
```

## Step 2: Deploy to Netlify

### 1. Connect to Netlify

1. **Go to [Netlify](https://netlify.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New site from Git"**
4. **Choose GitHub** as your Git provider
5. **Select your repository:** `Paristech1/Languify5`

### 2. Configure Build Settings

Set these build settings in Netlify:

- **Base directory:** Leave empty (or `backend` if you put files in a subfolder)
- **Build command:** `npm install`
- **Publish directory:** Leave empty (or `backend` if you put files in a subfolder)

### 3. Add Environment Variables

In the Netlify dashboard, go to **Site settings > Environment variables** and add:

```
GEMINI_API_KEY = AIzaSyC78njT2Q-vcIb3FTerWF4fmOivNmWAabc
MYMEMORY_API_KEY = 0ea48e98b9msh0f2fdbd5b1baaefp15de2ajsn003892add3b0
MYMEMORY_EMAIL = your-email@example.com
```

**Important:** Replace `your-email@example.com` with your actual email address!

### 4. Deploy

1. **Click "Deploy site"**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Get your Netlify URL** (something like `https://languify5.netlify.app`)

## Step 3: Update Frontend

Once you have your Netlify URL, update your `app.js` file:

1. **Open `app.js`** in your project
2. **Find this line** (around line 425):
   ```javascript
   const response = await fetch('https://your-netlify-app.netlify.app/.netlify/functions/api/create-lesson', {
   ```
3. **Replace `your-netlify-app`** with your actual Netlify app name
4. **Save the file**

## Step 4: Test Your Backend

Test these endpoints with your Netlify URL:

### Health Check
```
GET https://your-app-name.netlify.app/.netlify/functions/api/health
```

### Create Lesson
```
POST https://your-app-name.netlify.app/.netlify/functions/api/create-lesson
Content-Type: application/json

{
  "englishText": "Hello world"
}
```

## Step 5: Test Your Live App

1. **Open your `index.html`** in a browser
2. **Go to "Custom Lesson"** section
3. **Enter English text** (e.g., "Hello world")
4. **Click "Save as Lesson"**
5. **Watch the magic happen!** 🎉

Your app should now:
- ✅ Translate English to Spanish using MyMemory API
- ✅ Generate vocabulary and explanations using Gemini AI
- ✅ Create dynamic lessons automatically
- ✅ Work completely live without any mock data

## Troubleshooting

### If deployment fails:
- Check that all files are uploaded to GitHub
- Verify environment variables are set correctly in Netlify
- Check Netlify build logs for errors

### If API calls fail:
- Verify your Netlify URL is correct in `app.js`
- Check that environment variables are set in Netlify
- Test the health endpoint first

### If you get CORS errors:
- The backend is already configured with CORS
- Make sure you're using the correct Netlify URL

## Next Steps

Once your backend is working:

1. **Test with different English phrases**
2. **Check the generated vocabulary and explanations**
3. **Set up PhoneGap** for mobile deployment
4. **Share your live app!** 🌟

---

**Your Langu-ify app is now powered by real AI!** 🤖✨
