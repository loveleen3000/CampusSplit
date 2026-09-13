const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Expense = require('../models/Expense');
const { calculateOptimizedSettlements } = require('../utils/minCashFlow');

router.get('/calculate', async (req, res) => {
  try {
    const members = await Member.find();
    const expenses = await Expense.find();

    const calculation = calculateOptimizedSettlements(expenses, members);
    res.json(calculation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;