require('dotenv').config();

async function checkAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ CRITICAL: No API Key found. Check your .env file!");
    return;
  }

  console.log(`🔑 Testing Key: ${apiKey.substring(0, 5)}...`);

  // We hit the API directly, bypassing the SDK to avoid version bugs
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ API REJECTED YOUR KEY:");
      console.error(`Error: ${data.error.message}`);
      console.error(`Code: ${data.error.code}`);
      return;
    }

    console.log("\n✅ SUCCESS! Here are the models your key can access:\n");
    
    // Filter only for models that can generate text/code
    const usefulModels = (data.models || []).filter(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    usefulModels.forEach(model => {
      // The 'name' field usually looks like "models/gemini-1.5-flash"
      console.log(`Name: ${model.name}`); 
      console.log(`Ver : ${model.version}`);
      console.log("--------------------------------------------------");
    });

    if (usefulModels.length === 0) {
      console.log("⚠️ No text-generation models found. Your key might be restricted.");
    }

  } catch (error) {
    console.error("❌ NETWORK ERROR:", error.message);
  }
}

checkAvailableModels();