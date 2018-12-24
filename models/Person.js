const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PersonSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  number: Number
});

module.exports = mongoose.model('people', PersonSchema);
