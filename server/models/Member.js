const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  upi: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);