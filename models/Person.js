const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PersonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('people', PersonSchema);
