const { fetchPRDiff } = require('./src/services/githubService');

(async () => {
  try {
   
    const diff = await fetchPRDiff("https://github.com/facebook/react/pull/28256");
    
    console.log("✅ Successfully fetched PR Diff!");
    console.log("--------------------------------------------------");
    console.log(diff.substring(0, 500) + "..."); 
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();