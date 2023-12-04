const { celebrate, Joi } = require('celebrate');
const { regex } = require('../utils/data');

const validateRegister = celebrate({
  body: Joi.object().keys({
    login: Joi.string().min(2).max(20).regex(regex),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    login: Joi.string().min(2).max(20).regex(regex),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfileInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(20),
    description: Joi.string().max(50),
  }),
});

const validateUpdateLogin = celebrate({
  body: Joi.object().keys({
    login: Joi.string().min(2).max(20).regex(regex),
  }),
});

const validateUpdatePassword = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
  }),
});

const validateCheckUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

const validateUpdateChanelInfo = celebrate({
  body: Joi.object().keys({
    chanelId: Joi.string().alphanum().length(24),
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(50),
  }),
});

const validateCheckChanel = celebrate({
  params: Joi.object().keys({
    chanelId: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfileInfo,
  validateUpdateLogin,
  validateUpdatePassword,
  validateCheckUser,
  validateUpdateChanelInfo,
  validateCheckChanel,
};
