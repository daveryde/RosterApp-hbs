const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  handle: {
    type: String,
    require: true
  },
  title: {
    type: String,
    required: true
  },
  public: {
    type: Boolean,
    default: false
  },
  roster: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
      },
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
    }
  ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
