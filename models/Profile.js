const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  handle: {
    type: String
  },
  title: {
    type: String
  },
  public: {
    type: Boolean,
    default: false
  },
  roster: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product'
    }
  ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
