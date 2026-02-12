# 📘 Project Documentation - AI Code Review Agent

## 1. System Architecture
The application follows a standard MERN-style architecture (minus the permanent DB for this version) with a separate Frontend and Backend.

* **Frontend**: React application using Tailwind CSS for UI and Axios for API communication.
* **Backend**: Node.js/Express server that acts as a bridge between the User, GitHub, and Gemini AI.
* **AI Integration**: Uses the Google Gemini 1.5/2.0 Flash model via the `@google/generative-ai` SDK.



## 2. API Workflow
1. The user provides a code snippet or a GitHub PR URL.
2. The Backend detects if it's a URL; if so, it uses the `Octokit` library to fetch the `.diff` content.
3. The server reads the uploaded `rules.json` (if present) using `Multer`.
4. A prompt is constructed containing:
   - The Code/Diff
   - System Instructions
   - Custom Team Rules
5. Gemini AI processes the request and returns a structured JSON response.

## 3. Custom Knowledge Base Logic
The agent uses "RAG-lite" (Retrieval-Augmented Generation) logic. Instead of just asking the AI to review code, we inject the contents of the user's `rules.json` into the System Prompt. This ensures the AI enforces company-specific standards that aren't part of its general training data.

## 4. Environment Variables
To run this project, you must configure:
* `GEMINI_API_KEY`: Your key from Google AI Studio.
* `PORT`: Default is 5000.
