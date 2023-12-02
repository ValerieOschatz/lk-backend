const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    default: '',
    maxlength: [80, ', поле должно содержать не более 80 символов'],
  },
  photo: {
    type: String,
    default: '',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  ownerChanel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chanel',
    default: null,
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

module.exports = mongoose.model('post', postSchema);
