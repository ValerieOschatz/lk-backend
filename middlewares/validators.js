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
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(30),
  }),
});

const validateUpdatePrivatSettigs = celebrate({
  body: Joi.object().keys({
    comments: Joi.number().integer().min(0).max(2),
    sharing: Joi.number().integer().min(0).max(2),
    profileInfo: Joi.number().integer().min(0).max(2),
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

const validateCreateChanel = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(30),
  }),
});

const validateUpdateChanelInfo = celebrate({
  body: Joi.object().keys({
    chanelId: Joi.string().alphanum().length(24),
    name: Joi.string().min(2).max(20).required(),
    description: Joi.string().max(30),
  }),
});

const validateUpdateChanelPrivatSettigs = celebrate({
  body: Joi.object().keys({
    chanelId: Joi.string().alphanum().length(24),
    comments: Joi.number().integer().min(0).max(2),
    sharing: Joi.number().integer().min(0).max(2),
    chanelInfo: Joi.number().integer().min(0).max(2),
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
  validateUpdatePrivatSettigs,
  validateUpdateLogin,
  validateUpdatePassword,
  validateCheckUser,
  validateCreateChanel,
  validateUpdateChanelInfo,
  validateUpdateChanelPrivatSettigs,
  validateCheckChanel,
};
