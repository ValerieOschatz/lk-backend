const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: [80, ', поле должно содержать не более 80 символов'],
    required: true,
  },
  answerTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message',
    default: null,
  },
  isUpdated: {
    type: Boolean,
    default: false,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('message', messageSchema);
