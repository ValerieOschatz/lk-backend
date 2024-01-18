const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Chanel = require('../models/chanel');
const { sortByName } = require('../middlewares/sort');
const { secretKey } = require('../utils/jwtConfig');

const {
  CREATED,
  badRequestErrorText,
  conflictErrorText,
  notFoundErrorText,
} = require('../utils/data');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const register = async (req, res, next) => {
  try {
    const {
      login,
      password,
      name,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const createdAt = Date.now();

    const user = await User.create({
      login,
      password: hash,
      name,
      createdAt,
    });

    const visibleUser = {
      login: user.login,
      name: user.name,
    };

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
      // secure: true,
      // sameSite: 'none',
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
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    let users = await User.find({});

    if (req.query.subscriptions) {
      users = users.filter((item) => item.subscribers.includes(req.query.subscriptions));
    }

    if (req.query.subscribers) {
      const currentUser = await User.findById(req.query.subscribers);
      users = users.filter((item) => currentUser.subscribers.includes(item._id));
    }

    if (req.query.chanelSubscribers) {
      const currentChanel = await Chanel.findById(req.query.chanelSubscribers);
      users = users.filter((item) => currentChanel.subscribers.includes(item._id));
    }

    if (req.query.name) {
      let searchedName = req.query.name;
      searchedName = searchedName.toLowerCase();
      users = users.filter((item) => item.name.toLowerCase().includes(searchedName)
      && item._id.toString() !== req.user._id);
    }
    users = sortByName(users);

    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updatePhoto = async (req, res, next) => {
  try {
    const photo = req.file && req.file.filename;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photo },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateProfileInfo = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, description },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updatePrivatSettings = async (req, res, next) => {
  try {
    const {
      comments,
      posts,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        privatSettings: {
          comments,
          posts,
        },
      },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const updateLogin = async (req, res, next) => {
  try {
    const { login } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { login },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
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

const updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { password: hash },
      { new: true, runValidators: true },
    );
    const visibleUser = { login: user.login, name: user.name };

    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(visibleUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $addToSet: { subscribers: req.user._id } },
      { new: true },
    );
    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const unsubsxribe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.query.userId,
      { $pull: { subscribers: req.user._id } },
      { new: true },
    );
    if (!user) {
      throw new NotFoundError(notFoundErrorText);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(badRequestErrorText));
    }
    return next(err);
  }
};

const logout = (req, res, next) => {
  try {
    return res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    }).send({ message: 'Выход' });
  } catch (err) {
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
  updateProfileInfo,
  updatePrivatSettings,
  updateLogin,
  updatePassword,
  subscribe,
  unsubsxribe,
  logout,
};
