//Budget API

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = 3000;


app.use(cors());


// Load budget data from JSON file on each request
app.get('http://localhost:3000/budget', async (req, res) => {
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
