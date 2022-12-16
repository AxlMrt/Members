const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, maxLength: 20, required: true },
  comment: { type: String, required: true, maxLength: 200 },
  date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Message', MessageSchema);
