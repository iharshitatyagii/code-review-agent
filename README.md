# 🚀 AI Code Review Agent

An advanced, context-aware **Full-Stack AI Agent** designed to perform instant code audits. Whether it's a manual snippet or a **GitHub Pull Request**, this agent identifies bugs, security vulnerabilities, and performance bottlenecks using **Google Gemini 2.0/3.0**.

## 🌟 Key Features

* **GitHub Integration**: Paste a public PR link, and the agent automatically fetches the Git Diff for review.
* **Custom Knowledge Base**: Upload a `rules.json` file to enforce specific team coding standards (e.g., "No 'var'", "Arrow functions only").
* **Persona-Driven Audits**: Use the "Custom Focus" field to guide the AI, from "Strict Security Audit" to "Gordon Ramsay Roast Mode".
* **Review History Dashboard**: An in-memory dashboard to track recent audits and maintain a log of code health over time.

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Lucide React (Icons)
* **Backend**: Node.js, Express.js
* **AI Engine**: Google Gemini API (`gemini-flash-latest`)
* **Tools**: Multer (File Handling), Axios, Octokit (GitHub API)

## 📂 Project Structure

```text
code-review-agent/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints (Review, History)
│   │   ├── services/        # AI & GitHub logic
│   │   └── index.js         # Entry point
│   └── .env                 # API Keys (Ignored by Git)
└── frontend/
    ├── src/
    │   ├── App.js           # Main Dashboard UI
    └── tailwind.config.js   # Styling
# 🚀 Getting Started
1. Prerequisites
Node.js installed.

A Gemini API Key from Google AI Studio.

2. Backend Setup
Bash
cd backend
npm install
Create a .env file and add:
GEMINI_API_KEY=your_api_key_here
npm start
3. Frontend Setup
Bash
cd frontend
npm install
npm start
💡 Example usage of rules.json
To enforce custom team rules, upload a JSON file like this:

JSON
{
  "rules": [
    "Use functional components over class components",
    "Ensure all API calls have error handling",
    "Strictly avoid the use of 'var'"
  ]
}
👨‍💻 Developed By
# Harshita Tyagi 

Specializing in MERN Stack & AI Integrations.
