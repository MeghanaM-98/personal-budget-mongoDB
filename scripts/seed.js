
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const BudgetModel = require('../models/BudgetModel');


(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: undefined });
    const raw = fs.readFileSync(path.join(__dirname, '..', 'budget.json'), 'utf-8');
    const json = JSON.parse(raw);

    // Map from {title, budget} to {title, value, color}
    // Give default colors if none (you can adjust the array)
    const fallbackColors = [
      '#ffcd56','#ff6384','#36a2eb','#fd6b19',
      '#8bc34a','#9c27b0','#00bcd4','#607d8b'
    ];

    const docs = (json.myBudget || []).map((item, i) => ({
      title: item.title,
      value: item.budget,
      color: fallbackColors[i % fallbackColors.length]
    }));

    await BudgetModel.deleteMany({});
    await BudgetModel.insertMany(docs);
    console.log(`Seeded ${docs.length} items`);
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
