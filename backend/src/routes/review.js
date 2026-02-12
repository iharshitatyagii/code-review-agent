const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const { analyzeCode } = require('../services/aiService');
const { fetchPRDiff } = require('../services/githubService');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('rules'), async (req, res) => {
    try {
        // 1. Get Code & Custom Text Input
        let { code, customRules } = req.body;
        
        // 2. Get the Uploaded File (if any)
        let fileRules = "";
        if (req.file) {
            try {
                // Parse the JSON file content
                const jsonContent = JSON.parse(req.file.buffer.toString());
                fileRules = JSON.stringify(jsonContent, null, 2);
                console.log("📂 Loaded rules.json");
            } catch (err) {
                return res.status(400).json({ error: "Invalid JSON file format" });
            }
        }

        // 3. Combine Manual Rules + File Rules
        const combinedRules = `
            ${customRules || ""}
            ${fileRules ? `\nSTRICT TEAM RULES (from rules.json):\n${fileRules}` : ""}
        `;

        // 4. Handle GitHub URLs
        if (code.includes("github.com") && code.includes("/pull/")) {
            console.log("🔗 GitHub PR URL detected. Fetching diff...");
            try {
                const diff = await fetchPRDiff(code);
                code = `GIT DIFF CONTEXT:\n${diff}`; 
            } catch (err) {
                return res.status(400).json({ error: "Failed to fetch PR. Make sure it's public." });
            }
        }

        // 5. Send to AI
        const review = await analyzeCode(code, combinedRules);
        res.json(review);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analysis failed" });
    }
});

module.exports = router;