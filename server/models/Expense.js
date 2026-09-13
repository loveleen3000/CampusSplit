const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    enum: ['Canteen', 'Project Lab', 'Hostel', 'Other'], 
    default: 'Canteen' 
  },
  paidBy: { type: String, required: true },
  splitType: { type: String, enum: ['equal', 'exact'], default: 'equal' },
  splitAmong: [{ type: String }],
  customSplits: { type: Map, of: Number },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, default: null },
  isSettled: { type: Boolean, default: false },
  date: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);