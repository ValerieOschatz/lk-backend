const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { secretKey } = require('../utils/jwtConfig');
const {
  CREATED,
  badRequestErrorText,
  conflictErrorText,
  notFoundUserErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const register = async (req, res, next) => {
  try {
    const { login, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ login, password: hash, name });
    const visibleUser = { login: user.login, name: user.name };

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

const loginProfile = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    const user = await User.findUserByCredentials(login, password);
    const token = jwt.sign(
      { _id: user._id },
      secretKey,
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000 * 24 * 7,
    }).send({ token });
  } catch (err) {
    return next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(notFoundUserErrorText);
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    let users = await User.find({});
    users = users.filter((item) => item.name.includes(req.query.name));
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const updatePhoto = async (req, res, next) => {
  try {
    const photo = req.file.path.split('\\').join('/');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photo },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  register,
  loginProfile,
  getProfile,
  getUsers,
  getUser,
  updatePhoto,
};
