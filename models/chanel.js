const mongoose = require('mongoose');

const chanelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле name обязательное'],
    minlength: [2, 'поле name должно содержать не менее 2 символов'],
    maxlength: [20, ', поле name должно содержать не более 30 символов'],
  },
  photo: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    maxlength: [30, 'поле description должно содержать не более 30 символов'],
    default: '',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  privatSettings: {
    comments: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    sharing: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    profileInfo: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
  },
});

module.exports = mongoose.model('chanel', chanelSchema);
