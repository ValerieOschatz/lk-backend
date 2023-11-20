const { celebrate, Joi } = require('celebrate');
const { regex } = require('../utils/data');

const validateRegister = celebrate({
  body: Joi.object().keys({
    login: Joi.string().min(2).max(20).regex(regex),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
  }),
});

module.exports = {
  validateRegister,
};
