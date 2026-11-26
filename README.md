# AI-4-Students — Tanuj Industries

## What's Included
- `index.html`: Responsive mobile-first Android web app (Home, AI Chat, Study Dashboard, Visual Lab, History, Profile/Settings, Auth modals, Dark Mode, AI Memory).
- `server/server.js`: Secure Node.js + Express backend integrating Google's `@google/genai` SDK without exposing API keys in the client.
- `firebase/firebaseConfig.js`: Firebase Authentication & Firestore integration-ready module.

## Quick Setup
1. `cd server && npm install`
2. Copy `.env.example` to `.env` and add your `GEMINI_API_KEY`.
3. Run `npm start` to start the backend on `http://localhost:3000`.
4. Add your Firebase credentials in `firebase/firebaseConfig.js` and wrap `index.html` with Capacitor (`npx cap add android`) to package as an Android APK.
