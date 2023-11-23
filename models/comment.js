const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    default: '',
    maxlength: [80, ', поле должно содержать не более 80 символов'],
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

module.exports = mongoose.model('post', commentSchema);
