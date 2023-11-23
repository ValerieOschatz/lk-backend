const mongoose = require('mongoose');
const { regex } = require('../utils/data');
const checkUser = require('../middlewares/checkUser');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: [true, 'поле login обязательное'],
    unique: [true, 'пользователь с этим login уже существует'],
    minlength: [2, 'поле login должно содержать не менее 2 символов'],
    maxlength: [20, ', поле login должно содержать не более 20 символов'],
    validate: {
      validator: (v) => regex.test(v),
      message: 'поле может содержать латинские буквы, цифры, нижние подчеркивания',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
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
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  privatSettings: {
    comments: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    sharing: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    profileInfo: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: null,
  },
});

userSchema.statics.findUserByCredentials = checkUser;

module.exports = mongoose.model('user', userSchema);
