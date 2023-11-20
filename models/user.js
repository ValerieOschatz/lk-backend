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
  subscription_person: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  // subscription_chanels: {},
  privat_settings: {
    comments: {
      type: Number,
      default: 0,
    },
    sharing: {
      type: Number,
      default: 0,
    },
    profile_info: {
      type: Number,
      default: 0,
    },
  },
});

userSchema.statics.findUserByCredentials = checkUser;

module.exports = mongoose.model('user', userSchema);
