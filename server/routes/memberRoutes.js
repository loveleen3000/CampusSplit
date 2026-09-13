const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, upi } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const member = new Member({
      name: name.trim(),
      upi: upi?.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@upi`
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:name', async (req, res) => {
  try {
    await Member.findOneAndDelete({ name: req.params.name });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;