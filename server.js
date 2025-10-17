require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const BudgetModel = require('./models/BudgetModel');

const app = express();

// --- connect Mongo ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });

// middleware
app.use(cors());
app.use(express.json()); // for POST JSON

const port = process.env.PORT || 3000;

// static site
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 1) GET /budget  -> return shape { myBudget: [{ title, budget, color }] }
app.get('/budget', async (req, res) => {
  try {
    const items = await BudgetModel.find().sort({ createdAt: 1 }).lean();
    const payload = {
      myBudget: items.map(i => ({
        title: i.title,
        budget: i.value,   // map DB value -> front-end "budget"
        color: i.color
      }))
    };
    res.json(payload);
  } catch (err) {
    console.error('GET /budget failed:', err);
    res.status(500).json({ error: 'Failed to fetch budget items' });
  }
});

// 2) POST /budget  -> add one item (title, value, color)
app.post('/budget', async (req, res) => {
  try {
    const { title, value, color } = req.body;
    const doc = await BudgetModel.create({ title, value, color });
    res.status(201).json({
      message: 'Created',
      item: {
        id: doc._id,
        title: doc.title,
        budget: doc.value,
        color: doc.color
      }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'ValidationError',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    console.error('POST /budget failed:', err);
    res.status(500).json({ error: 'Failed to create budget item' });
  }
});

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
