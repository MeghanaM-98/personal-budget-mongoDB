const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = 3000;

// Serve your static files (put index.html and assets under ./public)
app.use('/', express.static('public'));

// Simple health route (unchanged)
app.get('/hello', (req, res) => {
  res.send('Hello World!');
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
  console.log(`Example app listening at http://localhost:${port}`);
});
