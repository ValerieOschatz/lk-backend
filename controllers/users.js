const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {
  CREATED,
  badRequestErrorText,
  conflictErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const register = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ login, password: hash });
    const visibleUser = { login: user.login };

    return res.status(CREATED).send(visibleUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    if (err.code === 11000) {
      return next(new ConflictError(conflictErrorText));
    }
    return next(err);
  }
};

module.exports = {
  register,
};
