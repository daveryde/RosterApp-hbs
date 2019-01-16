const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  classroom: {
    type: String,
    required: true
  },
  roster: [
    {
      teacher: {
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
  ]
});

module.exports = Student = mongoose.model('student', StudentSchema);
