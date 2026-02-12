require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const reviewRoutes = require('./routes/review');
const historyRoutes = require('./routes/history');

app.use('/api/review', reviewRoutes);
app.use('/api/history', historyRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is alive at http://localhost:${PORT}`);
  console.log(`📝 In-Memory History Mode Active`);
});