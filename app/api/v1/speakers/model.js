const mongoose = require('mongoose')

const SpeakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 50
    },
    avatar: {
      type: String,
      default: 'default.png',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Speaker', SpeakerSchema)