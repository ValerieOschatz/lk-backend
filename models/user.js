const mongoose = require('mongoose');
const { regex } = require('../utils/data');
const checkUser = require('../middlewares/checkUser');

const privatSettingsSchema = new mongoose.Schema({
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
});

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
    maxlength: [30, ', поле name должно содержать не более 30 символов'],
    default: 'TEMP_NAME',
  },
  photo: {
    type: String,
  },
  description: {
    type: String,
    minlength: [2, 'поле description должно содержать не менее 2 символов'],
    maxlength: [30, 'поле description должно содержать не более 30 символов'],
  },
  // subscribers: {},
  // subscription_person: {},
  // subscription_chanels: {},
  privat_settings: privatSettingsSchema,
});

userSchema.statics.findUserByCredentials = checkUser;

module.exports = mongoose.model('user', userSchema);
