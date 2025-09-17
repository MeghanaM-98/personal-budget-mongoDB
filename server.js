//Budget API

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = 3000;


app.use(cors());

// 1) Serve everything in /public at the web root (/)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// 2) Home route -> /public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});



// Load budget data from JSON file on each request
app.get('/budget', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'budget.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    res.json(data); // { myBudget: [...] }
  } catch (err) {
    console.error('Failed to load budget.json:', err);
    res.status(500).json({ error: 'Could not load budget data' });
  }
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
