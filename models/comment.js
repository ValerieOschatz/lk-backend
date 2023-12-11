const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: [150, ', поле должно содержать не более 150 символов'],
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  answerTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('comment', commentSchema);
