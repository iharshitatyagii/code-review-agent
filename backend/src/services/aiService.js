const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are an expert Senior Software Engineer doing a Code Review.
You might receive raw code OR a Git Diff (lines starting with + or -).

Instructions:
1. If it's a Git Diff, focus strictly on the lines starting with '+' (added code). Use '-' lines only for context.
2. Identify bugs, security risks, and performance issues.
3. Be constructive and specific.

Respond ONLY in valid JSON format:
{
  "summary": "Executive summary of the changes.",
  "issues": [
    { "line": 10, "type": "Critical", "message": "Memory leak detected", "suggestion": "Use useEffect cleanup..." }
  ],
  "rating": 8
}
`;

async function analyzeCode(code, customRules = "") {
  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest" 
    });

    const finalPrompt = `
      ${systemPrompt}
      
      USER CUSTOM INSTRUCTIONS:
      ${customRules ? `Focus strictly on this: ${customRules}` : "Follow standard best practices."}
      
      CODE TO ANALYZE:
      ${code}
    `;

    const result = await model.generateContent([finalPrompt]);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    const data = JSON.parse(cleanJson);

    if (data.rating) {
        if (typeof data.rating === 'string') {
           
            data.rating = parseInt(data.rating.split('/')[0]);
        }
        if (isNaN(data.rating)) data.rating = 0;
    }

    return data;

  } catch (error) {
    console.error("❌ AI Service Error:", error);
    throw new Error("Failed to analyze code");
  }
}

module.exports = { analyzeCode };