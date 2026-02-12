const express = require('express');
const router = express.Router();

const historyStore = []; 

router.get('/', (req, res) => {
  res.json(historyStore.slice().reverse());
});

router.post('/save', (req, res) => {
  const { repoName, prLink, summary, rating, issues } = req.body;

  const newReview = {
    id: Date.now(), // Generate a fake ID
    repoName,
    prLink,
    summary,
    rating,
    issues,
    timestamp: new Date()
  };

  historyStore.push(newReview);
  console.log("✅ Saved review to memory:", repoName);
  
  res.status(201).json({ message: "Review saved!", review: newReview });
});

module.exports = router;