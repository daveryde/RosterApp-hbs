const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('product', ProductSchema);
