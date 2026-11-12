AARVIK AI — ONLINE AI EDITION
================================

This version includes a real online AI chat using the Google Gemini API through a Netlify serverless function. It is not a standalone offline AI model. An internet connection and a Gemini API key are required for live answers.

WHAT IS INCLUDED
- Responsive AARVIK AI study dashboard and PWA files
- Live AI Assistant using Gemini generateContent API
- Hindi-first system instruction: simple Hindi, point-by-point explanations, examples and summaries
- Server-side API key storage via Netlify environment variables (the key is never sent to browser code)
- Existing Study Library, quiz, notes and profile features

IMPORTANT SECURITY NOTE
Never paste GEMINI_API_KEY into index.html or any public JavaScript file. Anyone can read browser code. Add it only as a Netlify environment variable. This starter is suitable for personal testing. Before sharing it publicly, add user authentication and request limits/budget alerts because visitors could otherwise consume your API quota.

PUBLISH USING NETLIFY (FUNCTIONS ARE REQUIRED)
The previous drag-and-drop static-only method is not enough for live AI. Deploy this complete folder/repository with Netlify Functions enabled, preferably by connecting a GitHub repository to Netlify.

1. Create a free GitHub account and a new repository named aarvik-ai.
2. Upload ALL files and folders from this ZIP to the repository root. Keep netlify.toml and the netlify/functions folder in place.
3. In Netlify, choose Add new site > Import an existing project > GitHub, select the repository, and deploy.
4. In Netlify: Site configuration (or Project configuration) > Environment variables > Add a variable.
   Name: GEMINI_API_KEY
   Value: paste your Gemini API key from https://aistudio.google.com/app/apikey
5. Optional variable:
   Name: GEMINI_MODEL
   Value: gemini-3.8-flash
6. Save the variables, then trigger a new deploy so the functions receive them.
7. Open your Netlify site URL, open AI Assistant, and check for “ऑनलाइन AI कनेक्शन तैयार है”. Ask a test question.

NETLIFY FUNCTION ENDPOINTS
- /.netlify/functions/status — checks whether a server-side key is configured (does not reveal the key)
- /.netlify/functions/ask — sends chat history to Gemini and returns the answer

COST AND LIMITS
Gemini API access has provider-specific quotas, rate limits and possible charges. Check current pricing and usage in Google AI Studio / Google Cloud before using it heavily. Do not assume all API usage is free.

CURRENT LIMITATIONS
- The AI can answer from its model knowledge but does not automatically browse the live web.
- No user login, cloud-saved chat history, payment system, or admin panel is included.
- Notes/profile/progress remain in the browser on that device.
- AI responses may occasionally be incorrect; verify important information.
- This is a starter app, not a production-certified service.
