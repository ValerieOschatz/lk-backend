const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: [20, ', поле должно содержать не более 20 символов'],
    default: '',
  },
  photo: {
    type: String,
    default: '',
  },
  participants: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: [],
  },
  groupDetails: {
    isGroup: [{
      type: Boolean,
      default: false,
    }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    rights: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('chat', chatSchema);
