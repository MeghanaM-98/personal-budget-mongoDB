const mongoose = require('mongoose');

const hexColor = /^#([A-Fa-f0-9]{6})$/; 

const BudgetModelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  value: {                 
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true,
    validate: {
      validator: (v) => hexColor.test(v),
      message: 'color must be a hex like #ED4523'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('BudgetModel', BudgetModelSchema);