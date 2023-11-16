const { celebrate, Joi } = require('celebrate');

const validateSignUp = celebrate({
  body: Joi.object().keys({
    login: Joi.string().min(2).max(20).required(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateSignUp,
};
