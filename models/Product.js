const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  roster: [
    {
      rosterUser: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      name: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Product = mongoose.model('product', ProductSchema);
