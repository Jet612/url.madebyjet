<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ukYa8HZ0e5cLxkKwkGggCFmduKqXhLxG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file and set the `NEXT_PUBLIC_GEMINI_API_KEY` to your Gemini API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
3. Run the app:
   `npm run dev`
   
   The app will be available at http://localhost:3000
